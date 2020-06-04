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

  private getComments() {
    const token = localStorage.getItem('token');
    this.api.getComments(token, this.movieId).subscribe(res => {
      const comments = Object.values(res)[0];
      comments.forEach(c => {
        this.comments.push(Object.assign(new Comment(), c));
      });
    });
  }


}
