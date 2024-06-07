import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
  selector: 'app-derby-edit',
  templateUrl: './derby-edit.component.html',
  styleUrls: ['./derby-edit.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DerbyEditComponent implements OnInit {
  @Input() data: any | undefined;
  @Input() form: FormGroup;
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
  constructor(private fb: FormBuilder, private crudService: CrudService) {
  }

  ngOnInit(): void {
    console.log(this.form)
    // this.getCountries();
  }
}
