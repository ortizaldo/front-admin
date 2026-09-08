import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ComponentsModule } from "src/app/components/components.module";
import { AuthLayoutRoutes } from "./auth-layout.routing";
import { LoginComponent } from "src/app/pages/auth/login/login.component";
import { RegisterComponent } from "src/app/pages/auth/register/register.component";
import { PasswordModule } from "primeng/password";
import { ActivateComponent } from "src/app/pages/auth/activate/activate.component";
import { ButtonModule } from "primeng/button";
import { KPIModule } from "src/app/components/kpi/kpi.module";

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AuthLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    ComponentsModule,
    PasswordModule,
    ProgressSpinnerModule,
    ButtonModule,
    KPIModule,
  ],
  declarations: [LoginComponent, RegisterComponent, ActivateComponent],
})
export class AuthLayoutModule {}
