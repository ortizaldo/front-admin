import { UpperCasePipe } from "@angular/common";
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, QueryList, ViewChild, ViewChildren, ViewEncapsulation} from "@angular/core";
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { ConfirmationService, MenuItem, MessageService, PrimeNGConfig } from "primeng/api";
import { ContextMenu } from "primeng/contextmenu";
import { Table } from "primeng/table";
import { catchError, tap } from "rxjs";
import { CrudService } from "src/app/_services/crud.service";
import { CSVRecord } from 'src/app/_models/CSVRecord';
import { read, writeFileXLSX, readFile } from "xlsx";
import { WeightPipe } from "src/app/utils/weight-pipe";
@Component({
  selector: "app-teams-datatable",
  templateUrl: "teams-datatable.component.html",
  styleUrls: ["teams-datatable.component.css"],
  encapsulation: ViewEncapsulation.None,
  providers: [UpperCasePipe, WeightPipe]
})


export class TeamsDatatable implements OnInit, OnChanges  {
  @Input() data!: any[];
  @Input() teams!: any[];
  @Input() confDerby!: any;
  @Input() derby!: any;
  @Input() selectedData: any[];
  @Input() columns: any[];
  @Input() loading: boolean = true;
  @Input() export: boolean = false;
  @Input() title: string = "";
  @Input() items: MenuItem[];
  @Input() emptyMessage: string = "No se encontraron registros.";
  @Output() dialogChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() dataChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() deleteRecords: EventEmitter<any> = new EventEmitter<any>();
  @Output() editRecords: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('dt') table: Table;
  @ViewChild('contextMenuDT') contextMenu: ContextMenu;
  @ViewChildren('dynamicInput') inputs!: QueryList<ElementRef>;
  @ViewChild('csvReader') csvReader: any;
  
  ringForm: UntypedFormGroup;
  clonedData: { [s: string]: any } = {};
  formEdit: UntypedFormGroup;
  titleFile = 'Angular7-readCSV';
  public records: any[] = [];

  constructor(private fb: UntypedFormBuilder, private crudService: CrudService, private confirmationService: ConfirmationService, private messageService: MessageService, private toastr: ToastrService, private primengConfig: PrimeNGConfig, private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.addFormDynamic();
    this.cd.detectChanges();
    this.primengConfig.ripple = true;
  }

  ngOnChanges(changes: any): void {
    if (changes.data) {
      this.formEdit = new UntypedFormGroup({});
      const self = this;
      this.data.map((data, index) => {
        self.columns.forEach((column, idx) => {
          if (column.field !== "_id") {
            this.formEdit.addControl(`${column.field}_${data._id}`, new UntypedFormControl(data[column.field], Validators.required));
          }
        });
      });
    }
  }

  ngAfterViewInit() {
    this.inputs.forEach((input, index) => {
      input.nativeElement.tabIndex = index + 1;
    });
  }

  addFormDynamic() {
    const data = this.teams;
    const dataRings = [];
    data.forEach((team: any) => {
      team.rings.teamName = team.teamName.toUpperCase();
      team.rings.teamId = team._id;
      dataRings.push(team.rings);
    });

    this.formEdit = new UntypedFormGroup({});
    const self = this;
    dataRings.map((data, index) => {
      self.columns.forEach((column, idx) => {
        if (column.field !== "_id") {
          this.formEdit.addControl(`${column.field}_${data._id}`, new UntypedFormControl(data[column.field], Validators.required));
        }
      });
    });
  }

  selectText(event: FocusEvent): void {
    const input = event.target as HTMLInputElement;
    input.select();
  }


  addNewTeam() {
    const generateMongoId = () => {
      const timestamp = Math.floor(Date.now() / 1000);
      const random = crypto.getRandomValues(new Uint8Array(5));
      const hex = Array.from(random).map(b => b.toString(16).padStart(2, '0')).join('');
      return `${timestamp.toString(16).padStart(8, '0')}${hex}`;
    };
    
    const _id = generateMongoId();

    let dataRound = {_id, teamName: "Nombre del partido"};
    for (let index = 0; index < this.derby.numGallos; index++) {
      dataRound = { ...dataRound, ["R" + (index + 1) + "_ring"]: 0,["R" + (index + 1) + "_weight"]: 0,};
    }

    this.dataChange.emit(dataRound);
  }

