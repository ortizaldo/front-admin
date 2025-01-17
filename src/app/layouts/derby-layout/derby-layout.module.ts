import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TableModule } from 'primeng/table';

import { DerbyLayoutRoutes } from "./derby-layout.routing";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { PanelMenuModule } from 'primeng/panelmenu';
import { TabMenuModule } from 'primeng/tabmenu';
import { SlideMenuModule } from 'primeng/slidemenu';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { ComponentsModule } from "src/app/components/components.module";
import { DatatableCustomModule } from "src/app/components/datatable/datatable-custom.module";
import { DialogCustomModule } from "src/app/components/dialog/dialog-custom.module";
import { FormGralModule } from "src/app/components/forms/form-general.module";
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { SplitterModule } from "primeng/splitter";
import { DerbyComponent } from "src/app/pages/admin/derby/derby.component";
import { DropdownModule } from "primeng/dropdown";
import { ScrollPanelModule } from "primeng/scrollpanel";
import { SplitButtonModule } from "primeng/splitbutton";
import { TabViewModule } from "primeng/tabview";
import { ToastModule } from 'primeng/toast';
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(DerbyLayoutRoutes),
    FormsModule,
    HttpClientModule,
    NgbModule,
    ComponentsModule,
    TableModule,
    DatatableCustomModule,
    DialogCustomModule,
    FormGralModule,
    PanelMenuModule,
    TabMenuModule,
    SlideMenuModule,
    NgbDropdownModule,
    ButtonModule,
    ReactiveFormsModule,
    SplitterModule,
    ConfirmDialogModule,
    DropdownModule,
    ScrollPanelModule,
    SplitButtonModule,
    TabViewModule,
    TabMenuModule,
    ToastModule
  ],
  declarations: [
    DerbyComponent
  ]
})
export class DerbyLayoutModule { }
