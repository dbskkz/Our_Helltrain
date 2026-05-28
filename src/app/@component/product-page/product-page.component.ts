import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { LucideAngularModule, MessageCircleMore, HeartIcon, Send, ChevronLeft, ChevronRight } from 'lucide-angular';



// 模擬未來後端回傳的 DTO 結構
export interface ProductDetailDTO {
  productId: number;
  productName: string;
  description: string[];
  price: number;
  tags: string[];          // 後端 type、grade、condition 整合過後的標籤陣列
  location: string;        // 模擬從賣家/商品表整合出的地區
  school: string;          // 模擬從賣家（使用者）抓取的學校
  sellerName: string;      // 模擬從賣家抓取的帳號
  images: (string | null)[]; // 最高限制 7 張圖片
  safetyFeatures: string[];
  status: string;
}

@Component({
  selector: 'app-product-page',
  imports: [CommonModule, CurrencyPipe, LucideAngularModule],
  templateUrl: './product-page.component.html',
  styleUrl: './product-page.component.scss'
})
export class ProductPageComponent {

  readonly HeartIcon = HeartIcon;
  readonly SendIcon = Send;
  readonly MessageCircleIcon = MessageCircleMore;
  readonly ChevronLeftIcon = ChevronLeft;
  readonly ChevronRightIcon = ChevronRight;

  // 💡 抓取 HTML 中的滾動區域
  @ViewChild('thumbViewport') thumbViewport!: ElementRef<HTMLDivElement>;


    // 模擬從 API 撈出來的商品詳細資料
  product: ProductDetailDTO = {
    productId: 101,
    productName: '葬送的芙莉蓮 1',
    price: 180,
    // 學校與地區：模擬從賣家 User 資料串過來的結果
    school: '國立臺灣大學',
    location: '台北市',
    sellerName: '賣家帳號',
    // 整合後的關鍵字標籤：包含種類（二手書）、商品狀況（狀況良好）
    tags: ['二手書', '狀況良好'],
    // 圖片上限 7 張，這邊放 3 張有網址、4 張 null 測試過濾邏輯
    images: [
      'https://picsum.photos/id/1025/400/500',
      'https://picsum.photos/id/103/400/500',
      'https://picsum.photos/id/1062/400/500',
      'https://picsum.photos/id/1026/400/500', // 增加測試圖，讓總數超過4張
      'https://picsum.photos/id/1029/400/500',
      null,
      null,
      null,
      null
    ],
    safetyFeatures: [
      '不點擊不明連結，不離開平台交易',
      '轉帳前請先確認賣家信用評價',
      '若有任何交易爭議，請立即向平台客服回報',
    ],
    description: [
      '魔王被勇者一行人打倒後的世界。',
      '勇者欣梅爾與僧侶海塔爾、戰士艾森與魔法使芙莉蓮，\n為了再次體驗各地的人們帶來的感動，\n踏上了各處旅行的旅途。',
      '這是關於某個魔法使的後日談——',
    ],
    status: 'AVAILABLE'
  };

  selectedImageIndex = 0;

  ngOnInit(): void {}

  //圖片篩選邏輯 即使後端開了 7 個欄位或陣列長度是 7，我們只把「有圖片」的網址抓出來
  get validImages(): string[] {
    return this.product.images.filter((img): img is string => img !== null);
  }

  // 取得當前選中的主圖
  get selectedImage(): string {
    return this.validImages[this.selectedImageIndex] || '';
  }

  // 切換縮圖
  selectImage(index: number): void {
    if (this.product.images[index]) {
      this.selectedImageIndex = index;
    }
  }

/**
   * 💡 核心控制：點擊箭頭滑動縮圖
   * @param direction 'left' 或 'right'
   */
  scrollThumbnails(direction: 'left' | 'right'): void {
    const viewport = this.thumbViewport.nativeElement;
    // 一個縮圖 54px + gap 8px = 62px，每次移動一個縮圖的距離
    const scrollAmount = 62;

    if (direction == 'left') {
      viewport.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      viewport.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  }


/* 按鈕 */
  addToCart(): void {
    alert(`已將「${this.product.productName}」加入購物車！`);
  }

  sendRequest(): void {
    alert(`已成功向賣家發送「${this.product.productName}」的購買請求！`);
  }

}
