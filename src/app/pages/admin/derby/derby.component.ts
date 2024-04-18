import { Component, OnInit } from "@angular/core";
import Chart from 'chart.js';
import { MenuItem } from "primeng/api";

@Component({
  selector: "app-derby",
  templateUrl: "derby.component.html"
})
export class DerbyComponent implements OnInit {
  itemsDerby: MenuItem[];
  constructor() { }

  ngOnInit() {
    this.itemsDerby = [
      {label: 'Nuevo derby', icon: 'pi pi-plus'},
    ];
  }
}
