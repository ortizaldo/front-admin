import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";
import { Routes, RouterModule } from "@angular/router";

import { AdminLayoutComponent } from "./layouts/admin-layout/admin-layout.component";
import { LoginComponent } from "./pages/auth/login/login.component";
import { AuthGuard } from "./middleware/auth.guard";
import { AuthLayoutComponent } from "./layouts/auth-layout/auth-layout.component";
import { DerbyLayoutComponent } from "./layouts/derby-layout/derby-layout.component";
import { roleGuard } from "./middleware/role.guard";

const routes: Routes = [
  {
    path: "",
    redirectTo: "dashboard",
    canActivate: [AuthGuard, roleGuard],
    data: {
      roles: ["ADMIN"],
    },
    pathMatch: "full",
  },
  {
    path: "derby-admin",
    component: DerbyLayoutComponent,
    canActivate: [AuthGuard, roleGuard],
    data: {
      roles: ["ADMIN", "OPERADOR"],
    },
    children: [
      {
        path: "",
        loadChildren: () =>
          import("./layouts/derby-layout/derby-layout.module").then(
            (m) => m.DerbyLayoutModule,
          ),
      },
    ],
  },
  {
    path: "",
    component: AdminLayoutComponent,
    canActivate: [AuthGuard, roleGuard],
    children: [
      {
        path: "",
        loadChildren: () =>
          import("./layouts/admin-layout/admin-layout.module").then(
            (m) => m.AdminLayoutModule,
          ),
      },
    ],
    data: {
      roles: ["ADMIN"],
    },
  },
  {
    path: "",
    component: AuthLayoutComponent,
    children: [
      {
        path: "",
        loadChildren: () =>
          import("./layouts/auth-layout/auth-layout.module").then(
            (m) => m.AuthLayoutModule,
          ),
      },
    ],
  },
  {
    path: "**",
    redirectTo: "dashboard",
  },
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes, {
      useHash: true,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
