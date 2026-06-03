import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { BasicResponse, SetInfoVo, UserReq, UserRes } from '../@Interface/user';


@Injectable({ providedIn: 'root' })
export class UserService {

  //預設頭像
  avatarUrl = signal<string>('/img/頭像範例.png');
  private myProxyUrl = '/user';

  private apiUrl = 'http://localhost:8080/user';
  isLoggedIn = signal<boolean>(sessionStorage.getItem('isLoggedIn') === 'true'); // Demo 暫用

  constructor(private http: HttpClient) { }

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

  // 登入by.絲絨
  login(email: string, password: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/login?email=${email}&password=${password}`);
  }

  logout() {
    return this.http.get(
      `${this.apiUrl}/logout`,
      { withCredentials: true }
    ).subscribe({
      complete: () => {
        this.isLoggedIn.set(false);
        sessionStorage.removeItem('isLoggedIn');
      }
    });
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

//取得單一使用者資料
getUserData(userId: number): Observable<UserRes> {
    const params = new HttpParams().set('userId', userId.toString());
    return this.http.get<UserRes>(`${this.apiUrl}/getByUserId`, { params });
}

//修改個人資料
updateProfile(vo: SetInfoVo): Observable<BasicResponse> {
  const formData = new FormData();

  formData.append('name',vo.name);
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
