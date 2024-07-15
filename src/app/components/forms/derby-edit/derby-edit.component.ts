import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, FormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/interfaces/user';
import * as _ from "underscore";
import * as moment from "moment";
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
  @Input() selectedArma: any | undefined;
  @Input() armas: any[] | undefined;
  @Input() form: UntypedFormGroup;
  constructor(private fb: UntypedFormBuilder, private crudService: CrudService) {
    this.armas = [{ description: "1/4 Filo", value: "1/4" }, { description: "1/2 Filo", value: "1/2" }, { description: "Pulgada Filo", value: "pulgada" }];
  }

  ngOnInit(): void {
    console.log(this.form)
  }

  onChange(evt: any, endpoint: string) {
  }
}
