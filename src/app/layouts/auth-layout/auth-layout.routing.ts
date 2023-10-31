import { Routes } from "@angular/router";
import { LoginComponent } from "src/app/pages/auth/login/login.component";

export const AuthLayoutRoutes: Routes = [
  {
    path: "auth",
    children: [
      {
        path: "login",
        component: LoginComponent,
      }
    ]
  },
];
