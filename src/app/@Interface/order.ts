import { BasicResponse } from "./user";

/**
 * @description 單筆訂單的詳細內容資料物件 (Value Object)
 * @comment 對齊後端 Java 的 OrderListVo。用於商品詳細頁、買賣家訂單列表。
 */
export interface OrderListVo {
  orderId: number;
  createDate: string;
  buyerCheck: boolean;
  sellerCheck: boolean;
  /** @property 訂單目前狀態 (關鍵字：'請求回應中'、'交易完成'、'已取消') */
  status: string;
  sellerName: string;
  productName: string;
  price: number;
  /**
   * @property 買家（發送購買請求者）的會員姓名
   * @warning 💡 注意：後端沒給 buyerId，前台比對「是不是我買的」要用這個欄位比對 userName！
   */
  buyerName: string;
  imgPath: string;
}

/**
 * @description 訂單相關 API 的後端回傳規格 (Response)
 * @comment 承襲 BasicResponse 的 statusCode 與 message，並打包訂單陣列。
 * @usedBy ApiTestService.getProductAllOrder (取得商品的所有訂單)
 */
export interface OrderRes extends BasicResponse {
  /** @property 該次查詢撈出來的訂單清單陣列 */
  orderList: OrderListVo[];
}
