import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { ConfirmationService, MenuItem, MessageService } from "primeng/api";
import { AutoCompleteCompleteEvent } from "primeng/autocomplete";
import { catchError, tap } from "rxjs";
import { CrudService } from "src/app/_services/crud.service";
import * as _ from "underscore";
@Component({
  selector: "app-catalogs",
  templateUrl: "catalogs.component.html",
  styleUrls: ["catalogs.component.scss"],
})
export class CatalogsComponent implements OnInit {
  catalogForm: UntypedFormGroup;
  // public items: MenuItem[];
  // public itemsDT: MenuItem[];

  selectedItems: any[] | undefined;
  selectedItem: any;

  items: any[] | undefined;
  filteredItems: any[] | undefined;

  collapsed = true;
  isEditing = false;
  catalog: any;
  title: string;
  emptyMessage: string;
  endpoint: string;
  loading: boolean = true;
  data: any[];
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
    private fb: UntypedFormBuilder,
    private crudService: CrudService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.getCatalogs();
  }

  search(event: AutoCompleteCompleteEvent) {
    this.items = [...Array(10).keys()].map((item) => event.query + "-" + item);
  }

  getCatalogs() {
    const params = {
      filters: {
        deleted: false,
      },
    };
    this.crudService
      .getMany("catalogs", null, params)
      .pipe(
        tap((data: any) => {
          console.log("🚀 ~ CatalogsComponent ~ getCatalogs ~ data:", data);
          this.items = data.data;
          console.log(
            "🚀 ~ CatalogsComponent ~ getCatalogs ~ this.items:",
            this.items,
          );
          // if (this.derby) {
          //   this.selectedDerby = _.findWhere(this.derbys, {
          //     _id: this.derby._id,
          //   });
          //   this.onChange();
          // }
          // this.loading = false;
        }),
        catchError((err) => {
          this.loading = false;
          return err;
        }),
      )
      .subscribe();
  }

  filterItems(event: AutoCompleteCompleteEvent) {
    //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
    let filtered: any[] = [];
    let query = event.query;
    console.log("🚀 ~ CatalogsComponent ~ filterItems ~ query:", query);

    for (let i = 0; i < (this.items as any[]).length; i++) {
      let item = (this.items as any[])[i];
      if (item.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(item);
      }
    }
    this.filteredItems = filtered;
  }

  manageCatalog(event) {
    this.router.navigate([`/catalog-dashboard/${event._id}`]);
  }
}
