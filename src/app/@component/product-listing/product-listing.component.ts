import { ProductServiceService } from './../../@Services/product-service.service';
import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { Options } from '@angular-slider/ngx-slider';
import { FormsModule } from '@angular/forms';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PaginationService } from '../../@Services/pageination.service';

// 素材庫
import { LucideAngularModule, Home, ChevronRight, ChevronLeft, RotateCcw, X } from 'lucide-angular';
import { UiBehaviorService } from '../../@Services/ui-behavior.service';
import { ProductCardComponent } from '../product-card/product-card.component';
import { EighteenAcademyService } from '../../@Services/eighteen-academy.service';
import { ProductCard } from '../../@Interface/product-card';
import { CategoriesService } from '../../@Services/categories.service';
import { SearchProductReq } from '../../@Services/product-service.service';

// 網址用的 slug → type 中文名稱
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

@Component({
  selector: 'app-product-listing',
  imports: [LucideAngularModule, RouterLink, FormsModule, NgxSliderModule, ProductCardComponent],
  templateUrl: './product-listing.component.html',
  styleUrl: './product-listing.component.scss'
})
export class ProductListingComponent implements OnInit, OnDestroy {

  constructor(
    private route: ActivatedRoute,
    private uiBehavior: UiBehaviorService,
    private aca: EighteenAcademyService,
    public pagination: PaginationService,
    private productservice:ProductServiceService,
    private ctgService:CategoriesService
  ) {}

  // =========================================================
  // LIFECYCLE
  // =========================================================

  ngOnInit(): void {

    // 1. 常見分類
    this.route.paramMap.subscribe(params => {
      window.scrollTo({ top: 0, behavior: 'instant' });
      this.category = params.get('category') || 'all';
      this.loadProducts();
    });

    // 2. 自由篩選
    this.route.queryParamMap.subscribe(query => {
      window.scrollTo({ top: 0, behavior: 'instant' });

      // 處理來自 SearchBar 的文字篩選
      // this.keyword = query.get('keyword') || ''; // 文字搜尋

      // 處理來自 SearchPanel 的複雜篩選 (filter)
      const filterJson = query.get('filter');

      console.log('filterJson=', filterJson);

      if (filterJson) {
        try {
          this.searchReq = JSON.parse(filterJson);

          console.log('searchReq=', this.searchReq);

        } catch (e) {
          console.error('filter parse error', e);
          this.searchReq = {};
        }
      } else {
        this.searchReq = {};
      }


      // 接收來自 side-nav 的學群
      const deptsParam = query.get('depts');
      const selectedNames = deptsParam ? deptsParam.split(',') : [];
      this.department.forEach(d => {
        d.selected = selectedNames.includes(d.name); // .includes 回傳 boolean，所以這一行的意思就是 d.selected = true 或 false
      });

      this.loadProducts(); // ← 加這行，keyword 變了要重新計算分頁
    });

  }

  ngOnDestroy(): void {
    this.resetFilters();
    this.goToPage(1);
    this.resetQuery();

  }

  resetQuery(){
    this.category = 'all';
    this.searchReq = {};
  }



  // =========================================================
  // ICONS
  // =========================================================

  readonly HomeIcon     = Home;
  readonly nextIcon     = ChevronRight;
  readonly prevIcon     = ChevronLeft;
  readonly RotateCcwIcon = RotateCcw;
  readonly XIcon        = X;

  // =========================================================
  // CATEGORY
  // =========================================================

  searchReq: SearchProductReq = {};
  allProducts:ProductCard[] = [];
  // keyword: string | null = '';
  category: string | null = '';

  get categoryName(): string {

    if (this.searchReq.keyword) {
      return '搜尋結果';
    }

    if (this.category === 'all') {
      return '全部商品';
    }

    return CATEGORY_MAP[this.category!] || '全部商品';
  }

