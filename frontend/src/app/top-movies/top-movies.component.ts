import { Component, OnInit } from '@angular/core';
import { ImbdMovie } from '../models/ImbdMovie';
import { ApiService } from '../api.service';
import { ImbdService } from '../services/imdb.api.service';

@Component({
  selector: 'app-top-movies',
  templateUrl: './top-movies.component.html',
  styleUrls: ['./top-movies.component.scss']
})
export class TopMoviesComponent implements OnInit {

  private error: string;
  private moviesIDs: Array<string> = new Array<string>();
  private moviesRatings: Array<number> = new Array<number>();
  
  public moviesTop: Array<ImbdMovie> = new Array<ImbdMovie>();
  public smallRatingsStarsStyle = {
    'font-size': "12px",
    'padding': "3px"
  };
  
  constructor(private api: ApiService, private imbdService: ImbdService) { }
  ngOnInit(): void {
      this.getTops();
  }

  private getTops() {
    const token = localStorage.getItem('token');
    this.api.getTops(token).subscribe((res) => {
      const tops = JSON.parse(Object.values(res)[0]);
      if (tops.length > 0) {
          console.log(res);
          this.error = '';
          tops.forEach(value => {
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
    this.moviesTop = new Array<ImbdMovie>();
    this.moviesIDs.forEach(id => {
      this.imbdService.getMovie(id).subscribe(res =>
        this.moviesTop.push(Object.assign(new ImbdMovie(), res))
      );
    });
  }
}
