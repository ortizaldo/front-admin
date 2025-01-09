import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from "@angular/core";
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
})


export class TeamsDatatable implements OnInit {
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
  constructor(private fb: UntypedFormBuilder, private crudService: CrudService, private confirmationService: ConfirmationService, private messageService: MessageService, private toastr: ToastrService, private primengConfig: PrimeNGConfig, private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.formEdit = new UntypedFormGroup({
      ring: new UntypedFormControl(0, [Validators.required]),
      weight: new UntypedFormControl(0, [Validators.required]),
      teamName: new UntypedFormControl(0, [Validators.required]),
    });
    this.primengConfig.ripple = true;
    this.cd.detectChanges();
    this.primengConfig.ripple = true;
  }


  openDialog() {
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

  edit(data: any, key?: string){
    console.log("🚀 ~ TeamsDatatable ~ edit ~ data:", data)
    // if (data.nulo) {
    //   data.amount = 0;
    // }
    // this.calcularTotalCorretaje();
    // const _data = {data, key}
    // this.editRecords.emit({ value: _data });
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
    // this.data[idx][field]= value;
  }
}
