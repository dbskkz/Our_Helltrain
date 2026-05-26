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

export interface Product {
  title: string;
  price: number;
  time: string;
  imgUrl: string;
  location: string;
  quantity?: number;
  user: {
    userName: string;
    userImg: string;
    university: string;
    department: string;
    location: string[];
  };
}

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
    public pagination: PaginationService
  ) {}

  // =========================================================
  // LIFECYCLE
  // =========================================================

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      window.scrollTo({ top: 0, behavior: 'auto' });
      this.category = params.get('category');
      this.loadProducts();
    });
  }

  ngOnDestroy(): void {
    this.resetFilters();
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

  category: string | null = '';
  categoryName = '全部商品';

  loadProducts() {
    this.pagination.init(this.allProducts.length, this.pageSize);
  }

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
    priceHighValue: -1,
    sellerGrade:    6
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

  onCityChange(): void {
    console.log(this.cities);
  }

  onDeptChange(): void {
    console.log(this.department);
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
  // PAGINATION（每頁最多 30 筆）
  // =========================================================

  pageSize = 30;

  get pagedProducts(): Product[] {
    const start = (this.pagination.currentPage - 1) * this.pageSize;
    return this.allProducts.slice(start, start + this.pageSize);
  }

  prevPage()              { this.pagination.prevPage();       window.scrollTo({ top: 0, behavior: 'smooth' }); }
  nextPage()              { this.pagination.nextPage();       window.scrollTo({ top: 0, behavior: 'smooth' }); }
  goToPage(page: number)  { this.pagination.goToPage(page); }

  // =========================================================
  // RESET
  // =========================================================

  resetFilters(): void {
    this.priceValue     = this.DEFAULT_FILTERS.priceValue;
    this.priceHighValue = this.DEFAULT_FILTERS.priceHighValue;
    this.sellerGrade    = this.DEFAULT_FILTERS.sellerGrade;
    this.cities.forEach(c => c.selected = false);
    this.department.forEach(d => d.selected = false);
    this.pagination.goToPage(1);
  }

  // =========================================================
  // 假資料
  // =========================================================

  department = [
    { id: 1,  name: '資訊學群',       selected: false },
    { id: 2,  name: '工程學群',       selected: false },
    { id: 3,  name: '數理化學群',     selected: false },
    { id: 4,  name: '醫藥衛生學群',   selected: false },
    { id: 5,  name: '生命科學學群',   selected: false },
    { id: 6,  name: '生物資源學群',   selected: false },
    { id: 7,  name: '地球與環境學群', selected: false },
    { id: 8,  name: '建築與設計學群', selected: false },
    { id: 9,  name: '藝術學群',       selected: false },
    { id: 10, name: '社會與心理學群', selected: false },
    { id: 11, name: '大眾傳播學群',   selected: false },
    { id: 12, name: '外語學群',       selected: false },
    { id: 13, name: '文史哲學群',     selected: false },
    { id: 14, name: '教育學群',       selected: false },
    { id: 15, name: '法政學群',       selected: false },
    { id: 16, name: '管理學群',       selected: false },
    { id: 17, name: '財經學群',       selected: false },
    { id: 18, name: '遊憩與運動學群', selected: false },
    { id: 19, name: '不拘',           selected: false }
  ];

  cities = [
    { id: 1,  name: '台北市', selected: false },
    { id: 2,  name: '新北市', selected: false },
    { id: 3,  name: '桃園市', selected: false },
    { id: 4,  name: '台中市', selected: false },
    { id: 5,  name: '台南市', selected: false },
    { id: 6,  name: '高雄市', selected: false },
    { id: 7,  name: '基隆市', selected: false },
    { id: 8,  name: '新竹市', selected: false },
    { id: 9,  name: '嘉義市', selected: false },
    { id: 10, name: '新竹縣', selected: false },
    { id: 11, name: '苗栗縣', selected: false },
    { id: 12, name: '彰化縣', selected: false },
    { id: 13, name: '南投縣', selected: false },
    { id: 14, name: '雲林縣', selected: false },
    { id: 15, name: '嘉義縣', selected: false },
    { id: 16, name: '屏東縣', selected: false },
    { id: 17, name: '宜蘭縣', selected: false },
    { id: 18, name: '花蓮縣', selected: false },
    { id: 19, name: '台東縣', selected: false },
    { id: 20, name: '澎湖縣', selected: false }
  ];

  allProducts: Product[] = [
    {
      title: 'MacBook Air M1',
      price: 22000,
      time: '2小時前',
      imgUrl: 'assets/macbook.jpg',
      location: '台北',
      quantity: 1,
      user: { userName: '資工狸貓', userImg: 'assets/avatar1.jpg', university: '台大', department: '資工系', location: ['台北'] }
    },
    {
      title: 'iPad Pro 11吋',
      price: 18000,
      time: '5小時前',
      imgUrl: 'assets/ipad.jpg',
      location: '新北',
      quantity: 1,
      user: { userName: '設計天鵝', userImg: 'assets/avatar2.jpg', university: '實踐', department: '設計系', location: ['新北'] }
    },
    {
      title: '二手教科書組',
      price: 350,
      time: '1天前',
      imgUrl: 'assets/books.jpg',
      location: '台中',
      quantity: 3,
      user: { userName: '法律貓咪', userImg: 'assets/avatar3.jpg', university: '東海', department: '法律系', location: ['台中'] }
    },
    {
      title: 'AirPods Pro 2代',
      price: 5500,
      time: '3小時前',
      imgUrl: 'assets/airpods.jpg',
      location: '高雄',
      quantity: 1,
      user: { userName: '音樂海豚', userImg: 'assets/avatar4.jpg', university: '中山', department: '音樂系', location: ['高雄'] }
    },
    {
      title: '機械鍵盤 Cherry MX',
      price: 1200,
      time: '6小時前',
      imgUrl: 'assets/keyboard.jpg',
      location: '桃園',
      quantity: 1,
      user: { userName: '電機松鼠', userImg: 'assets/avatar5.jpg', university: '中央', department: '電機系', location: ['桃園'] }
    }
  ];
}
