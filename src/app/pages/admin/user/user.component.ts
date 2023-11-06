import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { Table } from "primeng/table";

@Component({
  selector: "app-user",
  templateUrl: "user.component.html",
  styleUrls: ["user.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class UserComponent implements OnInit {
  customers!: any[];
  selectedCustomers: any[];

  representatives: any[];

  statuses: any[];

  loading: boolean = true;

  @ViewChild('dt') table: Table;
  constructor() { }

  ngOnInit() { }
}
