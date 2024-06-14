import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from "@angular/core";
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
  @Input() data!: any[];
  @Input() confDerby!: any;
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


  @ViewChild('dt') table: Table;
  @ViewChild('contextMenuDT') contextMenu: ContextMenu;
  constructor(private crudService: CrudService, private primengConfig: PrimeNGConfig) { }

  ngOnInit() {
    console.log('%csrc/app/components/datatable/teams-datatable/teams-datatable.component.ts:36 columns', 'color: #007acc;', this.columns);
    console.log('%csrc/app/components/datatable/teams-datatable/teams-datatable.component.ts:37 this.data', 'color: #007acc;', this.data);
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
