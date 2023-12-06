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

@Component({
  selector: 'app-state',
  templateUrl: './state.component.html',
  styleUrls: ['./state.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class StateComponent implements OnInit {
  @Input() data: any | undefined;
  @Input() form: FormGroup;
  @Input() countrys: Country[] | undefined;

  selectedCountry: Country;

  items: SelectItem[];

  @ViewChild('form') formElement: ElementRef;
  constructor(private fb: FormBuilder, private crudService: CrudService) {
  }

  ngOnInit(): void {
    this.getCountries();
  }

  getCountries() {
    const params = {
      select: ["description", "_id"]
    };
    this.crudService.getMany("country", null, params)
      .pipe(
        tap((data: any) => {
          this.countrys = [{ _id: 0, description: "Seleccione una opcion" }, ...data.data];
        }),
        catchError(err => {
          return err
        })
      )
      .subscribe();
  }
}
