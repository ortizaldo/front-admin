import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ConfirmationService, MenuItem, MessageService, PrimeNGConfig } from "primeng/api";
import { ContextMenu } from "primeng/contextmenu";
import { Table } from "primeng/table";
import { catchError, tap } from "rxjs";
import { CrudService } from "src/app/_services/crud.service";

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
  @Input() title: string = "";
  @Input() items: MenuItem[];
  @Input() emptyMessage: string = "No se encontraron registros.";
  @Output() dialogChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() deleteRecords: EventEmitter<any> = new EventEmitter<any>();
  @Output() editRecords: EventEmitter<any> = new EventEmitter<any>();

  formEdit: FormGroup;

  activeIndex: number = 0;

  @ViewChild('dt') table: Table;
  @ViewChild('contextMenuDT') contextMenu: ContextMenu;
  constructor(private fb: FormBuilder,private crudService: CrudService, private primengConfig: PrimeNGConfig, private cd: ChangeDetectorRef, private confirmationService: ConfirmationService, private messageService: MessageService) { }

  ngOnInit() {
    this.formEdit = new FormGroup({
      folio: new FormControl(0, [Validators.required]),
      amount: new FormControl(0, [Validators.required]),
    });
    this.primengConfig.ripple = true;
    this.cd.detectChanges();
  }

  openDialog() {
    this.dialogChange.emit({ openDialog: true });
  }

  showContextMenu(cm: ContextMenu, event: MouseEvent) {
    cm.onShow.emit(event);
    event.stopPropagation();
  }

  deleteSelected() {
    this.deleteRecords.emit({ data: this.selectedData });
  }

  delete(data) {
    this.deleteRecords.emit({ data: [data] });
  }

  editSelected(data) {
    this.editRecords.emit({ data });
  }

  onRowEditInit(data: any) {
    console.log("🚀 ~ CorretajeDatatable ~ onRowEditInit ~ data:", data)
  }

  onRowEditSave(data: any, key?: string) {
    this.edit(data);
  }

  edit(data, key?: string) {
    this.crudService.put(data, data._id, "brooker-bet")
      .pipe(
        tap((data: any) => {
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Folio editado', life: 3000 });
          let total = 0;
          this.groupedData[key].data.map(item => {
            total += item.amount;
          });

          this.groupedData[key].total = total;
        }),
        catchError(err => {
          this.loading = false;
          return err
        })
      )
      .subscribe();
  }

  onRowEditCancel(data: any, index: number) {
    console.log("🚀 ~ CorretajeDatatable ~ onRowEditCancel ~ index:", index)
    console.log("🚀 ~ CorretajeDatatable ~ onRowEditCancel ~ data:", data)
  }
}
