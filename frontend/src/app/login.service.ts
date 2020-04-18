import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private subject = new Subject<any>();

  constructor() { }

  sendLoggedUser(user: string) {
    this.subject.next(user);
  }

  getLoggedUser(): Observable<any>{ 
    return this.subject.asObservable();
  }
}
