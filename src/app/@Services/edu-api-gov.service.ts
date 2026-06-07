import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EduApiGovService {
  private url = '/moe-api/files/opendata/u1_new.json';

  constructor(private http: HttpClient) {}

  getSchools(): Observable<any[]> {
    return this.http.get<any[]>(this.url);
  }


  // loadSchool(schools: any[]){
  //   this.getSchools().subscribe({
  //     next: (data) => {
  //       schools.push(...data);
  //     },
  //     error: (err) => {
  //       console.error('無法載入學校資料：', err);
  //     }
  //   });
  // }
}
