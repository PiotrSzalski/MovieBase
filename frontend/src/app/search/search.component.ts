import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { ImbdMovie } from '../models/ImbdMovie';
import { ImbdService } from '../services/imdb.api.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {

  private error: string;
  private moviesIDs: Array<string> = new Array<string>();
  public moviesFound: Array<ImbdMovie> = new Array<ImbdMovie>();

  constructor(private api: ApiService, private imbdService: ImbdService) { }

  public search() {
    this.moviesIDs = new Array<string>();
    const phrase = (<HTMLInputElement>document.getElementById("movieSearch")).value;
    const token = localStorage.getItem("token");
    if (phrase === '') {
      this.error = 'Nie podałeś tytułu!'
    } else {
      this.api.search(token, phrase).subscribe(res => {
        const list = Object.values(res);
        if (list.length > 0) {
          this.error = '';
          list.forEach(value => {
            this.moviesIDs.push(value.imdbID as string)
          });
          this.getDataFromImdbApi();
        } else {
          this.error = 'Nie znaleziono żadnych tytułów ;('
        }
      });
    }
  }

  private getDataFromImdbApi() {
    this.moviesFound = new Array<ImbdMovie>();
    this.moviesIDs.forEach(id => {
      this.imbdService.getMovie(id).subscribe(res =>
        this.moviesFound.push(Object.assign(new ImbdMovie(), res))
      );
    });
    console.log(this.moviesFound[0])
    console.log(this.moviesFound.length)
  }
}
