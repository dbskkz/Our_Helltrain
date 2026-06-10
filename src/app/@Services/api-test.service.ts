import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, map } from 'rxjs';
import { GetProductDataRes } from '../@Interface/product-vo';


// interface LoginReq {
//   email: string;
//   password: string;
// }

interface reportReq { }

@Injectable({
  providedIn: 'root'
})
export class ApiTestService {

  constructor(private http: HttpClient) { }

  // // 存使用者資料的 Signal
  // currentUser = signal<any>(null);
  private productApiUrl = 'http://localhost:8080/product';
  private reportApiUrl = 'http://localhost:8080/report';
  private orderApiUrl = 'http://localhost:8080/order';

  // // 登入
  // login(data: LoginReq): Observable<any> {
  //   return this.http.post(`${this.apiUrl}/login`, data).pipe(
  //     map((res: any) => {
  //       //  只要不是 200，就直接 Throw Error！
  //       if (!res || res.statusCode !== 200) { throw res; }
  //       return res;
  //     })
  //   );
  // }

  // // 取得使用者資料
  // getUserData(userId: string): Observable<any> {
  //   // 目前 Demo 階段：把 ID 帶在網址後面傳給後端
  //   return this.http.get(`${this.apiUrl}/getByUserId?userId=${userId}`);
  // }

  // 取得單一帳號內的商品資訊
  searchBySellerId(userId: number): Observable<any> {
    return this.http.get(`${this.productApiUrl}/search/userId?userId=${userId}`);
  }

  // 新增檢舉
  addReport(data: reportReq) { return this.http.post(`${this.reportApiUrl}/addReport`, data, { withCredentials: true }); }

  // === Order ===
  //取得使用者的所有訂單
  getAllOrder(): Observable<any> { return this.http.get(`${this.orderApiUrl}/getUserOrder`, { withCredentials: true }); }

  // 賣家同意請求
  acceptOrder(changeOrderStatusVo: any) {
    return this.http.post(`${this.orderApiUrl}/acceptOrder`, changeOrderStatusVo, { withCredentials: true });
  }

  // 買家主動取消訂單
  canaelOrder(changeOrderStatusVo: any) {
    return this.http.post(`${this.orderApiUrl}/canaelOrder`, changeOrderStatusVo, { withCredentials: true });
  }

  //雙方點擊確認完成交易
  checkDelivery(changeOrderStatusVo: any) {
    return this.http.post(`${this.orderApiUrl}/delivery`, changeOrderStatusVo, { withCredentials: true });
  }

  //交易雙方給予評價
  giveLevel(goodLevelReq: any) {
    return this.http.post(`${this.orderApiUrl}/giveLevel`, goodLevelReq, { withCredentials: true });
  }

  //單一商品詳情
  searchByProductId(productId: number): Observable<GetProductDataRes> {
    return this.http.get<GetProductDataRes>(`${this.productApiUrl}/search/productId?productId=${productId}`);
  }
}
