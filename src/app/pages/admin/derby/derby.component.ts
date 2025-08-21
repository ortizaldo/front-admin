import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import Chart from "chart.js";
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
  @Output() dataUpdated = new EventEmitter();

  derbyForm: UntypedFormGroup;
  derbyConf: UntypedFormGroup;
  teamForm: UntypedFormGroup;
  derbys!: any[];
  teams!: any[];
  compadres: any[] = [];
  derby: any;
  confDerby: any;
  body: any;
  title: string = "Crear derby";
  selectedDerby: any;
  _id: any;
  columns: any[];

  //variables para el datatable
  public itemsDT: MenuItem[];
  titleDT: string;
  emptyMessage: string;
  endpoint: string;
  data: any[] = [];
  columnsDT: any[];
  selectedAny: any;
  headerDetails: string = "Agregar partido";
  dataRound: any;
  itemsDerby: MenuItem[];

  derbyModel = {};

  teamModel = {};

  derbyDialog: boolean = false;
  teamDialog: boolean = false;
  isEditing: boolean = false;
  loading: boolean = true;

  @ViewChild("derbyTemplate", { static: true }) derbyTemplate: TemplateRef<any>;
  @ViewChild("derbyCompadresTemplate", { static: true })
  derbyCompadresTemplate: TemplateRef<any>;
  @ViewChild("teamTemplate", { static: true }) teamTemplate: TemplateRef<any>;
  @ViewChild("buttonsTemplate", { static: true })
  buttonsTemplate: TemplateRef<any>;
  @ViewChild("buttonsTemplateTeam", { static: true })
  buttonsTemplateTeam: TemplateRef<any>;
  constructor(
    private fb: UntypedFormBuilder,
    private crudService: CrudService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.itemsDerby = [
      {
        label: "Nuevo derby",
        icon: "pi pi-plus",
        command: () => this.openNew({ openDialog: true }),
      },
    ];

    this.getDerbys();

    this.derbyForm = this.fb.group({
      name: new UntypedFormControl(""),
      arma: new UntypedFormControl("", [Validators.required]),
      armaSelected: new UntypedFormControl(""),
      numGallos: new UntypedFormControl("", [Validators.required]),
      entrance: new UntypedFormControl("", [Validators.required]),
      dateEvent: new UntypedFormControl(moment().format("YYYY-MM-DD")),
    });

    this.derbyConf = this.fb.group({
      tolerance: new UntypedFormControl(""),
      minWeight: new UntypedFormControl("", [Validators.required]),
      maxWeight: new UntypedFormControl("", [Validators.required]),
    });

    this.initDTL();
  }

  initDTL() {
    this.emptyMessage = "No se encontraron partidos";
    this.endpoint = "team";
    this.teamForm = new UntypedFormGroup({
      teamName: new UntypedFormControl("", [Validators.required]),
    });

    this.columns = [{ field: "description", header: "Pais" }];

    this.teamForm = new UntypedFormGroup({
      description: new UntypedFormControl("", [Validators.required]),
    });
  }

  saveDerby() {
    const name =
      "Derby " +
      this.derbyForm.value.armaSelected.description +
      " " +
      this.derbyForm.value.numGallos +
      " Gallos";
    this.derbyForm.patchValue({ name: name });
    this.derbyForm.patchValue({
      arma: this.derbyForm.value.armaSelected.value,
    });
    this.body = this.derbyForm.value;
    const self = this;
    this.crudService
      .post(this.body, "derby")
      .pipe(
        tap((data: any) => {
          this.loading = false;
          this.derbyDialog = false;
          this.derbyForm.reset();
          this.derby = data.data;
          this.saveConf();
        }),
        catchError((err) => {
          const _err = err.error ? err.error.err : err;
          this.showNotification(
            "top",
            "right",
            "Error al registrar",
            _err.code == 11000 ? "Registro duplicado" : _err.message,
            "alert-warning"
          );
          return err;
        })
      )
      .subscribe();
  }

  saveConf() {
    const body = {
      derby: this.derby._id,
      roosterConf: {
        tolerance: 80,
        minWeight: 1400,
        maxWeight: 1900,
      },
    };
    this.crudService
      .post(body, "derby-conf")
      .pipe(
        tap((data: any) => {
          this.getDerbys();
          this.showNotification(
            "top",
            "right",
            "Registro del derby",
            "Se registro correctamente",
            "alert-success"
          );
        }),
        catchError((err) => {
          const _err = err.error ? err.error.err : err;
          this.showNotification(
            "top",
            "right",
            "Error al registrar",
            _err.code == 11000 ? "Registro duplicado" : _err.message,
            "alert-warning"
          );
          return err;
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
    this.crudService
      .getMany("derby", null, params)
      .pipe(
        tap((data: any) => {
          this.derbys = data.data;
          if (this.derby) {
            this.selectedDerby = _.findWhere(this.derbys, {
              _id: this.derby._id,
            });

            this.onChange();
          }
          this.loading = false;
        }),
        catchError((err) => {
          this.loading = false;
          return err;
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
    if (openDialog) {
      this.derbyModel = {
        template: this.derbyTemplate,
        templateButtons: this.buttonsTemplate,
      };
      this.title = "Agregar derby";
    }
    this.derbyDialog = openDialog;
  }

  openNewCompadres(cmd) {
    console.log(
      "%cfront-admin/src/app/pages/admin/derby/derby.component.ts:247 this.teams",
      "color: #007acc;",
      this.teams
    );
    const { openDialog } = cmd;
    if (openDialog) {
      this.derbyModel = {
        template: this.derbyCompadresTemplate,
        templateButtons: this.buttonsTemplate,
      };
      this.title = "Configurar compadres";
    }
    this.derbyDialog = openDialog;
  }

  openNewTeam(cmd) {
    const { openDialog } = cmd;
    if (openDialog) {
      this.derbyModel = {
        template: this.teamTemplate,
        templateButtons: this.buttonsTemplateTeam,
      };
      this.title = "Agregar partido";
    }

    this.derbyDialog = openDialog;
  }

  addNewTeam(cmd) {
    if (!_.has(cmd, "isMany")) {
      this.saveOne(cmd);
    } else {
      this.saveMany(cmd);
    }
  }

  saveOne(cmd) {
    const { teamName } = cmd;
    delete cmd.teamName;
    const teams = {
      derby: this.selectedDerby._id,
      teamName,
      rings: cmd,
    };
    this.crudService
      .post(teams, "team")
      .pipe(
        tap((data: any) => {
          this.messageService.add({
            severity: "success",
            summary: "Registro partidos",
            detail: "Partido agregado",
            life: 3000,
          });
          cmd.teamName = teamName;
          this.getTeams();
        }),
        catchError((err) => {
          this.loading = false;
          return err;
        })
      )
      .subscribe();
  }

  saveMany(cmd) {
    this.crudService
      .post(cmd.data, "team")
      .pipe(
        tap((data: any) => {
          this.messageService.add({
            severity: "success",
            summary: "Registro partidos",
            detail: "Se registraron los partidos",
            life: 3000,
          });
          this.getTeams();
        }),
        catchError((err) => {
          this.loading = false;
          return err;
        })
      )
      .subscribe();
  }

  deleteOne(item: any) {
    console.log("🚀 ~ DerbyComponent ~ deleteOne ~ item:", item);
    this.crudService
      .deleteOne(this.endpoint, item.teamId, {
        filters: {
          hardDelete: true,
        },
      })
      .pipe(
        tap((data: any) => {
          this.loading = false;
          this.messageService.add({
            severity: "success",
            summary: "Successful",
            detail: "Registro Eliminado",
            life: 3000,
          });
          this.getTeams();
        }),
        catchError((err) => {
          this.loading = false;
          return err;
        })
      )
      .subscribe();
  }

  deleteMany(items: any[]) {
    this.crudService
      .deleteMany(this.endpoint, items, {
        filters: {
          hardDelete: true,
        },
      })
      .pipe(
        tap((data: any) => {
          this.loading = false;
          this.messageService.add({
            severity: "success",
            summary: "Successful",
            detail: "Registros Eliminados",
            life: 3000,
          });
          this.getTeams();
          this.selectedAny = null;
        }),
        catchError((err) => {
          this.loading = false;
          return err;
        })
      )
      .subscribe();
  }

  deleteSelected(event) {
    console.log("🚀 ~ DerbyComponent ~ deleteSelected ~ event:", event);
    let title = "Estas seguro de eliminar los siguientes partidos?";
    if (event.data.length === 1) {
      title = `Estas seguro de eliminar el partido ${event.data[0].teamName} ?`;
    }
    this.confirmationService.confirm({
      message: title,
      header: "Eliminar partido",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        if (event.data.length > 1) {
          let items = [];
          event.data.forEach((item: any) => {
            items.push(item.teamId);
          });
          this.deleteMany(items);
        } else {
          this.deleteOne(event.data[0]);
        }
      },
    });
  }

  editSelected(data) {
    const { teamName } = data;
    const { teamId } = data;
    delete data.teamName;
    delete data.teamId;
    const rings = [];

    const teams = {
      derby: this.selectedDerby._id,
      teamName: teamName.toUpperCase(),
      rings: data,
    };

    this.crudService
      .put(teams, teamId, "team")
      .pipe(
        tap((data: any) => {
          this.getTeams();
        }),
        catchError((err) => {
          this.loading = false;
          return err;
        })
      )
      .subscribe();
  }

  openModalCompadres(event) {
    this.openNewCompadres(event);
  }

  agregarGrupo() {
    const countCompadres = this.compadres.length + 1;
    this.compadres.push({ name: `Grupo ${countCompadres}`, partidos: [] });
  }

  onDrop(grupo: any, partido: any) {
    console.log("🚀 ~ DerbyComponent ~ onDrop ~ partido:", partido);
    if (!grupo.partidos.some((p: any) => p.id === partido.id)) {
      grupo.partidos.push(partido);
    }
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

  hideTeamDialog(cmd) {
    this.teamForm.reset();
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
  showNotification(
    from,
    align,
    title = "",
    message = "",
    color = "alert-info"
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
      }
    );
  }

  onChange() {
    this.selectedDerby = this.derbys.find((obj) => obj._id === this._id);
    if (this.selectedDerby) {
      const params = {
        filtersId: {
          derby: {
            value: this.selectedDerby._id,
          },
        },
      };
      this.getDerbyConf("derby-conf", params);
      this.getDerbyTeams("team", params);
    } else {
      this.confDerby = null;
      this.teams = [];
      this.data = [];
      this.columnsDT = [];
      this.dataUpdated.emit();
    }
  }

  getDerbyConf(type: string, params: any) {
    this.crudService
      .getMany(type, null, params)
      .pipe(
        tap((data: any) => {
          this.confDerby = data.data[0];
          console.log(
            "%cfront-admin/src/app/pages/admin/derby/derby.component.ts:400 this.confDerby",
            "color: #007acc;",
            this.confDerby
          );
        }),
        catchError((err) => {
          return err;
        })
      )
      .subscribe();
  }

  getDerbyTeams(type: string, params: any) {
    this.crudService
      .getMany(type, null, params)
      .pipe(
        tap((data: any) => {
          this.teams = data.data;
          let _data = [];
          const idx = 2;
          for (let index = 0; index < this.selectedDerby.numGallos; index++) {
            _data.push(
              {
                header: "R" + (index + 1) + " Anillo",
                size: "40px",
                field: "R" + (index + 1) + "_ring",
              },
              {
                header: "Peso",
                size: "40px",
                field: "R" + (index + 1) + "_weight",
              }
            );
          }
          this.columnsDT = [
            { header: "Partido", size: "150px", field: "teamName" },
            { field: "_id" },
            ..._data,
          ];

          this.columnsDT.map((column, idx) => {
            column.idx = idx + 1;
            column.tabIndex = idx;
          });
          this.getTeams();
        }),
        catchError((err) => {
          return err;
        })
      )
      .subscribe();
  }

  getTeams() {
    const params = {
      filtersId: {
        derby: {
          value: this.selectedDerby._id,
        },
      },
    };
    this.crudService
      .getMany("team", null, params)
      .pipe(
        tap((data: any) => {
          const teams = data.data;
          this.data = [];
          teams.forEach((team: any) => {
            const teamN = team.teamName.toUpperCase();
            team.rings.teamName = teamN;
            team.rings.teamId = team._id;
            team.rings._id = team._id;

            this.data.push(team.rings);
            this.dataUpdated.emit();
          });
        }),
        catchError((err) => {
          return err;
        })
      )
      .subscribe();
  }
  setDerby(partido: any) {
    this.columnsDT = [{ header: "Partido", field: "partido" }];
    const self = this;

    let _data;
    for (let index = 0; index < this.selectedDerby.numGallos; index++) {
      _data = { ..._data, ["anillo" + (index + 1)]: "" };
      _data = { ..._data, ["peso" + (index + 1)]: "" };
    }
    let dataRound = [];
    for (let index = 0; index < 1; index++) {
      dataRound.push({ partido: "Partido " + (index + 1), ..._data });
    }

    this.data = dataRound;
  }
}
