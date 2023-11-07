import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from "@angular/core";
import { tap } from "rxjs";
import { CrudService } from "src/app/_services/crud.service";

@Component({
  selector: "app-user",
  templateUrl: "user.component.html",
  styleUrls: ["user.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class UserComponent implements OnInit {
  users!: any[];
  selectedUsers: any[];
  columns: any[];

  userDialog: boolean = false;
  loading: boolean = true;

  myModel = {
  };

  @ViewChild('myTemplate', { static: true }) myTemplate: TemplateRef<any>;


  constructor(private crudService: CrudService) { }

  ngOnInit() {
    this.columns = [
      { field: 'company', header: 'Compañia' },
      { field: 'firstName', header: 'Nombre' },
      { field: 'lastName', header: 'Apellidos' },
      { field: 'email', header: 'Email' },
      { field: 'typeUser', header: 'Tipo' },
      { field: 'phoneNumber', header: 'Telefono' },
    ]
    this.getUsers();

    this.myModel = {
      template: this.myTemplate
    }
  }

  getUsers() {
    this.crudService.get("users")
      .pipe(
        tap((data: any) => {
          this.users = data.data;
          console.log("🚀 ~ file: simple-datatable.component.ts:30 ~ SimpleDatatable ~ tap ~ data:", data.data);
          this.loading = false;
          // this.optionsSelect.typeOfRepresentative = data.data;
          // if (this._data) {
          //   this.selectedValue.typeOfRepresentative = this._data.typeResponsible;
          //   this.updateModel(this.selectedValue.typeOfRepresentative, "typeOfRepresentative");
          // }
          // this.isLoading = false;
        }),
        // catchError(err => {
        //   // const response = this.apiResponsesService.data(err);
        //   // this.alerts.error(response.title, response.message);
        //   // throw err;
        // })
      )
      .subscribe();

  }

  openNew(cmd) {
    const { openDialog } = cmd;
    this.userDialog = openDialog;
  }

  hideDialog(cmd) {
    const { openDialog } = cmd;
    this.userDialog = openDialog;
    // this.submitted = false;
  }
}
