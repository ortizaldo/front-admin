import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";
import { Routes, RouterModule } from "@angular/router";

import { AdminLayoutComponent } from "./layouts/admin-layout/admin-layout.component";
import { LoginComponent } from "./pages/auth/login/login.component";
import { AuthGuard } from "./auth.guard";

const routes: Routes = [
  {
    path: "auth",
    children: [
      {
        path: "login",
        component: LoginComponent,
      }
    ]
  },
  {
    path: "",
    redirectTo: "auth/login",
    pathMatch: "full",
    canActivate: [AuthGuard],
  },
  {
    path: "",
    component: AdminLayoutComponent,
    children: [
      {
        path: "",
        loadChildren: () => import("./layouts/admin-layout/admin-layout.module").then(m => m.AdminLayoutModule)
      }
    ]
  },
  {
    path: "**",
    redirectTo: "dashboard"
  }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes, {
      useHash: true
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
