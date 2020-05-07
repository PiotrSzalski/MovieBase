import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { Routes, RouterModule } from '@angular/router';
import { MainPageComponent } from './main-page/main-page.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { PropositionsComponent } from './propositions/propositions.component';
import { SearchComponent } from './search/search.component';
import { MovieComponent } from './movie/movie.component';
import { MoviePageComponent } from './movie-page/movie-page.component';
import { MyRatingsPageComponent } from './my-ratings-page/my-ratings-page.component';
import { RatingStarsComponent } from './rating-stars/rating-stars.component';

const routes: Routes = [
  { path: 'login', component: LoginPageComponent },
  { path: 'propositions', component: PropositionsComponent },
  { path: '', component: MainPageComponent },
  { path: 'search', component: SearchComponent },
  { path: 'movie/:id', component: MoviePageComponent },
  { path: 'rates', component: MyRatingsPageComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    MainPageComponent,
    NavBarComponent,
    PropositionsComponent,
    SearchComponent,
    MovieComponent,
    MoviePageComponent,
    MyRatingsPageComponent,
    RatingStarsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
