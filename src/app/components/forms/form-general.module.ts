import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { UserReadComponent } from './user-read/user-read.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import { DropdownModule } from "primeng/dropdown";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SimpleCatalogComponent } from "./simple-catalog/simple-catalog.component";
import { StateComponent } from "./state/state.component";
import { MunicipalityComponent } from "./municipality/municipality.component";
import { CompanyComponent } from "./company/company.component";
import { DerbyEditComponent } from "./derby-edit/derby-edit.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NgbModule,
    TableModule,
    ToolbarModule,
    ButtonModule,
    DropdownModule,
    ReactiveFormsModule
  ],
  declarations: [
    UserReadComponent,
    UserEditComponent,
    SimpleCatalogComponent,
    StateComponent,
    MunicipalityComponent,
    CompanyComponent,
    DerbyEditComponent
  ],
  // declarations: [SimpleDatatable],
  exports: [
    UserReadComponent,
    UserEditComponent,
    SimpleCatalogComponent,
    StateComponent,
    MunicipalityComponent,
    CompanyComponent,
    DerbyEditComponent
  ],
})
export class FormGralModule { }
