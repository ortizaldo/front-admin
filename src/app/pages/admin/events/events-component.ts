import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from "@angular/core";
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from "@angular/forms";
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { catchError, tap } from "rxjs";
import { CrudService } from "src/app/_services/crud.service";
import * as _ from "underscore";
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid'
@Component({
  selector: "app-events",
  templateUrl: "events.component.html",
  styleUrls: ["events.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class EventsComponent implements OnInit {
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    }
  };
  constructor(private fb: UntypedFormBuilder, private crudService: CrudService, private confirmationService: ConfirmationService, private messageService: MessageService) { 
    
  }

  ngOnInit() {
    
  }
}
