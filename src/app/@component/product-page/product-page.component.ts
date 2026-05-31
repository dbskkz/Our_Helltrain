import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { LucideAngularModule,Home, MessageCircleMore, HeartIcon, Send, ChevronLeft, ChevronRight } from 'lucide-angular';
import Swal from 'sweetalert2';
import { RouterLink } from '@angular/router';
import { UserService } from '../../@Services/user.service';
import { SellerCardComponent } from '../seller-card/seller-card.component';


// 模擬未來後端回傳的 DTO 結構
export interface ProductDetailDTO {
  productId: number;
  userId: number;
  productName: string;
  description: string;
  price: number;
  imgPath: string;
  type: string;
  shelfDate: string;
  productCondition: string;
  status: string;
  grade?: string;
  deptGroup?: string;
  location: string;

  // 關鍵新增：把賣家資訊全部打包在這個巢狀物件裡！
  seller: {
    userName: string;
    userImg: string;     // 大頭貼
    university: string;  // 學校
    department: string;  // 科系
    location: string[];  // 常出沒地區陣列
    grade: string;       // 信用等級
    tradeCount?: number;  // 交易次數 (如果有的話)
  };
}

@Component({
  selector: 'app-product-page',
  imports: [SellerCardComponent,CommonModule,RouterLink, CurrencyPipe, LucideAngularModule],
  templateUrl: './product-page.component.html',
  styleUrl: './product-page.component.scss'
})
export class ProductPageComponent {

  readonly HomeIcon     = Home;
  readonly HeartIcon = HeartIcon;
  readonly SendIcon = Send;
  readonly MessageCircleIcon = MessageCircleMore;
  readonly ChevronLeftIcon = ChevronLeft;
  readonly ChevronRightIcon = ChevronRight;

  // 💡 抓取 HTML 中的滾動區域
  @ViewChild('thumbViewport') thumbViewport!: ElementRef<HTMLDivElement>;

  constructor(public userService: UserService) {}

  // 模擬未來後端回傳的真實 JSON 資料
 product: ProductDetailDTO = {
  productId: 10123,
  userId: 99,
  productName: '葬送的芙莉蓮 1',
  description: '魔王被勇者一行人打倒後的世界...',
  price: 180,
  imgPath: 'https://picsum.photos/id/1025/400/500,...',
  type: '書籍',
  shelfDate: '2026-05-28',
  productCondition: '狀況良好',
  status: 'AVAILABLE',
  grade: '大一',
  deptGroup: '資訊學群',
  location: '台北市',

  // 💥 替換掉原本散落的 sellerName 和 sellerGrade，改成這個完美的物件
  seller: {
    userName: '企管水豚',
    userImg: 'assets/images/capybara.jpg', // 隨便塞個圖片路徑測試
    university: '輔仁大學',
    department: '企管系',
    location: ['新北市', '台北市'],
    grade: '4.9',
    tradeCount: 52
  }
};

  selectedImageIndex = 0;

  ngOnInit(): void {}

  //圖片篩選邏輯 即使後端開了 7 個欄位或陣列長度是 7，我們只把「有圖片」的網址抓出來
  get validImages(): string[] {
    if (!this.product.imgPath) return [];
    // 用逗號切開，並順便濾掉可能不小心產生的空白字元
    return this.product.imgPath.split(',').map(url => url.trim()).filter(url => url !== '');
  }

  // 取得當前選中的主圖
  get selectedImage(): string {
    return this.validImages[this.selectedImageIndex] || '';
  }

  // 切換縮圖
  selectImage(index: number): void {
if (index >= 0 && index < this.validImages.length) {
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
   Swal.fire({
      title: '已加入收藏！',
      text: `商品「${this.product.productName}」已成功收藏。`,
      icon: 'success',
      confirmButtonText: '好的',
      confirmButtonColor: '#EDA900'
    });
  }

  sendRequest(): void {
    Swal.fire({
      title: '確定要發送購買請求嗎？',
      text: `系統將會發送「${this.product.productName}」的購買意願給賣家。`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: '確定發送',
      cancelButtonText: '先不要',
      confirmButtonColor: '#EDA900',
      cancelButtonColor: '#999999',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: '發送成功！',
          text: '已成功向賣家發送購買請求，請靜待同學的回覆！',
          icon: 'success',
          confirmButtonText: '好的',
          confirmButtonColor: '#EDA900'
        });
      }
    });
  }
 }
