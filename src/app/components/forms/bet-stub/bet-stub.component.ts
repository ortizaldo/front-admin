import { Component, ElementRef, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, FormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/interfaces/user';

import { SelectItem } from 'primeng/api';
import { SelectItemGroup } from 'primeng/api';
import { CrudService } from 'src/app/_services/crud.service';
import { catchError, tap } from 'rxjs';
import { ControlValueAccessor } from '@angular/forms';
@Component({
  selector: 'app-bet-stub',
  templateUrl: './bet-stub.component.html',
  styleUrls: ['./bet-stub.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class BetStubComponent implements OnInit{
  @Input() data: any | undefined;
  @Input() _selectedDerby: any;
  @Input() label: string;
  @Input() form: UntypedFormGroup;
  onChange: any = () => {};
  onTouched: any = () => {};
  percentage: string;
  brookers: any[] = [];
  derby: any[] = [];
  selectedBrooker: any;
  selectedDerby: any;
  @ViewChild('form') formElement: ElementRef;
  constructor(private fb: UntypedFormBuilder, private crudService: CrudService) {
  }

  ngOnInit(): void {
    console.log('%csrc/app/components/forms/bet-stub/bet-stub.component.ts:33 form', 'color: #007acc;', this.form);
    this.getBrokers();
    this.getDerbies();
  }

  getBrokers() {
    this.crudService.getMany("brooker", null, null)
      .pipe(
        tap((data: any) => {
          this.brookers = data.data;
        }),
        catchError(err => {
          return err
        })
      )
      .subscribe();

  }

  getDerbies() {
    this.crudService.getMany("derby", null, null)
      .pipe(
        tap((data: any) => {
          this.derby = data.data;
          this.selectedDerby = this._selectedDerby;
        }),
        catchError(err => {
          // this.loading = false;
          return err
        })
      )
      .subscribe();

  }
}
