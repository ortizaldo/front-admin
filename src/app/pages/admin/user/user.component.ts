import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from "@angular/core";
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
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
  userForm: UntypedFormGroup;
  users!: any[];
  user: any;
  body: any;
  title: string = "Crear usuario";
  selectedUsers: any[];
  columns: any[];

  userDialog: boolean = false;
  isEditing: boolean = false;
  loading: boolean = true;

  myModel = {
  };

  @ViewChild('userTemplate', { static: true }) userTemplate: TemplateRef<any>;
  @ViewChild('buttonsTemplate', { static: true }) buttonsTemplate: TemplateRef<any>;

  constructor(private fb: UntypedFormBuilder, private crudService: CrudService, private confirmationService: ConfirmationService, private messageService: MessageService, private toastr: ToastrService) { }

  ngOnInit() {
    this.columns = [
      { field: 'firstName', header: 'Nombre' },
      { field: 'lastName', header: 'Apellidos' },
      { field: 'email', header: 'Email' },
      { field: 'typeUser', header: 'Tipo' },
      { field: 'phoneNumber', header: 'Telefono' },
    ]
    this.getUsers();

    this.myModel = {
      template: this.userTemplate,
      templateButtons: this.buttonsTemplate
    }

    this.userForm = this.fb.group({
      firstName: new UntypedFormControl('', [Validators.required]),
      lastName: new UntypedFormControl('', [Validators.required]),
      email: new UntypedFormControl('', [Validators.required]),
      phoneNumber: new UntypedFormControl('', [Validators.required]),
      addressStreet: new UntypedFormControl('', [Validators.required]),
      postalCode: new UntypedFormControl('', [Validators.required]),
      country: new UntypedFormControl('', [Validators.required]),
      state: new UntypedFormControl('', [Validators.required]),
      municipality: new UntypedFormControl('', [Validators.required]),
    });
  }

  getUsers() {
    const params = {
      filters: {
        deleted: false,
      },
      select: [
        "_id",
        "firstName",
        "lastName",
        "email",
        "typeUser",
        "address",
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

  editSelected(data) {
    this.userDialog = true;
    this.title = "Editar usuario";
    this.user = data.data;
    this.isEditing = true;
    this.userForm.patchValue(data.data);
    if (data.data.address) {
      const { addressStreet, postalCode, country, state, municipality } = data.data.address;
      this.userForm.patchValue({ addressStreet, postalCode, country, state, municipality });
    }
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

  addToAddress() {
    const { addressStreet, postalCode, country, state, municipality } = this.userForm.value;
    this.body = { ...this.body, address: { addressStreet, postalCode, country, state, municipality } };

    const keysToDelete = ["addressStreet", "postalCode", "country", "state", "municipality"];

    const self = this;
    keysToDelete.forEach(key => {
      delete self.body[key];
    });
  }

  saveUser() {
    this.body = this.userForm.value;
    this.addToAddress();
    this.crudService.post(this.body, "users")
      .pipe(
        tap((data: any) => {
          this.getUsers();
          this.loading = false;
          this.userDialog = false;
          this.userForm.reset();
          this.user = null;
        }),
        catchError(err => {
          const _err = err.error ? err.error.err : err;
          this.showNotification('top', 'right', "Error al registrar", _err.code == 11000 ? "Registro duplicado" : _err.message, "alert-warning")
          return err
        })
      )
      .subscribe();
  }

  showNotification(from, align, title = '', message = '', color = "alert-info") {
    this.toastr.info(`<span class="tim-icons icon-bell-55" [data-notify]="icon"></span> ${title}</b> - ${message}.`, '', {
      disableTimeOut: true,
      closeButton: true,
      enableHtml: true,
      toastClass: `alert ${color} alert-with-icon`,
      positionClass: 'toast-' + from + '-' + align
    });
  }

  editUser() {
    this.body = this.userForm.value;
    this.addToAddress();
    this.crudService.put(this.body, this.user._id, "users")
      .pipe(
        tap((data: any) => {
          this.getUsers();
          this.loading = false;
          this.userDialog = false;
          this.userForm.reset();
          this.user = null;
        }),
        catchError(err => {
          this.loading = false;
          return err
        })
      )
      .subscribe();
  }

  hideDialog(cmd) {
    this.userForm.reset();
    this.userDialog = false;
  }
}
