import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { ToastrModule } from 'ngx-toastr';

import { AppComponent } from "./app.component";
import { AdminLayoutComponent } from "./layouts/admin-layout/admin-layout.component";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { AppRoutingModule } from "./app-routing.module";
import { ComponentsModule } from "./components/components.module";
import { AuthInterceptor } from "./_helpers/auth.interceptor";
import { AuthLayoutComponent } from "./layouts/auth-layout/auth-layout.component";
import { ConfirmationService, MessageService } from "primeng/api";
import { NgxMaskModule, IConfig } from 'ngx-mask'
import { DerbyLayoutComponent } from "./layouts/derby-layout/derby-layout.component";
const maskConfig: Partial<IConfig> = {
  validation: false,
};
@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ComponentsModule,
    NgbModule,
    RouterModule,
    AppRoutingModule,
    ToastrModule.forRoot(),
    NgxMaskModule.forRoot(maskConfig),
  ],
  declarations: [AppComponent, AdminLayoutComponent, AuthLayoutComponent, DerbyLayoutComponent],
  providers: [AuthInterceptor, MessageService, ConfirmationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
