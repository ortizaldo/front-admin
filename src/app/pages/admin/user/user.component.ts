import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ConfirmationService, MessageService } from "primeng/api";
import { catchError, tap } from "rxjs";
import { CrudService } from "src/app/_services/crud.service";

@Component({
  selector: "app-user",
  templateUrl: "user.component.html",
  styleUrls: ["user.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class UserComponent implements OnInit {
  userForm: FormGroup;
  users!: any[];
  selectedUsers: any[];
  columns: any[];

  userDialog: boolean = false;
  loading: boolean = true;

  myModel = {
  };

  @ViewChild('userTemplate', { static: true }) userTemplate: TemplateRef<any>;


  constructor(private fb: FormBuilder, private crudService: CrudService, private confirmationService: ConfirmationService, private messageService: MessageService) { }

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
      template: this.userTemplate
    }

    this.userForm = this.fb.group({
      company: new FormControl('', [Validators.required]),
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      phoneNumber: new FormControl('', [Validators.required]),
      addressStreet: new FormControl('', [Validators.required]),
      postalCode: new FormControl('', [Validators.required]),
      country: new FormControl('', [Validators.required]),
      state: new FormControl('', [Validators.required]),
      municipality: new FormControl('', [Validators.required]),
    });
  }

  getUsers() {
    const params = {
      select: [
        "_id",
        "company",
        "firstName",
        "lastName",
        "email",
        "typeUser",
        "phoneNumber"
      ]
    };
    this.crudService.getMany("users", null, params)
      .pipe(
        tap((data: any) => {
          this.users = data.data;
          this.loading = false;
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

  deleteOne(item: any) {
    this.crudService.deleteOne("users", item._id, {
      filters: {
        hardDelete: false,
      },
    })
      .pipe(
        tap((data: any) => {
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Registro Eliminado', life: 3000 });
          this.getUsers();
        }),
        catchError(err => {
          this.loading = false;
          return err
        })
      )
      .subscribe();
  }

  deleteMany(items: any[]) {
    this.crudService.deleteMany("users", items, {
      filters: {
        hardDelete: false,
      },
    })
      .pipe(
        tap((data: any) => {
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Registro Eliminado', life: 3000 });
          this.getUsers();
        }),
        catchError(err => {
          this.loading = false;
          return err
        })
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
  }
}
