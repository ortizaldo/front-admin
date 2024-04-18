import { Component, OnInit } from "@angular/core";

declare interface RouteInfo {
  path: string;
  title: string;
  rtlTitle?: string;
  icon: string;
  class: string;
}
export const ROUTES: RouteInfo[] = [
  {
    path: "/dashboard",
    title: "Dashboard",
    icon: "pi pi-chart-line",
    class: ""
  },
  {
    path: "/users",
    title: "Usuarios",
    icon: "pi pi-users",
    class: ""
  },
  {
    path: "/derby",
    title: "Derby",
    icon: "pi pi-briefcase",
    class: ""
  },
  {
    path: "/catalogs",
    title: "Catalogos",
    icon: "pi pi-folder",
    class: ""
  },
];

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.css"]
})
export class SidebarComponent implements OnInit {
  menuItems: any[];

  constructor() { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }
  isMobileMenu() {
    if (window.innerWidth > 991) {
      return false;
    }
    return true;
  }
}
