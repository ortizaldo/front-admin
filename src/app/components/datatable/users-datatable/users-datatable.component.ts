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
  selector: "app-users-datatable",
  templateUrl: "users-datatable.component.html",
  styleUrls: ["users-datatable.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class UsersDatatable implements OnInit {
  @Input() data: any[] = [];
  @Input() selectedData: any[];
  @Input() globalFilter: any[] = ["name", "description", "countryDesc"];
  @Input() columns: any[];
  @Input() loading: boolean = true;
  @Input() export: boolean = false;
  @Input() statsUsers: boolean = true;
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
    this.items = [
      {
        name: "Options",
        icon: "pi pi-upload",
        routerLink: ["/fileupload"],
      },
    ];
    this.primengConfig.ripple = true;
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

  delete(data) {
    this.deleteRecords.emit({ data: [data] });
  }

  editSelected(data) {
    this.editRecords.emit({ data });
  }

  getItems(data: any): MenuItem[] {
    if (!data) {
      return [];
    }

    let items: MenuItem[] = [
      {
        label: "Editar",
        icon: "pi pi-pencil",
        command: () => {
          // this.editUser(data);
        },
      },
      {
        label: "Eliminar",
        icon: "pi pi-trash",
        command: () => {
          // this.deleteUser(data);
        },
      },
    ];

    if (data.status === "ACTIVE") {
      items.push({
        label: "Desactivar",
        icon: "pi pi-ban",
        command: () => {
          // this.deactivateUser(data);
        },
      });
    }

    if (data.status === "PENDING_ACTIVATION") {
      items.push({
        label: "Reenviar invitación",
        icon: "pi pi-send",
        command: () => {
          // this.resendInvitation(data);
        },
      });
    }

    if (data.status !== "ACTIVE" && data.status !== "PENDING_ACTIVATION") {
      items.push({
        label: data.status === "Active" ? "Desactivar" : "Activar",
        icon: data.status === "Active" ? "pi pi-ban" : "pi pi-check-circle",
        command: () => {
          // this.deactivateUser(data);
        },
      });
    }
    return items;
  }
}
