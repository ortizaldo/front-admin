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
@Component({
  selector: "app-events",
  templateUrl: "events.component.html",
  styleUrls: ["events.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class EventsComponent implements OnInit {
  eventForm!: UntypedFormGroup;
  sidebarVisible: boolean = false;
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, InteractionPlugin],
    initialView: "dayGridMonth",
    displayEventTime: false,
    eventDisplay: "block",
    headerToolbar: {
      left: "prev,next today",
      center: "title",
      right: "dayGridMonth,timeGridWeek,timeGridDay",
    },
    events: [],
    eventClick: this.onEventClick.bind(this),
    eventContent: (arg: EventContentArg) => {
      return this.renderEvent(arg);
    },
    eventMouseEnter: (info) => {
      this.showEventPreview(info);
    },

    eventMouseLeave: () => {
      this.hideEventPreview();
    },
  };

  kpis: EventKpi[] = [
    {
      label: "Próximos",
      value: 8,
      type: "upcoming",
    },
    {
      label: "Este mes",
      value: 4,
      type: "month",
    },
    {
      label: "En curso",
      value: 1,
      type: "inProgress",
    },
    {
      label: "Finalizados",
      value: 12,
      type: "finished",
    },
  ];

  currentEvents: any[] = [];
  selectedEvent: any = null;

  eventoSeleccionado: any;
  display: boolean;

  previewVisible = false;
  title = "";

  previewPosition = {
    top: 0,
    left: 0,
  };

  private hidePreviewTimeout: any;

  @ViewChild("sidebarRef") sidebarRef!: Sidebar;
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

    this.eventForm = this.fb.group({
      nombre: ["", Validators.required],

      numGallos: [5, [Validators.required, Validators.min(1)]],

      tipoEvento: [null, Validators.required],

      arma: [null, Validators.required],

      pesoMinimo: [null],

      pesoMaximo: [null],

      tolerancia: [80],

      creditos: [null, Validators.required],

      peleaXDentro: [null],

      fechaEvento: [null, Validators.required],

      horarioBasculaInicio: [null],

      horarioBasculaFin: [null],

      flyer: [null],
    });
  }

  openSidebar() {
    this.sidebarVisible = true;
    this.title = "Nuevo evento";
    this.eventForm.reset();
  }

  onEventClick(data: any) {
    const dataEvent = this.currentEvents.find(
      (event) => event.id == data.event._def.publicId,
    );
    this.getEvent(dataEvent);
  }

  getEvent(event: any) {
    const params = {
      select: [],
      populate: [],
    };
    this.crudService
      .getMany("events", event.id, params)
      .pipe(
        tap((data: any) => {
          const _data = data.data;
          this.eventoSeleccionado = _data;
          this.title = "Editar evento";
          this.sidebarVisible = true;

          // console.log(utcDate);
          this.eventForm.patchValue({
            nombre: _data.nombre,
            numGallos: _data.numGallos,
            tipoEvento: _data.tipoEvento,
            arma: _data.arma,
            pesoMinimo: _data.pesoMinimo,
            pesoMaximo: _data.pesoMaximo,
            tolerancia: _data.tolerancia,
            creditos: _data.creditos,
            peleaXDentro: _data.peleaXDentro,
            fechaEvento: new Date(_data.fechaEvento),
            horarioBasculaInicio: this.parseTime12Hours(
              this.formatHour(new Date(_data.horarioBasculaInicio)),
            ),
            horarioBasculaFin: this.parseTime12Hours(
              this.formatHour(new Date(_data.horarioBasculaFin)),
            ),
            flyer: _data.flyer,
          });
        }),
        catchError((err) => {
          return err;
        }),
      )
      .subscribe();
  }

  private parseTime12Hours(time: string): Date | null {
    if (!time) {
      return null;
    }

    // Acepta: 03:00 p.m., 03:00 PM, 3:00 a. m., etc.
    const normalizedTime = time
      .trim()
      .toLowerCase()
      .replace(/\s/g, "")
      .replace(/\./g, "");

    const match = normalizedTime.match(
      /^(\d{1,2}):(\d{2})(?::(\d{2}))?(am|pm)$/,
    );

    if (!match) {
      return null;
    }

    let hours = Number(match[1]);
    const minutes = Number(match[2]);
    const seconds = Number(match[3] ?? 0);
    const period = match[4];

    if (period === "pm" && hours !== 12) {
      hours += 12;
    }

    if (period === "am" && hours === 12) {
      hours = 0;
    }

    const result = new Date();
    result.setHours(hours, minutes, seconds, 0);

    return result;
  }

  formatHour(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    return new Intl.DateTimeFormat("es-MX", options).format(date);
  }

  getEvents(endpoint, select, populate) {
    let params = {
      select,
      populate,
      filters: {
        deleted: false,
      },
    };
    const self = this;
    this.crudService
      .getMany(endpoint, null, params)
      .pipe(
        tap((data: any) => {
          const result = data.data.map((event: any) => {
            return {
              id: event._id,
              title: event.nombre,
              start: new Date(event.fechaEvento),
              end: new Date(event.fechaEvento),
              extendedProps: {
                id: event._id,
                fechaEvento: event.fechaEvento,
                weapon: event.arma,
                roosters: event.numGallos,
                status: event.status,
                pesoMinimo: event.pesoMinimo,
                pesoMaximo: event.pesoMaximo,
                creditos: event.creditos,
                flyer: event.flyer,
              },
            };
          });
          self.calendarOptions.events = result;
          console.log(
            "🚀 ~ EventsComponent ~ getEvents ~ self.calendarOptions.events:",
            self.calendarOptions.events,
          );
          self.currentEvents = result;
          self.changeDetector.detectChanges();
        }),
        catchError((err) => {
          return err;
        }),
      )
      .subscribe();
  }

  renderEvent(arg: EventContentArg): { domNodes: Node[] } {
    const event = arg.event;

    const weapon = event.extendedProps["weapon"] ?? "";
    const roosters = event.extendedProps["roosters"] ?? "";
    const status = event.extendedProps["status"] ?? "DRAFT";

    const day = event.start ? event.start.getDate().toString() : "";

    const card = document.createElement("div");
    card.className = "calendar-event-card";

    /* Fecha */

    const date = document.createElement("div");
    date.className = "calendar-event-card__date";
    date.textContent = day;

    /* Contenido */

    const content = document.createElement("div");
    content.className = "calendar-event-card__content";

    /* Título */

    const title = document.createElement("div");
    title.className = "calendar-event-card__title";
    title.textContent = event.title;

    /* Metadata */

    const meta = document.createElement("div");
    meta.className = "calendar-event-card__meta";
    meta.textContent = `${weapon} · ${roosters} pollos`;

    /* Status */

    const statusElement = document.createElement("div");

    statusElement.className =
      `calendar-event-card__status ` +
      `calendar-event-card__status--${status.toLowerCase()}`;

    statusElement.textContent = this.getStatusLabel(status);

    /* Armar card */

    content.appendChild(title);
    content.appendChild(meta);
    content.appendChild(statusElement);

    card.appendChild(date);
    card.appendChild(content);

    return {
      domNodes: [card],
    };
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      PUBLISHED: "PUBLICADO",
      OPEN: "ABIERTO",
      DRAFT: "BORRADOR",
    };

    return labels[status] ?? status;
  }

  showEventPreview(info: any): void {
    if (this.hidePreviewTimeout) {
      clearTimeout(this.hidePreviewTimeout);
    }

    const event = info.event._def;

    this.selectedEvent = {
      id: event.extendedProps["id"],
      fechaEvento: event.extendedProps["fechaEvento"],
      title: event.title,
      date: event.start,
      weapon: event.extendedProps["weapon"] + " De filo",
      roosters: event.extendedProps["roosters"],
      status: event.extendedProps["status"],
      creditos: event.extendedProps["creditos"],
      rounds: event.extendedProps["rounds"],
      flyer: event.extendedProps["flyer"],
      pesoMinimo: event.extendedProps["pesoMinimo"],
      pesoMaximo: event.extendedProps["pesoMaximo"],
    };

    const rect = info.el.getBoundingClientRect();

    const eventRect = info.el.getBoundingClientRect();

    const previewWidth = 330;
    const previewHeight = 250;

    const gap = 10;
    const viewportPadding = 16;

    let left: number;
    let top: number;

    /*
     * POSICIÓN HORIZONTAL
     */

    const spaceRight = window.innerWidth - eventRect.right;

    const spaceLeft = eventRect.left;

    // ¿Cabe a la derecha?
    if (spaceRight >= previewWidth + gap + viewportPadding) {
      left = eventRect.right + gap;
    }
    // ¿Cabe a la izquierda?
    else if (spaceLeft >= previewWidth + gap + viewportPadding) {
      left = eventRect.left - previewWidth - gap;
    }
    // No cabe completo en ninguno de los lados
    else {
      left = window.innerWidth - previewWidth - viewportPadding;
    }

    /*
     * POSICIÓN VERTICAL
     */

    top = eventRect.top;

    // Si se sale por abajo
    if (top + previewHeight + viewportPadding > window.innerHeight) {
      top = window.innerHeight - previewHeight - viewportPadding;
    }

    // Evitar salir por arriba
    top = Math.max(viewportPadding, top);

    /*
     * SEGURIDAD HORIZONTAL
     */

    left = Math.max(
      viewportPadding,
      Math.min(left, window.innerWidth - previewWidth - viewportPadding),
    );

    this.previewPosition = {
      top,
      left,
    };

    this.previewVisible = true;
  }

  hideEventPreview(): void {
    this.hidePreviewTimeout = setTimeout(() => {
      this.previewVisible = false;
      this.selectedEvent = null;
    }, 150);
  }

  cancelHidePreview(): void {
    if (this.hidePreviewTimeout) {
      clearTimeout(this.hidePreviewTimeout);

      this.hidePreviewTimeout = null;
    }
  }

  onSave(event: any) {}
  onSaveDraft(event: any) {
    if (event.editing) {
      this.editEvent(event.form, event._id);
    } else {
      this.saveEvent(event.form);
    }
  }

  onPublish(event: any) {
    this.editEvent(event.data, event._id);
  }

  saveEvent(form: any) {
    this.crudService
      .post(form, "events")
      .pipe(
        tap((data: any) => {
          console.log("🚀 ~ EventsComponent ~ onSaveDraft ~ data:", data);
          this.getEvents("events", {}, []);
          // this.loading = false;
          this.eventForm.reset();
          this.sidebarVisible = false;
          this.selectedEvent = null;
          this.showNotification(
            "top",
            "right",
            "Creación de evento",
            "El evento se creo correctamente.",
            "alert-success",
          );
        }),
        catchError((err) => {
          const _err = err.error ? err.error.err : err;
          console.log("🚀 ~ EventsComponent ~ onSaveDraft ~ _err:", _err);
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
  editEvent(form: any, id: string) {
    this.crudService
      .put(form, id, "events")
      .pipe(
        tap((data: any) => {
          this.getEvents("events", {}, []);
          this.eventForm.reset();
          this.sidebarVisible = false;
          this.selectedEvent = null;
          this.showNotification(
            "top",
            "right",
            "Edición de evento",
            "El evento se modifico correctamente.",
            "alert-success",
          );
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
  onClose(e) {
    this.sidebarRef.close(e);
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
