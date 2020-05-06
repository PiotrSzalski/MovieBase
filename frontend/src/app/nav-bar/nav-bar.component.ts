import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service'
import { Router } from '@angular/router';
import { LoginService } from '../login.service'
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {

  private logged: boolean
  private user: string
  private loginSubscription: Subscription;
  private interval;
  private tokenExpirationTime = 900000;



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
          this.refresh();
          this.interval = setInterval(() => {
            this.refresh();
            }, this.tokenExpirationTime);
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
    this.interval = setInterval(() => {
      this.refresh();
      }, this.tokenExpirationTime);
  }

  refresh() {
    const token = localStorage.getItem('token');
    this.api.refresh(token).subscribe( res => {
      if(Object.keys(res).length) {
        localStorage.setItem("token", res["token"])
      } else {
        clearInterval(this.interval);
        this.logged = false;
        this.user = '';
        localStorage.removeItem('token');
        this.router.navigate(['/']);
      }
    })
  }

  login() {
    this.router.navigate(['/login']);
  }

  logout() {
    const token = localStorage.getItem('token');
    if(this.logged && token !== null) {
      this.api.logout(token).subscribe( res => {
        if(res['logged_out']) {
          clearInterval(this.interval);
          this.logged = false;
          this.user = '';
          localStorage.removeItem('token');
          this.router.navigate(['/']);
        }
      });
    }
  }

  search() {
    if(this.logged) {
      this.router.navigate(['/search']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  propositions() {
    if(this.logged) {
      this.router.navigate(['/propositions']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  rates() {
    if(this.logged) {
      this.router.navigate(['/rates']);
    } else {
      this.router.navigate(['/login']);
    }
  }

}
