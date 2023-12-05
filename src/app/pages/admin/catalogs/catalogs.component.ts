import { Component, OnInit } from "@angular/core";
import { MenuItem } from 'primeng/api';
import { catchError, tap } from "rxjs";
import { CrudService } from "src/app/_services/crud.service";

@Component({
  selector: "app-catalogs",
  templateUrl: "catalogs.component.html",
  styleUrls: ["catalogs.component.scss"],
})
export class CatalogsComponent implements OnInit {
  public items: MenuItem[];
  collapsed = true;
  title: string;
  loading: boolean = true;
  data: any[];
  columns: any[];
  selectedAny: any;

  constructor(private crudService: CrudService) { }

  ngOnInit() {
    const self = this;
    this.items = [
      {
        label: 'Dirección',
        icon: 'fa fa-address-card',
        items: [
          {
            label: 'Pais',
            command: (event: any) => {
              this.title = 'Catalogo país';
              const select = [
                "_id",
                "description",
                "createdAt",
                "deleted",
              ];

              self.columns = [
                { field: 'description', header: 'Pais' },
              ]
              self.getCatalog('country', select, []);
              self.showDtl(event);
            }
          },
          {
            label: 'Estado',
            command: (event: any) => {
              this.title = 'Catalogo estado';
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

              self.columns = [
                { field: 'country', header: 'Pais' },
                { field: 'description', header: 'Estado' },
              ]
              self.getCatalog('state', select, populate);
              self.showDtl(event);
            }
          },
          {
            label: 'Municipio',
            command: (event: any) => {
              this.title = 'Catalogo municipio';
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

              self.columns = [
                { field: 'country', header: 'Pais' },
                { field: 'state', header: 'Estado' },
                { field: 'description', header: 'Municipio' },
              ]
              self.getCatalog('municipality', select, populate);
              self.showDtl(event);
            }
          },
        ]
      },
      {
        label: 'Compañia',
        icon: 'fa fa-briefcase',
        command: (event: any) => {
          this.title = 'Catalogo compañia';
          const select = [
            "_id",
            "name",
            "logo",
          ];
          self.getCatalog('companies', select, []);
          self.showDtl(event);
        }
      },
    ]
  }

  showDtl(event) {
    console.log(event);
  }

  openModal(event) {
    console.log(event);
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
}
