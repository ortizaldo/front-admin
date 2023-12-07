import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from "@angular/core";
import { Table } from "primeng/table";
import { catchError, tap } from "rxjs";
import { CrudService } from "src/app/_services/crud.service";

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
  @Input() export: boolean = false;
  @Input() title: string = "";
  @Output() dialogChange: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('dt') table: Table;
  constructor(private crudService: CrudService) { }

  ngOnInit() {
  }

  openDialog() {
    this.dialogChange.emit({ openDialog: true });
  }
}
