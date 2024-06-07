import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/interfaces/user';
import * as _ from "underscore";
import { CrudService } from 'src/app/_services/crud.service';
import { catchError, tap } from 'rxjs';

@Component({
  selector: 'app-derby-edit',
  templateUrl: './derby-edit.component.html',
  styleUrls: ['./derby-edit.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DerbyEditComponent implements OnInit {
  @Input() data: any | undefined;
  @Input() form: FormGroup;
  constructor(private fb: FormBuilder, private crudService: CrudService) {
  }

  ngOnInit(): void {
    console.log(this.form)
    // this.getCountries();
  }
}
