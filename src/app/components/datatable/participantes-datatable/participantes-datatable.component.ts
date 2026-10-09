import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import {
  ConfirmationService,
  MenuItem,
  MessageService,
  PrimeNGConfig,
} from "primeng/api";
import { ContextMenu } from "primeng/contextmenu";
import { Table } from "primeng/table";
import { catchError, tap } from "rxjs";
import { CrudService } from "src/app/_services/crud.service";

@Component({
  selector: "app-participantes-datatable",
  templateUrl: "participantes-datatable.component.html",
  styleUrls: ["participantes-datatable.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class ParticipantesDatatable implements OnInit {
  @Input() data: any[] = [];
  @Input() selectedData: any[];
  @Input() globalFilter: any[] = ["numero", "nombre"];
  @Input() loading: boolean = true;
  @Input() export: boolean = false;
  @Input() title: string = "";
  @Input() items: MenuItem[];
  @Input() emptyMessage: string = "No se encontraron registros.";
  @Output() dialogChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() deleteRecords: EventEmitter<any> = new EventEmitter<any>();
  @Output() editRecords: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild("dt") table: Table;
  @ViewChild("contextMenuDT") contextMenu: ContextMenu;
  constructor(
    private crudService: CrudService,
    private primengConfig: PrimeNGConfig,
  ) {}

  ngOnInit() {
    this.primengConfig.ripple = true;
  }

  openDialog() {
    this.dialogChange.emit({ openDialog: true });
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
}
