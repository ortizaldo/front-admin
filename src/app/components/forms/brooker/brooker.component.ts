import { Component, ElementRef, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/interfaces/user';

import { SelectItem } from 'primeng/api';
import { SelectItemGroup } from 'primeng/api';
import { CrudService } from 'src/app/_services/crud.service';
import { catchError, tap } from 'rxjs';
import { Country } from 'src/app/interfaces/country';
import { State } from 'src/app/interfaces/state';
import { Municipality } from 'src/app/interfaces/municipality';
import { ControlValueAccessor } from '@angular/forms';
@Component({
  selector: 'app-brooker',
  templateUrl: './brooker.component.html',
  styleUrls: ['./brooker.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class BrookerComponent implements OnInit, ControlValueAccessor  {
  @Input() data: any | undefined;
  @Input() label: string;
  @Input() form: FormGroup;
  onChange: any = () => {};
  onTouched: any = () => {};
  percentage: string;

  @ViewChild('form') formElement: ElementRef;
  constructor(private fb: FormBuilder, private crudService: CrudService) {
  }

  ngOnInit(): void {
    console.log('%csrc/app/components/forms/brooker/brooker.component.ts:29 this.form', 'color: #007acc;', this.form);
  }

  writeValue(value: any): void {
    this.percentage = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // Implement this method if needed
  }
}
