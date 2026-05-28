import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  LucideAngularModule,
  Search,
  MapPin,
  LayoutGrid,
  ChevronRight,
  ChevronLeft,
} from 'lucide-angular';
import { PaginationService } from '../../@Services/pageination.service';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ProductDialogComponent } from '../product-dialog/product-dialog.component';

@Component({
  selector: 'app-back-product',
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './back-product.component.html',
  styleUrl: './back-product.component.scss',
})
export class BackProductComponent {
  constructor(
    public pagination: PaginationService,
    private dialog: MatDialog,
  ) {}

  readonly SearchIcon = Search;
  readonly mapIcon = MapPin;
  readonly GridIcon = LayoutGrid;
  readonly nextIcon = ChevronRight;
  readonly prevIcon = ChevronLeft;

  readonly pageSize = 5;

  private allProducts: Product[] = [
    {
      id: 'PROD-1001',
      name: '手工羊駝公仔',
      imageUrl: 'https://picsum.photos/seed/prod1/56/56',
      category: '精品飾品',
      price: 1200,
      stock: 25,
      status: '販售中',
      description: '純手工製作，每隻獨一無二，適合收藏或送禮。',
      sellerName: '快樂羊駝',
      listedAt: '2026-04-01',
      condition: '全新',
      ageRating: '不限',
      location: '高雄',
    },
    {
      id: 'PROD-1002',
      name: '手工羊駝公仔',
      imageUrl: 'https://picsum.photos/seed/prod2/56/56',
      category: '毛絨玩具',
      price: 1200,
      stock: 30,
      status: '販售中',
      description: '柔軟毛絨材質，觸感極佳，小朋友的最愛。',
      sellerName: '林小美',
      listedAt: '2026-04-05',
      condition: '近全新',
      ageRating: '3歲以上',
      location: '台北',
    },
    {
      id: 'PROD-1003',
      name: '手工羊駝公仔',
      imageUrl: 'https://picsum.photos/seed/prod3/56/56',
      category: '精品飾品',
      price: 1200,
      stock: 5,
      status: '下架',
      description: '商品描述與實物不符，已下架處理。',
      sellerName: 'bad_seller',
      listedAt: '2026-03-20',
      condition: '二手',
      ageRating: '不限',
      location: '台中',
    },
    {
      id: 'PROD-1004',
      name: '羊駝鑰匙圈',
      imageUrl: 'https://picsum.photos/seed/prod4/56/56',
      category: '精品飾品',
      price: 350,
      stock: 60,
      status: '販售中',
      description: '輕巧可愛，多色可選，隨機出貨。',
      sellerName: 'Jason Wang',
      listedAt: '2026-04-10',
      condition: '全新',
      ageRating: '不限',
      location: '台南',
    },
    {
      id: 'PROD-1005',
      name: '羊駝抱枕',
      imageUrl: 'https://picsum.photos/seed/prod5/56/56',
      category: '毛絨玩具',
      price: 890,
      stock: 12,
      status: '販售中',
      description: '超大尺寸抱枕，適合擺放沙發或床頭。',
      sellerName: '林小美',
      listedAt: '2026-04-15',
      condition: '全新',
      ageRating: '不限',
      location: '高雄',
    },
    {
      id: 'PROD-1006',
      name: '羊駝手機殼',
      imageUrl: 'https://picsum.photos/seed/prod6/56/56',
      category: '3C配件',
      price: 450,
      stock: 8,
      status: '販售中',
      description: '適用 iPhone 15 系列，防摔耐磨材質。',
      sellerName: 'Amy Lee',
      listedAt: '2026-04-18',
      condition: '全新',
      ageRating: '不限',
      location: '台北',
    },
    {
      id: 'PROD-1007',
      name: '羊駝馬克杯',
      imageUrl: 'https://picsum.photos/seed/prod7/56/56',
      category: '生活用品',
      price: 280,
      stock: 40,
      status: '販售中',
      description: '陶瓷材質，容量 350ml，可微波加熱。',
      sellerName: '王大明',
      listedAt: '2026-04-20',
      condition: '全新',
      ageRating: '不限',
      location: '台中',
    },
    {
      id: 'PROD-1008',
      name: '羊駝頸枕',
      imageUrl: 'https://picsum.photos/seed/prod8/56/56',
      category: '旅行用品',
      price: 650,
      stock: 0,
      status: '下架',
      description: '記憶棉材質，長途旅行必備。',
      sellerName: 'Jason Wang',
      listedAt: '2026-03-01',
      condition: '全新',
      ageRating: '不限',
      location: '台南',
    },
    {
      id: 'PROD-1009',
      name: '羊駝書籤組',
      imageUrl: 'https://picsum.photos/seed/prod9/56/56',
      category: '文具',
      price: 120,
      stock: 0,
      status: '下架',
      description: '一組五入，PVC 材質防水耐用。',
      sellerName: '林小美',
      listedAt: '2026-03-10',
      condition: '全新',
      ageRating: '不限',
      location: '高雄',
    },
    {
      id: 'PROD-1010',
      name: '羊駝毛線球',
      imageUrl: 'https://picsum.photos/seed/prod10/56/56',
      category: '手工藝',
      price: 280,
      stock: 0,
      status: '下架',
      description: '商品照片與實物嚴重不符，已違規下架。',
      sellerName: 'bad_seller',
      listedAt: '2026-02-15',
      condition: '二手',
      ageRating: '不限',
      location: '台中',
    },
    {
      id: 'PROD-1011',
      name: '羊駝造型餅乾',
      imageUrl: 'https://picsum.photos/seed/prod11/56/56',
      category: '食品',
      price: 180,
      stock: 0,
      status: '下架',
      description: '食品類商品未附合格證明，已違規下架。',
      sellerName: 'bad_seller',
      listedAt: '2026-02-20',
      condition: '全新',
      ageRating: '不限',
      location: '台北',
    },
  ];

