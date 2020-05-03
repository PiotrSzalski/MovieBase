import {Component, Input, OnInit} from '@angular/core';
import {ImbdMovie} from '../models/ImbdMovie';
import {ApiService} from "../api.service";


@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss']
})
export class RatingComponent implements OnInit {

  @Input() movie: ImbdMovie;

  constructor(private api: ApiService) { }
  ngOnInit() {

  }

  public getRatingFromServer() {
    const token = localStorage.getItem('token');
    const imdbID = this.movie.imdbID;
    this.api.get_rate(token, imdbID).subscribe( res => {
      console.log(res);
    });
  }

  public handleChange(rating) {
    const token = localStorage.getItem('token');
    const imdbID = this.movie.imdbID;
    this.api.rate(token, rating, imdbID).subscribe(res => {
      console.log(res);
    });
  }


}
