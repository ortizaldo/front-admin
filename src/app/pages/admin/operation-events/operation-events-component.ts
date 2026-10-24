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

type EstadoPelea = "PROGRAMADA" | "EN_CURSO" | "FINALIZADA";

interface Partido {
  nombre: string;
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
  allFights: any[] = [];
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
    { label: "FINALIZADA", value: "FINALIZADA" },
    { label: "En curso", value: "encurso" },
    { label: "Programada", value: "programada" },
    { label: "Cancelada", value: "cancelada" },
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

  getFights(
    endpoint: string,
    select: any = {},
    populate: any = [],
    eventId?: string,
  ) {
    let params = {
      select,
      populate: [
        {
          path: "event",
          select: "nombre",
        },
        {
          path: "verde._id",
          select: "nombre",
        },
        {
          path: "rojo._id",
          select: "nombre",
        },
      ],
      filters: {
        deleted: false,
      },
      filtersId: {
        event: {
          value: eventId,
        },
      },
    };
    this.crudService
      .getMany(endpoint, null, params)
      .pipe(
        tap((response: any) => {
          this.allFights = response.data;
        }),
        catchError((error) => {
          console.error("Error fetching fights:", error);
          return [];
        }),
      )
      .subscribe();
  }

  cambiarEvento(evento: any) {
    this.eventoSeleccionado = evento;
    this.kpis[0].value = evento.numeroPeleas;
    this.kpis[1].value = evento.peleasEnCurso;
    this.kpis[2].value = evento.peleasFinalizadas;
    this.getFights("rooster-fights", {}, [], evento._id);
  }

  closeSidebar() {
    this.sidebarVisible = false;
  }

  closeSidebarPub() {
    this.sidebarVisiblePub = false;
  }

  get peleasFiltradas(): Pelea[] {
    const termino = this.normalizar(this.busqueda);

    return this.allFights.filter((pelea) => {
      const coincideBusqueda =
        !termino ||
        this.normalizar(pelea.cotejo).includes(termino) ||
        this.normalizar(pelea.verde._id.nombre).includes(termino) ||
        this.normalizar(pelea.rojo._id.nombre).includes(termino);

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
      FINALIZADA: "Finalizada",
      EN_CURSO: "En curso",
      PROGRAMADA: "Programada",
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
