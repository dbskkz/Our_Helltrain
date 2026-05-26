import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EduApiGovService {

  // 此為實驗用 Service ， 要使用正式 API ，請左轉 school-data.service !
  // 實驗結果於 foreground-test component

  constructor(
    private http :HttpClient
  ) { }

  getData(): Observable<any> {
    return this.http.get(
      'https://stats.moe.gov.tw/files/opendata/sdata.json'
    );
  }
}
