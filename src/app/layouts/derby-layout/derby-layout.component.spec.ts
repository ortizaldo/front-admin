import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { DerbyLayoutComponent } from "./derby-layout.component";

describe("DerbyLayoutComponent", () => {
  let component: DerbyLayoutComponent;
  let fixture: ComponentFixture<DerbyLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DerbyLayoutComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DerbyLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
