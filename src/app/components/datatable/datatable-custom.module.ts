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
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';
import { TabViewModule } from "primeng/tabview";
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TeamsDatatable } from "./teams-datatable/teams-datatable.component";
import { CorretajeDatatable } from "./corretaje-datatable/corretaje-datatable.component";
import { ReactiveFormsModule } from "@angular/forms";
import { DividerModule } from "primeng/divider";
import {CheckboxModule} from 'primeng/checkbox';
import { FileUploadModule } from 'primeng/fileupload';
import { WeightPipe } from "src/app/utils/weight-pipe";
import { TooltipModule } from 'primeng/tooltip';
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
    NgbDropdownModule,
    InputMaskModule,
    TabViewModule,
    InputNumberModule,
    ReactiveFormsModule,
    ToastModule,
    DividerModule,
    CheckboxModule,
    FileUploadModule,
    TooltipModule
  ],
  declarations: [SimpleDatatable, TeamsDatatable, CorretajeDatatable, WeightPipe],
  exports: [SimpleDatatable, TeamsDatatable, CorretajeDatatable, WeightPipe],
  providers: [MessageService, ConfirmationService]
})
export class DatatableCustomModule { }
