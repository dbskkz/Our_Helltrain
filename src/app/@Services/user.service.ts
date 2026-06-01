import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {

  //預設頭像
  avatarUrl = signal<string>('/img/頭像範例.png');

  private apiUrl = 'http://localhost:8080/user';
  isLoggedIn = signal<boolean>(localStorage.getItem('isLoggedIn') === 'true'); // Demo 暫用

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
          localStorage.setItem('isLoggedIn', 'true'); // Demo 暫用
        }
      })
    );
  }

  logout() {
    this.isLoggedIn.set(false);
    localStorage.removeItem('isLoggedIn'); // Demo 暫用
  }

/** 頭像同步變更廣播
 * 使用方法
 * TS 注入: constructor(public userService: UserService) {}
 * HTML 綁定: <img [src]="userService.avatarUrl()" alt="使用者大頭貼">
 */
  updateAvatar(newUrl: string) {
    this.avatarUrl.set(newUrl);
  }


}
