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
    this.rate = rate;
    if(token) {
      const data = {
        imdbId: this.movieId.slice(2),
        rate: rate
      }
      this.api.sendRate(token, data).subscribe( res => {
        if(res["rated"]) {
          this.rated = 'Dziękujemy za zmianę oceny.';
        } else {
          this.rated = 'Wystapił błąd przy zmianie oceny.';
        }
      });
    }
  }

}
