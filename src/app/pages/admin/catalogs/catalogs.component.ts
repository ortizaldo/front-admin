import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { catchError, tap } from "rxjs";
import { CrudService } from "src/app/_services/crud.service";
import * as _ from "underscore";
@Component({
  selector: "app-catalogs",
  templateUrl: "catalogs.component.html",
  styleUrls: ["catalogs.component.scss"],
})
export class CatalogsComponent implements OnInit {
  catalogForm: FormGroup;
  public items: MenuItem[];
  collapsed = true;
  title: string;
  emptyMessage: string;
  endpoint: string;
  loading: boolean = true;
  data: any[];
  columns: any[];
  selectedAny: any;

  catalogDialog: boolean = false;
  headerDetails: string = "Crear registro";

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
    this.items = [
      {
        label: 'Dirección',
        icon: 'fa fa-address-card',
        items: [
          {
            label: 'Pais',
            command: (event: any) => {
              self.enableCountry();
            }
          },
          {
            label: 'Estado',
            command: (event: any) => {
              this.enableState();
            }
          },
          {
            label: 'Municipio',
            command: (event: any) => {
              this.enableMunicipality();
            }
          },
        ]
      },
      {
        label: 'Compañia',
        icon: 'fa fa-briefcase',
        command: (event: any) => {
          this.enableCompany();
        }
      },
    ];

    this.myModel = {
      template: this.catalogTemplate,
      templateButtons: this.buttonsTemplate
    }

    this.initDTL();
  }

  enableCountry() {
    this.title = 'Catalogo país';
    this.headerDetails = "Crear registro de País";
    this.emptyMessage = "No se encontraron paises";
    this.endpoint = 'country';
    this.catalogForm = new FormGroup({
      description: new FormControl('', [Validators.required]),
    });
    const select = [
      "_id",
      "description",
      "createdAt",
      "deleted",
    ];

    this.columns = [
      { field: 'description', header: 'Pais' },
    ]
    this.getCatalog('country', select, []);
  }

  enableState() {
    this.title = 'Catalogo estado';
    this.headerDetails = "Crear registro de Estado";
    this.emptyMessage = "No se encontraron estados";
    this.endpoint = 'state';
    this.catalogForm = new FormGroup({
      description: new FormControl('', [Validators.required]),
      country: new FormControl('', [Validators.required]),
    });
    const select = [
      "_id",
      "description",
      "country",
      "createdAt",
      "deleted",
    ];

    const populate = [
      {
        path: 'country',
        select: 'description'
      }
    ];

    this.columns = [
      { field: 'country', header: 'Pais' },
      { field: 'description', header: 'Estado' },
    ]
    this.getCatalog('state', select, populate);
  }

  enableMunicipality() {
    this.title = 'Catalogo municipio';
    this.headerDetails = "Crear registro de Municipio";
    this.emptyMessage = "No se encontraron municipios";
    this.endpoint = 'municipality';
    this.catalogForm = new FormGroup({
      description: new FormControl('', [Validators.required]),
      country: new FormControl('', [Validators.required]),
      state: new FormControl('', [Validators.required]),
    });
    const select = [
      "_id",
      "description",
      "country",
      "state",
      "createdAt",
      "deleted",
    ];

    const populate = [
      {
        path: 'country',
        select: 'description'
      },
      {
        path: 'state',
        select: 'description'
      }
    ];

    this.columns = [
      { field: 'country', header: 'Pais' },
      { field: 'state', header: 'Estado' },
      { field: 'description', header: 'Municipio' },
    ]
    this.getCatalog('municipality', select, populate);
  }

  enableCompany() {
    this.title = 'Catalogo compania';
    this.headerDetails = "Crear registro de Compañia";
    this.endpoint = 'companies';
    this.catalogForm = new FormGroup({
      description: new FormControl('', [Validators.required]),
    });
    const select = [
      "_id",
      "name",
      "logo",
    ];

    this.columns = [
      { field: 'name', header: 'Compañia' },
      { field: 'logo', header: 'Logo' },
    ]
    this.getCatalog('companies', select, []);
  }

  openNew(cmd) {
    const { openDialog } = cmd;
    this.catalogDialog = openDialog;
  }

  getCatalog(endpoint, select, populate) {
    let params = {
      select,
      populate
    };
    this.crudService.getMany(endpoint, null, params)
      .pipe(
        tap((data: any) => {
          if (endpoint === 'state') {
            data.data.forEach((item: any) => {
              item.country = item.country.description;
            });
          }

          if (endpoint === 'municipality') {
            data.data.forEach((item: any) => {
              item.country = item.country.description;
              item.state = item.state.description;
            });
          }
          this.data = data.data;
          this.loading = false;
        }),
        catchError(err => {
          this.loading = false;
          return err
        })
      )
      .subscribe();

  }

  initDTL() {
    // this.catalogDialog = true;
    this.emptyMessage = "No se encontraron paises";
    this.headerDetails = "Crear registro de País";
    this.endpoint = 'country';
    this.catalogForm = new FormGroup({
      description: new FormControl('', [Validators.required]),
    });
    this.title = 'Catalogo país';
    const select = [
      "_id",
      "description",
      "createdAt",
      "deleted",
    ];

    this.columns = [
      { field: 'description', header: 'Pais' },
    ]
    this.getCatalog('country', select, []);
  }

  /**
 * Saves the catalog data by making a POST request to the specified endpoint.
 *
 * @param {type} paramName - description of parameter
 * @return {type} description of return value
 */
  saveCatalog() {
    this.crudService.post(this.catalogForm.value, this.endpoint)
      .pipe(
        tap((data: any) => {
          this.data.unshift(data.data);
          this.loading = false;
          this.catalogDialog = false;

          if (this.endpoint === 'country') {
            this.enableCountry();
          }
          if (this.endpoint === 'state') {
            this.enableState();
          }
          if (this.endpoint === 'municipality') {
            this.enableMunicipality();
          }
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
          if (this.endpoint === 'country') {
            this.enableCountry();
          }
          if (this.endpoint === 'state') {
            this.enableState();
          }
          if (this.endpoint === 'municipality') {
            this.enableMunicipality();
          }
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

          if (this.endpoint === 'country') {
            this.enableCountry();
          }
          if (this.endpoint === 'state') {
            this.enableState();
          }
          if (this.endpoint === 'municipality') {
            this.enableMunicipality();
          }
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
    this.catalogDialog = false;
  }
}
