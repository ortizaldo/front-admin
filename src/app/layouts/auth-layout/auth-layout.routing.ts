import { Routes } from "@angular/router";
import { ActivateComponent } from "src/app/pages/auth/activate/activate.component";
import { LoginComponent } from "src/app/pages/auth/login/login.component";
import { RegisterComponent } from "src/app/pages/auth/register/register.component";

export const AuthLayoutRoutes: Routes = [
  {
    path: "auth",
    children: [
      {
        path: "login",
        component: LoginComponent,
      },
      {
        path: "register",
        component: RegisterComponent,
      },
      {
        path: "activate-account",
        component: ActivateComponent,
      },
    ],
  },
];
