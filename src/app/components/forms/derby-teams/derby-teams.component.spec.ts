import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DerbyTeamsComponent } from './derby-teams.component';

describe('DerbyTeamsComponent', () => {
  let component: DerbyTeamsComponent;
  let fixture: ComponentFixture<DerbyTeamsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DerbyTeamsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DerbyTeamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
