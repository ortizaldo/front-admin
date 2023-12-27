import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { TableModule } from 'primeng/table';
import { SimpleDatatable } from "./simple-datatable/simple-datatable.component";
import { ToolbarModule } from 'primeng/toolbar';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { ConfirmationService, MessageService } from "primeng/api";
import { SpeedDialModule } from 'primeng/speeddial';
import { ContextMenuModule } from 'primeng/contextmenu';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    NgbModule,
    TableModule,
    ToolbarModule,
    ConfirmDialogModule,
    SpeedDialModule,
    MenuModule,
    RippleModule,
    ButtonModule,
    ContextMenuModule,
    NgbDropdownModule
  ],
  declarations: [SimpleDatatable],
  exports: [SimpleDatatable],
  providers: [MessageService, ConfirmationService]
})
export class DatatableCustomModule { }
