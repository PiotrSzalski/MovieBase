import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyRatingsPageComponent } from './my-ratings-page.component';

describe('MyRatingsPageComponent', () => {
  let component: MyRatingsPageComponent;
  let fixture: ComponentFixture<MyRatingsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyRatingsPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyRatingsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
