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
  @Input() titleSingle: string = "Evento";
  @Input() titleMany: string = "Eventos";

  constructor() {}

  ngOnInit() {}
}
