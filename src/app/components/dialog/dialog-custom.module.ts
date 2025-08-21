import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";
import { ConfirmationService } from "primeng/api";
import { DialogModule } from "primeng/dialog";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { DialogFormComponent } from "./dialog-form/dialog-form.component";
import { DialogCompadresComponent } from "./dialog-compadres/dialog-compadres.component";

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    NgbModule,
    DialogModule,
    ConfirmDialogModule,
    ButtonModule,
  ],
  providers: [ConfirmationService],
  declarations: [DialogFormComponent, DialogCompadresComponent],
  exports: [DialogFormComponent, DialogCompadresComponent],
})
export class DialogCustomModule {}
