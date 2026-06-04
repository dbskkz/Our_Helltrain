import { ApiTestService } from './../../@Services/api-test.service';
import { UserService } from './../../@Services/user.service';
import { Component, HostListener, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  LucideAngularModule,
  User,
  BookText,
  MapPin,
  School,
  MessageCircleMore,
  HeartPlus,
  Pencil,
  ArrowRight,
  Plus,
  ThumbsUp,
  Trash2,
  Flag,
  Phone,
  Mail
} from 'lucide-angular';
import { ReportService } from '../../@Services/report.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-store',
  imports: [LucideAngularModule],
  templateUrl: './store.component.html',
  styleUrl: './store.component.scss',
})
export class StoreComponent {
  constructor(private router: Router,
    private reportService: ReportService,
    private userService: UserService,
    private route: ActivatedRoute,
    private apiTestService: ApiTestService) { }

  // Declare icon
  readonly User = User;
  readonly BookText = BookText;
  readonly MapPin = MapPin;
  readonly School = School;
  readonly MessageCircleMore = MessageCircleMore;
  readonly HeartPlus = HeartPlus;
  readonly Pencil = Pencil;
  readonly ArrowRight = ArrowRight;
  readonly Plus = Plus;
  readonly ThumbsUp = ThumbsUp;
  readonly Trash2 = Trash2;
  readonly Flag = Flag;
  readonly Phone = Phone;
  readonly Mail = Mail;

  isGood: boolean = true;
  isOwner: boolean = false;
  // 監聽全域鍵盤事件
  @HostListener('window:keydown', ['$event'])
  toggleTestMode(event: KeyboardEvent) {
    if (event.ctrlKey && event.key === '`') {
      this.isOwner = !this.isOwner;
    }
  }
  // 賣場主人資料
  shopOwnerData = signal<any>(null);

  // 分頁變數
  currentPage = 1;
  pageSize = 6;
  totalElements = 6;
  totalPages = 5;

  ngOnInit(): void {
    let idFromUrl = this.route.snapshot.paramMap.get('id');
    let targetUserId = Number(idFromUrl); //賣場網址ID
    let currentLoggedInId = this.userService.currentUser().userId; //使用者ID

    if (!idFromUrl) return;

    if (targetUserId === Number(currentLoggedInId)) { // 切換編輯模式
      this.isOwner = true;
    } else {
      this.isOwner = false;
    }

    this.fetchShopOwnerData(targetUserId);
  }

  // 檢舉
  goRepot() {
    // 檢舉用戶
    this.reportService.openReportDialog('user', '用戶名稱', '用戶ID');
  }

  shopOwnerName: string = '該賣場用戶'; // 暫存這家賣場主人的名字，用來給檢舉彈窗使用
  // 假設你有商品列表的變數
  products: any[] = [];
  // 取得賣場專屬資料與商品
  fetchShopOwnerData(userId: number) {
    // 呼叫你剛才處理好連線的 UserService 撈取該賣家個資
    this.userService.getUserData(userId).subscribe({
      next: (res) => {
        console.log('成功撈到賣場主人資料：', res);
        // 根據你們後端的資料結構調整，假設包在 res.user 或 res.data 裡
        const ownerData = res.user || res.data;
        if (ownerData) {
          this.shopOwnerName = ownerData.name || ownerData.username || '該賣場用戶';

          // 如果 UserService 廣播需要，也可以在這裡同步處理
          // 例如，如果是自己的賣場，順便更新全域頭像
          if (this.isOwner) {
            this.userService.updateAvatar(ownerData.imgPath);
          }
        }
      },
      error: (err) => {
        console.error('撈取賣場主人資料失敗：', err);
      }
    });

    // 順便在這邊發送撈取該賣家商品的 API
    this.fetchProduct(userId);
  }

  // 取得販賣商品資訊
  fetchProduct(userId: number) {
    this.apiTestService.searchBySellerId(userId).subscribe({
      next: (res) => { this.products = res; },
      error: (err) => { console.error('撈取商品失敗：', err); }
    });
  }

  // totalPages產生陣列
  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  // 獲取使用者資料
  get userData() {
    return this.userService.currentUser;
  }
  // 處理地區陣列 (有空再看看能不能重構)
  get formattedLocation(): string {
    const user = this.userService.currentUser();
    if (!user || !user.location) return '未填寫';

    // 🕵️ 抓漏核心：判斷後端給的到底是不是陣列
    if (Array.isArray(user.location)) {
      // 如果是陣列型態，用「、」把牠們手牽手串起來
      return user.location.join('、');
    }

    // 防禦機制：萬一後端有時候給的是字串 JSON (長得像陣列的字串)，試著解析它
    if (typeof user.location === 'string' && user.location.startsWith('[')) {
      try {
        const parsed = JSON.parse(user.location);
        if (Array.isArray(parsed)) {
          return parsed.join('、');
        }
      } catch (e) {
        // 解析失敗就保持原樣
      }
    }

    // 如果本來就是純字串（例如 "高雄市"），就直接回傳
    return user.location;
  }

  // 點擊頁碼
  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    // this.fetchProduct();
  }

  // 新增商品
  goLaunchProduct() {
    this.router.navigate(['/launch_product_info']);
  }

  // 商品管理
  manageProduct() {
    this.router.navigate(['/launch_product_info']);
  }

  // 收藏商品
  goCollectProduct() {
    Swal.fire({
      title: '商品已收藏！',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false,
    })
  }

  // 前往商品詳情頁
  goProductPage() {
    this.router.navigate(['/product_page']);
  }

  // 編輯個人資料
  goSettings() {
    this.router.navigate(['/profile_settings']);
  }
}
