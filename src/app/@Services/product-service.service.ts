import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ProductCard } from '../@Interface/product-card';
import { map, Observable } from 'rxjs';


// 對應後端 SearchProductReq
export interface SearchProductReq {
  keyword?: string;
  minPrice?: number;
  maxPrice?: number;
  types?: string[];     // 後端的 type，例如 ['教科書', '3C電子']
  conditions?: string;    // 後端的 grade
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

  // allProducts: ProductCard[] = [
  //   {
  //     title: '極簡黑後背包',
  //     type: ['服飾配件'],
  //     condition: 'likeNew',
  //     price: 300,
  //     time: '2小時前',
  //     imgUrl: 'assets/bag.jpg',
  //     location: '新竹市',

  //     user: {
  //       userName: '生科吉娃娃甘霖',
  //       userImg: 'assets/avatar.jpg',
  //       university: '清大',
  //       department: '生科系',
  //       location: ['新竹市', '高雄市']
  //     }
  //   },

  //   {
  //     title: '二手 iPad 支架',
  //     type: ['3C電子', '生活用品'],
  //     condition: 'likeNew',
  //     price: 150,
  //     time: '5小時前',
  //     imgUrl: 'assets/ipad-stand.jpg',
  //     location: '台中市',

  //     user: {
  //       userName: '資工小海豹',
  //       userImg: 'assets/avatar2.jpg',
  //       university: '逢甲',
  //       department: '資工系',
  //       location: ['台中市']
  //     }
  //   },

  //   {
  //     title: '日系奶茶色帆布袋',
  //     type: ['服飾配件'],
  //     condition: 'likeNew',
  //     price: 220,
  //     time: '1天前',
  //     imgUrl: 'assets/bag2.jpg',
  //     location: '台北市',

  //     user: {
  //       userName: '企管水豚',
  //       userImg: 'assets/avatar3.jpg',
  //       university: '政大',
  //       department: '企管系',
  //       location: ['台北市', '桃園縣']
  //     }
  //   },

  //   {
  //     title: '羅技無線滑鼠',
  //     type: ['3C電子'],
  //     condition: 'likeNew',
  //     price: 450,
  //     time: '3小時前',
  //     imgUrl: 'assets/mouse.jpg',
  //     location: '高雄市',

  //     user: {
  //       userName: '電機企鵝',
  //       userImg: 'assets/avatar4.jpg',
  //       university: '中山',
  //       department: '電機系',
  //       location: ['高雄市']
  //     }
  //   },

  //   {
  //     title: '微積分課本',
  //     type: ['教科書'],
  //     condition: 'likeNew',
  //     price: 180,
  //     time: '2天前',
  //     imgUrl: 'assets/book.jpg',
  //     location: '台南市',

  //     user: {
  //       userName: '數學狐狸',
  //       userImg: 'assets/avatar5.jpg',
  //       university: '成大',
  //       department: '數學系',
  //       location: ['台南市']
  //     }
  //   },

  //   {
  //     title: '木質藍牙音響',
  //     type: ['3C電子', '生活用品'],
  //     condition: 'likeNew',
  //     price: 680,
  //     time: '4小時前',
  //     imgUrl: 'assets/speaker.jpg',
  //     location: '新竹市',

  //     user: {
  //       userName: '設計小鹿',
  //       userImg: 'assets/avatar6.jpg',
  //       university: '交大',
  //       department: '工設系',
  //       location: ['新竹市', '台北市']
  //     }
  //   },

  //   {
  //     title: '韓系白色桌燈',
  //     type: ['家具家電', '生活用品'],
  //     condition: 'likeNew',
  //     price: 350,
  //     time: '6小時前',
  //     imgUrl: 'assets/lamp.jpg',
  //     location: '嘉義市',

  //     user: {
  //       userName: '中文柴犬',
  //       userImg: 'assets/avatar7.jpg',
  //       university: '中正',
  //       department: '中文系',
  //       location: ['嘉義市']
  //     }
  //   },

  //   {
  //     title: 'UNIQLO 連帽外套',
  //     type: ['服飾配件'],
  //     condition: 'likeNew',
  //     price: 500,
  //     time: '1天前',
  //     imgUrl: 'assets/hoodie.jpg',
  //     location: '桃園縣',

  //     user: {
  //       userName: '歷史貓咪',
  //       userImg: 'assets/avatar8.jpg',
  //       university: '中央',
  //       department: '歷史系',
  //       location: ['桃園縣']
  //     }
  //   },

