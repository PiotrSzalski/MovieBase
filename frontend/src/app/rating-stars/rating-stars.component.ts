import {Component, Input, OnInit} from '@angular/core';
import {ImbdService} from "../services/imdb.api.service";
import {ApiService} from "../api.service";

@Component({
  selector: 'app-rating-stars',
  templateUrl: './rating-stars.component.html',
  styleUrls: ['./rating-stars.component.scss']
})
export class RatingStarsComponent implements OnInit {
  @Input() rate: number;
  @Input() movieId: string;
  @Input() customStyle: {};

  private rated: string;

  constructor(private imbdService: ImbdService, private api: ApiService) { }

  ngOnInit() {
  }

  selectRate(rate) {
    const token = localStorage.getItem("token");
    //spam prevention
    if (this.rate == rate)
      return;
    let prev_rate = this.rate;
    this.rate = rate;
    console.log("RATE SENT",rate,this.movieId)
    if(token) {
      const data = {
        imdbId: this.movieId.slice(2),
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
