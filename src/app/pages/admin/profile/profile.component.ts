import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from "@angular/forms";
import { AuthService } from "src/app/_services/auth.service";
import { CrudService } from "src/app/_services/crud.service";
import { TokenStorageService } from "src/app/_services/token-storage.service";
import { User } from "src/app/interfaces/user";

@Component({
  selector: "app-profile",
  templateUrl: "profile.component.html"
})
export class ProfileComponent implements OnInit {
  user: User | undefined;
  userForm: UntypedFormGroup;
  constructor(private fb: UntypedFormBuilder, private tokenService: TokenStorageService, private crudService: CrudService) { }

  ngOnInit() {
    this.user = this.tokenService.getUser();

    this.userForm = this.fb.group({
      company: new UntypedFormControl('', [Validators.required]),
      firstName: new UntypedFormControl(this.user?.firstName, [Validators.required]),
      lastName: new UntypedFormControl(this.user?.lastName, [Validators.required]),
      email: new UntypedFormControl(this.user?.email, [Validators.required]),
      phoneNumber: new UntypedFormControl(this.user?.phoneNumber, [Validators.required]),
      addressStreet: new UntypedFormControl('', [Validators.required]),
      postalCode: new UntypedFormControl('', [Validators.required]),
      country: new UntypedFormControl('', [Validators.required]),
      state: new UntypedFormControl('', [Validators.required]),
      municipality: new UntypedFormControl('', [Validators.required]),
    });
  }

  saveUser() {
    console.log('%cprofile.component.ts line:34 this.userForm', 'color: #007acc;', this.userForm);
  }
}