  loadProducts(){
    this.isLoading = true;

    const hasSearch =
    Object.keys(this.searchReq).length > 0;
    // this.keyword ||

    if (hasSearch) {
      // const req: SearchProductReq = {
      //   ...this.searchReq
      //   // keyword: this.keyword || this.searchReq.keyword
      // };

      this.productservice.search(this.searchReq).subscribe({
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

      return;
    }
    // 有 keyword → 用 search API
    // if (this.keyword) {
    //   // SearchBar 路徑：所有篩選條件都交給後端
    // const req: SearchProductReq = {
    //   keyword: this.keyword,
    //   minPrice: this.priceValue === this.DEFAULT_FILTERS.priceValue ? undefined : this.priceValue,
    //   maxPrice: this.priceHighValue === this.DEFAULT_FILTERS.priceHighValue ? undefined : this.priceHighValue,
    //   types:      this.type.filter(t => t.selected).map(t => t.label),
    //   // conditions: this.condition.filter(c => c.selected).map(c => c.value),
    //   // grades / deptGroups 如果 sidebar 有的話也帶進來
    // };

    // this.productservice.search(req).subscribe({
    //   next: (res) => {
    //     this.products = res.productList ?? [];
    //     this.updatePagination();
    //     this.isLoading = false;
    //   },
    //   error: (err) => {
    //     console.error('搜尋失敗', err);
    //     this.isLoading = false;
    //   }
    // });

    // }
    else if (this.category && this.category !== 'all')
    {

      const chineseCat = CATEGORY_MAP[this.category] ?? this.category;

      this.productservice.searchByType(chineseCat).subscribe({
        next: (res) => {
          console.log(res.message);

          this.products = res.productList ?? [];
          this.updatePagination();
          this.isLoading = false;
        },
        error: (err) => {
          console.error('類別載入失敗', err);
          this.isLoading = false;
        }
      });

    }
    else
    {
      // 沒有 keyword → 用 getAll，category 在前端過濾
      this.productservice.getAll().subscribe({
        next: (res) => {
          this.products = res.productList ?? [];
          this.updatePagination();
          this.isLoading = false;
        },
        error: (err) => {
          console.error('載入失敗', err);
          this.isLoading = false;
        }
      });
    }
  }

  products: ProductCard[] = [];
  isLoading = false;

  // =========================================================
  // PANEL OPEN / CLOSE
  // =========================================================

  panelState = {
    sort:     false,
    filter:   false,
  };

  togglePanel(event: Event, panel: keyof typeof this.panelState) {
    this.uiBehavior.togglePanel(event, this.panelState, panel);
  }

  @HostListener('document:click')
  closeMenu(): void {
    this.uiBehavior.closeAll(this.panelState);
  }

  // =========================================================
  // PRICE FILTER
  // =========================================================

  private readonly DEFAULT_FILTERS = {
    priceValue:     0,
    priceHighValue: 5000,
    sellerGrade:    1,
  } as const;

  priceValue     = this.DEFAULT_FILTERS.priceValue;
  priceHighValue = this.DEFAULT_FILTERS.priceHighValue;

  priceOptions: Options = {
    floor: 0,
    ceil: 5000,
    step: 200,
    translate: (value: number): string => {
      if (value >= 5000) return '$5,000+';
      return `$${value.toLocaleString()}`;
    }
  };

  // =========================================================
  // SELLER RATING FILTER
  // =========================================================

  sellerGrade = this.DEFAULT_FILTERS.sellerGrade;

  sellerGradeOptions: Options = {
    showTicksValues: true,
    stepsArray: [
      { value: 1 },
      { value: 2 },
      { value: 3 },
      { value: 4 },
      { value: 5 }
    ]
  };

  // =========================================================
  // FILTER CHANGE HANDLERS
  // =========================================================

  onCityChange() {
    this.pagination.goToPage(1);
    this.updatePagination();
  }

  onDeptChange() {
    this.pagination.goToPage(1);
    this.updatePagination();
  }

  // =========================================================
  // FILTER LABEL GETTERS
  // =========================================================

  get priceLabel(): string {
    const isDefault = this.priceValue     === this.DEFAULT_FILTERS.priceValue
                   && this.priceHighValue === this.DEFAULT_FILTERS.priceHighValue;
    return isDefault ? '價格區間' : `$${this.priceValue} - $${this.priceHighValue}+`;
  }

  get gradeLabel(): string {
    return this.sellerGrade === this.DEFAULT_FILTERS.sellerGrade
      ? '賣家評價'
      : `評價 ${this.sellerGrade}★ 以上`;
  }

  get locationLabel(): string {
    const selected = this.cities.filter(c => c.selected).map(c => c.name);
    if (selected.length === 0) return '地區';
    if (selected.length <= 2) return selected.join('、');
    return `${selected[0]} 等 ${selected.length} 個地區`;
  }

  get schoolLabel(): string {
    const selected = this.department.filter(d => d.selected).map(d => d.name);
    if (selected.length === 0) return '科系類別';
    if (selected.length <= 2) return selected.join('、');
    return `${selected[0]} 等 ${selected.length} 個學群`;
  }

  // =========================================================
  // ACTIVE FILTER TAGS
  // =========================================================

  get activeFilters(): { key: string; label: string }[] {
    const tags: { key: string; label: string }[] = [];
    if (this.priceLabel    !== '價格區間') tags.push({ key: 'price',    label: this.priceLabel });
    if (this.gradeLabel    !== '賣家評價') tags.push({ key: 'grade',    label: this.gradeLabel });
    if (this.locationLabel !== '地區')     tags.push({ key: 'location', label: this.locationLabel });
    if (this.schoolLabel   !== '科系類別') tags.push({ key: 'school',   label: this.schoolLabel });
    return tags;
  }



  removeFilter(key: string): void {
    if (key === 'price') {
      this.priceValue     = this.DEFAULT_FILTERS.priceValue;
      this.priceHighValue = this.DEFAULT_FILTERS.priceHighValue;
    }
    if (key === 'grade')    this.sellerGrade = this.DEFAULT_FILTERS.sellerGrade;
    if (key === 'location') this.cities.forEach(c => c.selected = false);
    if (key === 'school')   this.department.forEach(d => d.selected = false);
  }


// =========================================================
// SORT
// =========================================================

sortOption: 'newest' | 'price-asc' | 'price-desc' = 'newest';

setSort(option: typeof this.sortOption, event: Event): void {
  event.stopPropagation();
  this.sortOption = option;
  this.panelState.sort = false;
  this.pagination.goToPage(1);
}

get sortLabel(): string {
  const map = {
    'newest':     '最新上架',
    'price-asc':  '價格由低到高',
    'price-desc': '價格由高到低',
  };
  return map[this.sortOption];
}

get sortedProducts(): ProductCard[] {
  const list = [...this.filteredProducts];
  switch (this.sortOption) {
    case 'price-asc':  return list.sort((a, b) => a.price - b.price);
    case 'price-desc': return list.sort((a, b) => b.price - a.price);
    case 'newest':
    default:           return list; // 假設原始資料已是最新排序
  }
}

  // =========================================================
  // PAGINATION（每頁最多 30 筆）
  // =========================================================

  pageSize = 30;

  get pagedProducts(): ProductCard[] {
    const start = (this.pagination.currentPage - 1) * this.pageSize;
    return this.sortedProducts.slice(start, start + this.pageSize);
  }

  updatePagination(): void {
    this.pagination.init(
      this.filteredProducts.length,
      this.pageSize
    );
  }

  prevPage()              { this.pagination.prevPage(); window.scrollTo({ top: 0, behavior: 'smooth' }); }
  nextPage()              { this.pagination.nextPage(); window.scrollTo({ top: 0, behavior: 'smooth' }); }
  goToPage(page: number)  { this.pagination.goToPage(page); window.scrollTo({ top: 0, behavior: 'smooth' }); }

  // =========================================================
  // RESET
  // =========================================================

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

  // .ts 加這個
  clearAllFilters(event: Event): void {
    event.stopPropagation();
    this.resetFilters();
    this.resetQuery();
  }


  // =========================================================
  // 搜尋結果
  // =========================================================

  get filteredProducts(): ProductCard[]{
    return this.products.filter(product =>{

      // category 篩選（只在非 search 模式下有意義）
      const chineseCat = CATEGORY_MAP[this.category!];

      const matchCategory =
        !this.searchReq.keyword &&
        this.category !== 'all'
          ? product.type.includes(chineseCat)
          : true;

      // const matchKeyword =
      //   !this.keyword
      //   || product.title.includes(this.keyword)
      //   || product.type.includes(this.keyword)
      //   || product.location.includes(this.keyword);

      const matchPrice =
        product.price > this.priceValue && product.price < this.priceHighValue

      const selectedCity = this.cities
        .filter(c => c.selected)
        .map(c => c.name);

      const matchCity = selectedCity.length === 0
        || selectedCity.some(city => product.location.includes(city))

      const selectedSchool = this.department
        .filter(d => d.selected)
        .map(d => d.name);

      const matchSchool = selectedSchool.length === 0
        || selectedSchool.some(s => product.deptGroup.includes(s));

      const selectedTypes = this.type
        .filter(t => t.selected)
        .map(t => CATEGORY_MAP[t.value]);

      const matchType = selectedTypes.length === 0
        || selectedTypes.some(t => product.type.includes(t));

      const selectedConditions = this.condition
        .filter(c => c.selected)
        .map(c => c.label);

      const matchCondition = selectedConditions.length === 0
        || selectedConditions.includes(product.condition);

      return matchCity && matchType && matchCondition && matchCategory
      && matchSchool && matchPrice;

    })
  }


  // =========================================================
  // 假資料
  // =========================================================

  get type() : any[]{
    return this.ctgService.categories;
  }

  get condition() : any[]{
    return this.ctgService.conditions;
  }

  get department(): any[]{
    return this.aca.academy
  }

  cities = [
    { id: 1,  name: '基隆市', selected: false },
    { id: 2,  name: '台北市', selected: false },
    { id: 3,  name: '新北市', selected: false },
    { id: 4,  name: '桃園縣', selected: false },
    { id: 5,  name: '新竹市', selected: false },
    { id: 6,  name: '新竹縣', selected: false },
    { id: 7,  name: '苗栗縣', selected: false },
    { id: 8,  name: '台中市', selected: false },
    { id: 9,  name: '彰化縣', selected: false },
    { id: 10, name: '南投縣', selected: false },
    { id: 11, name: '雲林縣', selected: false },
    { id: 12, name: '嘉義市', selected: false },
    { id: 13, name: '嘉義縣', selected: false },
    { id: 14, name: '台南市', selected: false },
    { id: 15, name: '高雄市', selected: false },
    { id: 16, name: '屏東縣', selected: false },
    { id: 17, name: '台東縣', selected: false },
    { id: 18, name: '花蓮縣', selected: false },
    { id: 19, name: '宜蘭縣', selected: false },
    { id: 20, name: '澎湖縣', selected: false },
    { id: 21, name: '金門縣', selected: false },
    { id: 22, name: '連江縣', selected: false }
  ];

}
