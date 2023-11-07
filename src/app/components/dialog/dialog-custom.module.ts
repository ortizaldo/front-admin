import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService } from "primeng/api";
import { DialogModule } from "primeng/dialog";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { AppDialogFormComponent } from './app-dialog-form/app-dialog-form.component';
// import { SimpleDatatable } from "./simple-datatable/simple-datatable.component";


@NgModule({
  imports: [CommonModule, RouterModule, NgbModule, DialogModule,
    ConfirmDialogModule, ButtonModule],
  // declarations: [SimpleDatatable],
  // exports: [SimpleDatatable]
  providers: [ConfirmationService],
  declarations: [
    AppDialogFormComponent
  ]
})
export class DialogCustomModule { }
