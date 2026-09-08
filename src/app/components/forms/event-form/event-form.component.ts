import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewEncapsulation,
} from "@angular/core";
import {
  UntypedFormBuilder,
  FormControl,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { User } from "src/app/interfaces/user";
import * as _ from "underscore";
import { ConfirmationService, MessageService, SelectItem } from "primeng/api";
import { SelectItemGroup } from "primeng/api";
import { CrudService } from "src/app/_services/crud.service";
import { catchError, tap } from "rxjs";
import { Country } from "src/app/interfaces/country";
import { State } from "src/app/interfaces/state";
import { Municipality } from "src/app/interfaces/municipality";

@Component({
  selector: "app-event-form",
  templateUrl: "./event-form.component.html",
  styleUrls: ["./event-form.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class EventFormComponent implements OnInit {
  @Input() data: any | undefined;
  @Input() eventForm: UntypedFormGroup;

  items: SelectItem[];

  eventTypes = [
    {
      name: "Derby",
      value: "DERBY",
    },
    {
      name: "Compromiso",
      value: "COMPROMISO",
    },
    {
      name: "Cuarterola",
      value: "CUARTEROLA",
    },
    {
      name: "Octerola",
      value: "OCTEROLA",
    },
    {
      name: "Decarola",
      value: "DECAROLA",
    },
  ];

  weapons = [
    {
      name: "1/4 de filo",
      value: "1/4",
    },
    {
      name: "1/2 filo",
      value: "1/2",
    },
    {
      name: "Pulgada de filo",
      value: "1",
    },
  ];

  flyerPreview: boolean = false;
  flyerError: boolean = false;
  saving: boolean = false;
  isDragging: boolean = false;

  @Output() save: EventEmitter<any> = new EventEmitter<any>();
  @Output() saveDraftEM: EventEmitter<any> = new EventEmitter<any>();
  constructor() {}

  ngOnInit(): void {}

  saveEvent() {
    this.saving = true;
    this.save.emit({
      form: this.eventForm.value,
      _id: this.data._id,
      data: this.data,
    });
  }

  onFlyerSelected(event: any) {}
  onDrop(event: any) {}
  onDragLeave(event: any) {}
  onDragOver(event: any) {}

  close() {}
  saveDraft() {
    this.saveDraftEM.emit({
      form: this.eventForm.value,
    });
  }
}
