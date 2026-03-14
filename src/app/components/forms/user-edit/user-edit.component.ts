import { Component, Input, OnInit, ViewEncapsulation } from "@angular/core";
import {
  UntypedFormBuilder,
  FormControl,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { User } from "src/app/interfaces/user";
import * as _ from "underscore";
import { SelectItem } from "primeng/api";
import { SelectItemGroup } from "primeng/api";
import { CrudService } from "src/app/_services/crud.service";
import { catchError, tap } from "rxjs";
import { Country } from "src/app/interfaces/country";
import { State } from "src/app/interfaces/state";
import { Municipality } from "src/app/interfaces/municipality";

@Component({
  selector: "app-user-edit",
  templateUrl: "./user-edit.component.html",
  styleUrls: ["./user-edit.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class UserEditComponent implements OnInit {
  @Input() data: any | undefined;
  @Input() form: UntypedFormGroup;
  @Input() companys: any[] | undefined;
  @Input() countrys: Country[] | undefined;
  @Input() states: State[] | undefined;
  @Input() municipalitys: Municipality[] | undefined;

  selectedCountry: any | undefined = {};
  selectedState: any | undefined = {};
  selectedMunicipality: any | undefined = {};
  selectedCompany: any | undefined = {};
  selectedDate: any | undefined = {};

  groupedCities: SelectItemGroup[];

  items: SelectItem[];
  constructor(
    private fb: UntypedFormBuilder,
    private crudService: CrudService,
  ) {}

  ngOnInit(): void {
    this.getCountries();
  }

  onChange(evt: any = null, select: string, endpoint: string = "") {
    if (select === "country") {
      // this.selectedCountry = _.where(this.countrys, {
      //   _id: this.form.value.country,
      // })[0];
      this.selectedCountry = this.countrys?.find(
        (x) => x._id == this.form.value.country,
      );
    }

    if (select === "state") {
      this.selectedState = this.states?.find(
        (x) => x._id == this.form.value.state,
      );
    }

    if (select === "municipality") {
      this.selectedMunicipality = this.municipalitys?.find(
        (x) => x._id == this.form.value.municipality,
      );
    }
    let params: any = {};
    if (endpoint === "state") {
      params = {
        filtersId: {
          country_id: {
            value: this.selectedCountry._id,
          },
        },
        select: ["country_id", "name", "_id"],
      };
      this.getCatalogDependent(endpoint, params);
    }

    if (endpoint === "municipality") {
      params = {
        filtersId: {
          country_id: {
            value: this.selectedCountry._id,
          },
          state_id: {
            value: this.selectedState._id,
          },
        },
        select: ["country_id", "state_id", "name", "_id"],
      };

      console.log(
        "%cfront-admin/src/app/components/forms/user-edit/user-edit.component.ts:96 params",
        "color: #007acc;",
        params,
      );
      this.getCatalogDependent(endpoint, params);
    }
  }

  getCountries() {
    const params = {
      select: ["name", "_id"],
    };
    this.crudService
      .getMany("country", null, params)
      .pipe(
        tap((data: any) => {
          this.countrys = [
            { _id: 0, name: "Seleccione una opcion" },
            ...data.data,
          ];
          this.selectedCountry = this.countrys[0];
        }),
        catchError((err) => {
          return err;
        }),
      )
      .subscribe();
  }

  getCatalogDependent(type: string, params: any) {
    this.crudService
      .getMany(type, null, params)
      .pipe(
        tap((data: any) => {
          if (type === "state") {
            this.states = [
              { _id: 0, name: "Seleccione una opcion" },
              ...data.data,
            ];
            this.selectedState = this.states[0];
            // if (_.has(this.data, "address")) {
            //   const { state } = this.data.address;
            //   this.selectedState = this.data
            //     ? this.states.find((x) => x._id == state)
            //     : this.states[0];
            //   this.onChange(null, "municipality");
            // } else {
            //   this.selectedState = this.states[0];
            // }
          }

          if (type === "municipality") {
            this.municipalitys = [
              { _id: 0, name: "Seleccione una opcion" },
              ...data.data,
            ];
            this.selectedMunicipality = this.municipalitys[0];
            // if (_.has(this.data, "address")) {
            //   const { municipality } = this.data.address;
            //   this.selectedMunicipality = this.data
            //     ? this.municipalitys.find((x) => x._id == municipality)
            //     : this.municipalitys[0];
            // } else {
            //   this.selectedMunicipality = this.municipalitys[0];
            // }
          }
        }),
        catchError((err) => {
          return err;
        }),
      )
      .subscribe();
  }

  saveUser() {
    console.log(
      "%cprofile.component.ts line:34 this.userForm",
      "color: #007acc;",
      this.data,
    );
  }
}
