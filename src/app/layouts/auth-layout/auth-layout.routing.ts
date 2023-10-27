import { Routes } from '@angular/router';

import { LoginComponent } from 'src/app/pages/auth/login/login.component';
import { RegisterComponent } from 'src/app/pages/auth/register/register.component';
import { AuthLayoutComponent } from './auth-layout.component';


export const AuthLayoutRoutes: Routes = [
  {
    path: "auth",
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
    ],
  },
];
