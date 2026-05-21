import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  LucideAngularModule,
  Search,
  MapPin,
  LayoutGrid, ChevronRight ,ChevronLeft
} from 'lucide-angular';
import { PaginationService } from '../../@Services/pageination.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-back-product',
  imports: [CommonModule, FormsModule, LucideAngularModule],
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

  allProducts: Product[] = [
    { id: 'PROD-1001', name: '手工羊駝公仔', imageUrl: 'https://picsum.photos/seed/prod1/56/56', category: '精品飾品', price: 1200, status: '販售中'  },
    { id: 'PROD-1002', name: '手工羊駝公仔', imageUrl: 'https://picsum.photos/seed/prod2/56/56', category: '毛絨玩具', price: 1200, status: '違規下架'  },
    { id: 'PROD-1003', name: '手工羊駝公仔', imageUrl: 'https://picsum.photos/seed/prod3/56/56', category: '精品飾品', price: 1200, status: '違規下架' },
    { id: 'PROD-1004', name: '羊駝鑰匙圈',   imageUrl: 'https://picsum.photos/seed/prod4/56/56', category: '精品飾品', price: 350, status: '販售中'  },
    { id: 'PROD-1005', name: '羊駝抱枕',     imageUrl: 'https://picsum.photos/seed/prod5/56/56', category: '毛絨玩具', price: 890, status: '販售中'  },
    { id: 'PROD-1006', name: '羊駝手機殼',   imageUrl: 'https://picsum.photos/seed/prod6/56/56', category: '3C配件',   price: 450, status: '違規下架'  },
    { id: 'PROD-1007', name: '羊駝馬克杯',   imageUrl: 'https://picsum.photos/seed/prod7/56/56', category: '生活用品', price: 280, status: '販售中'  },
    { id: 'PROD-1008', name: '羊駝頸枕',     imageUrl: 'https://picsum.photos/seed/prod8/56/56',  category: '旅行用品', price: 650, status: '下架'    },
    { id: 'PROD-1009', name: '羊駝書籤組',   imageUrl: 'https://picsum.photos/seed/prod9/56/56',  category: '文具',     price: 120, status: '下架'    },
    { id: 'PROD-1010', name: '羊駝毛線球',   imageUrl: 'https://picsum.photos/seed/prod10/56/56', category: '手工藝',   price: 280, status: '違規下架' },
    { id: 'PROD-1011', name: '羊駝造型餅乾', imageUrl: 'https://picsum.photos/seed/prod11/56/56', category: '食品',     price: 180, status: '違規下架' },
  ];

  products: Product[] = [];

  ngOnInit() {
    this.pagination.init(this.allProducts.length, this.pageSize);
    this.loadProducts();
  }

  searchQuery = '';
selectedStatus = '';
productStatuses = ['販售中', '違規下架', '下架'];

selectStatus(status: string) {
  this.selectedStatus = this.selectedStatus === status ? '' : status;
  this.applyFilter();
}

search() {
  this.pagination.goToPage(1);
  this.applyFilter();
}

clearFilters() {
  this.searchQuery    = '';
  this.selectedStatus = '';
  this.pagination.init(this.allProducts.length, this.pageSize);
  this.loadProducts();
}

applyFilter() {
  let filtered = this.allProducts;

  if (this.searchQuery) {
    filtered = filtered.filter(p =>
      p.name.includes(this.searchQuery) ||
      p.id.includes(this.searchQuery)
    );
  }

  if (this.selectedStatus) {
    filtered = filtered.filter(p => p.status === this.selectedStatus);
  }

  this.pagination.init(filtered.length, this.pageSize);
  const start = (this.pagination.currentPage - 1) * this.pageSize;
  this.products = filtered.slice(start, start + this.pageSize);
}

  loadProducts() {
    const start = (this.pagination.currentPage - 1) * this.pageSize;
    this.products = this.allProducts.slice(start, start + this.pageSize);
    // this.applyFilter();
  }
  getStatusBadge(status: string): string {
    const map: Record<string, string> = {
      販售中:  'badge-selling',
      違規下架: 'badge-violated',
      下架:    'badge-offline',
    };
    return map[status] ?? '';
  }

  selectProductStatus(event:Event){
  }

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
  status: string; //狀態
}
