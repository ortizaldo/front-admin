import { Component, OnInit } from "@angular/core";
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { ConfirmationService, MessageService } from "primeng/api";
import { catchError, tap } from "rxjs";
import { AuthService } from "src/app/_services/auth.service";
import { CrudService } from "src/app/_services/crud.service";
import { TokenStorageService } from "src/app/_services/token-storage.service";
import { User } from "src/app/interfaces/user";

@Component({
  selector: "app-profile",
  templateUrl: "profile.component.html",
})
export class ProfileComponent implements OnInit {
  user: any;
  userForm: UntypedFormGroup;
  constructor(
    private fb: UntypedFormBuilder,
    private tokenService: TokenStorageService,
    private crudService: CrudService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
  ) {}

  ngOnInit() {
    this.user = this.tokenService.getUser();

    this.getUser();
  }

  saveUser(evt: any) {
    const value = {
      firstName: evt.form.firstName,
      lastName: evt.form.lastName,
      email: evt.form.email,
      phoneNumber: evt.form.phoneNumber,
      birth: evt.form.birth,
      address: {
        addressStreet: evt.form.addressStreet,
        postalCode: evt.form.postalCode ? evt.form.postalCode : "",
        country: parseInt(evt.form.country),
        state: parseInt(evt.form.state),
        municipality: parseInt(evt.form.municipality),
      },
    };

    this.crudService
      .put(value, evt._id, "users")
      .pipe(
        tap((data: any) => {
          this.messageService.add({
            severity: "success",
            summary: "Successful",
            detail: "Usuario editado",
            life: 3000,
          });
        }),
        catchError((err) => {
          // this.loading = false;
          return err;
        }),
      )
      .subscribe();
  }

  getUser() {
    const populate = [
      {
        path: "address.country",
        select: "name",
      },
      {
        path: "address.state",
        select: "name",
      },
      {
        path: "address.municipality",
        select: "name",
      },
    ];
    const params = {
      select: [
        "name",
        "_id",
        "firstName",
        "lastName",
        "email",
        "phoneNumber",
        "birth",
        "address",
      ],
      populate,
    };
    this.crudService
      .getMany("users", this.user._id, params)
      .pipe(
        tap((data: any) => {
          const _data = data.data;
          this.setForm(data.data);
        }),
        catchError((err) => {
          return err;
        }),
      )
      .subscribe();
  }

  setForm(user: any) {
    this.userForm = this.fb.group({
      firstName: new UntypedFormControl(this.user?.firstName, [
        Validators.required,
      ]),
      lastName: new UntypedFormControl(this.user?.lastName, [
        Validators.required,
      ]),
      birth: new UntypedFormControl(this.user?.birth, [Validators.required]),
      email: new UntypedFormControl(this.user?.email, [Validators.required]),
      phoneNumber: new UntypedFormControl(this.user?.phoneNumber, [
        Validators.required,
      ]),
      addressStreet: new UntypedFormControl(this.user?.address?.addressStreet, [
        Validators.required,
      ]),
      postalCode: new UntypedFormControl(this.user?.address?.postalCode),
      country: new UntypedFormControl("", [Validators.required]),
      state: new UntypedFormControl("", [Validators.required]),
      municipality: new UntypedFormControl("", [Validators.required]),
    });
  }
}
