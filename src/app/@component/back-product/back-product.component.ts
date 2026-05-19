import { PaginationService } from './../../@service/pageination.service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  LucideAngularModule,
  Search,
  MapPin,
  LayoutGrid, ChevronRight ,ChevronLeft
} from 'lucide-angular';

@Component({
  selector: 'app-back-product',
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './back-product.component.html',
  styleUrl: './back-product.component.scss',
})
export class BackProductComponent {
  constructor(public pagination: PaginationService) {}
  readonly SearchIcon = Search;
  readonly mapIcon = MapPin;
  readonly GridIcon = LayoutGrid;
  readonly nextIcon=ChevronRight;
  readonly prevIcon=ChevronLeft;

  readonly pageSize = 5;

  private allProducts: Product[] = [
    { id: 'PROD-1001', name: '手工羊駝公仔', imageUrl: 'https://picsum.photos/seed/prod1/56/56', category: '精品飾品', price: 1200, stock: 25, status: '販售中'  },
    { id: 'PROD-1002', name: '手工羊駝公仔', imageUrl: 'https://picsum.photos/seed/prod2/56/56', category: '毛絨玩具', price: 1200, stock: 30, status: '審核中'  },
    { id: 'PROD-1003', name: '手工羊駝公仔', imageUrl: 'https://picsum.photos/seed/prod3/56/56', category: '精品飾品', price: 1200, stock: 5,  status: '違規下架' },
    { id: 'PROD-1004', name: '羊駝鑰匙圈',   imageUrl: 'https://picsum.photos/seed/prod4/56/56', category: '精品飾品', price: 350,  stock: 60, status: '販售中'  },
    { id: 'PROD-1005', name: '羊駝抱枕',     imageUrl: 'https://picsum.photos/seed/prod5/56/56', category: '毛絨玩具', price: 890,  stock: 12, status: '販售中'  },
    { id: 'PROD-1006', name: '羊駝手機殼',   imageUrl: 'https://picsum.photos/seed/prod6/56/56', category: '3C配件',   price: 450,  stock: 8,  status: '審核中'  },
    { id: 'PROD-1007', name: '羊駝馬克杯',   imageUrl: 'https://picsum.photos/seed/prod7/56/56', category: '生活用品', price: 280,  stock: 40, status: '販售中'  },
  ];

  products: Product[] = [];

  ngOnInit() {
    this.pagination.init(this.allProducts.length, this.pageSize);
    this.loadProducts();
  }

  loadProducts() {
    const start = (this.pagination.currentPage - 1) * this.pageSize;
    this.products = this.allProducts.slice(start, start + this.pageSize);
  }
  getStatusBadge(status: string): string {
    const map: Record<string, string> = {
      販售中:  'badge-selling',
      審核中:  'badge-review',
      違規下架: 'badge-violated',
      下架:    'badge-offline',
    };
    return map[status] ?? '';
  }

  clearFilters() {}

  prevPage() { if (this.pagination.prevPage()) this.loadProducts(); }
  nextPage() { if (this.pagination.nextPage()) this.loadProducts(); }
  goToPage(page: number) { if (this.pagination.goToPage(page)) this.loadProducts(); }
}
export interface Product {
  id: string;
  name: string;
  imageUrl: string; //商品圖
  category: string; //分類
  price: number; //價格
  stock: number; //庫存
  status: string; //狀態
}
