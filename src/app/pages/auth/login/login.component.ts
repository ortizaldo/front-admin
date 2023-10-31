import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/_services/auth.service';
import { TokenStorageService } from 'src/app/_services/token-storage.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];

  constructor(private authService: AuthService, private tokenStorage: TokenStorageService, private fb: FormBuilder) {

  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });

    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.roles = this.tokenStorage.getUser().roles;
    }
  }

  onSubmit(): void {
    console.log('%clogin.component.ts line:35 this.loginForm', 'color: #007acc;', this.loginForm);

    if (this.loginForm.invalid) return;

    this.authService.login(this.loginForm.value.email, this.loginForm.value.password).subscribe(
      data => {
        // this.tokenStorage.saveToken(data.accessToken);
        // this.tokenStorage.saveUser(data);

        // this.isLoginFailed = false;
        // this.isLoggedIn = true;
        // this.roles = this.tokenStorage.getUser().roles;
        // this.reloadPage();
      },
      err => {
        console.log("🚀 ~ file: login.component.ts:50 ~ LoginComponent ~ onSubmit ~ err:", err)
        this.errorMessage = err.error.message;
        console.log("🚀 ~ file: login.component.ts:51 ~ LoginComponent ~ onSubmit ~ this.errorMessage:", this.errorMessage)
        this.isLoginFailed = true;
      }
    );
  }

  reloadPage(): void {
    window.location.reload();
  }
}
