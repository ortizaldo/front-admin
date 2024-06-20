import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from "@angular/core";
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
  templateUrl: "derby.component.html",
  styleUrls: ["derby.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class DerbyComponent implements OnInit {
  derbyForm: FormGroup;
  derbyConf: FormGroup;
  teamForm: FormGroup;
  derbys!: any[];
  derby: any;
  confDerby: any;
  body: any;
  title: string = "Crear derby";
  selectedDerby: any;
  columns: any[];

  //variables para el datatable
  public itemsDT: MenuItem[];
  titleDT: string;
  emptyMessage: string;
  endpoint: string;
  data: any[];
  columnsDT: any[];
  selectedAny: any;
  headerDetails: string = "Agregar partido";
  dataRound : any ;
  itemsDerby: MenuItem[];

  derbyModel = {
  };

  teamModel = {
  };

  derbyDialog: boolean = false;
  teamDialog: boolean = false;
  isEditing: boolean = false;
  loading: boolean = true;

  @ViewChild('derbyTemplate', { static: true }) derbyTemplate: TemplateRef<any>;
  @ViewChild('teamTemplate', { static: true }) teamTemplate: TemplateRef<any>;
  @ViewChild('buttonsTemplate', { static: true }) buttonsTemplate: TemplateRef<any>;
  @ViewChild('buttonsTemplateTeam', { static: true }) buttonsTemplateTeam: TemplateRef<any>;
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

    this.teamModel = {
      teamTemplate: this.teamTemplate,
      buttonsTemplateTeam: this.buttonsTemplateTeam
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

    this.initDTL();
  }

  initDTL() {
    this.emptyMessage = "No se encontraron partidos";
    this.endpoint = 'team';
    this.teamForm = new FormGroup({
      teamName: new FormControl('', [Validators.required]),
    });

    this.columns = [
      { field: 'description', header: 'Pais' },
    ];

    this.teamForm = new FormGroup({
      description: new FormControl('', [Validators.required]),
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

            this.onChange(null, null);
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

  editSelected(data) {
    this.data[data.idx][data.field]= data.value;
    console.log("🚀 ~ DerbyComponent ~ editSelected ~ data:", data)
    // this.catalog = data.data;
    // this.isEditing = true;
    // switch (this.endpoint) {
    //   case 'state': {
    //     this.headerDetails = "Editar registro de Estado";
    //     break;
    //   }
    //   case 'municipality': {
    //     this.headerDetails = "Editar registro de Municipio";
    //     break;
    //   }
    //   case 'country': {
    //     this.headerDetails = "Editar registro de País";
    //     break;
    //   }
    // }
    // this.catalogForm.patchValue(data.data);
    // this.catalogDialog = true;
  }

  deleteSelected(event) {
    console.log("🚀 ~ DerbyComponent ~ deleteSelected ~ event:", event)
    this.confirmationService.confirm({
      message: 'Estas seguro de eliminar este partido?',
      header: 'Eliminar partido',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // if (event.data.length > 1) {
        //   let items = [];
        //   event.data.forEach((item: any) => {
        //     items.push(item._id);
        //   });
        //   this.deleteMany(items);
        // } else {
        //   this.deleteOne(event.data[0]);
        // }
      }
    });
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

  openNewTeam(cmd) {
    console.log("🚀 ~ DerbyComponent ~ openNewTeam ~ cmd:", cmd)
    const { openDialog } = cmd;
    this.teamDialog = openDialog;
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
    const params = {
        filtersId: {
          derby: {
            value: this.selectedDerby._id,
          }
        }
      }
    this.getCatalogDependent("derby-conf", params);
  }

  getCatalogDependent(type: string, params: any) {
    this.crudService.getMany(type, null, params)
      .pipe(
        tap((data: any) => {
          this.confDerby = data.data[0]?.roosterConf;

          this.columnsDT = [
            { header: "Partido", field: "partido" },
          ]

          this.getRounds();
          const self = this;

          let _data;
          for (let index = 0; index < this.selectedDerby.numGallos; index++) {
            _data = {..._data, ["anillo"+(index + 1)]:""};
            _data = {..._data, ["peso"+(index + 1)]:""};
          }
          let dataRound = [];
          for (let index = 0; index < 10; index++) {
            dataRound.push({partido:"Partido "+(index + 1), ..._data});
          }

          this.data = dataRound;
        }),
        catchError(err => {
          return err
        })
      )
      .subscribe();
  }

  getRounds() {
    let self = this;
    for (let index = 0; index < this.selectedDerby.numGallos; index++) {
      self.columnsDT.push({ header: "Anillo" + (index + 1), field: "anillo" + (index + 1) });
      self.columnsDT.push({ header: "Peso" + (index + 1), field: "peso" + (index + 1) });
    }
  }
}
