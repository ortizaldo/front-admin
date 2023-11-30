import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
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
  userForm: FormGroup;
  constructor(private fb: FormBuilder, private tokenService: TokenStorageService, private crudService: CrudService) { }

  ngOnInit() {
    this.user = this.tokenService.getUser();

    this.userForm = this.fb.group({
      company: new FormControl('', [Validators.required]),
      firstName: new FormControl(this.user?.firstName, [Validators.required]),
      lastName: new FormControl(this.user?.lastName, [Validators.required]),
      email: new FormControl(this.user?.email, [Validators.required]),
      phoneNumber: new FormControl(this.user?.phoneNumber, [Validators.required]),
      addressStreet: new FormControl('', [Validators.required]),
      postalCode: new FormControl('', [Validators.required]),
      country: new FormControl('', [Validators.required]),
      state: new FormControl('', [Validators.required]),
      municipality: new FormControl('', [Validators.required]),
    });
  }

  saveUser() {
    console.log('%cprofile.component.ts line:34 this.userForm', 'color: #007acc;', this.userForm);
  }
}
