import { Component, OnDestroy, OnInit } from "@angular/core";
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "src/app/_services/auth.service";

type ActivationState =
  | "validating"
  | "valid"
  | "activating"
  | "expired"
  | "resending"
  | "sent"
  | "activated"
  | "error";

@Component({
  selector: "app-activate",
  templateUrl: "./activate.component.html",
  styleUrls: ["./activate.component.scss"],
})
export class ActivateComponent implements OnInit, OnDestroy {
  passwordForm!: UntypedFormGroup;
  state: ActivationState = "expired";
  readonly maskedEmail = "o*************o@g***l.com";
  resendSeconds = 0;

  token: string = "";
  tokenValid = false;
  validatingToken = true;

  private resendTimer?: ReturnType<typeof setInterval>;
  private requestTimer?: ReturnType<typeof setTimeout>;

  constructor(
    private readonly router: Router,
    private fb: UntypedFormBuilder,
    private route: ActivatedRoute,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get("token") || "";

    if (!this.token) {
      this.validatingToken = false;
      this.tokenValid = false;
      return;
    }

    this.validateToken();

    this.passwordForm = this.fb.group({
      password: new UntypedFormControl("", [Validators.required]),
      confirmPassword: new UntypedFormControl("", [Validators.required]),
    });
  }

  validateToken(): void {
    this.setTokenState("validating");
    this.authService.validateActivationToken(this.token).subscribe({
      next: (data: any) => {
        console.log("Token validation response:", data);
        this.tokenValid = data.valid;
        this.validatingToken = false;
        this.setTokenState(this.tokenValid ? "valid" : "expired");
      },

      error: (error) => {
        console.log("🚀 ~ ActivateComponent ~ validateToken ~ error:", error);
        this.tokenValid = false;
        this.setTokenState(this.tokenValid ? "valid" : "expired");
      },
    });
  }

  activateAccount(): void {
    this.setTokenState("activating");
    this.authService
      .activateAccount({
        token: this.token,
        password: this.passwordForm.value.password,
      })
      .subscribe({
        next: (data: any) => {
          this.setTokenState("activated");
        },

        error: () => {
          this.tokenValid = false;
          this.validatingToken = false;
        },
      });
  }

  resendActivation(): void {
    if (this.state === "resending" || this.resendSeconds > 0) return;

    this.state = "resending";

    this.authService.resendActivationEmail(this.token).subscribe({
      next: (data: any) => {
        this.setTokenState("sent");
      },
      error: (error) => {
        this.tokenValid = false;
        this.validatingToken = false;
      },
    });
  }

  retry(): void {
    this.state = "expired";
  }

  goToLogin(): void {
    void this.router.navigate(["/login"]);
  }

  continueToApp(): void {
    void this.router.navigate(["/"]);
  }

  setTokenState(state: ActivationState): void {
    this.clearTimers();
    this.resendSeconds = 0;
    this.state = state;
    if (state === "sent") this.startCooldown(45);
  }

  ngOnDestroy(): void {
    this.clearTimers();
  }

  private startCooldown(seconds: number): void {
    this.resendSeconds = seconds;
    this.resendTimer = setInterval(() => {
      this.resendSeconds -= 1;
      if (this.resendSeconds <= 0 && this.resendTimer) {
        clearInterval(this.resendTimer);
        this.resendTimer = undefined;
      }
    }, 1000);
  }

  private clearTimers(): void {
    if (this.resendTimer) clearInterval(this.resendTimer);
    if (this.requestTimer) clearTimeout(this.requestTimer);
    this.resendTimer = undefined;
    this.requestTimer = undefined;
  }
}
