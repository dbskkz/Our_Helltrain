import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EduApiGovService {

  constructor(
    private http :HttpClient
  ) { }

  getData(): Observable<any> {
    return this.http.get(
      'https://stats.moe.gov.tw/files/opendata/sdata.json'
    );
  }
}
