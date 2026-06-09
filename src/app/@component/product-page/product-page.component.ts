import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { LucideAngularModule,Home, MessageCircleMore, HeartIcon, Send, ChevronLeft, ChevronRight, Flag, Heart, Check, Store, ChevronDown, ChevronUp, MoreVertical, Copy } from 'lucide-angular';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService } from '../../@Services/user.service';
import { ReportService } from '../../@Services/report.service';
import { ApiTestService } from '../../@Services/api-test.service';
import { ProductVo, GetProductDataRes } from '../../@Interface/product-vo';


  const CATEGORY_MAP: Record<string, string> = {
  'all':         '全部商品',
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
  readonly MoreVertical = MoreVertical;
  readonly Copy = Copy;

  // 💡 抓取 HTML 中的滾動區域
  @ViewChild('thumbViewport') thumbViewport!: ElementRef<HTMLDivElement>;
  @ViewChild('descText') descText!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    public userService: UserService,
    private router: Router,
    private reportService: ReportService,
    private apiTestService: ApiTestService) {}

  // 等待後端回傳的 JSON 資料
  product: ProductVo | null = null;
  sellerProductCount: number | null = null; //用來裝從同學 API 借來的「總上架件數」
  breadcrumbLabel = ''; // 用來存麵包屑要顯示的文字（學校名或分類名）
  breadcrumbUrl = '';   // 用來存麵包屑點擊後要回跳的網址路徑
  selectedImageIndex = 0;
  isExpanded = false; //控制商品說明是否展開
  isOverflowing = false; // 用來決定要不要顯示[查看更多]按鈕
  isCollected = false; // 是否已收藏
  isRequested = false; // 是否已發送請求
  isMenuOpen = false; //檢舉分享選單


  ngOnInit(): void {
    // 從網址列抓取動態商品 id (例如網址是 /product/10123)
    const productId = Number(this.route.snapshot.paramMap.get('id'));

    if (productId) {
      this.apiTestService.searchByProductId(productId).subscribe({
        next: (res: GetProductDataRes)=>{
          if(res.statusCode === 200 && res.productList?.length>0){
            this.product = res.productList[0];

            //智慧網址探針
            let prevUrlPath = '';
            // 1.悄悄翻閱瀏覽器的歷史紀錄（使用防禦型寫法，保證不噴紅字）
            const nav = (window as any).navigation;
            if (nav) {
              const currentIndex = nav.currentEntry?.index;
              if (currentIndex !== undefined && currentIndex > 0) {
                const fullUrl = nav.entries()[currentIndex - 1]?.url || '';
                prevUrlPath = new URL(fullUrl).pathname; // 抓出上一個網頁的路徑
              }
            }

            // 2. 開始通靈判斷（幫妳的獨立麵包屑塞值）
            if (prevUrlPath.includes('/school-community/')) {
              // 🏫 狀況一：如果是從學校校版點進來的
              this.breadcrumbLabel = this.product.seller.school; // 抓後端的學校名稱
              this.breadcrumbUrl = prevUrlPath;                  // 回程網址直接綁定校版網址

            } else if (prevUrlPath.includes('/product-list/')) {
              // 📚 狀況二：如果是從商品分類列表點進來的
              // 1. 拆解網址：把 "/product-list/notes" 用斜線切開，抓出最後一節英文代號
              const urlSegments = prevUrlPath.split('/');
              const categorySlug = urlSegments[urlSegments.length - 1]; // 拿到 'notes' 或 'daily' 或 'all'
              // 2. 翻對照表：利用妳檔案最上方宣告的 CATEGORY_MAP，把英文翻譯回中文
              // (例如：'notes' 轉成 '筆記考古')
              const matchedChineseName = CATEGORY_MAP[categorySlug];

              // 3. 聰明配對
              if (matchedChineseName && this.product.type.includes(matchedChineseName)) {
                // 如果翻出來的中文（筆記考古），確實有在商品的分類陣列裡，就完美顯示它！
                this.breadcrumbLabel = matchedChineseName;
              } else if (categorySlug === 'all') {
                this.breadcrumbLabel = '全部商品';
              } else {
                // 萬一真的對不上
                this.breadcrumbLabel = this.product.type[0];
              }
              this.breadcrumbUrl = prevUrlPath;                  // 回程網址直接綁定列表網址

            } else {
              // 🛡️ 狀況三：安全防呆備案（例如直接開網址或從首頁點進來）
              this.breadcrumbLabel = this.product.type[0];
              this.breadcrumbUrl = this.getCategoryRoute(this.product.type[0]);
            }

            this.fetchSellerTotalCount(this.product.userId);

            setTimeout(()=> this.checkTextOverflow());
          } else {
            Swal.fire('查無商品', '該商品可能已經下架，或是不存在喔！', 'warning');
          }
        },
        error: (err) => {
          console.error('撈取商品詳細失敗：', err);
          Swal.fire('連線失敗', '系統無法載入商品資訊，請稍後再試', 'error');
        }
      });
    }
  }

  // 🌟 5. 借用同學 API 來數數的專門方法
  fetchSellerTotalCount(userId: number) {
    this.apiTestService.searchBySellerId(userId).subscribe({
      next: (res) => {
        if (res && res.productList) {
          // 🎯 核心精華：直接拿同學撈出來的商品陣列長度，當作總上架筆數！
          this.sellerProductCount = res.productList.length;
        }
      },
      error: (err) => {
        console.error('撈取賣家上架數失敗：', err);
        this.sellerProductCount = 0; // 失敗就防呆給 0 筆
      }
    });
  }

 // 🌟 6. 圖片篩選功能大瘦身！因為後端已經是 List<String> 陣列，不需要再用逗號切開了！
  get validImages(): string[] {
    return this.product?.imgPath ?? []; // 防呆：如果 product 還沒回來，先給空陣列
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

    ngAfterViewInit() {
    setTimeout(() => {
      this.checkTextOverflow();
    });
  }

//檢查是否要顯示 查看更多 按鈕
  checkTextOverflow() {
    if (this.descText && this.descText.nativeElement) {
      const element = this.descText.nativeElement;

      // 取得這段文字「真實」長出的總高度
      const actualHeight = element.scrollHeight;
      const maxAllowedHeight = 110;

      // 如果真實高度大於 4 行的高度，isOverflowing 就會變成 true！
      this.isOverflowing = actualHeight > maxAllowedHeight;
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
    if (!this.product) return;
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
    if (!this.product) return;
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

  // 在底下加入三個點控制的方法
toggleMenu(event: Event): void {
  event.stopPropagation();
  this.isMenuOpen = !this.isMenuOpen;
}

// 🔗 分享商品功能（超簡單神技）
shareProduct(): void {
  if (!this.product) return;

  // 抓取目前網頁的完整網址，直接塞進使用者的剪貼簿
  navigator.clipboard.writeText(window.location.href).then(() => {
    this.isMenuOpen = false; // 複製完順手關閉選單

    // 彈出精美提示
    Swal.fire({
      title: '連結已複製！',
      text: '快去分享給學校同學吧 🚀',
      icon: 'success',
      confirmButtonText: '太棒了',
      confirmButtonColor: '#EDA900'
    });
  });
}

// 🚩 點擊選單內的檢舉
onReportClick(): void {
  this.isMenuOpen = false; // 關閉選單
  this.reportProduct();    // 呼叫妳原本就寫好的檢舉功能
}

// 當使用者點選網頁其他任何地方時，自動把選單收起來
@HostListener('document:click')
closeMenu(): void {
   this.isMenuOpen = false;
}

  /*檢舉商品的功能*/
  reportProduct() {
    if (!this.product) return;
    console.log('準備檢舉商品，商品 ID:', this.product.productId);
    this.reportService.openReportDialog(
      'product',
      this.product.productName,
      this.product.userId.toString(),
      this.product.productId.toString()
    );
  }

  allProducts: any[] = []; //全部商品

    // 取得販賣商品資訊
  fetchProduct(userId: number) {
    this.apiTestService.searchBySellerId(userId).subscribe({
      next: (res) => {
        this.allProducts = res.productList;
      },
      error: (err) => { console.error('撈取商品失敗：', err); }
    });

  }

   // --- 賣家操作 ---
  openChat(): void {
    if (!this.product) return;
    console.log('開啟聊天室：', this.product.seller?.userName);
    // 未來串接：this.router.navigate(['/chat'], { queryParams: { userId: this.product.userId } });
  }

  gotoStore(): void {
    if (!this.product) return;
    console.log('前往賣場：', this.product.seller?.userName);
    this.router.navigate(['/store', this.product.userId]);
  }

 }
