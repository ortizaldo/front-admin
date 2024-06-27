import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrookerComponent } from './brooker.component';

describe('BrookerComponent', () => {
  let component: BrookerComponent;
  let fixture: ComponentFixture<BrookerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BrookerComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BrookerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
