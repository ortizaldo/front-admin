import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/interfaces/user';

import { SelectItem } from 'primeng/api';
import { SelectItemGroup } from 'primeng/api';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {
  @Input() data: User | undefined;
  @Input() companys: any[] | undefined;
  @Input() countrys: any[] | undefined;
  @Input() states: any[] | undefined;
  @Input() municipalitys: any[] | undefined;

  selectedCountry: any[] | undefined;
  selectedState: any[] | undefined;
  selectedMunicipality: any[] | undefined;
  selectedCompany: any[] | undefined;
  userForm: FormGroup;

  groupedCities: SelectItemGroup[];

  items: SelectItem[];
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.userForm = this.fb.group({
      // company: new FormControl('', [Validators.required]),
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      // phoneNumber: new FormControl('', [Validators.required]),
      addressStreet: new FormControl('', [Validators.required]),
      postalCode: new FormControl('', [Validators.required]),
      // country: new FormControl('', [Validators.required]),
      // state: new FormControl('', [Validators.required]),
      // municipality: new FormControl('', [Validators.required]),
    });
  }

}
