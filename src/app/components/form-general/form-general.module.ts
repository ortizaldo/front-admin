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
    UserEditComponent
  ],
  // declarations: [SimpleDatatable],
  exports: [
    UserReadComponent,
    UserEditComponent
  ],
})
export class FormGralModule { }
