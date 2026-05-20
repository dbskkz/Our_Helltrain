import { Component } from '@angular/core';
import {
  CircleCheckBig,
  LucideAngularModule,
  MessageCircleMore,
} from 'lucide-angular';

@Component({
  selector: 'app-order-information',
  imports: [LucideAngularModule],
  templateUrl: './order-information.component.html',
  styleUrl: './order-information.component.scss',
})
export class OrderInformationComponent {
  // Declare icon
  readonly CircleCheckBig = CircleCheckBig;
  readonly MessageCircleMore = MessageCircleMore;

  //tabs
  currentTab = '全部訂單'; // 預設選中
  // 列表欄位
  tabsColumns: string[] = ['全部訂單', '交易中', '已完成', '已取消'];

  // 分頁變數
  currentPage = 1;
  pageSize = 5;
  totalElements = 0;
  totalPages = 3;

  // 存放當前頁要顯示的資料
  orders: any[] = [];

  changeTab(tabName: string) {
    this.currentTab = tabName;
    this.currentPage = 1; // 切換分類時，頁碼歸零
    this.fetchOrders();
  }

  buyAgain() {}

  chat() {}

  fetchOrders() {}

  // 點擊頁碼
  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.fetchOrders();
  }
}