  //   {
  //     title: '機械鍵盤',
  //     type: ['3C電子'],
  //     condition: 'likeNew',
  //     price: 1200,
  //     time: '8小時前',
  //     imgUrl: 'assets/keyboard.jpg',
  //     location: '高雄市',

  //     user: {
  //       userName: '資安鸚鵡',
  //       userImg: 'assets/avatar9.jpg',
  //       university: '高科大',
  //       department: '資安系',
  //       location: ['高雄市', '屏東縣']
  //     }
  //   },

  //   {
  //     title: '無印風收納盒',
  //     type: ['生活用品'],
  //     condition: 'likeNew',
  //     price: 90,
  //     time: '30分鐘前',
  //     imgUrl: 'assets/storage.jpg',
  //     location: '台北市',

  //     user: {
  //       userName: '心理倉鼠',
  //       userImg: 'assets/avatar10.jpg',
  //       university: '台大',
  //       department: '心理系',
  //       location: ['台北市']
  //     }
  //   },

  //   {
  //     title: 'Canon 相機腳架',
  //     type: ['專業器材', '3C電子'],
  //     condition: 'likeNew',
  //     price: 750,
  //     time: '3天前',
  //     imgUrl: 'assets/tripod.jpg',
  //     location: '宜蘭縣',

  //     user: {
  //       userName: '傳播海豚',
  //       userImg: 'assets/avatar11.jpg',
  //       university: '世新',
  //       department: '傳播系',
  //       location: ['宜蘭縣', '台北市']
  //     }
  //   },

  //   {
  //     title: 'AirPods 保護殼',
  //     type: ['3C電子', '服飾配件'],
  //     condition: 'likeNew',
  //     price: 120,
  //     time: '5天前',
  //     imgUrl: 'assets/case.jpg',
  //     location: '彰化縣',

  //     user: {
  //       userName: '法律松鼠',
  //       userImg: 'assets/avatar12.jpg',
  //       university: '東海',
  //       department: '法律系',
  //       location: ['彰化縣']
  //     }
  //   },

  //   {
  //     title: '小米行動電源',
  //     type: ['3C電子'],
  //     condition: 'likeNew',
  //     price: 400,
  //     time: '7小時前',
  //     imgUrl: 'assets/powerbank.jpg',
  //     location: '台中市',

  //     user: {
  //       userName: '物理狼犬',
  //       userImg: 'assets/avatar13.jpg',
  //       university: '中興',
  //       department: '物理系',
  //       location: ['台中市']
  //     }
  //   },

  //   {
  //     title: '可折疊電腦桌',
  //     type: ['家具家電'],
  //     condition: 'likeNew',
  //     price: 900,
  //     time: '2天前',
  //     imgUrl: 'assets/table.jpg',
  //     location: '花蓮縣',

  //     user: {
  //       userName: '地科海獺',
  //       userImg: 'assets/avatar14.jpg',
  //       university: '東華',
  //       department: '地科系',
  //       location: ['花蓮縣']
  //     }
  //   },

  //   {
  //     title: 'CASIO 電子錶',
  //     type: ['服飾配件', '3C電子'],
  //     condition: 'likeNew',
  //     price: 650,
  //     time: '11小時前',
  //     imgUrl: 'assets/watch.jpg',
  //     location: '新北市',

  //     user: {
  //       userName: '哲學兔子',
  //       userImg: 'assets/avatar15.jpg',
  //       university: '輔大',
  //       department: '哲學系',
  //       location: ['新北市']
  //     }
  //   },

  //   {
  //     title: '床邊小推車',
  //     type: ['家具家電', '生活用品'],
  //     condition: 'likeNew',
  //     price: 260,
  //     time: '4天前',
  //     imgUrl: 'assets/cart.jpg',
  //     location: '苗栗縣',

  //     user: {
  //       userName: '化學河馬',
  //       userImg: 'assets/avatar16.jpg',
  //       university: '聯大',
  //       department: '化學系',
  //       location: ['苗栗縣']
  //     }
  //   },

  //   {
  //     title: 'Sony 耳罩耳機',
  //     type: ['3C電子'],
  //     condition: 'likeNew',
  //     price: 1800,
  //     time: '9小時前',
  //     imgUrl: 'assets/headphone.jpg',
  //     location: '台南市',

  //     user: {
  //       userName: '音樂熊貓',
  //       userImg: 'assets/avatar17.jpg',
  //       university: '南藝大',
  //       department: '音樂系',
  //       location: ['台南市']
  //     }
  //   },

