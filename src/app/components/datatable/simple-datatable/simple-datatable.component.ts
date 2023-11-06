import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { Table } from "primeng/table";

@Component({
  selector: "app-simple-datatable",
  templateUrl: "simple-datatable.component.html",
  styleUrls: ["simple-datatable.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class SimpleDatatable implements OnInit {
  @Input() data!: any[];
  @Input() selectedData: any[];
  @Input() columns: any[];
  @Input() loading: boolean = true;
  @Input() title: string = "";

  @ViewChild('dt') table: Table;
  constructor() { }

  ngOnInit() {
    this.loading = false;
  }
}
