import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import Chart from "chart.js";

@Component({
  selector: "app-catalog-dashboard",
  templateUrl: "catalog-dashboard.component.html",
})
export class CatalogDashboardComponent implements OnInit {
  public canvas: any;
  public ctx;
  public datasets: any;
  public data: any;
  public myChartData;
  public clicked: boolean = true;
  public clicked1: boolean = false;
  public clicked2: boolean = false;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get("id");
    console.log("🚀 ~ CatalogDashboardComponent ~ ngOnInit ~ id:", id);
  }
}
