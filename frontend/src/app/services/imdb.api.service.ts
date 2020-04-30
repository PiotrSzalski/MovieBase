import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class ImbdService {

    private baseURL;
    private apiKey;
    private httpOptions;

    constructor(private http: HttpClient) {
        this.baseURL = 'http://www.omdbapi.com/';
        this.apiKey = '35c93c49';
    }
    public getMovie(id: string) {
        id = 'tt' + id;
        const httpParams = new HttpParams().set("apikey", this.apiKey).set("i", id);
        return this.http.get(this.baseURL, {params: httpParams });
    }
}