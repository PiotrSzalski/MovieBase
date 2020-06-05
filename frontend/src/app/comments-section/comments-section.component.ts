import {Component, Input, OnInit} from '@angular/core';
import {ApiService} from '../api.service';
import {Comment} from '../models/Comment';

@Component({
  selector: 'app-comments-section',
  templateUrl: './comments-section.component.html',
  styleUrls: ['./comments-section.component.scss']
})
export class CommentsSectionComponent implements OnInit {
  @Input() movieId: string;
  private page = 1;  // current page
  private pages = 1; // number of pages
  public comments: Array<Comment> = new Array<Comment>();
  constructor(private api: ApiService) { }

  ngOnInit() {
    this.getComments();
  }

  comment() {
    const token = localStorage.getItem('token');
    const commentBody = (<HTMLInputElement> document.getElementById('comment_input'));
    if (token && commentBody.value !== '') {
      const data = {
        body: commentBody.value,
        movieId: this.movieId
      };
      this.api.sendComment(token, data).subscribe(res => {
        if (res['commented']) {
          window.location.reload();
        }

      });
    }
  }

  private getComments(page = 1) {
    const token = localStorage.getItem('token');
    this.comments.length = 0;
    this.api.getComments(token, this.movieId, this.page).subscribe(res => {
      this.pages = Object.values(res)[2];
      this.page = Object.values(res)[1];
      const comments = Object.values(res)[0];
      comments.forEach(c => {
        this.comments.push(Object.assign(new Comment(), c));
      });
    });

  }


}
