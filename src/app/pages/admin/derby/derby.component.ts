import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import Chart from 'chart.js';
import { ToastrService } from "ngx-toastr";
import { ConfirmationService, MenuItem, MessageService } from "primeng/api";
import { catchError, tap } from "rxjs";
import { CrudService } from "src/app/_services/crud.service";
import * as moment from "moment";
import * as _ from "underscore";

@Component({
  selector: "app-derby",
  templateUrl: "derby.component.html"
})
export class DerbyComponent implements OnInit {
  derbyForm: FormGroup;
  derbyConf: FormGroup;
  derbys!: any[];
  derby: any;
  body: any;
  title: string = "Crear derby";
  selectedDerby: any;
  columns: any[];

  itemsDerby: MenuItem[];

  derbyModel = {
  };

  derbyDialog: boolean = false;
  isEditing: boolean = false;
  loading: boolean = true;

  @ViewChild('derbyTemplate', { static: true }) derbyTemplate: TemplateRef<any>;
  @ViewChild('buttonsTemplate', { static: true }) buttonsTemplate: TemplateRef<any>;
  constructor(private fb: FormBuilder, private crudService: CrudService, private confirmationService: ConfirmationService, private messageService: MessageService, private toastr: ToastrService) { }

  ngOnInit() {
    this.itemsDerby = [
      {label: 'Nuevo derby', icon: 'pi pi-plus', command: () => this.openNew({ openDialog: true })},
    ];

    this.getDerbys();

    this.derbyModel = {
      template: this.derbyTemplate,
      templateButtons: this.buttonsTemplate
    }

    this.derbyForm = this.fb.group({
      name: new FormControl(''),
      arma: new FormControl('', [Validators.required]),
      numGallos: new FormControl('', [Validators.required]),
      entrance: new FormControl('', [Validators.required]),
      dateEvent: new FormControl(moment().format('YYYY-MM-DD')),
    });

    this.derbyConf = this.fb.group({
      tolerance: new FormControl(''),
      minWeight: new FormControl('', [Validators.required]),
      maxWeight: new FormControl('', [Validators.required]),
    });
  }

  saveDerby() {
    const name = "Derby " + this.derbyForm.value.arma.description + " " + this.derbyForm.value.numGallos + " Gallos";
    this.derbyForm.patchValue({ name: name });
    this.derbyForm.patchValue({ arma: this.derbyForm.value.arma.value });
    this.body = this.derbyForm.value;
    const self = this;
    this.crudService.post(this.body, "derby")
      .pipe(
        tap((data: any) => {
          this.loading = false;
          this.derbyDialog = false;
          this.derbyForm.reset();
          this.derby = data.data;
          this.saveConf();
        }),
        catchError(err => {
          const _err = err.error ? err.error.err : err;
          this.showNotification('top', 'right', "Error al registrar", _err.code == 11000 ? "Registro duplicado" : _err.message, "alert-warning")
          return err
        })
      )
      .subscribe();
  }

  saveConf() {
    const body = {derby: this.derby._id, roosterConf: {
              tolerance: .080,
              minWeight: 1.400,
              maxWeight: 2.900,
            } };
    this.crudService.post(body, 'derby-conf')
      .pipe(
        tap((data: any) => {
          this.getDerbys();
          this.showNotification('top', 'right', "Registro del derby","Se registro correctamente","alert-success");
        }),
        catchError(err => {
          const _err = err.error ? err.error.err : err;
          this.showNotification('top', 'right', "Error al registrar", _err.code == 11000 ? "Registro duplicado" : _err.message, "alert-warning")
          return err
        })
      )
      .subscribe();
  }

  getDerbys() {
    const params = {
      filters: {
        deleted: false,
      },
    };
    this.crudService.getMany("derby", null, params)
      .pipe(
        tap((data: any) => {
          this.derbys = data.data;
          if (this.derby) {
            this.selectedDerby = _.findWhere(this.derbys, { _id: this.derby._id });
          }
          this.loading = false;
        }),
        catchError(err => {
          this.loading = false;
          return err
        })
      )
      .subscribe();

  }

  /**
   * A function to open a new dialog based on the provided command.
   *
   * @param {any} cmd - An object containing information about opening the dialog.
   */
  openNew(cmd) {
    const { openDialog } = cmd;
    this.derbyDialog = openDialog;
  }
  /**
   * Resets the derby form and closes the derby dialog.
   *
   * @param {any} cmd - The command object.
   */
  hideDialog(cmd) {
    this.derbyForm.reset();
    this.derbyDialog = false;
  }
  /**
   * A function to show a notification.
   *
   * @param {any} from - The position from which the notification will appear.
   * @param {any} align - The alignment of the notification.
   * @param {string} title - The title of the notification.
   * @param {string} message - The message content of the notification.
   * @param {string} color - The color theme of the notification.
   */
  showNotification(from, align, title = '', message = '', color = "alert-info") {
    this.toastr.info(`<span class="tim-icons icon-bell-55" [data-notify]="icon"></span> ${title}</b> - ${message}.`, '', {
      disableTimeOut: true,
      closeButton: true,
      enableHtml: true,
      toastClass: `alert ${color} alert-with-icon`,
      positionClass: 'toast-' + from + '-' + align
    });
  }

  onChange(evt: any, endpoint: string) {
    console.log('%csrc/app/pages/admin/derby/derby.component.ts:135 this.selectedDerby', 'color: #007acc;', this.selectedDerby);
  }
}
