import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { LucideAngularModule,Home, MessageCircleMore, HeartIcon, Send, ChevronLeft, ChevronRight, Flag, Heart, Check, Store, ChevronDown, ChevronUp } from 'lucide-angular';
import Swal from 'sweetalert2';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../@Services/user.service';

  const CATEGORY_MAP: Record<string, string> = {
  'books':       '教科書',
  'equipment':   '專業器材',
  'daily':       '生活用品',
  'electronics': '3C電子',
  'furniture':   '家具家電',
  'notes':       '筆記考古',
  'fashion':     '服飾配件',
  'sports':      '戶外運動',
  'graduation':  '畢業季',
};

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

  // 💥 關鍵新增：把賣家資訊全部打包在這個巢狀物件裡！
  user: {
    userName: string;
    userImg: string;     // 大頭貼
    university: string;  // 學校
    department: string;  // 科系
    location: string[];  // 常出沒地區陣列
    grade: string;       // 信用等級
    tradeCount: number;  // 交易次數 (如果有的話)
    productCount: number; //上架商品數
  };
}

@Component({
  selector: 'app-product-page',
  imports: [CommonModule,RouterLink, CurrencyPipe, LucideAngularModule],
  templateUrl: './product-page.component.html',
  styleUrl: './product-page.component.scss'
})
export class ProductPageComponent {

  readonly HomeIcon          = Home;
  readonly HeartIcon         = Heart;
  readonly SendIcon          = Send;
  readonly MessageCircleIcon = MessageCircleMore;
  readonly ChevronLeftIcon   = ChevronLeft;
  readonly ChevronRightIcon  = ChevronRight;
  readonly Flag              = Flag;
  readonly CheckIcon         = Check;
  readonly StoreIcon         = Store;
  readonly ChevronDownIcon = ChevronDown;
  readonly ChevronUpIcon = ChevronUp;

  // 💡 抓取 HTML 中的滾動區域
  @ViewChild('thumbViewport') thumbViewport!: ElementRef<HTMLDivElement>;

  constructor(public userService: UserService, private router: Router) {}



  // 模擬未來後端回傳的真實 JSON 資料
 product: ProductDetailDTO = {
  productId: 10123,
  userId: 99,
  productName: '葬送的芙莉蓮 1',
  description:`「魔王被勇者一行人打倒後的世界。
勇者欣梅爾與僧侶海塔爾、戰士艾森與魔法使芙莉蓮，為了再次體驗各地的人們帶來的感動，踏上了各處旅行的旅途。這是關於某個魔法使的後日談——

【書況詳細說明】
本書為一手購入的自有書（非租書店流出），平時均收納於防潮封閉式書櫃中，無日曬褪色、無煙味或寵物接觸環境，整體書況保存極佳，外觀約有九五成新。書斑極少，僅書側有些微自然的歲月存放痕跡。

內頁部分：
1. 全書完好：內頁極為乾淨，保證絕無任何鉛筆、原子筆或螢光筆之劃記。
2. 結構穩固：無折角、無撕裂、無泡水變形，亦無任何缺頁或掉頁狀況。
3. 附原廠書套：出貨時會附上全新透明哈哈書套，保護書皮不被刮傷。

【二手規格小檔案】
■ 書名：葬送的芙莉蓮 1 (臺灣東立正版)
■ 作者：山田鐘人 (原作) / アベツカサ (作畫)
■ 裝訂：平裝 / 單行本 / 繁體中文

由於目前正值畢業季大出清，希望這本治癒人心的神作能流轉到下一位真心喜愛動漫的同學手中。為了方便大家，本商品非常歡迎在國立臺灣大學校園內（如總圖、公館捷運站、或各大教學大樓）進行面交，時間均可配合調整。有任何關於課本、二手書況的問題，歡迎直接點選上方的聊天按鈕與我聯繫，謝謝！」`,
  price: 180,
  imgPath: 'https://picsum.photos/id/1025/400/500,https://picsum.photos/id/103/400/500,https://picsum.photos/id/1062/400/500,https://picsum.photos/id/106/400/500,https://picsum.photos/id/62/400/500',
  type: '教科書',
  shelfDate: '2026-05-28',
  productCondition: '狀況良好',
  status: 'AVAILABLE',
  grade: '大一',
  deptGroup: '資訊學群',
  location: '台北市',

  // 替換掉原本散落的 sellerName 和 sellerGrade，改成這個完美的物件
  user: {
    userName: '企管水豚',
    userImg: 'https://picsum.photos/id/1025/400/500', // 隨便塞個圖片路徑測試
    university: '輔仁大學',
    department: '企管系',
    location: ['新北市', '台北市'],
    grade: '4.9',
    tradeCount: 52,
    productCount: 7
  }
};

  selectedImageIndex = 0;
  isExpanded = false; //控制商品說明是否展開
  isCollected = false; // 是否已收藏
  isRequested = false; // 是否已發送請求



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


  //切換展開/收起狀態
  toggleExpand(): void {
    this.isExpanded = !this.isExpanded;
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

  //type標籤連結
  getCategoryRoute(categoryName: string): string {
    // 透過 Object.keys 尋找哪一個「英文 Key」對應的「中文 Value」等於我們傳進來的 categoryName
    const routePath = Object.keys(CATEGORY_MAP).find(
      (key) => CATEGORY_MAP[key] === categoryName
    );

    // 如果有找到就跳轉過去，沒找到（防呆）就預設導向所有商品列表
    return `/product-list/${routePath || 'all'}`;
  }


/* 商品操作按鈕 */
//加入收藏
  addToCart(): void {
    this.isCollected = !this.isCollected;

   if (this.isCollected) {
      Swal.fire({
        title: '已加入收藏！',
        text: `商品「${this.product.productName}」已成功收藏。`,
        icon: 'success',
        confirmButtonText: '好的',
        confirmButtonColor: '#EDA900'
      });
    }
  }

  // 發送請求按鈕
  sendRequest(): void {
// 防呆：如果已經發送過了，就不讓使用者再點擊
    if (this.isRequested) return;
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
        this.isRequested = true; // 狀態改為已發送
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

  /*檢舉商品的功能*/
  reportProduct() {
    console.log('準備檢舉商品，商品 ID:', this.product.productId);

    // 使用你熟悉的 Swal 來做確認視窗
    Swal.fire({
      title: '檢舉商品',
      text: '確定要檢舉這項商品嗎？請確認商品是否有違規情形。',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#c62828', // 配合同學的 .report 紅色樣式
      cancelButtonColor: '#999999',
      confirmButtonText: '確定檢舉',
      cancelButtonText: '先不要'
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['/front_report'], {
          queryParams: {
            productId: this.product.productId,
            productName: this.product.productName // 也可以順便把名稱帶過去
          }
        });

      }
    });
  }

   // --- 賣家操作 ---
  openChat(): void {
    console.log('開啟聊天室：', this.product.user.userName);
    // 未來串接：this.router.navigate(['/chat'], { queryParams: { userId: this.product.userId } });
  }

  gotoStore(): void {
    console.log('前往賣場：', this.product.user.userName);
    this.router.navigate(['/store']);
  }
 }
