import { Component, OnInit } from '@angular/core';
import {ImbdMovie} from '../models/ImbdMovie';
import {ImbdService} from '../services/imdb.api.service';
import {ApiService} from '../api.service';

@Component({
  selector: 'app-my-ratings-page',
  templateUrl: './my-ratings-page.component.html',
  styleUrls: ['./my-ratings-page.component.scss']
})
export class MyRatingsPageComponent implements OnInit {

  private error: string;
  private moviesIDs: Array<string> = new Array<string>();
  private moviesRatings: Array<number> = new Array<number>();
  public moviesFound: Array<ImbdMovie> = new Array<ImbdMovie>();
  public smallRatingsStarsStyle = {
    'font-size': "12px",
    'padding': "3px"
  };
  constructor(private api: ApiService, private imbdService: ImbdService) { }
  ngOnInit(): void {
      this.getMyRates();
  }

  private getMyRates() {
    const token = localStorage.getItem('token');
    this.api.getMyRates(token).subscribe((res) => {
      const myRates = JSON.parse(Object.values(res)[0]);
      if (myRates.length > 0) {
          this.error = '';
          myRates.forEach(value => {
            this.moviesIDs.push(value.imdbID as string);
            this.moviesRatings.push(value.rate as number);
          });
          this.getDataFromImdbApi();
        } else {
          this.error = 'Nie znaleziono żadnych tytułów ;('
        }
    });
  }

  private getDataFromImdbApi() {
    this.moviesFound = new Array<ImbdMovie>();
    this.moviesIDs.forEach(id => {
      this.imbdService.getMovie(id).subscribe(res =>
        this.moviesFound.push(Object.assign(new ImbdMovie(), res))
      );
    });
    console.log(this.moviesFound[0]);
    console.log(this.moviesFound.length);
  }

}
