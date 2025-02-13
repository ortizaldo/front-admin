import { UpperCasePipe } from "@angular/common";
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, QueryList, ViewChild, ViewChildren, ViewEncapsulation} from "@angular/core";
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { ConfirmationService, MenuItem, MessageService, PrimeNGConfig } from "primeng/api";
import { ContextMenu } from "primeng/contextmenu";
import { Table } from "primeng/table";
import { catchError, tap } from "rxjs";
import { CrudService } from "src/app/_services/crud.service";

@Component({
  selector: "app-teams-datatable",
  templateUrl: "teams-datatable.component.html",
  styleUrls: ["teams-datatable.component.css"],
  encapsulation: ViewEncapsulation.None,
  providers: [UpperCasePipe]
})


export class TeamsDatatable implements OnInit, OnChanges  {
  ringForm: UntypedFormGroup;
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

  formEdit: UntypedFormGroup;

  @ViewChild('dt') table: Table;
  @ViewChild('contextMenuDT') contextMenu: ContextMenu;

  clonedData: { [s: string]: any } = {};
  @ViewChildren('dynamicInput') inputs!: QueryList<ElementRef>;
  constructor(private fb: UntypedFormBuilder, private crudService: CrudService, private confirmationService: ConfirmationService, private messageService: MessageService, private toastr: ToastrService, private primengConfig: PrimeNGConfig, private cd: ChangeDetectorRef) {}

  ngOnInit() {
    console.log('%csrc/app/components/datatable/teams-datatable/teams-datatable.component.ts:48 this.columns', 'color: #007acc;', this.columns);
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

  edit(_data: any, control?: string, key?: string){
    if (control && key) {
      _data.teamName = this.formEdit.controls[control].value;
    }
    this.editRecords.emit(_data);
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
    console.log("🚀 ~ TeamsDatatable ~ onRowEditInit ~ data:", data)
    // this.addFormDynamic();
    dt.initRowEdit(data)
    this.cd.detectChanges();
  }
}
