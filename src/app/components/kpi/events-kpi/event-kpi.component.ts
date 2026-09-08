import { Component, Input, OnInit } from "@angular/core";
import { EventKpi } from "src/app/interfaces/kpiEvents";

@Component({
  selector: "app-event-kpi",
  templateUrl: "./event-kpi.component.html",
  styleUrls: ["./event-kpi.component.scss"],
})
export class EventKpiComponent implements OnInit {
  test: Date = new Date();

  @Input() kpis: EventKpi[] = [];

  constructor() {}

  ngOnInit() {
    console.log(
      "%cfront-admin/src/app/components/kpi/events-kpi/event-kpi.component.ts:17 this.kpis",
      "color: #007acc;",
      this.kpis,
    );
  }
}
