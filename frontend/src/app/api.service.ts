import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseURL;

  constructor(private http: HttpClient) {
    this.baseURL = "http://localhost:5000";
  }

  public login(username: string, password: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    return this.http.post<string>(this.baseURL + "/login", { username, password }, httpOptions)
  }

  public logout(token) {
    const httpOptions = {
      headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': token
        })
      };
      return this.http.get(this.baseURL + "/logout", httpOptions)
  }

  public register(data) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    return this.http.post<string>(this.baseURL + "/register", data, httpOptions)
  }

  public status(token) {
    const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': token
      })
    };
    return this.http.get(this.baseURL + "/status", httpOptions)
  }

  public search(token, phrase) {
    const httpOptions = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': token
        });
    const httpParams = new HttpParams().set("title", phrase)
    return this.http.get(this.baseURL + "/search", {headers: httpOptions, params: httpParams})
  }

  public refresh(token) {
    const httpOptions = {
      headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': token
        })
      };
    return this.http.get(this.baseURL + "/refresh", httpOptions)
  }

  public sendRate(token, data) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': token
      })
    };
    return this.http.post<string>(this.baseURL + "/rate", data, httpOptions)
  }

  public getRate(token, movieId) {
    const httpOptions = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token
    });
    const httpParams = new HttpParams().set("movieId", movieId);
    return this.http.get(this.baseURL + "/rate", {headers: httpOptions, params: httpParams})
  }

  public getMyRates(token) {
    const httpOptions = {
      headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': token
        })
      };
    return this.http.get(this.baseURL + "/rates", httpOptions);
  }

  public getTops(token, limit='10') {
    const httpOptions = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token
    });
    const httpParams = new HttpParams().set("limit", limit);
    return this.http.get(this.baseURL + "/tops", {headers: httpOptions, params: httpParams})
  }

  public getRecommendations(token) {
    const httpOptions = {
      headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': token
        })
      };
    return this.http.get(this.baseURL + "/recomendations", httpOptions);
  }
}
