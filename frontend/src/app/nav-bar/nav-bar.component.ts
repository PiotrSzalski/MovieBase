import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service'
import { Router } from '@angular/router';
import { LoginService } from '../login.service'
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  private logged: boolean
  private user: string
  private loginSubscription: Subscription;

  constructor(private api: ApiService, private router: Router, private loginService: LoginService) { 
    this.logged = false;
    this.user = "";
    this.loginSubscription = this.loginService.getLoggedUser().subscribe((user)=>{
      this.setLoggedUser(user);
    })
  }

  ngOnInit() {
    const token = localStorage.getItem('token');
    if(token !== null) {
      this.api.status(token).subscribe( res => {
        if(res['logged']) {
          this.logged = true;
          this.user = res['user'];
        } else {
          this.logged = false;
          this.user = '';
          localStorage.removeItem('token');
        }
      });
    }
  }
  
  setLoggedUser(user) {
    this.logged = true;
    this.user = user;
  }

  login() {
    this.router.navigate(['/login']);
  }

  logout() {
    const token = localStorage.getItem('token');
    if(this.logged && token !== null) {
      this.api.logout(token).subscribe( res => {
        if(res['logged_out']) {
          this.logged = false;
          this.user = '';
          localStorage.removeItem('token');
          this.router.navigate(['/']);
        }
      });
    }
  }

  propositions() {
    if(this.logged) {
      this.router.navigate(['/propositions']);
    } else {
      this.router.navigate(['/login']);
    }
  }

}
