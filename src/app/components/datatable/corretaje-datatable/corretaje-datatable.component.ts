import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from "@angular/core";
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

  activeIndex: number = 0;

  @ViewChild('dt') table: Table;
  @ViewChild('contextMenuDT') contextMenu: ContextMenu;
  constructor(private crudService: CrudService, private primengConfig: PrimeNGConfig) { }

  ngOnInit() {
    this.primengConfig.ripple = true;
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
    console.log("🚀 ~ file: simple-datatable.component.ts:56 ~ SimpleDatatable ~ editSelected ~ data:", data)
    this.editRecords.emit({ data });
  }
}
