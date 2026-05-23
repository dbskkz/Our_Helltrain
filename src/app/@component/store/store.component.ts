import { Component } from '@angular/core';
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
} from 'lucide-angular';

@Component({
  selector: 'app-store',
  imports: [LucideAngularModule],
  templateUrl: './store.component.html',
  styleUrl: './store.component.scss',
})
export class StoreComponent {
  // Declare icon
  readonly User = User;
  readonly BookText = BookText;
  readonly MapPin = MapPin;
  readonly School = School;
  readonly MessageCircleMore = MessageCircleMore;
  readonly HeartPlus = HeartPlus;
  readonly Pencil = Pencil;
  readonly ArrowRight = ArrowRight;

  isOwner: boolean = false;

  // 分頁變數
  currentPage = 1;
  pageSize = 5;
  totalElements = 0;
  totalPages = 3;

  fetchProduct() {}

  // 點擊頁碼
  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.fetchProduct;
  }
}
