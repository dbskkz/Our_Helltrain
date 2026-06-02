import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiTestService {

  constructor(private http: HttpClient) { }

  private apiUrl = 'http://localhost:8080/user';

  // 登入
  login(email: string, password: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/login?email=${email}&password=${password}`);
  }
}
