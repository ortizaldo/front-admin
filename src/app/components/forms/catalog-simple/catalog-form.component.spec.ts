import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleCatalogComponent } from './catalog-form.component';

describe('SimpleCatalogComponent', () => {
  let component: SimpleCatalogComponent;
  let fixture: ComponentFixture<SimpleCatalogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SimpleCatalogComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleCatalogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