  //   {
  //     title: '白色洞洞板',
  //     type: ['生活用品', '家具家電'],
  //     condition: 'likeNew',
  //     price: 140,
  //     time: '1小時前',
  //     imgUrl: 'assets/board.jpg',
  //     location: '基隆市',

  //     user: {
  //       userName: '航管企鵝',
  //       userImg: 'assets/avatar18.jpg',
  //       university: '海大',
  //       department: '航管系',
  //       location: ['基隆市']
  //     }
  //   },

  //   {
  //     title: '日文單字書',
  //     type: ['教科書', '筆記考古'],
  //     condition: 'likeNew',
  //     price: 200,
  //     time: '2天前',
  //     imgUrl: 'assets/japanese-book.jpg',
  //     location: '台北市',

  //     user: {
  //       userName: '日文狐狸',
  //       userImg: 'assets/avatar19.jpg',
  //       university: '淡江',
  //       department: '日文系',
  //       location: ['台北市']
  //     }
  //   },

  //   {
  //     title: '宿舍小冰箱',
  //     type: ['家具家電'],
  //     condition: 'likeNew',
  //     price: 2500,
  //     time: '6天前',
  //     imgUrl: 'assets/fridge.jpg',
  //     location: '高雄市',

  //     user: {
  //       userName: '機械老虎',
  //       userImg: 'assets/avatar20.jpg',
  //       university: '高應大',
  //       department: '機械系',
  //       location: ['高雄市']
  //     }
  //   },

  //   {
  //     title: '藍色瑜珈墊',
  //     type: ['戶外運動'],
  //     condition: 'likeNew',
  //     price: 320,
  //     time: '13小時前',
  //     imgUrl: 'assets/yoga.jpg',
  //     location: '台中市',

  //     user: {
  //       userName: '護理綿羊',
  //       userImg: 'assets/avatar21.jpg',
  //       university: '中國醫',
  //       department: '護理系',
  //       location: ['台中市']
  //     }
  //   },

  //   {
  //     title: '全新保溫杯',
  //     type: ['生活用品', '戶外運動'],
  //     condition: 'likeNew',
  //     price: 280,
  //     time: '7天前',
  //     imgUrl: 'assets/cup.jpg',
  //     location: '屏東縣',

  //     user: {
  //       userName: '海洋章魚',
  //       userImg: 'assets/avatar22.jpg',
  //       university: '屏大',
  //       department: '海洋系',
  //       location: ['屏東縣']
  //     }
  //   },

  //   {
  //     title: '拍立得相機',
  //     type: ['3C電子', '專業器材'],
  //     condition: 'likeNew',
  //     price: 2200,
  //     time: '10小時前',
  //     imgUrl: 'assets/camera.jpg',
  //     location: '新竹市',

  //     user: {
  //       userName: '攝影小貓',
  //       userImg: 'assets/avatar23.jpg',
  //       university: '玄奘',
  //       department: '影傳系',
  //       location: ['新竹市']
  //     }
  //   },

  //   {
  //     title: '桌上型小風扇',
  //     type: ['家具家電', '生活用品'],
  //     condition: 'likeNew',
  //     price: 180,
  //     time: '2小時前',
  //     imgUrl: 'assets/fan.jpg',
  //     location: '雲林縣',

  //     user: {
  //       userName: '農業水獺',
  //       userImg: 'assets/avatar24.jpg',
  //       university: '虎尾',
  //       department: '農業系',
  //       location: ['雲林縣']
  //     }
  //   },

  //   {
  //     title: '黑色長裙',
  //     type: ['服飾配件'],
  //     condition: 'likeNew',
  //     price: 390,
  //     time: '1天前',
  //     imgUrl: 'assets/skirt.jpg',
  //     location: '台北市',

  //     user: {
  //       userName: '社會企鵝',
  //       userImg: 'assets/avatar25.jpg',
  //       university: '師大',
  //       department: '社教系',
  //       location: ['台北市']
  //     }
  //   },

  //   {
  //     title: '繪圖板',
  //     type: ['3C電子', '專業器材'],
  //     condition: 'likeNew',
  //     price: 1600,
  //     time: '3天前',
  //     imgUrl: 'assets/tablet.jpg',
  //     location: '高雄市',

  //     user: {
  //       userName: '動畫狐狸',
  //       userImg: 'assets/avatar26.jpg',
  //       university: '樹德',
  //       department: '動畫系',
  //       location: ['高雄市']
  //     }
  //   },

