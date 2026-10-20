import {
  ChangeDetectorRef,
  Component,
  OnInit,
  signal,
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
import { ConfirmationService, MenuItem, MessageService } from "primeng/api";
import { catchError, tap } from "rxjs";
import { CrudService } from "src/app/_services/crud.service";
import * as _ from "underscore";
import {
  CalendarOptions,
  DateSelectArg,
  EventClickArg,
  EventApi,
  EventContentArg,
} from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import InteractionPlugin from "@fullcalendar/interaction";
import { EventKpi } from "src/app/interfaces/kpiEvents";
import { ToastrService } from "ngx-toastr";
import moment from "moment";
import { Sidebar } from "primeng/sidebar";
import localeEsMx from "@angular/common/locales/es-MX";
import { registerLocaleData } from "@angular/common";
import { Menu } from "primeng/menu";

registerLocaleData(localeEsMx);

type EstadoPelea = "finalizada" | "encurso" | "programada" | "cancelada";

interface Partido {
  partido: string;
  peso: number;
  anillo: number;
}

export interface Pelea {
  id: number;
  cotejo: string;
  ronda: number;
  verde: Partido;
  rojo: Partido;
  estado: EstadoPelea;
  resultado: string | null;
  duracion: string | null;
}

@Component({
  selector: "app-operation-events",
  templateUrl: "operation-events.component.html",
  styleUrls: ["operation-events.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class OperationEventsComponent implements OnInit {
  eventForm!: UntypedFormGroup;
  sidebarVisible: boolean = false;
  sidebarVisiblePub: boolean = false;

  kpis: EventKpi[] = [
    {
      label: "Cotejos",
      value: 8,
      type: "upcoming",
    },
    {
      label: "En curso",
      value: 1,
      type: "inProgress",
    },
    {
      label: "Finalizadas",
      value: 12,
      type: "finished",
    },
  ];

  allEvents: any[] = [];
  roosters: any[] = [];
  currentEvents: any[] = [];
  selectedEvent: any = null;

  eventoSeleccionado: any;
  flyerPreview: string | null = null;
  display: boolean;

  previewVisible = false;
  edit = false;
  loading = false;
  title = "";

  roostersDialog = false;
  isEditing = false;
  headerDetails = "";
  totalParticipantes = 0;

  busqueda = "";
  rondaSeleccionada: number | null = null;
  estadoSeleccionado: EstadoPelea | null = null;

  opcionesRonda = [
    { label: "Todas las rondas", value: null },
    { label: "Ronda 1", value: 1 },
    { label: "Ronda 2", value: 2 },
    { label: "Ronda 3", value: 3 },
  ];

  opcionesEstado = [
    { label: "Todos los estados", value: null },
    { label: "Finalizada", value: "finalizada" },
    { label: "En curso", value: "encurso" },
    { label: "Programada", value: "programada" },
    { label: "Cancelada", value: "cancelada" },
  ];

  peleas: Pelea[] = [
    {
      id: 1,
      cotejo: "01",
      ronda: 1,
      verde: { partido: "Violín y Qta Fénix-1", peso: 1.76, anillo: 101 },
      rojo: { partido: "Nicos y Pérez-2", peso: 1.76, anillo: 122 },
      estado: "finalizada",
      resultado: "Gana verde",
      duracion: "08:35",
    },
    {
      id: 2,
      cotejo: "02",
      ronda: 1,
      verde: { partido: "San Ángel", peso: 1.56, anillo: 102 },
      rojo: { partido: "Rentería Ranch", peso: 1.56, anillo: 269 },
      estado: "finalizada",
      resultado: "Empate",
      duracion: "12:04",
    },
    {
      id: 3,
      cotejo: "03",
      ronda: 1,
      verde: { partido: "Qta de la Rosa-1", peso: 1.67, anillo: 253 },
      rojo: { partido: "Aguilar", peso: 1.69, anillo: 115 },
      estado: "encurso",
      resultado: null,
      duracion: null,
    },
    {
      id: 4,
      cotejo: "04",
      ronda: 1,
      verde: { partido: "Nicos y Pérez-1", peso: 1.96, anillo: 105 },
      rojo: { partido: "La Chaliniza", peso: 1.97, anillo: 186 },
      estado: "programada",
      resultado: null,
      duracion: null,
    },
    {
      id: 5,
      cotejo: "05",
      ronda: 1,
      verde: { partido: "Alondra", peso: 1.63, anillo: 266 },
      rojo: { partido: "Violín y Qta Fénix-2", peso: 1.64, anillo: 152 },
      estado: "cancelada",
      resultado: null,
      duracion: null,
    },
  ];

  previewPosition = {
    top: 0,
    left: 0,
  };

  menuEvento = [];

  menuItems: MenuItem[] = [];

  myModel = {};

  private hidePreviewTimeout: any;

  @ViewChild("sidebarRef") sidebarRef!: Sidebar;
  @ViewChild("sidebarRefPub") sidebarRefPub!: Sidebar;
  @ViewChild("menu") menu!: MenuItem;

  @ViewChild("catalogTemplate", { static: true })
  catalogTemplate: TemplateRef<any>;
  @ViewChild("buttonsTemplate", { static: true })
  buttonsTemplate: TemplateRef<any>;
  constructor(
    private fb: UntypedFormBuilder,
    private changeDetector: ChangeDetectorRef,
    private crudService: CrudService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private toastr: ToastrService,
  ) {}

  ngOnInit() {
    this.getEvents("events", {}, []);
    // this.getkpiEvents("event-kpis", {}, []);

    this.myModel = {
      template: this.catalogTemplate,
      templateButtons: this.buttonsTemplate,
    };
  }

  getEvents(endpoint: string, select: any = {}, populate: any = []) {
    let params = {
      select,
      populate,
      filters: {
        deleted: false,
        status: "PUBLISHED",
      },
    };
    this.crudService
      .getMany(endpoint, null, params)
      .pipe(
        tap((response: any) => {
          this.allEvents = response.data;
        }),
        catchError((error) => {
          console.error("Error fetching events:", error);
          return [];
        }),
      )
      .subscribe();
  }

  getkpiRoosters(endpoint, select, populate, evento) {
    let params = {
      select,
      populate,
      filters: {
        deleted: false,
      },
    };
    this.crudService
      .getMany(endpoint, evento._id, params)
      .pipe(
        tap((data: any) => {
          console.log("total", data.total);
          this.eventoSeleccionado = evento;
          this.eventoSeleccionado.totalParticipantes = data.total;
        }),
        catchError((err) => {
          return err;
        }),
      )
      .subscribe();
  }

  cambiarEvento(evento: any) {
    this.getkpiRoosters("event-kpi-roosters", {}, [], evento);
    // this.sidebarVisible = true;
  }

  closeSidebar() {
    this.sidebarVisible = false;
  }

  closeSidebarPub() {
    this.sidebarVisiblePub = false;
  }

  get peleasFiltradas(): Pelea[] {
    const termino = this.normalizar(this.busqueda);

    return this.peleas.filter((pelea) => {
      const coincideBusqueda =
        !termino ||
        this.normalizar(pelea.cotejo).includes(termino) ||
        this.normalizar(pelea.verde.partido).includes(termino) ||
        this.normalizar(pelea.rojo.partido).includes(termino);

      const coincideRonda =
        this.rondaSeleccionada === null ||
        pelea.ronda === this.rondaSeleccionada;

      const coincideEstado =
        this.estadoSeleccionado === null ||
        pelea.estado === this.estadoSeleccionado;

      return coincideBusqueda && coincideRonda && coincideEstado;
    });
  }

  textoEstado(estado: EstadoPelea): string {
    const textos: Record<EstadoPelea, string> = {
      finalizada: "Finalizada",
      encurso: "En curso",
      programada: "Programada",
      cancelada: "Cancelada",
    };

    return textos[estado];
  }

  verPelea(pelea: Pelea): void {
    // this.ver.emit(pelea);
  }

  editarPelea(pelea: Pelea): void {
    // this.editar.emit(pelea);
  }

  registrarResultado(pelea: Pelea): void {
    // this.registrar.emit(pelea);
  }

  trackById(_index: number, pelea: Pelea): number {
    return pelea.id;
  }

  private normalizar(valor: string): string {
    return valor
      .toLocaleLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();
  }
}
