import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import Chart from 'chart.js';
import { ToastrService } from "ngx-toastr";
import { ConfirmationService, MenuItem, MessageService } from "primeng/api";
import { CrudService } from "src/app/_services/crud.service";

@Component({
  selector: "app-derby",
  templateUrl: "derby.component.html"
})
export class DerbyComponent implements OnInit {
  derbyForm: FormGroup;
  derbys!: any[];
  derby: any;
  body: any;
  title: string = "Crear derby";
  selectedDerby: any[];
  columns: any[];

  itemsDerby: MenuItem[];

  derbyModel = {
  };

  derbyDialog: boolean = false;
  isEditing: boolean = false;
  loading: boolean = true;

  @ViewChild('derbyTemplate', { static: true }) derbyTemplate: TemplateRef<any>;
  @ViewChild('buttonsTemplate', { static: true }) buttonsTemplate: TemplateRef<any>;
  constructor(private fb: FormBuilder, private crudService: CrudService, private confirmationService: ConfirmationService, private messageService: MessageService, private toastr: ToastrService) { }

  ngOnInit() {
    this.itemsDerby = [
      {label: 'Nuevo derby', icon: 'pi pi-plus', command: () => this.openNew({ openDialog: true })},
      {label: 'Excepciones', icon: 'pi pi-plus', command: () => this.openNew({ openDialog: true }), disabled: true},
    ];

    this.derbyModel = {
      template: this.derbyTemplate,
      templateButtons: this.buttonsTemplate
    }

    this.derbyForm = this.fb.group({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
    });
  }

  openNew(cmd) {
    const { openDialog } = cmd;
    this.derbyDialog = openDialog;
  }
}