  uploadListener($event: any): void {
    let text = [];
    let files = $event.srcElement.files;
    if (this.isValidCSVFile(files[0])) {
      let input = $event.target;
      let reader = new FileReader();
      reader.readAsText(input.files[0]);
      reader.onload = () => {
        let csvData = reader.result;
        let csvRecordsArray = (<string>csvData).split(/\r\n|\n/);
        let headersRow = this.getHeaderArray(csvRecordsArray);
        this.records = this.getDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length);
      };
      reader.onerror = function () {
        console.log('error is occured while reading file!');
      };

    } else {
      alert("Please import valid .csv file.");
      this.fileReset();
    }
  }

  onUpload(event) {
    const file = event.files[0];
    const reader = new FileReader();
    const self = this;
    reader.onload = () => {
      const text = reader.result as string;
      const [headerLine, ...lines] = text.trim().split('\n');
      const headers = headerLine.split(',');

      const csvRecords = lines.map(line => {
        const values = line.split(',');
        let dataRound: any = {};
        dataRound.derby = this.derby._id;
        dataRound.rings = {};
        headers.forEach((header, i) => {
          header = header.replace(/\r/g, '');
          const value = values[i];
          if(header.includes('ring') || header.includes('weight')){
            dataRound.rings[header] = isNaN(Number(value)) ? value : Number(value);
          }else{
            dataRound[header] = isNaN(Number(value)) ? value : Number(value);
          }
        });
        return dataRound;
      });

      csvRecords.map((record: any) => {
        record.rings._id = self.generateMongoId();
      })

      const data={data: csvRecords, isMany: true}
      this.dataChange.emit(data);
      
    };

    reader.readAsText(file);
  }

  generateMongoId() {
    const timestamp = Math.floor(Date.now() / 1000);
    const random = crypto.getRandomValues(new Uint8Array(5));
    const hex = Array.from(random).map(b => b.toString(16).padStart(2, '0')).join('');
    return `${timestamp.toString(16).padStart(8, '0')}${hex}`;
  }

  edit(_data: any, control?: string, key?: string){
    console.log("🚀 ~ TeamsDatatable ~ edit ~ key:", key)
    console.log("🚀 ~ TeamsDatatable ~ edit ~ control:", control)
    console.log("🚀 ~ TeamsDatatable ~ edit ~ _data:", _data)
    
    if(!this.validacionesInputs()){
      return
    }
    if (control && key) {
      _data.teamName = this.formEdit.controls[control].value;
    }
    this.editRecords.emit(_data);
  }

  validacionesInputs(){
    return true;
  }

  // showContextMenu(cm: ContextMenu, event: MouseEvent) { 
  //   cm.onShow.emit(event);
  //   event.stopPropagation();
  // }

  deleteSelected() {
    this.deleteRecords.emit({ data: this.selectedData });
  }

  delete(data) {
    this.deleteRecords.emit({ data: [data] });
  }

  updData(idx, field, value) {
    this.editRecords.emit({idx, field, value});
  }

  onRowEditInit(data: any, dt: any) {
    dt.initRowEdit(data)
    this.cd.detectChanges();
  }

  getDataRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: any) {
    let csvArr = [];
    for (let i = 1; i < csvRecordsArray.length; i++) {
      let curruntRecord = (<string>csvRecordsArray[i]).split(',');
      if (curruntRecord.length == headerLength) {
        let csvRecord: CSVRecord = new CSVRecord();
        csvRecord.id = curruntRecord[0].trim();
        csvRecord.firstName = curruntRecord[1].trim();
        csvRecord.lastName = curruntRecord[2].trim();
        csvRecord.age = curruntRecord[3].trim();
        csvRecord.position = curruntRecord[4].trim();
        csvRecord.mobile = curruntRecord[5].trim();
        csvArr.push(csvRecord);
      }
    }
    return csvArr;
  }

  isValidCSVFile(file: any) {
    return file.name.endsWith(".csv");
  }

  getHeaderArray(csvRecordsArr: any) {
    let headers = (<string>csvRecordsArr[0]).split(',');
    let headerArray = [];
    for (let j = 0; j < headers.length; j++) {
      headerArray.push(headers[j]);
    }
    return headerArray;
  }
  fileReset() {
    this.csvReader.nativeElement.value = "";
    this.records = [];
  }
}
