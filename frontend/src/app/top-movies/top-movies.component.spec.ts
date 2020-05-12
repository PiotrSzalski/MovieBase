import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopMoviesComponent } from './top-movies.component';

describe('TopMoviesComponent', () => {
  let component: TopMoviesComponent;
  let fixture: ComponentFixture<TopMoviesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopMoviesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopMoviesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
