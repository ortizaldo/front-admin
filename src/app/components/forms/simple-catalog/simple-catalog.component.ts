import {
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import {
  UntypedFormBuilder,
  FormControl,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { User } from "src/app/interfaces/user";

import { SelectItem } from "primeng/api";
import { SelectItemGroup } from "primeng/api";
import { CrudService } from "src/app/_services/crud.service";
import { catchError, tap } from "rxjs";
import { Country } from "src/app/interfaces/country";
import { State } from "src/app/interfaces/state";
import { Municipality } from "src/app/interfaces/municipality";

@Component({
  selector: "app-simple-catalog",
  templateUrl: "./simple-catalog.component.html",
  styleUrls: ["./simple-catalog.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class SimpleCatalogComponent implements OnInit {
  @Input() data: any | undefined;
  @Input() label: string;
  @Input() form: UntypedFormGroup;
  @Input() companys: any[] | undefined;
  @Input() countrys: Country[] | undefined;
  @Input() states: State[] | undefined;
  @Input() municipalitys: Municipality[] | undefined;

  selectedCountry: Country;
  selectedState: State;
  selectedMunicipality: Municipality;
  selectedCompany: any | undefined = {};

  items: SelectItem[];

  @ViewChild("form") formElement: ElementRef;
  constructor(
    private fb: UntypedFormBuilder,
    private crudService: CrudService,
  ) {}

  ngOnInit(): void {
    console.log(
      "%cfront-admin/src/app/components/forms/simple-catalog/simple-catalog.component.ts:40 this.form",
      "color: #007acc;",
      this.form,
    );
    this.dynamicForm();
    this.getCountries();
  }

  dynamicForm() {
    const group: Record<string, any> = {};

    for (const [name, control] of Object.entries(this.form.controls)) {
      const v = this.data?.[name] ?? control.value ?? null;

      const validators = [];
      if (control.hasError("required")) validators.push(Validators.required);

      group[name] = [{ value: v, disabled: control.disabled }, validators];
    }

    this.form = this.fb.group(group);
  }

  fc(name: string) {
    return this.form.get(name);
  }

  showError(name: string) {
    const ctrl = this.fc(name);
    return !!ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched);
  }

  onChange(evt: any, endpoint: string) {
    let params: any = {};
    if (endpoint === "state") {
      params = {
        filtersId: {
          country: {
            value: this.selectedCountry._id,
          },
        },
        select: ["country", "description", "_id"],
      };
    }

    if (endpoint === "municipality") {
      params = {
        filtersId: {
          country: {
            value: this.selectedCountry._id,
          },
          state: {
            value: this.selectedState._id,
          },
        },
        select: ["country", "state", "description", "_id"],
      };
    }
    this.getCatalogDependent(endpoint, params);
  }

  getCountries() {
    const params = {
      select: ["description", "_id"],
    };
    this.crudService
      .getMany("country", null, params)
      .pipe(
        tap((data: any) => {
          this.countrys = [
            { _id: 0, description: "Seleccione una opcion" },
            ...data.data,
          ];
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
              { _id: 0, description: "Seleccione una opcion" },
              ...data.data,
            ];
            this.selectedState = this.states[0];
          }

          if (type === "municipality") {
            this.municipalitys = [
              { _id: 0, description: "Seleccione una opcion" },
              ...data.data,
            ];
            this.selectedMunicipality = this.municipalitys[0];
          }
        }),
        catchError((err) => {
          return err;
        }),
      )
      .subscribe();
  }
}
