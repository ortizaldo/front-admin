import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from "@angular/core";
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from "@angular/forms";
import { ConfirmationService, MenuItem, MessageService, PrimeNGConfig } from "primeng/api";
import { ContextMenu } from "primeng/contextmenu";
import { Table } from "primeng/table";
import { catchError, tap } from "rxjs";
import { CrudService } from "src/app/_services/crud.service";
import { ExcelService } from "src/app/_services/excel.service";
import * as _ from "underscore";
@Component({
  selector: "app-corretaje-datatable",
  templateUrl: "corretaje-datatable.component.html",
  styleUrls: ["corretaje-datatable.component.css"],
  encapsulation: ViewEncapsulation.None,
})


export class CorretajeDatatable implements OnInit {
  @Input() data!: any[];
  @Input() groupedData: any;
  @Input() selectedData: any[];
  @Input() columns: any[];
  @Input() loading: boolean = true;
  @Input() export: boolean = false;
  @Input() total: number = 0;
  @Input() title: string = "";
  @Input() items: MenuItem[];
  @Input() emptyMessage: string = "No se encontraron registros.";
  @Output() dialogChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() deleteRecords: EventEmitter<any> = new EventEmitter<any>();
  @Output() editRecords: EventEmitter<any> = new EventEmitter<any>();
  @Output() getData: EventEmitter<any> = new EventEmitter<any>();

  selectedSize: any = '';
  sizes!: any[];
  formEdit: UntypedFormGroup;

  activeIndex: number = 0;

  @ViewChild('dt') table: Table;
  @ViewChild('contextMenuDT') contextMenu: ContextMenu;
  constructor(private excelService: ExcelService, private fb: UntypedFormBuilder,private crudService: CrudService, private primengConfig: PrimeNGConfig, private cd: ChangeDetectorRef, private confirmationService: ConfirmationService, private messageService: MessageService) { }

  ngOnInit() {
    this.formEdit = new UntypedFormGroup({
      folio: new UntypedFormControl(0, [Validators.required]),
      amount: new UntypedFormControl(0, [Validators.required]),
      nulo: new UntypedFormControl(false),
    });
    this.primengConfig.ripple = true;
    this.cd.detectChanges();

    this.sizes = [
        { name: 'Small', class: 'p-datatable-sm' },
        { name: 'Normal', class: '' },
        { name: 'Large',  class: 'p-datatable-lg' }
    ];
    this.calcularTotalCorretaje();
  }


  calcularTotalCorretaje() {
    const array = Object.entries(this.groupedData);
    if (!_.isEmpty(this.groupedData)) {
      let total = 0;
      array.map(([clave, valor]: [string, { total: number }]) => {
        if ('total' in valor) {
          total += valor.total;
        }
      });
      this.total = total;
    }else{
      this.total = 0;
    }
  }

  openDialog() {
    this.dialogChange.emit({ openDialog: true });
  }

  // showContextMenu(cm: ContextMenu, event: MouseEvent) {
  //   cm.onShow.emit(event);
  //   event.stopPropagation();
  // }

  deleteSelected() {
    this.deleteRecords.emit({ data: this.selectedData });
  }

  getBrokerBet() {
    const populate = [
      {
        path: 'derby',
        select: 'name'
      },
      {
        path: 'brooker',
        select: 'brookerName'
      },
    ];
    const filter = {
      endpoint: 'brooker-bet',
      params: {},
      populate
    }
    this.getData.emit(filter);
  }

  exportToExcel(): void {
    this.excelService.exportToExcel(this.groupedData, 'sample-file');
  }

  delete(data) {
    this.calcularTotalCorretaje();
    this.deleteRecords.emit({ data: [data] });
  }
  onRowEditInit(data: any) {}

  onRowEditSave(data: any, key?: string) {
    this.calcularTotalCorretaje();
    const _data = {data, key}
    this.editRecords.emit({ value: _data });
  }

  edit(data: any, key?: string){
    if (data.nulo) {
      data.amount = 0;
    }
    this.calcularTotalCorretaje();
    const _data = {data, key}
    this.editRecords.emit({ value: _data });
  }



  onRowEditCancel(data: any, index: number) {}
}
