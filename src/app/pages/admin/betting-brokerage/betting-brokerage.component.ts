import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { catchError, tap } from "rxjs";
import { CrudService } from "src/app/_services/crud.service";
import * as _ from "underscore";
@Component({
  selector: "app-betting-brokerage",
  templateUrl: "betting-brokerage.component.html",
  styleUrls: ["betting-brokerage.component.scss"],
})
export class BettingBrokerageComponent implements OnInit {
  catalogForm: FormGroup;
  public items: MenuItem[];
  public itemsDT: MenuItem[];
  collapsed = true;
  isEditing = false;
  catalog: any;
  title: string;
  emptyMessage: string;
  endpoint: string;
  loading: boolean = true;
  data: any[];
  groupedData: any;
  columns: any[];
  selectedAny: any;

  derbys: any[];
  derby: any;

  catalogDialog: boolean = false;
  headerDetails: string = "Agregar folio";

  myModel = {
  };

  @ViewChild('catalogTemplate', { static: true }) catalogTemplate: TemplateRef<any>;
  @ViewChild('buttonsTemplate', { static: true }) buttonsTemplate: TemplateRef<any>;
  constructor(private fb: FormBuilder, private crudService: CrudService, private confirmationService: ConfirmationService, private messageService: MessageService) { }

  ngOnInit() {
    this.catalogForm = this.fb.group({
      description: new FormControl('', [Validators.required]),
    });

    const self = this;

    this.myModel = {
      template: this.catalogTemplate,
      templateButtons: this.buttonsTemplate
    }
    this.getDerby('derby',  {}, []);
  }



  openNew(cmd) {
    this.isEditing = false;
    this.catalog = null;
    const { openDialog } = cmd;
    this.catalogDialog = openDialog;
  }

  editSelected(data) {
    this.catalog = data.data;
    this.isEditing = true;
    this.headerDetails = "Editar folio";
    this.catalogForm.patchValue(data.data);
    this.catalogDialog = true;
  }

  getDerby(endpoint, select, populate) {
    let params = {
      select,
      populate,
      filters: {
        deleted: false
      }
    };
    this.crudService.getMany(endpoint, null, params)
      .pipe(
        tap((data: any) => {
          this.derbys = data.data;
        }),
        catchError(err => {
          this.loading = false;
          return err
        })
      )
      .subscribe();

  }

  getBrooker(endpoint, select, populate) {
    let params = {
      select,
      populate,
      filters: {
        deleted: false
      },
      filtersId: {
        derby: {
          value: this.derby._id,
        }
      },
    };
    this.crudService.getMany(endpoint, null, params)
      .pipe(
        tap((data: any) => {
          this.data = data.data;
          const groupedData = this.data.reduce((acc, current) => {
            const { folio, amount } = current;
            if (!acc[current.brooker.brookerName]) {
              acc[current.brooker.brookerName] = {data: [], total: 0, percent: 0};
            }
            acc[current.brooker.brookerName].data.push({folio, amount});
            acc[current.brooker.brookerName].total += amount;
            acc[current.brooker.brookerName].percent = current.brooker.percent;
            return acc;
          }, {});

          this.groupedData = groupedData;
          this.loading = false;
        }),
        catchError(err => {
          this.loading = false;
          return err
        })
      )
      .subscribe();

  }

  onChange(event, type) {
    console.log('%csrc/app/pages/admin/betting-brokerage/betting-brokerage.component.ts:130 this.derby', 'color: #007acc;', this.derby);
    this.initDTL();
  }

  initDTL() {
    // this.catalogDialog = true;
    this.emptyMessage = "No se folios de corretaje";
    this.headerDetails = "Crear folio de corretaje";
    this.endpoint = 'brooker-bet';
    this.catalogForm = new FormGroup({
      derby: new FormControl(this.derby, [Validators.required]),
      brooker: new FormControl('', [Validators.required]),
      folio: new FormControl('', [Validators.required]),
      amount: new FormControl('', [Validators.required]),
      active: new FormControl('', [Validators.required]),
    });
    this.title = 'Folios de corretaje';

    this.columns = [
      { field: 'corredor1', header: 'Corredor' },
      { field: 'description', header: 'Cantidad' },
      { field: 'corredor1', header: 'Corredor' },
      { field: 'description', header: 'Cantidad' },
      { field: 'corredor1', header: 'Corredor' },
      { field: 'description', header: 'Cantidad' },
      { field: 'corredor1', header: 'Corredor' },
      { field: 'description', header: 'Cantidad' },
    ]

    const populate = [
      {
        path: 'derby',
        select: 'name'
      },
      {
        path: 'brooker',
        select: 'brookerName'
      },
    ];
    this.getBrooker('brooker-bet', {}, populate);
  }

  /**
 * Saves the catalog data by making a POST request to the specified endpoint.
 *
 * @param {type} paramName - description of parameter
 * @return {type} description of return value
 */
  save() {
    this.crudService.post(this.catalogForm.value, this.endpoint)
      .pipe(
        tap((data: any) => {
          this.data.unshift(data.data);
          this.loading = false;
          if (!this.catalogForm.value.active) {
            this.catalogDialog = false;
            this.catalogForm.reset();
          }

          const populate = [
            {
              path: 'derby',
              select: 'name'
            },
            {
              path: 'brooker',
              select: 'brookerName'
            },
          ];
          this.getBrooker('brooker-bet', {}, populate);
        }),
        catchError(err => {
          this.loading = false;
          return err
        })
      )
      .subscribe();
  }

  edit() {
    this.crudService.put(this.catalogForm.value, this.catalog._id, this.endpoint)
      .pipe(
        tap((data: any) => {
          this.data.unshift(data.data);
          this.loading = false;
          this.catalogDialog = false;
          this.isEditing = false;
          this.catalogForm.reset();
        }),
        catchError(err => {
          this.loading = false;
          return err
        })
      )
      .subscribe();
  }

  deleteOne(item: any) {
    this.crudService.deleteOne(this.endpoint, item._id, {
      filters: {
        hardDelete: true,
      },
    })
      .pipe(
        tap((data: any) => {
          this.loading = false;
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Registro Eliminado', life: 3000 });
        }),
        catchError(err => {
          this.loading = false;
          return err
        })
      )
      .subscribe();
  }

  deleteMany(items: any[]) {
    this.crudService.deleteMany(this.endpoint, items, {
      filters: {
        hardDelete: true,
      },
    })
      .pipe(
        tap((data: any) => {
          this.loading = false;

          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Registro Eliminado', life: 3000 });
        }),
        catchError(err => {
          this.loading = false;
          return err
        })
      )
      .subscribe();
  }

  deleteSelected(event) {
    this.confirmationService.confirm({
      message: 'Estas seguro de eliminar este registro?',
      header: 'Eliminar registro',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (event.data.length > 1) {
          let items = [];
          event.data.forEach((item: any) => {
            items.push(item._id);
          });
          this.deleteMany(items);
        } else {
          this.deleteOne(event.data[0]);
        }
      }
    });
  }

  hideDialog() {
    this.selectedAny = [];
    this.catalogForm.reset();
    this.catalogDialog = false;
  }
}
