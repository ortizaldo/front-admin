import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { TableModule } from 'primeng/table';

import { AdminLayoutRoutes } from "./admin-layout.routing";
import { DashboardComponent } from "../../pages/admin/dashboard/dashboard.component";
import { IconsComponent } from "../../pages/admin/icons/icons.component";
import { MapComponent } from "../../pages/admin/map/map.component";
import { NotificationsComponent } from "../../pages/admin/notifications/notifications.component";
import { UserComponent } from "../../pages/admin/user/user.component";
import { TablesComponent } from "../../pages/admin/tables/tables.component";
import { TypographyComponent } from "../../pages/admin/typography/typography.component";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { PanelMenuModule } from 'primeng/panelmenu';
import { TabMenuModule } from 'primeng/tabmenu';
import { SlideMenuModule } from 'primeng/slidemenu';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { ComponentsModule } from "src/app/components/components.module";
import { DatatableCustomModule } from "src/app/components/datatable/datatable-custom.module";
import { DialogCustomModule } from "src/app/components/dialog/dialog-custom.module";
import { FormGralModule } from "src/app/components/form-general/form-general.module";
import { ProfileComponent } from "src/app/pages/admin/profile/profile.component";
import { CatalogsComponent } from "src/app/pages/admin/catalogs/catalogs.component";
import { ButtonModule } from 'primeng/button';
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    HttpClientModule,
    NgbModule,
    ComponentsModule,
    TableModule,
    DatatableCustomModule,
    DialogCustomModule,
    FormGralModule,
    PanelMenuModule,
    TabMenuModule,
    SlideMenuModule,
    NgbDropdownModule,
    ButtonModule,
  ],
  declarations: [
    DashboardComponent,
    CatalogsComponent,
    UserComponent,
    TablesComponent,
    IconsComponent,
    TypographyComponent,
    NotificationsComponent,
    MapComponent,
    ProfileComponent
    // RtlComponent
  ],
})
export class AdminLayoutModule { }
