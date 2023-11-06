import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { TableModule } from 'primeng/table';
import { SimpleDatatable } from "./simple-datatable/simple-datatable.component";

// import { FooterComponent } from "./footer/footer.component";
// import { NavbarComponent } from "./navbar/navbar.component";
// import { SidebarComponent } from "./sidebar/sidebar.component";

@NgModule({
  imports: [CommonModule, RouterModule, NgbModule, TableModule],
  declarations: [SimpleDatatable],
  exports: [SimpleDatatable]
})
export class DatatableCustomModule { }
