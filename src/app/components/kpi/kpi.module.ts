import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { TableModule } from "primeng/table";
import { ToolbarModule } from "primeng/toolbar";
import { ButtonModule } from "primeng/button";
import { DropdownModule } from "primeng/dropdown";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { InputMaskModule } from "primeng/inputmask";
import { InputSwitchModule } from "primeng/inputswitch";
import { TabViewModule } from "primeng/tabview";
import { AvatarModule } from "primeng/avatar";
import { TagModule } from "primeng/tag";
import { CalendarModule } from "primeng/calendar";

import {
  DlDateTimeDateModule,
  DlDateTimePickerModule,
} from "angular-bootstrap-datetimepicker";
import { EventKpiComponent } from "./events-kpi/event-kpi.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NgbModule,
    TableModule,
    ToolbarModule,
    ButtonModule,
    DropdownModule,
    ReactiveFormsModule,
    InputMaskModule,
    InputSwitchModule,
    TabViewModule,
    AvatarModule,
    TagModule,
    CalendarModule,
  ],
  declarations: [EventKpiComponent],
  // declarations: [SimpleDatatable],
  exports: [EventKpiComponent],
})
export class KPIModule {}
