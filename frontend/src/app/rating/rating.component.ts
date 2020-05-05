import {Component, Input, OnInit, DoCheck} from '@angular/core';
import {ImbdMovie} from '../models/ImbdMovie';
import {ApiService} from '../api.service';



@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss']
})
export class RatingComponent implements OnInit {

  @Input() movie: ImbdMovie;
  @Input() rating: number;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.getRatingFromDB();
  }

  public handleChange(rating) {
    const token = localStorage.getItem('token');
    const imdbID = this.movie.imdbID;
    this.api.rate(token, rating, imdbID).subscribe(res => {});
    this.rating = rating;
  }

  private getRatingFromDB() {
    const token = localStorage.getItem('token');
    this.rating = 0;
    this.api.get_rate(token, this.movie.imdbID).subscribe(res =>
      this.onRatingLoad(res[0].rating));
  }

  private onRatingLoad(rating) {
    this.rating = rating;
    const inputElement = document.getElementById(this.movie.imdbID + '-' + rating) as HTMLInputElement;
    if (inputElement) {
      inputElement.checked = true;
    }
  }

}
