import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';
import { BasicResponse, SetInfoVo, UserReq, UserRes } from '../@Interface/user';
interface LoginReq {
  email: string;
  password: string;
}


@Injectable({ providedIn: 'root' })
export class UserService {

  //預設頭像
  avatarUrl = signal<string>('/img/頭像範例.png');
  private myProxyUrl = '/user';

  private apiUrl = 'http://localhost:8080/user';
  isLoggedIn = signal<boolean>(sessionStorage.getItem('isLoggedIn') === 'true'); // Demo 暫用

  // 存使用者資料的 Signal by.絲絨
  currentUser = signal<any>(null);

  constructor(private http: HttpClient) {
    // 💡 補上這段防禦：網頁一打開，如果發現有 userId，就自動去後端撈資料來補滿電台！
    const savedUserId = localStorage.getItem('userId');
    if (savedUserId) {
      this.getUserData(Number(savedUserId)).subscribe({
        next: (res) => {
          if (res && res.user) {
            this.currentUser.set(res.user); // 補滿電台，這樣重整網頁王明也不會消失！
            this.updateAvatar(res.user.imgPath);
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
    return this.http.post(`${this.apiUrl}/login`, data,).pipe(
      map((res: any) => {
        //  只要不是 200，就直接 Throw Error！
        if (!res || res.statusCode !== 200) { throw res; }
        return res;
      })
    );
  }

  // 取得使用者資料 by.絲絨
  getUserData(userId: number): Observable<any> {
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

  //註冊
  register(data: UserReq): Observable<BasicResponse> {
    return this.http.post<BasicResponse>(`${this.apiUrl}/insert`, data);
  }

  //使用者輸入驗證碼後按下發送所需要街的資料回傳API(初次及後續驗證皆是這個)
  verifyEmail(payload: { email: string; code: string }): Observable<BasicResponse> {
    return this.http.post<BasicResponse>(`${this.apiUrl}/verify`, payload);
  }

  //重新發送驗證碼
  resendCode(email: string): Observable<BasicResponse> {
    return this.http.post<BasicResponse>(`${this.apiUrl}/resend`, { user_email: email });
  }

  // 取得單一使用者資料
  // getUserData(userId: number): Observable<UserRes> {
  //   const params = new HttpParams().set('userId', userId.toString());
  //   return this.http.get<UserRes>(`${this.apiUrl}/getByUserId`, { params });
  // }

  //修改個人資料
  updateProfile(vo: SetInfoVo): Observable<BasicResponse> {
    const formData = new FormData();

    formData.append('name', vo.name);
    formData.append('school', vo.school);
    if (vo.department && vo.department.trim() !== '') {
      formData.append('department', vo.department);
    }
    if (vo.phone && vo.phone.trim() !== '') {
      formData.append('phone', vo.phone);
    }
    if (vo.msg && vo.msg.trim() !== '') {
      formData.append('msg', vo.msg);
    }
    formData.append('deleteImg', vo.deleteImg.toString());

    // 2. 處理地區陣列 (後端接收 List<String> location)
    vo.location.forEach(area => {
      formData.append('location', area);
    });

    // 3. 處理圖片檔案
    if (vo.img) {
      formData.append('img', vo.img);
    }

    // 發送給後端 (記得 withCredentials: true 才能帶 Session Cookie 喔！)
    return this.http.post<BasicResponse>(`${this.myProxyUrl}/setInfo`, formData, {
      withCredentials: true
    });
  }
}
