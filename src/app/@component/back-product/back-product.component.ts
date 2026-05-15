import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LucideAngularModule, Search, MapPin,LayoutGrid } from 'lucide-angular';

@Component({
  selector: 'app-back-product',
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './back-product.component.html',
  styleUrl: './back-product.component.scss',
})
export class BackProductComponent {
  readonly SearchIcon = Search;
  readonly mapIcon = MapPin;
  readonly GridIcon=LayoutGrid;


  products: any[] = [];
  loadProducts: any;
  getStatusBadge(status: string): string {
    const map: Record<string, string> = {
      販售中: 'badge-selling',
      審核中: 'badge-review',
      違規下架: 'badge-violated',
      下架: 'badge-offline',
    };
    return map[status] ?? '';
  }
  currentPage: number = 1; // 預設從第一頁開始
  totalPages: number = 5; // 總共幾頁，從後端拿
  pageNumbers: number[] = [1, 2, 3, 4, 5]; // 頁碼陣列，用來 @for 產生頁碼按鈕
  clearFilters() {}
  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadProducts(); // 重新跟後端拿該頁資料
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadProducts();
    }
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.loadProducts();
  }
}
