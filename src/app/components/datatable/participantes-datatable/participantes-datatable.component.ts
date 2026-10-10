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
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { ToastrService } from "ngx-toastr";
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
  roosterForm!: UntypedFormGroup;

  @Input() data: any[] = [];
  @Input() selectedData: any[];
  @Input() globalFilter: any[] = ["numero", "nombre"];
  @Input() loading: boolean = true;
  @Input() export: boolean = false;
  @Input() title: string = "";
  @Input() event_id: string = "";
  @Input() items: MenuItem[];
  @Input() emptyMessage: string = "No se encontraron registros.";
  @Output() dialogChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() deleteRecords: EventEmitter<any> = new EventEmitter<any>();
  @Output() editRecords: EventEmitter<any> = new EventEmitter<any>();
  @Output() refreshRoosters: EventEmitter<any> = new EventEmitter<any>();

  visible: boolean = false;

  @ViewChild("dt") table: Table;
  @ViewChild("contextMenuDT") contextMenu: ContextMenu;
  constructor(
    private crudService: CrudService,
    private fb: UntypedFormBuilder,
    private primengConfig: PrimeNGConfig,
    private toastr: ToastrService,
  ) {}

  ngOnInit() {
    this.primengConfig.ripple = true;

    this.roosterForm = this.fb.group({
      nombre: ["", Validators.required],
    });
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

  showDialog() {
    this.visible = true;
  }

  closeDialog() {
    this.visible = false;
    this.roosterForm.reset();
  }

  saveRooster() {
    const rooster = this.roosterForm.value;
    rooster.event = this.event_id; // Replace with the actual event ID
    this.crudService
      .post(rooster, "rooster")
      .pipe(
        tap((data: any) => {
          console.log(
            "🚀 ~ ParticipantesDatatable ~ saveRooster ~ data:",
            data.data,
          );
          this.showNotification(
            "top",
            "right",
            "Registro exitoso",
            "Se ha registrado correctamente el participante",
            "alert-success",
          );
          this.refreshRoosters.emit();
          this.visible = false;
          this.roosterForm.reset();
        }),
        catchError((err) => {
          const _err = err.error ? err.error.err : err;
          this.showNotification(
            "top",
            "right",
            "Error al registrar",
            _err.code == 11000 ? "Registro duplicado" : _err.message,
            "alert-warning",
          );
          return err;
        }),
      )
      .subscribe();
  }

  showNotification(
    from: string,
    align: string,
    title = "",
    message = "",
    color = "alert-info",
  ) {
    this.toastr.info(
      `<span class="tim-icons icon-bell-55" [data-notify]="icon"></span> ${title}</b> - ${message}.`,
      "",
      {
        disableTimeOut: true,
        closeButton: true,
        enableHtml: true,
        toastClass: `alert ${color} alert-with-icon`,
        positionClass: "toast-" + from + "-" + align,
      },
    );
  }
}
