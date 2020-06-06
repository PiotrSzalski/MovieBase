import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ImbdService } from '../services/imdb.api.service';
import { ImbdMovie } from '../models/ImbdMovie';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-movie-page',
  templateUrl: './movie-page.component.html',
  styleUrls: ['./movie-page.component.scss']
})
export class MoviePageComponent implements OnInit {

  private movieId: string
  private movie: ImbdMovie
  private rate: number
  private rated: string

  constructor(private route: ActivatedRoute, private imbdService: ImbdService, private api: ApiService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.movieId = params['id'].substring(2);
      this.imbdService.getMovie(this.movieId).subscribe( res => {
        this.movie = Object.assign(new ImbdMovie(), res);
      })
      const token = localStorage.getItem("token");
      if(token) {
        this.api.getRate(token, this.movieId).subscribe( res => {
          if(!Object.keys(res).length) {
            this.rated = "Wystapił błąd przy pobieraniu oceny."
          } else if(res["rate"] !== 0) {
            this.rate = res["rate"];
            (<HTMLInputElement>document.getElementById("star-"+this.rate)).checked = true;
            this.rated = "Twoja ocena: " + this.rate +"/5"
          } else {
            this.rated = "Nie oceniłeś jeszcze tego filmu."
          }
        })
      }
    });
  }

  selectRate(rate) {
    const token = localStorage.getItem("token");
    //spam prevention
    if (this.rate == rate)
      return;
    let prev_rate = this.rate;
    this.rate = rate;
    if(token) {
      const data = {
        imdbId: this.movieId,
        rate: rate
      }
      this.api.sendRate(token, data).subscribe( res => {
        if(res["rated"]) {
          this.rated = "Dziękujemy za ocenę.";
        } else if (res["secs"]) {
          this.rate = prev_rate;
          (<HTMLInputElement>document.getElementById("star-"+this.rate)).checked = true;
          this.rated = "Za szybko! Poczekaj ";
          if (res["secs"] === 0)
            this.rated += "chwileczkę."
          else if (res["secs"] === 1)
            this.rated += "sekundkę.";
          else if (res["secs"] === 5)
            this.rated += "5 sekund.";
          else
            this.rated += res["secs"] + " sekundy.";
        } else {
          this.rated = "Wystapił błąd przy wysyłaniu oceny.";
        }
      });
    }
  }
}
