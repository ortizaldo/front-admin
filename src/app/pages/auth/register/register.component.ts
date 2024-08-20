import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/_services/auth.service';
import { TokenStorageService } from 'src/app/_services/token-storage.service';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ["./register.component.css"],
})
export class RegisterComponent implements OnInit {
  registerForm: UntypedFormGroup;
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];

  constructor(private authService: AuthService, private tokenStorage: TokenStorageService, private fb: UntypedFormBuilder, private toastr: ToastrService, private router: Router) {

  }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      firstName: new UntypedFormControl("", [Validators.required]),
      lastName: new UntypedFormControl("", [Validators.required]),
      email: new UntypedFormControl("", [Validators.required]),
      password: new UntypedFormControl("", [Validators.required]),
      passwordConfirm: new UntypedFormControl("", [Validators.required]),
    });
  }

  onSubmit(): void {
    delete this.registerForm.value.passwordConfirm;
    if (this.registerForm.invalid) return;
    this.authService.register(this.registerForm.value).subscribe(
      data => {
        this.showNotification('top', 'right', "Registro de cuenta", "Se registro correctamente", "alert-success");
        this.redirectDashboard();
      },
      err => {
        const _err = err.error.err;
        this.errorMessage = _err.message;
        this.showNotification('top', 'right', _err.title, _err.message, "alert-warning");
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
