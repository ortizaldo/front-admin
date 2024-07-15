import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/_services/auth.service';
import { TokenStorageService } from 'src/app/_services/token-storage.service';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  loginForm: UntypedFormGroup;
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];

  constructor(private authService: AuthService, private tokenStorage: TokenStorageService, private fb: UntypedFormBuilder, private toastr: ToastrService, private router: Router) {

  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: new UntypedFormControl('', [Validators.required]),
      password: new UntypedFormControl('', [Validators.required])
    });

    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      // this.roles = this.tokenStorage.getUser().roles;
    }
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;
    this.authService.login(this.loginForm.value.email, this.loginForm.value.password).subscribe(
      data => {
        this.tokenStorage.saveToken(data.accessToken);
        this.tokenStorage.saveUser(data.user);

        this.isLoginFailed = false;
        this.isLoggedIn = true;
        // this.roles = this.tokenStorage.getUser().roles;
        this.redirectDashboard();
      },
      err => {
        const _err = err.error.err;
        this.errorMessage = _err.message;
        this.showNotification('top', 'right', _err.title, _err.message, "alert-warning")
        this.isLoginFailed = true;
      }
    );
  }

  showNotification(from, align, title = '', message = '', color = "alert-info") {
    // let strColor = "alert-info";
    // switch (color) {
    //   case 1:
    //     strColor = "alert-info"
    //     break;
    //   case 2:
    //     strColor = "alert-success"
    //     break;
    //   case 3:
    //     strColor = "alert-warning"
    //     break;
    //   case 4:
    //     strColor = "alert-danger"
    //     break;
    //   case 5:
    //     strColor = "alert-primary"
    //     break;
    //   default:
    //     break;
    // }

    this.toastr.info(`<span class="tim-icons icon-bell-55" [data-notify]="icon"></span> ${title}</b> - ${message}.`, '', {
      disableTimeOut: true,
      closeButton: true,
      enableHtml: true,
      toastClass: `alert ${color} alert-with-icon`,
      positionClass: 'toast-' + from + '-' + align
    });
  }

  reloadPage(): void {
    window.location.reload();
  }

  redirectDashboard(): void {
    this.router.navigate(['/']).then(() => console.log('Redirect to login'));
  }
}
