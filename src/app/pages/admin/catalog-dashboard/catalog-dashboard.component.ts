import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { CrudService } from "src/app/_services/crud.service";
import Chart from "chart.js";
// import { ConfirmationService, MessageService } from "primeng/api/public_api";
import { tap } from "rxjs/internal/operators/tap";
import { catchError } from "rxjs";

@Component({
  selector: "app-catalog-dashboard",
  templateUrl: "catalog-dashboard.component.html",
})
export class CatalogDashboardComponent implements OnInit {
  catalog: any;

  constructor(
    private route: ActivatedRoute,
    private fb: UntypedFormBuilder,
    private crudService: CrudService,
    private router: Router,
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get("id");
    console.log("🚀 ~ CatalogDashboardComponent ~ ngOnInit ~ id:", id);
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
          console.log("🚀 ~ CatalogsComponent ~ getCatalogs ~ data:", data);
          this.catalog = data.data;
        }),
        catchError((err) => {
          // this.loading = false;
          return err;
        }),
      )
      .subscribe();
  }
}
