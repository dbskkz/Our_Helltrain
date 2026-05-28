import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }

   //讀取、取得
  getApi<T = any>(url:string, params?: any){
    return this.http.get<T>(url, { params });
  };

  //新增 (也可以刪除、更新)變更資料，postApi蠻長使用到的
  postApi<T = any>(url:string,postData:any){
    return this.http.post<T>(url,postData);
  };

  //更新
  putApi(url:string,putData:any){
    return this.http.put(url,putData);
  };

  //刪除(不一定會使用到)
  delApi(url:string){
    return this.http.delete(url);
  };
}
