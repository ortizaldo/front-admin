import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppDialogFormComponent } from './app-dialog-form.component';

describe('AppDialogFormComponent', () => {
  let component: AppDialogFormComponent;
  let fixture: ComponentFixture<AppDialogFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppDialogFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppDialogFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