  //   {
  //     title: '透明資料夾組',
  //     type: ['筆記考古', '生活用品'],
  //     condition: 'likeNew',
  //     price: 60,
  //     time: '5小時前',
  //     imgUrl: 'assets/folder.jpg',
  //     location: '台南市',

  //     user: {
  //       userName: '教育熊熊',
  //       userImg: 'assets/avatar27.jpg',
  //       university: '嘉藥',
  //       department: '教育系',
  //       location: ['台南市']
  //     }
  //   },

  //   {
  //     title: '宿舍閱讀燈',
  //     type: ['家具家電', '生活用品'],
  //     condition: 'likeNew',
  //     price: 210,
  //     time: '12小時前',
  //     imgUrl: 'assets/reading-lamp.jpg',
  //     location: '新北市',

  //     user: {
  //       userName: '外文兔兔',
  //       userImg: 'assets/avatar28.jpg',
  //       university: '文化',
  //       department: '英文系',
  //       location: ['新北市']
  //     }
  //   },

  //   {
  //     title: 'Switch 遊戲片',
  //     type: ['3C電子'],
  //     condition: 'likeNew',
  //     price: 980,
  //     time: '9天前',
  //     imgUrl: 'assets/game.jpg',
  //     location: '桃園縣',

  //     user: {
  //       userName: '資管狐狸',
  //       userImg: 'assets/avatar29.jpg',
  //       university: '元智',
  //       department: '資管系',
  //       location: ['桃園縣']
  //     }
  //   },

  //   {
  //     title: '簡約白襯衫',
  //     type: ['服飾配件'],
  //     condition: 'likeNew',
  //     price: 330,
  //     time: '8小時前',
  //     imgUrl: 'assets/shirt.jpg',
  //     location: '彰化縣',

  //     user: {
  //       userName: '經濟海豹',
  //       userImg: 'assets/avatar30.jpg',
  //       university: '彰師大',
  //       department: '經濟系',
  //       location: ['彰化縣']
  //     }
  //   },

  //   {
  //     title: '藍芽小鍵盤',
  //     type: ['3C電子'],
  //     condition: 'likeNew',
  //     price: 520,
  //     time: '14小時前',
  //     imgUrl: 'assets/bluetooth-keyboard.jpg',
  //     location: '台中市',

  //     user: {
  //       userName: '統計小鹿',
  //       userImg: 'assets/avatar31.jpg',
  //       university: '靜宜',
  //       department: '統計系',
  //       location: ['台中市']
  //     }
  //   },

  //   {
  //     title: '宿舍地毯',
  //     type: ['生活用品', '家具家電'],
  //     condition: 'likeNew',
  //     price: 450,
  //     time: '2天前',
  //     imgUrl: 'assets/carpet.jpg',
  //     location: '高雄市',

  //     user: {
  //       userName: '土木柴犬',
  //       userImg: 'assets/avatar32.jpg',
  //       university: '義守',
  //       department: '土木系',
  //       location: ['高雄市']
  //     }
  //   }
  // ];


  search(req: SearchProductReq): Observable<GetProductDataRes> {
    return this.http.post<any>(`${this.BASE}/search`, req).pipe(
      map(res => res.products.map((p: any) => ({
        // 後端欄位 → 前端欄位， 後端沒有就先留空  title:    p.productName,
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
        location: (p.location && p.location.length > 0) ? p.location[0] : '未知地點',
        deptGroup: p.deptGroup,
        // 補上前端元件需要的 user 欄位
        user: {
          userName: '李吉娃娃',
          userImg: 'https://www.townlinepaint.com/cdn/shop/products/B6B4B2.png?v=1646778952&width=1200/default.jpg',
          university: '清華大學',
          department: '生科系',
          location: '高雄'
        }

      })))
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
        location: (p.location && p.location.length > 0) ? p.location[0] : '未知地點',
        deptGroup: p.deptGroup,
        // 補上前端元件需要的 user 欄位
        user: {
          userName: '李吉娃娃',
          userImg: 'https://www.townlinepaint.com/cdn/shop/products/B6B4B2.png?v=1646778952&width=1200/default.jpg',
          university: '清華大學',
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
        location: (p.location && p.location.length > 0) ? p.location[0] : '未知地點',
        deptGroup: p.deptGroup,
        // 補上前端元件需要的 user 欄位
        user: {
          userName: '李吉娃娃',
          userImg: 'https://www.townlinepaint.com/cdn/shop/products/B6B4B2.png?v=1646778952&width=1200/default.jpg',
          university: '清華大學',
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
