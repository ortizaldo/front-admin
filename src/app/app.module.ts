import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule, LOCALE_ID } from "@angular/core";
import { registerLocaleData } from '@angular/common';
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { ToastrModule } from 'ngx-toastr';
import localeEsMx from '@angular/common/locales/es-MX';
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

registerLocaleData(localeEsMx, 'es-MX');
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
  providers: [AuthInterceptor, MessageService, ConfirmationService, { provide: LOCALE_ID, useValue: 'es-MX' }],
  bootstrap: [AppComponent]
})
export class AppModule { }
