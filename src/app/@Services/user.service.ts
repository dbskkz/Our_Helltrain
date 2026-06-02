import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';

interface LoginReq {
  email: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {

  //預設頭像
  avatarUrl = signal<string>('/img/頭像範例.png');

  private apiUrl = 'http://localhost:8080/user';
  isLoggedIn = signal<boolean>(localStorage.getItem('isLoggedIn') === 'true'); // Demo 暫用

  // 存使用者資料的 Signal by.絲絨
  currentUser = signal<any>(null);

  constructor(private http: HttpClient) {
    // 💡 補上這段防禦：網頁一打開，如果發現有 userId，就自動去後端撈資料來補滿電台！
    const savedUserId = localStorage.getItem('userId');
    if (savedUserId) {
      this.getUserData(savedUserId).subscribe({
        next: (res) => {
          if (res && res.user) {
            this.currentUser.set(res.user); // 補滿電台，這樣重整網頁王明也不會消失！
          }
        }
      });
    }
  }

  // login(email: string, password: string) {
  //   const params = new HttpParams()
  //     .set('email', email)
  //     .set('password', password);

  //   return this.http.get<{ statusCode: number; message: string; role: string; data: any }>(
  //     `${this.apiUrl}/login`,
  //     { params, withCredentials: true }
  //   ).pipe(
  //     tap(res => {
  //       if (res.statusCode === 200) {
  //         this.isLoggedIn.set(true);
  //         localStorage.setItem('isLoggedIn', 'true'); // Demo 暫用
  //       }
  //     })
  //   );
  // }

  // 登入 by.絲絨
  login(data: LoginReq): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, data).pipe(
      map((res: any) => {
        //  只要不是 200，就直接 Throw Error！
        if (!res || res.statusCode !== 200) { throw res; }
        return res;
      })
    );
  }

  // 取得使用者資料 by.絲絨
  getUserData(userId: string): Observable<any> {
    // 目前 Demo 階段：把 ID 帶在網址後面傳給後端
    return this.http.get(`${this.apiUrl}/getByUserId?userId=${userId}`);
  }

  logout() {
    this.isLoggedIn.set(false);
    localStorage.removeItem('isLoggedIn'); // Demo 暫用
    localStorage.removeItem('userId'); // Demo 暫用
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
