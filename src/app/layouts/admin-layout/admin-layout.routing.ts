import { Routes } from "@angular/router";

import { DashboardComponent } from "../../pages/admin/dashboard/dashboard.component";
import { IconsComponent } from "../../pages/admin/icons/icons.component";
import { MapComponent } from "../../pages/admin/map/map.component";
import { NotificationsComponent } from "../../pages/admin/notifications/notifications.component";
import { UserComponent } from "../../pages/admin/user/user.component";
import { TablesComponent } from "../../pages/admin/tables/tables.component";
import { TypographyComponent } from "../../pages/admin/typography/typography.component";
import { ProfileComponent } from "src/app/pages/admin/profile/profile.component";
// import { RtlComponent } from "../../pages/admin/rtl/rtl.component";

export const AdminLayoutRoutes: Routes = [
  { path: "dashboard", component: DashboardComponent },
  { path: "profile", component: ProfileComponent },
  { path: "users", component: UserComponent },
  // { path: "maps", component: MapComponent },
  // { path: "notifications", component: NotificationsComponent },
  // { path: "tables", component: TablesComponent },
  // { path: "typography", component: TypographyComponent },
  // { path: "rtl", component: RtlComponent }
];
