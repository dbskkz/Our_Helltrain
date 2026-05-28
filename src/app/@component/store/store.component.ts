import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
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
} from 'lucide-angular';

@Component({
  selector: 'app-store',
  imports: [LucideAngularModule],
  templateUrl: './store.component.html',
  styleUrl: './store.component.scss',
})
export class StoreComponent {
  constructor(private router: Router) {}

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

  isGood: boolean = true;
  isOwner: boolean = false;
  // 監聽全域鍵盤事件
  @HostListener('window:keydown', ['$event'])
  toggleTestMode(event: KeyboardEvent) {
    if (event.ctrlKey && event.key === '`') {
      this.isOwner = !this.isOwner;
    }
  }

  // 分頁變數
  currentPage = 1;
  pageSize = 6;
  totalElements = 6;
  totalPages = 5;

  goRepot() {
    this.router.navigate(['/front_report']);
  }

  fetchProduct() {}

  // totalPages產生陣列
  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  // 點擊頁碼
  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.fetchProduct();
  }

  // 新增商品
  goLaunchProduct() {
    this.router.navigate(['/launch_product']);
  }

  // 商品管理
  manageProduct() {
    this.router.navigate(['/launch_product']);
  }

  // 編輯商品 || 收藏商品
  goUpdateProduct() {
    if (this.isOwner) {
      this.router.navigate(['/launch_product']);
    } else {
    }
  }
}
