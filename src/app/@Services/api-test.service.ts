import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, map } from 'rxjs';

interface LoginReq {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiTestService {

  constructor(private http: HttpClient) { }

  // 存使用者資料的 Signal
  currentUser = signal<any>(null);
  private apiUrl = 'http://localhost:8080/user';

  // 登入
  login(data: LoginReq): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, data).pipe(
      map((res: any) => {
        //  只要不是 200，就直接 Throw Error！
        if (!res || res.statusCode !== 200) { throw res; }
        return res;
      })
    );
  }

  // 取得使用者資料
  getUserData(userId: string): Observable<any> {
    // 目前 Demo 階段：把 ID 帶在網址後面傳給後端
    return this.http.get(`${this.apiUrl}/getByUserId?userId=${userId}`);
  }
  /* 💡 未來的 Token 寫法（留給以後的你）：
     以後引進 Token 攔截器後，這行程式碼可以直接變成：
     return this.http.get(`${this.apiUrl}/profile`);
     完全不用帶 userId，後端看 Token 就知道是誰。Component 端完全不用改！
  */

}
