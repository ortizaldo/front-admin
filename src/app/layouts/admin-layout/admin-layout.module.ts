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
// import { RtlComponent } from "../../pages/admin/rtl/rtl.component";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ComponentsModule } from "src/app/components/components.module";

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    HttpClientModule,
    NgbModule,
    ComponentsModule,
    TableModule
  ],
  declarations: [
    DashboardComponent,
    UserComponent,
    TablesComponent,
    IconsComponent,
    TypographyComponent,
    NotificationsComponent,
    MapComponent,
    // RtlComponent
  ]
})
export class AdminLayoutModule { }
