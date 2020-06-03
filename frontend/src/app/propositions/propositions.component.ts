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
      console.log(res);
      const list = JSON.parse(res["recomendations"]);
      if (list.length > 0) {
        this.error = ""
        list.forEach(value => {
          this.recommendations.push(value.imdbID as string);
        });
        this.getDataFromImdbApi();
      } else {
        if (res["count"] == 0)
          this.error = "Nie wystawiłaś/eś jeszcze żadnych ocen.";
        else if (res["count"] < 5)
          this.error = "Nie wystawiłaś/eś jeszcze pięciu ocen.";
        else
          this.error = "Błąd w trakcie szukania rekomendacji."
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
