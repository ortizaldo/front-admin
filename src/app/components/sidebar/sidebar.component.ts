import { Component, OnInit } from "@angular/core";
import { TokenStorageService } from "src/app/_services/token-storage.service";

declare interface RouteInfo {
  path: string;
  title: string;
  rtlTitle?: string;
  icon: string;
  class: string;
}
export const ROUTES: any[] = [
  {
    path: "/dashboard",
    title: "Dashboard",
    icon: "pi pi-chart-line",
    class: "",
    roles: ["ADMIN"],
  },
  {
    path: "/users",
    title: "Usuarios",
    icon: "pi pi-users",
    class: "",
    roles: ["ADMIN"],
  },
  {
    path: "/betting-brokerage",
    title: "Corretaje",
    icon: "pi pi-dollar",
    class: "",
    roles: ["ADMIN"],
  },
  {
    path: "/events",
    title: "Eventos",
    icon: "pi pi-calendar",
    class: "",
    roles: ["ADMIN"],
  },
  {
    path: "/catalogs",
    title: "Catálogos",
    icon: "pi pi-folder",
    class: "",
    roles: ["ADMIN"],
  },
  {
    path: "/derby-admin",
    title: "Operación Derby",
    icon: "pi pi-briefcase",
    class: "",
    roles: ["ADMIN", "OPERADOR"],
  },
  {
    path: "/live",
    title: "En Vivo",
    icon: "pi pi-video",
    class: "",
    roles: ["USUARIO"],
  },
  {
    path: "/bets",
    title: "Mis Apuestas",
    icon: "pi pi-ticket",
    class: "",
    roles: ["USUARIO"],
  },
  {
    path: "/wallet",
    title: "Mi Cartera",
    icon: "pi pi-wallet",
    class: "",
    roles: ["USUARIO"],
  },
  {
    path: "/profile",
    title: "Perfil",
    icon: "pi pi-user",
    class: "",
    roles: ["USUARIO"],
  },
];

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.css"],
})
export class SidebarComponent implements OnInit {
  menuItems: any[];

  constructor(private tokenStorage: TokenStorageService) {}

  ngOnInit() {
    const role = this.tokenStorage.getUser().typeUser;
    this.menuItems = ROUTES.filter((menuItem) => menuItem.roles.includes(role));
  }
  isMobileMenu() {
    if (window.innerWidth > 991) {
      return false;
    }
    return true;
  }
}
