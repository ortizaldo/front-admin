import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { CrudService } from "src/app/_services/crud.service";
import Chart from "chart.js";
// import { ConfirmationService, MessageService } from "primeng/api/public_api";
import { tap } from "rxjs/internal/operators/tap";
import { catchError } from "rxjs";
import { ConfirmationService, MenuItem, MessageService } from "primeng/api";

@Component({
  selector: "app-catalog-dashboard",
  templateUrl: "catalog-dashboard.component.html",
  styleUrls: ["catalog-dashboard.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class CatalogDashboardComponent implements OnInit {
  catalogForm: UntypedFormGroup;

  catalog: any;

  selectedItems: any[] | undefined;
  selectedItem: any;

  items: any[] | undefined;
  breadcumb: any[] | undefined;
  filteredItems: any[] | undefined;

  collapsed = true;
  isEditing = false;
  catalogData: any;
  title: string;
  emptyMessage: string;
  endpoint: string;
  loading: boolean = true;
  data: any[] = [];
  columns: any[];
  selectedAny: any;

  catalogDialog: boolean = false;
  headerDetails: string = "Crear registro";

  myModel = {};

  @ViewChild("catalogTemplate", { static: true })
  catalogTemplate: TemplateRef<any>;
  @ViewChild("buttonsTemplate", { static: true })
  buttonsTemplate: TemplateRef<any>;

  constructor(
    private route: ActivatedRoute,
    private fb: UntypedFormBuilder,
    private crudService: CrudService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get("id");

    this.catalogForm = this.fb.group({
      description: new UntypedFormControl("", [Validators.required]),
    });

    const self = this;

    this.myModel = {
      template: this.catalogTemplate,
      templateButtons: this.buttonsTemplate,
    };
    this.getCatalog(id);
  }

  getCatalog(id: string) {
    const params = {
      filters: {
        deleted: false,
      },
    };
    this.crudService
      .getMany("catalogs", id, params)
      .pipe(
        tap((data: any) => {
          this.catalog = data.data;
          this.breadcumb = [
            { icon: "pi pi-home", route: "/" },
            { label: "Catalogos", route: "/catalogs" },
            { label: this.catalog.name },
          ];
          this.enableCatalog();
        }),
        catchError((err) => {
          return err;
        }),
      )
      .subscribe();
  }

  enableCatalog() {
    const metadata = this.catalog.metadata;
    this.title = metadata.texts.title;
    this.headerDetails = metadata.texts.headerDetails;
    this.emptyMessage = metadata.texts.emptyMessage;
    this.endpoint = metadata.endpoint;

    if (metadata.form) {
      this.catalogForm = new UntypedFormGroup({});
      metadata.form.forEach((field) => {
        const control = new UntypedFormControl("", Validators.required || []);
        this.catalogForm.addControl(field.name, control);
      });
    }

    const select = metadata.select;

    this.columns = metadata.columns;

    const populate = [];
    metadata.populate.map((item) => {
      populate.push({ path: item.path, select: item.select });
    });
    this.getCatalogData(metadata.endpoint, select, populate);
  }

  getCatalogData(endpoint, select, populate) {
    this.data = [];
    let params = {
      select,
      populate,
      filters: {},
    };
    this.crudService
      .getMany(endpoint, null, params)
      .pipe(
        tap((data: any) => {
          if (endpoint === "state") {
            data.data.forEach((item: any) => {
              const country = item.country_id[0];
              item.countryDesc = country ? country.name : null;
              item.countryId = country ? country._id : null;
            });
          }

          if (endpoint === "municipality") {
            data.data.forEach((item: any) => {
              const country = item.country_id[0];
              item.countryDesc = country ? country.name : null;
              item.countryId = country ? country._id : null;

              const state = item.state_id[0];
              item.stateId = state ? state._id : null;
              item.stateDesc = state ? state.name : null;
            });
          }

          this.data = data.data;
          this.loading = false;
        }),
        catchError((err) => {
          this.loading = false;
          return err;
        }),
      )
      .subscribe();
  }

  // enableBrookerage() {
  //   this.catalogForm = new UntypedFormGroup({
  //     brookerName: new UntypedFormControl("", [Validators.required]),
  //     percent: new UntypedFormControl(["", [Validators.required]]),
  //   });
  //   this.title = "Corredores";
  //   this.headerDetails = "Crear corredor de apuestas";
  //   this.endpoint = "brooker";
  //   const select = ["_id", "brookerName", "percent"];

  //   this.columns = [
  //     { field: "brookerName", header: "Nombre" },
  //     { field: "percent", header: "Porcentaje" },
  //   ];
  //   this.getCatalogData("brooker", select, []);
  // }

  openNew(cmd) {
    this.isEditing = false;
    this.catalog = null;
    const { openDialog } = cmd;
    this.catalogDialog = openDialog;
  }

  editSelected(data) {
    this.catalog = data.data;
    this.isEditing = true;
    switch (this.endpoint) {
      case "state": {
        this.catalogForm.patchValue(data.data);
        this.catalogForm.patchValue({
          country: data.data.country ? data.data.country._id : null,
        });
        console.log(
          "%cfront-admin/src/app/pages/admin/catalog-dashboard/catalog-dashboard.component.ts:210 this.catalogForm.value",
          "color: #007acc;",
          this.catalogForm.value,
        );
        this.headerDetails = "Editar registro de Estado";
        break;
      }
      case "municipality": {
        this.catalogForm.patchValue(data.data);
        this.headerDetails = "Editar registro de Municipio";
        break;
      }
      case "country": {
        this.catalogForm.patchValue(data.data);
        this.headerDetails = "Editar registro de País";
        break;
      }
      case "brooker": {
        this.catalogForm.patchValue(data.data);
        this.headerDetails = "Editar registro de Corredor de apuestas";
        break;
      }
    }

    console.log(
      "%cfront-admin/src/app/pages/admin/catalog-dashboard/catalog-dashboard.component.ts:223 data.data",
      "color: #007acc;",
      data.data,
    );

    this.catalogDialog = true;
  }

  initDTL() {
    // this.catalogDialog = true;
    this.emptyMessage = "No se encontraron registros";
    this.headerDetails = "Crear registro de País";
    this.endpoint = "country";
    this.catalogForm = new UntypedFormGroup({
      description: new UntypedFormControl("", [Validators.required]),
    });
    this.title = "Catalogo país";
    const select = ["_id", "description", "createdAt", "deleted"];

    this.columns = [{ field: "description", header: "Pais" }];
    this.getCatalogData("country", select, []);
  }

  /**
   * Saves the catalog data by making a POST request to the specified endpoint.
   *
   * @param {type} paramName - description of parameter
   * @return {type} description of return value
   */
  saveCatalog() {
    this.crudService
      .post(this.catalogForm.value, this.endpoint)
      .pipe(
        tap((data: any) => {
          this.data.unshift(data.data);
          this.loading = false;
          this.catalogDialog = false;
          this.enableCatalog();
          this.catalogForm.reset();
        }),
        catchError((err) => {
          this.loading = false;
          return err;
        }),
      )
      .subscribe();
  }

  editCatalog() {
    this.crudService
      .put(this.catalogForm.value, this.catalog._id, this.endpoint)
      .pipe(
        tap((data: any) => {
          this.data.unshift(data.data);
          this.loading = false;
          this.catalogDialog = false;
          this.isEditing = false;
          this.enableCatalog();
          this.catalogForm.reset();
        }),
        catchError((err) => {
          this.loading = false;
          return err;
        }),
      )
      .subscribe();
  }

  deleteOne(item: any) {
    this.crudService
      .deleteOne(this.endpoint, item._id, {
        filters: {
          hardDelete: true,
        },
      })
      .pipe(
        tap((data: any) => {
          this.loading = false;
          this.messageService.add({
            severity: "success",
            summary: "Successful",
            detail: "Registro Eliminado",
            life: 3000,
          });
          this.enableCatalog();
        }),
        catchError((err) => {
          this.loading = false;
          return err;
        }),
      )
      .subscribe();
  }

  deleteMany(items: any[]) {
    this.crudService
      .deleteMany(this.endpoint, items, {
        filters: {
          hardDelete: true,
        },
      })
      .pipe(
        tap((data: any) => {
          this.loading = false;

          this.messageService.add({
            severity: "success",
            summary: "Successful",
            detail: "Registro Eliminado",
            life: 3000,
          });
          this.enableCatalog();
        }),
        catchError((err) => {
          this.loading = false;
          return err;
        }),
      )
      .subscribe();
  }

  deleteSelected(event) {
    this.confirmationService.confirm({
      message: "Estas seguro de eliminar este registro?",
      header: "Eliminar registro",
      icon: "pi pi-exclamation-triangle",
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
      },
    });
  }

  hideDialog() {
    this.selectedAny = [];
    this.catalogForm.reset();
    this.catalogDialog = false;
  }
}