  products: Product[] = [];

  ngOnInit() {
    this.pagination.init(this.allProducts.length, this.pageSize);
    this.loadProducts();
  }

  searchQuery = '';
  selectedStatus = '';
  productStatuses = ['販售中', '下架'];

  selectStatus(status: string) {
    this.selectedStatus = this.selectedStatus === status ? '' : status;
    this.applyFilter();
  }

  search() {
    this.pagination.goToPage(1);
    this.applyFilter();
  }

  clearFilters() {
    this.searchQuery = '';
    this.selectedStatus = '';
    this.pagination.init(this.allProducts.length, this.pageSize);
    this.loadProducts();
  }

  applyFilter() {
    let filtered = this.allProducts;

    if (this.searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.name.includes(this.searchQuery) || p.id.includes(this.searchQuery),
      );
    }

    if (this.selectedStatus) {
      filtered = filtered.filter((p) => p.status === this.selectedStatus);
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
      販售中: 'badge-selling',
      違規下架: 'badge-violated',
      下架: 'badge-offline',
    };
    return map[status] ?? '';
  }

  selectProduct(item: Product) {
    const dialogRef = this.dialog.open(ProductDialogComponent, {
      width: '520px',
      data: item,
    });
  }

  prevPage() {
    if (this.pagination.prevPage()) this.loadProducts();
  }
  nextPage() {
    if (this.pagination.nextPage()) this.loadProducts();
  }
  goToPage(page: number) {
    if (this.pagination.goToPage(page)) this.loadProducts();
  }
}
export interface Product {
  id: string;
  name: string;
  imageUrl: string;
  category: string;
  price: number;
  stock: number;
  status: string;
  description: string; // 描述
  sellerName: string; // 賣方名稱
  listedAt: string; // 上架時間
  condition: string; // 商品狀況
  ageRating: string; // 商品使用年級
  location: string; // 商品在地
}
