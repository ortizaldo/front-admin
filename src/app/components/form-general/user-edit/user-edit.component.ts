import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
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
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class UserEditComponent implements OnInit {
  @Input() data: User | undefined;
  @Input() companys: any[] | undefined;
  @Input() countrys: Country[] | undefined;
  @Input() states: State[] | undefined;
  @Input() municipalitys: Municipality[] | undefined;

  selectedCountry: Country;
  selectedState: State;
  selectedMunicipality: Municipality;
  selectedCompany: any | undefined = {};
  userForm: FormGroup;

  groupedCities: SelectItemGroup[];

  items: SelectItem[];
  constructor(private fb: FormBuilder, private crudService: CrudService) {
  }

  ngOnInit(): void {
    console.log('%cuser-edit.component.ts line:39 this.data', 'color: #007acc;', this.data);
    this.userForm = this.fb.group({
      company: new FormControl('', [Validators.required]),
      firstName: new FormControl(this.data?.firstName, [Validators.required]),
      lastName: new FormControl(this.data?.lastName, [Validators.required]),
      email: new FormControl(this.data?.email, [Validators.required]),
      phoneNumber: new FormControl(this.data?.phoneNumber, [Validators.required]),
      addressStreet: new FormControl('', [Validators.required]),
      postalCode: new FormControl('', [Validators.required]),
      country: new FormControl('', [Validators.required]),
      state: new FormControl('', [Validators.required]),
      municipality: new FormControl('', [Validators.required]),
    });

    this.getCountries();
  }

  onChange(evt: any, endpoint: string) {
    console.log("🚀 ~ file: user-edit.component.ts:57 ~ UserEditComponent ~ onChange ~ endpoint:", endpoint)
    console.log('%cuser-edit.component.ts line:58 this.selectedState', 'color: #007acc;', this.selectedState);
    let params: any = {};
    if (endpoint === "state") {
      params = {
        filtersId: {
          country: {
            value: this.selectedCountry._id,
          }
        },
        select: ["country", "description", "_id"]
      }
    }

    if (endpoint === "municipality") {
      params = {
        filtersId: {
          country: {
            value: this.selectedCountry._id,
          },
          state: {
            value: this.selectedState._id,
          }
        },
        select: ["country", "state", "description", "_id"]
      }
    }
    this.getCatalogDependent(endpoint, params);
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

  getCatalogDependent(type: string, params: any) {
    this.crudService.getMany(type, null, params)
      .pipe(
        tap((data: any) => {

          if (type === "state") {
            this.states = [{ _id: 0, description: "Seleccione una opcion" }, ...data.data];
            console.log("🚀 ~ file: user-edit.component.ts:110 ~ UserEditComponent ~ tap ~ this.states:", this.states)
          }

          if (type === "municipality") {
            this.municipalitys = [{ _id: 0, description: "Seleccione una opcion" }, ...data.data];
          }
        }),
        catchError(err => {
          return err
        })
      )
      .subscribe();
  }
}
