import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ProductCard } from '../@Interface/product-card';
import { map, Observable } from 'rxjs';


// 對應後端 SearchProductReq
export interface SearchProductReq {
  keyword?: string;
  minPrice?: number;
  maxPrice?: number;
  types?: string[];
  grade?: string;
}

// 對應後端 GetProductDataRes（你要確認後端實際欄位名稱）
export interface GetProductDataRes {
  statusCode:number,
  message:string,
  productList: ProductCard[];
}


@Injectable({
  providedIn: 'root'
})
export class ProductServiceService {

  private readonly BASE = 'http://localhost:8080/product';

  constructor(private http:HttpClient) { }

  // search(req: SearchProductReq): Observable<GetProductDataRes> {
  //   return this.http.post<any>(`${this.BASE}/search`, req).pipe(
  //     map(res => res.products.map((p: any) => ({
  //       // 後端欄位 → 前端欄位， 後端沒有就先留空  title:    p.productName,
  //       productId: p.productId,
  //       userId: p.userId,
  //       title: p.productName || '未命名商品',
  //       description: p.description,
  //       price: p.price || 0,
  //       type: p.type || [],
  //       time: p.shelfDate || '',
  //       condition: p.productCondition || '未知',
  //       // 防呆：如果後端 imgPath 是空的或不是陣列，給它一張預設圖
  //       imgUrl: (p.imgPath && p.imgPath.length > 0)
  //         ? p.imgPath[0]
  //         : 'https://www.townlinepaint.com/cdn/shop/products/B6B4B2.png?v=1646778952&width=1200/default.jpg',
  //       // 防呆：如果後端 location 是空的，給個預設字串或陣列
  //       status: p.status,
  //       grade: p.grade,
  //       location: (p.location && p.location.length > 0) ? p.location : '未知地點',
  //       deptGroup: p.deptGroup,
  //       // 補上前端元件需要的 user 欄位
  //       user: {
  //         userName: '李吉娃娃',
  //         userImg: 'https://www.townlinepaint.com/cdn/shop/products/B6B4B2.png?v=1646778952&width=1200/default.jpg',
  //         university: '清華大學',
  //         department: '生科系',
  //         location: '高雄'
  //       }

  //     })))
  //   );
  // }
  search(req: SearchProductReq): Observable<GetProductDataRes> {
  return this.http.post<any>(`${this.BASE}/search`, req).pipe(
    map(res => {

      const rawList = res?.productList || [];

      const mappedList = rawList.map((p: any) => ({
        productId: p.productId,
        userId: p.userId,
        title: p.productName || '未命名商品',
        description: p.description,
        price: p.price || 0,
        type: p.type || [],
        time: p.shelfDate || '',
        condition: p.productCondition || '未知',

        imgUrl:
          p.imgPath && p.imgPath.length > 0
            ? p.imgPath[0]
            : 'https://www.townlinepaint.com/cdn/shop/products/B6B4B2.png?v=1646778952&width=1200/default.jpg',

        status: p.status,
        grade: p.grade,
        location:
          p.location && p.location.length > 0
            ? p.location
            : '未知地點',

        deptGroup: p.deptGroup,

        user: {
          userName: '李吉娃娃',
          userImg:
            'https://www.townlinepaint.com/cdn/shop/products/B6B4B2.png?v=1646778952&width=1200/default.jpg',
          university: '國立清華大學',
          department: '生科系',
          location: '高雄'
        }
      }));

      return {
        statusCode: res?.statusCode || 200,
        message: res?.message || 'Success',
        productList: mappedList
      };
    })
  );
}

 getAll(): Observable<GetProductDataRes> {
  // 1. 將 get<GetProductDataRes> 改為 get<any>，這樣 map 才能自由轉換結構
  return this.http.get<any>(`${this.BASE}/getInfo`).pipe(
    map(res => {
      // 安全檢查：確保後端有回傳 productList，沒有的話就給空陣列
      const rawList = res?.productList || [];

      const mappedList = rawList.map((p: any) => ({
        productId: p.productId,
        userId: p.userId,
        title: p.productName || '未命名商品',
        description: p.description,
        price: p.price || 0,
        type: p.type || [],
        time: p.shelfDate || '',
        condition: p.productCondition || '未知',
        // 防呆：如果後端 imgPath 是空的或不是陣列，給它一張預設圖
        imgUrl: (p.imgPath && p.imgPath.length > 0)
          ? p.imgPath[0]
          : 'https://www.townlinepaint.com/cdn/shop/products/B6B4B2.png?v=1646778952&width=1200/default.jpg',
        // 防呆：如果後端 location 是空的，給個預設字串或陣列
        status: p.status,
        grade: p.grade,
        location: (p.location && p.location.length > 0) ? p.location : '未知地點',
        deptGroup: p.deptGroup,
        // 補上前端元件需要的 user 欄位
        user: {
          userName: '李吉娃娃',
          userImg: 'https://www.townlinepaint.com/cdn/shop/products/B6B4B2.png?v=1646778952&width=1200/default.jpg',
          university: '國立清華大學',
          department: '生科系',
          location: '高雄'
        }
      }));

      // 回傳符合 GetProductDataRes 介面的格式
      return {
        statusCode: res?.statusCode || 200,
        message: res?.message || 'Success',
        productList: mappedList
      };

    }) // The end of outer map
  );
}

searchByType(type:string): Observable<GetProductDataRes> {
  // 後端用@RequestParam --> 前端用 HttpParam --> 建立HttpParam物件
  // const param = new HttpParams; 錯1: 不完整
  // const param = new HttpParams().set('type', type); 錯2: param要加s
  const params = new HttpParams().set('type', type);

  // 發送GET請求，記得網址帶Httpparam變數
  // return get<any>
  return this.http.get<any>(`${this.BASE}/search/type`, {params}).pipe(
    map(res => {
      // 檢查是否有ProductList，若無則給他空陣列，有則Map
      // const rawList = res.productList || [];
      const rawList = res?.productList || [];

      const mappedList = rawList.map((p:any) => ({
        productId: p.productId,
        userId: p.userId,
        title: p.productName || '未命名商品',
        description: p.description,
        price: p.price || 0,
        type: p.type || [],
        time: p.shelfDate || '',
        condition: p.productCondition || '未知',
        // 防呆：如果後端 imgPath 是空的或不是陣列，給它一張預設圖
        imgUrl: (p.imgPath && p.imgPath.length > 0)
          ? p.imgPath[0]
          : 'https://www.townlinepaint.com/cdn/shop/products/B6B4B2.png?v=1646778952&width=1200/default.jpg',
        // 防呆：如果後端 location 是空的，給個預設字串或陣列
        status: p.status,
        grade: p.grade,
        location: (p.location && p.location.length > 0) ? p.location : '未知地點',
        deptGroup: p.deptGroup,
        // 補上前端元件需要的 user 欄位
        user: {
          userName: '李吉娃娃',
          userImg: 'https://www.townlinepaint.com/cdn/shop/products/B6B4B2.png?v=1646778952&width=1200/default.jpg',
          university: '國立清華大學',
          department: '生科系',
          location: '高雄'
        }
      })) // the end of inner map

      return {
        statusCode: res?.statusCode || 418,
        message: res?.message || "為甚麼要演奏春日影",
        productList: mappedList
      };

    }) // The end of outer map

  )
  // 完成回符合GetProductDataRes 介面的回傳

}


}
