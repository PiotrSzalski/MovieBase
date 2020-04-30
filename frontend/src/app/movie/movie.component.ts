import { Component, OnInit, Input } from '@angular/core';
import { ImbdMovie } from '../models/ImbdMovie';

@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.scss']
})
export class MovieComponent implements OnInit {
  
  @Input() movie:ImbdMovie;
  
  constructor() {}
  ngOnInit() {}

}
