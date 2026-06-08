import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { ProductCard } from '../@Interface/product-card';
import { ProductServiceService, GetProductDataRes, SearchProductReq } from './product-service.service';
import { PaginationService } from './pageination.service';
import { CategoriesService } from './categories.service';
import { EighteenAcademyService } from './eighteen-academy.service';

const CATEGORY_MAP: Record<string, string> = {
  'books':       '教科書',
  'equipment':   '專業器材',
  'daily':       '日用品',
  'electronics': '3C電子',
  'furniture':   '家具家電',
  'notes':       '筆記考古',
  'fashion':     '服飾配件',
  'sports':      '戶外運動',
  'graduation':  '畢業季',
};

export { CATEGORY_MAP };

@Injectable({ providedIn: 'root' })
export class ProductListingStateService {

  // ── 狀態 ──────────────────────────────────────────────
  products: ProductCard[] = [];
  isLoading = false;

  category: string | null = 'all';
  searchReq: SearchProductReq = {};

  sortOption: 'newest' | 'price-asc' | 'price-desc' = 'newest';

  readonly DEFAULT_FILTERS = {
    priceValue:     0,
    priceHighValue: 5000,
    sellerGrade:    1,
    condition:      '',
    type:           '',
  } as const;

  priceValue     = this.DEFAULT_FILTERS.priceValue;
  priceHighValue = this.DEFAULT_FILTERS.priceHighValue;
  sellerGrade    = this.DEFAULT_FILTERS.sellerGrade;

  constructor(
    private productservice: ProductServiceService,
    public  pagination: PaginationService,
    private ctgService: CategoriesService,
    private aca: EighteenAcademyService,
  ) {}

  // ── 資料來源 getter ────────────────────────────────────
  get type()       { return this.ctgService.categories; }
  get condition()  { return this.ctgService.conditions; }
  get department() { return this.aca.academy; }
  get cities()     { return this.ctgService.cities; }

  // ── 載入商品 ───────────────────────────────────────────
  loadProducts(): void {
    this.isLoading = true;
    const hasSearch = Object.keys(this.searchReq).length > 0;

    if (hasSearch) {
      this.handleResponse(this.productservice.search(this.searchReq));
    } else if (this.category && this.category !== 'all') {
      const chineseCat = CATEGORY_MAP[this.category] ?? this.category;
      this.handleResponse(this.productservice.searchByType(chineseCat));
    } else {
      this.handleResponse(this.productservice.getAll());
    }
  }

  loadByUniversity(universityName: string): void {
    this.isLoading = true;
    this.handleResponse(this.productservice.getByUniversity(universityName));
  }

  handleResponse(observable: Observable<GetProductDataRes>): void {
    observable.subscribe({
      next: (res) => {
        this.products = res.productList ?? [];
        this.updatePagination();
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  // ── 篩選邏輯 ───────────────────────────────────────────
  matchPrice(product: ProductCard): boolean {
    if (this.priceHighValue >= 5000) return product.price >= this.priceValue;
    return product.price >= this.priceValue && product.price <= this.priceHighValue;
  }

  matchCity(product: ProductCard): boolean {
    const selected = this.cities.filter(c => c.selected).map(c => c.name);
    return selected.length === 0 || selected.some(city => product.location.includes(city));
  }

  matchSchool(product: ProductCard): boolean {
    const selected = this.department.filter(d => d.selected).map(d => d.name);
    return selected.length === 0 || selected.some(s => product.deptGroup.includes(s));
  }

  matchType(product: ProductCard): boolean {
    const selected = this.type.filter(t => t.selected).map(t => CATEGORY_MAP[t.value]);
    return selected.length === 0 || selected.some(t => product.type.includes(t));
  }

  matchCondition(product: ProductCard): boolean {
    const selected = this.condition.filter(c => c.selected).map(c => c.label);
    return selected.length === 0 || selected.includes(product.condition);
  }

  matchCategory(product: ProductCard): boolean {
    const chineseCat = CATEGORY_MAP[this.category!];
    return (!this.searchReq.keyword && this.category !== 'all')
      ? product.type.includes(chineseCat)
      : true;
  }

  get filteredProducts(): ProductCard[] {
    return this.products.filter(p =>
      this.matchCategory(p) &&
      this.matchPrice(p) &&
      this.matchCity(p) &&
      this.matchSchool(p) &&
      this.matchType(p) &&
      this.matchCondition(p)
    );
  }

  get sortedProducts(): ProductCard[] {
    const list = [...this.filteredProducts];
    if (this.sortOption === 'price-asc')  return list.sort((a, b) => a.price - b.price);
    if (this.sortOption === 'price-desc') return list.sort((a, b) => b.price - a.price);
    return list;
  }

  // ── 分頁 ───────────────────────────────────────────────
  pageSize = 30;

  updatePagination(): void {
    this.pagination.init(this.filteredProducts.length, this.pageSize);
  }

  get pagedProducts(): ProductCard[] {
    const start = (this.pagination.currentPage - 1) * this.pageSize;
    return this.sortedProducts.slice(start, start + this.pageSize);
  }

  // ── 重設 ───────────────────────────────────────────────
  resetFilters(): void {
    this.priceValue     = this.DEFAULT_FILTERS.priceValue;
    this.priceHighValue = this.DEFAULT_FILTERS.priceHighValue;
    this.sellerGrade    = this.DEFAULT_FILTERS.sellerGrade;
    this.cities.forEach(c => c.selected = false);
    this.department.forEach(d => d.selected = false);
    this.type.forEach(t => t.selected = false);
    this.condition.forEach(c => c.selected = false);
    this.pagination.goToPage(1);
  }

  resetQuery(): void {
    this.searchReq = {};
  }
}
