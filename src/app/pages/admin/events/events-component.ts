import { ChangeDetectorRef, Component, OnInit, signal, TemplateRef, ViewChild, ViewEncapsulation } from "@angular/core";
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from "@angular/forms";
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { catchError, tap } from "rxjs";
import { CrudService } from "src/app/_services/crud.service";
import * as _ from "underscore";
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import InteractionPlugin from '@fullcalendar/interaction';
@Component({
  selector: "app-events",
  templateUrl: "events.component.html",
  styleUrls: ["events.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class EventsComponent implements OnInit {
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, InteractionPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    events: [],
    eventClick: this.onEventClick.bind(this)
  };

  currentEvents: any[] = [];

  eventoSeleccionado: any;
  display: boolean;
  constructor(private changeDetector: ChangeDetectorRef, private crudService: CrudService,) { 
    
  }

  ngOnInit() {
    this.getEvents('events', {}, []);
  }

  onEventClick(data: any) {
    const dataEvent = this.currentEvents.find(event => event.id == data.event._def.publicId);
    this.eventoSeleccionado = dataEvent;
    console.log("🚀 ~ EventsComponent ~ onEventClick ~ dataEvent:", dataEvent)
    this.display = true;
  }

  getEvents(endpoint, select, populate) {
    let params = {
      select,
      populate,
      filters: {
        deleted: false
      }
    };
    const self = this;
    this.crudService.getMany(endpoint, null, params)
      .pipe(
        tap((data: any) => {
          const result = data.data.map((event: any) => {
            return {
              id: event._id,
              title: event.nombre,
              start: new Date(event.fechaEvento),
              end: new Date(event.fechaEvento),
              information: event
            }
          });
          self.calendarOptions.events = result;
          self.currentEvents = result;
          self.changeDetector.detectChanges();
        }),
        catchError(err => {
          return err
        })
      )
      .subscribe();

  }
}
