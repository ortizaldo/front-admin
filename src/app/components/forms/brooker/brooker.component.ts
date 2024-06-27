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
  selector: 'app-brooker',
  templateUrl: './brooker.component.html',
  styleUrls: ['./brooker.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class BrookerComponent implements OnInit {
  @Input() data: any | undefined;
  @Input() label: string;
  @Input() form: FormGroup;

  @ViewChild('form') formElement: ElementRef;
  constructor(private fb: FormBuilder, private crudService: CrudService) {
  }

  ngOnInit(): void {
  }
}
