import { Routes } from "@angular/router";

import { DashboardComponent } from "../../pages/admin/dashboard/dashboard.component";
import { UserComponent } from "../../pages/admin/user/user.component";
import { ProfileComponent } from "src/app/pages/admin/profile/profile.component";
import { CatalogsComponent } from "src/app/pages/admin/catalogs/catalogs.component";
import { BettingBrokerageComponent } from "src/app/pages/admin/betting-brokerage/betting-brokerage.component";
import { EventsComponent } from "src/app/pages/admin/events/events-component";
import { CatalogDashboardComponent } from "src/app/pages/admin/catalog-dashboard/catalog-dashboard.component";

export const AdminLayoutRoutes: Routes = [
  { path: "dashboard", component: DashboardComponent },
  { path: "profile", component: ProfileComponent },
  { path: "users", component: UserComponent },
  { path: "catalogs", component: CatalogsComponent },
  { path: "catalog-dashboard/:id", component: CatalogDashboardComponent },
  { path: "events", component: EventsComponent },
  { path: "betting-brokerage", component: BettingBrokerageComponent },
];
