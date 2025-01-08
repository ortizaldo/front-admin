import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { ConfirmationService, MenuItem, MessageService, PrimeNGConfig } from "primeng/api";
import { ContextMenu } from "primeng/contextmenu";
import { Table } from "primeng/table";
import { catchError, tap } from "rxjs";
import { CrudService } from "src/app/_services/crud.service";

@Component({
  selector: "app-teams-datatable",
  templateUrl: "teams-datatable.component.html",
  styleUrls: ["teams-datatable.component.css"],
  encapsulation: ViewEncapsulation.None,
})


export class TeamsDatatable implements OnInit {
  ringForm: UntypedFormGroup;
  @Input() data!: any[];
  @Input() teams!: any[];
  @Input() confDerby!: any;
  @Input() derby!: any;
  @Input() selectedData: any[];
  @Input() columns: any[];
  @Input() loading: boolean = true;
  @Input() export: boolean = false;
  @Input() title: string = "";
  @Input() items: MenuItem[];
  @Input() emptyMessage: string = "No se encontraron registros.";
  @Output() dialogChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() dataChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() deleteRecords: EventEmitter<any> = new EventEmitter<any>();
  @Output() editRecords: EventEmitter<any> = new EventEmitter<any>();


  @ViewChild('dt') table: Table;
  @ViewChild('contextMenuDT') contextMenu: ContextMenu;
  constructor(private fb: UntypedFormBuilder, private crudService: CrudService, private confirmationService: ConfirmationService, private messageService: MessageService, private toastr: ToastrService, private primengConfig: PrimeNGConfig) { }

  ngOnInit() {
    this.primengConfig.ripple = true;
  }


  openDialog() {
    let _data = [];
    for (let index = 0; index < this.derby.numGallos; index++) {
      _data.push({ header: "R" + (index + 1) + " Anillo", size: "40px"}, { header: "Peso", size: "40px"});
    }
    let dataRound = [{ header: "Partido", size: "150px"}, ..._data];
    // this.dataChange.emit({ openDialog: true });
  }

  // showContextMenu(cm: ContextMenu, event: MouseEvent) {
  //   cm.onShow.emit(event);
  //   event.stopPropagation();
  // }

  deleteSelected() {
    this.deleteRecords.emit({ data: this.selectedData });
  }

  delete(data) {
    this.deleteRecords.emit({ data: [data] });
  }

  updData(idx, field, value) {
    this.editRecords.emit({idx, field, value});
    // this.data[idx][field]= value;
  }
}
