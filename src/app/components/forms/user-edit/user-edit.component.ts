import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, FormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/interfaces/user';
import * as _ from "underscore";
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
  @Input() data: any | undefined;
  @Input() form: UntypedFormGroup;
  @Input() companys: any[] | undefined;
  @Input() countrys: Country[] | undefined;
  @Input() states: State[] | undefined;
  @Input() municipalitys: Municipality[] | undefined;

  selectedCountry: Country;
  selectedState: State;
  selectedMunicipality: Municipality;
  selectedCompany: any | undefined = {};


  groupedCities: SelectItemGroup[];

  items: SelectItem[];
  constructor(private fb: UntypedFormBuilder, private crudService: CrudService) {
  }

  ngOnInit(): void {
    this.getCountries();
  }

  onChange(evt: any, endpoint: string) {
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
          console.log('%cuser-edit.component.ts line:80 this.data', 'color: #007acc;', this.data);
          if (_.has(this.data, "address")) {
            const { country } = this.data.address;
            this.selectedCountry = this.data ? this.countrys.find(x => x._id == country) : this.states[0];
            this.onChange(null, "state");
          } else {
            this.selectedCountry = this.countrys[0];
          }
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
            this.selectedState = this.states[0];
            if (_.has(this.data, "address")) {
              const { state } = this.data.address;
              this.selectedState = this.data ? this.states.find(x => x._id == state) : this.states[0];
              this.onChange(null, "municipality");
            } else {
              this.selectedState = this.states[0];
            }
          }

          if (type === "municipality") {
            this.municipalitys = [{ _id: 0, description: "Seleccione una opcion" }, ...data.data];
            this.selectedMunicipality = this.municipalitys[0];
            if (_.has(this.data, "address")) {
              const { municipality } = this.data.address;
              this.selectedMunicipality = this.data ? this.municipalitys.find(x => x._id == municipality) : this.municipalitys[0];
            } else {
              this.selectedMunicipality = this.municipalitys[0];
            }
          }
        }),
        catchError(err => {
          return err
        })
      )
      .subscribe();
  }
}
