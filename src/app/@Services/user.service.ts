import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {

  private apiUrl = 'http://localhost:8080/user';
  isLoggedIn = signal<boolean>(sessionStorage.getItem('isLoggedIn') === 'true'); // Demo 暫用

  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    const params = new HttpParams()
      .set('email', email)
      .set('password', password);

    return this.http.get<{ statusCode: number; message: string; role: string; data: any }>(
      `${this.apiUrl}/login`,
      { params, withCredentials: true }
    ).pipe(
      tap(res => {
        if (res.statusCode === 200) {
          this.isLoggedIn.set(true);
          sessionStorage.setItem('isLoggedIn', 'true'); // Demo 暫用
        }
      })
    );
  }

  logout() {
    this.isLoggedIn.set(false);
    sessionStorage.removeItem('isLoggedIn'); // Demo 暫用
  }
}
