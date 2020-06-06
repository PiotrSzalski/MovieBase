import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service'
import { Router } from '@angular/router';
import { ImbdMovie } from '../models/ImbdMovie';
import { ImbdService } from '../services/imdb.api.service';

@Component({
  selector: 'app-propositions',
  templateUrl: './propositions.component.html',
  styleUrls: ['./propositions.component.scss']
})
export class PropositionsComponent implements OnInit {

  public moviesFound: Array<ImbdMovie> = new Array<ImbdMovie>();
  private recommendations: Array<string> = new Array<string>();
  private error: string = '';

  constructor(private api: ApiService, private router: Router, private imbdService: ImbdService) { }

  ngOnInit() {
    const token = localStorage.getItem("token")
    this.api.getRecommendations(token).subscribe(res => {
      if(res["count"] == -1) {
        this.error = "Błąd w trakcie szukania rekomendacji."
      } else if(res["count"] < 5) {
        this.error = "Aby otrzymać rekomendacje, musisz wystawić co najmniej 5 ocen.";
      } else {
        const list = JSON.parse(res["recomendations"]);
        this.error = ""
        this.recommendations = list.map(({imdbID}) => imdbID as string);
        this.getDataFromImdbApi();
      }
    })
  }

  private getDataFromImdbApi() {
    this.recommendations.forEach(id => {
      this.imbdService.getMovie(id).subscribe( res => {
        const index = this.recommendations.indexOf(id);
        this.moviesFound[index] = Object.assign(new ImbdMovie(), res);
      }, err => {
        console.log(err);
        this.error = 'Błąd zewnerznego API';
      });
    });
  }
}
