import { Component, HostListener, OnInit } from '@angular/core';
import { Options } from '@angular-slider/ngx-slider';
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { ActivatedRoute } from '@angular/router';

// 素材庫
import { LucideAngularModule, ArrowUpDown,Home} from 'lucide-angular';
import { UiBehaviorService } from '../../@Services/ui-behavior.service';
import { ProductCardComponent } from "../product-card/product-card.component";

@Component({
  selector: 'app-product-listing',
  imports: [LucideAngularModule,
    // BrowserModule,
    FormsModule,
    NgxSliderModule, ProductCardComponent],
  templateUrl: './product-listing.component.html',
  styleUrl: './product-listing.component.scss'
})

export class ProductListingComponent implements OnInit{

  constructor(
    private route: ActivatedRoute,
    private uiBehavior:UiBehaviorService
  ) {}


  // =========================================================
  // ICON
  // =========================================================

  readonly ArrowUpDownIcon = ArrowUpDown;
  readonly HomeIcon = Home;

  // =========================================================
  // CATEGORY
  // =========================================================

  category: string | null = '';
  categoryName = '全部商品';

  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {

      this.category = params.get('category');

      console.log('當前分類:', this.category);

      // TODO:
      // this.loadProducts(this.category);

    });

  }


  // =========================================================
  // FILTER PANEL OPEN/CLOSE
  // =========================================================


  panelState = {
    price: false,
    sort: false,
    grade: false,
    location: false,
    school: false
  }

  togglePanel(
    event: Event,
    panel: keyof typeof this.panelState
  )
  {
    this.uiBehavior.togglePanel(event, this.panelState, panel)
  }

  @HostListener('document:click')
  closeMenu(): void {

    this.uiBehavior.closeAll(this.panelState);

  }


  // =========================================================
  // FILTER VALUES
  // =========================================================


  private readonly DEFAULT_FILTERS = {
    priceValue:     0,
    priceHighValue: 10000,
    sellerGrade:    5
  } as const;


  // =========================================================
  // PRICE FILTER
  // =========================================================


  priceValue     = this.DEFAULT_FILTERS.priceValue;
  priceHighValue = this.DEFAULT_FILTERS.priceHighValue;

  priceOptions: Options = {
    floor: 0,
    ceil: 10000,
    step: 100,        // 每格 100 元
  translate: (value: number): string => `$${value.toLocaleString()}`
  };


  // =========================================================
  // SELLER RATING FILTER SLIDER
  // =========================================================


  sellerGrade    = this.DEFAULT_FILTERS.sellerGrade;

  sellerGradeOptions: Options = {
    showTicksValues: true,
    stepsArray: [
      { value: 1},
      { value: 2},
      { value: 3},
      { value: 4},
      // { value: 5, legend: "五星好評" }
      { value: 5 }
    ]
  };


  // =========================================================
  // TODO FILTER
  // =========================================================


  onCityChange(): void {

    console.log(this.cities);

  }

  onSchoolChange(): void {

    console.log(this.schools);

  }

  onDeptChange(): void {

    console.log(this.department);

  }

  // =========================================================
  // BUTTON LABEL GETTERS
  // =========================================================




  get priceLabel(): string {
    const isDefault = this.priceValue === this.DEFAULT_FILTERS.priceValue
                  && this.priceHighValue === this.DEFAULT_FILTERS.priceHighValue;
    return isDefault
      ? '價格區間'
      : `$${this.priceValue} - $${this.priceHighValue}`;
  }

  get gradeLabel(): string {
    return this.sellerGrade === this.DEFAULT_FILTERS.sellerGrade
      ? '賣家評價'
      : `評價 ${this.sellerGrade}★ 以上`;
  }

  get locationLabel(): string {
    const selected = this.cities
      .filter(c => c.selected)
      .map(c => c.name);

    if (selected.length === 0) return '地區';
    if (selected.length <= 2) return selected.join('、');
    return `${selected[0]} 等 ${selected.length} 個地區`;
  }

  get schoolLabel(): string {
    const selectedSchools = this.schools.filter(s => s.selected);
    const selectedDepts = this.department.filter(d => d.selected);
    const total = selectedSchools.length + selectedDepts.length;

    if (total === 0) return '校系';

    const parts: string[] = [];
    if (selectedSchools.length > 0) parts.push(`${selectedSchools.length} 所學校`);
    if (selectedDepts.length > 0) parts.push(`${selectedDepts.length} 個科系`);
    return parts.join('、');
  }


  // =========================================================
  // reset
  // =========================================================


  ngOnDestroy(): void {
    this.resetFilters();
  }

  resetFilters(): void {
    this.priceValue     = this.DEFAULT_FILTERS.priceValue;
    this.priceHighValue = this.DEFAULT_FILTERS.priceHighValue;
    this.sellerGrade    = this.DEFAULT_FILTERS.sellerGrade;
    this.cities.forEach(c => c.selected = false);
    this.schools.forEach(s => s.selected = false);
    this.department.forEach(d => d.selected = false);
  }


  // =========================================================
  // 假資料
  // =========================================================

  schools = [
    { id: 1, name: '國立臺灣大學', selected: false },
    { id: 2, name: '國立清華大學', selected: false },
    { id: 3, name: '國立陽明交通大學', selected: false },
    { id: 4, name: '國立成功大學', selected: false },
    { id: 5, name: '國立政治大學', selected: false },
    { id: 6, name: '國立中央大學', selected: false },
    { id: 7, name: '國立中山大學', selected: false },
    { id: 8, name: '國立臺灣師範大學', selected: false },
    { id: 9, name: '國立臺北科技大學', selected: false },
    { id: 10, name: '國立高雄科技大學', selected: false },
    { id: 11, name: '國立雲林科技大學', selected: false },
    { id: 12, name: '國立屏東科技大學', selected: false },
    { id: 13, name: '淡江大學', selected: false },
    { id: 14, name: '輔仁大學', selected: false },
    { id: 15, name: '東海大學', selected: false },
    { id: 16, name: '逢甲大學', selected: false },
    { id: 17, name: '中原大學', selected: false },
    { id: 18, name: '元智大學', selected: false },
    { id: 19, name: '長庚大學', selected: false },
    { id: 20, name: '銘傳大學', selected: false },
    { id: 21, name: '世新大學', selected: false },
    { id: 22, name: '實踐大學', selected: false },
    { id: 23, name: '中國文化大學', selected: false },
    { id: 24, name: '靜宜大學', selected: false },
    { id: 25, name: '亞洲大學', selected: false },
    { id: 26, name: '義守大學', selected: false },
    { id: 27, name: '南臺科技大學', selected: false },
    { id: 28, name: '朝陽科技大學', selected: false },
    { id: 29, name: '樹德科技大學', selected: false },
    { id: 30, name: '崑山科技大學', selected: false }
  ];

  department = [
    { id: 1, name: '資訊工程學系', selected: false },
    { id: 2, name: '資訊管理學系', selected: false },
    { id: 3, name: '電機工程學系', selected: false },
    { id: 4, name: '電子工程學系', selected: false },
    { id: 5, name: '機械工程學系', selected: false },
    { id: 6, name: '企業管理學系', selected: false },
    { id: 7, name: '財務金融學系', selected: false },
    { id: 8, name: '法律學系', selected: false }
  ];


  cities = [

    { id: 1, name: '台北市', selected: false },
    { id: 2, name: '新北市', selected: false },
    { id: 3, name: '桃園市', selected: false },
    { id: 4, name: '台中市', selected: false },
    { id: 5, name: '台南市', selected: false },
    { id: 6, name: '高雄市', selected: false },
    { id: 7, name: '基隆市', selected: false },
    { id: 8, name: '新竹市', selected: false },
    { id: 9, name: '嘉義市', selected: false }

  ];

  // products = [
  //   {
  //     title: '極簡黑後背包',
  //     price: 300,
  //     university: '清大',
  //     location: '新竹',
  //     time: '2小時前',
  //     category: '生科系',
  //     imgUrl: 'assets/bag.jpg',
  //     userImg: 'assets/avatar.jpg'
  //   },
  //   {
  //     title: '極簡黑後背包',
  //     price: 300,
  //     university: '清大',
  //     location: '新竹',
  //     time: '2小時前',
  //     category: '生科系',
  //     imgUrl: 'assets/bag.jpg',
  //     userImg: 'assets/avatar.jpg'
  //   },
  //   {
  //     title: '極簡黑後背包',
  //     price: 300,
  //     university: '清大',
  //     location: '新竹',
  //     time: '2小時前',
  //     category: '生科系',
  //     imgUrl: 'assets/bag.jpg',
  //     userImg: 'assets/avatar.jpg'
  //   },
  //   {
  //     title: '極簡黑後背包',
  //     price: 300,
  //     university: '清大',
  //     location: '新竹',
  //     time: '2小時前',
  //     category: '生科系',
  //     imgUrl: 'assets/bag.jpg',
  //     userImg: 'assets/avatar.jpg'
  //   },
  //   {
  //     title: '極簡黑後背包',
  //     price: 300,
  //     university: '清大',
  //     location: '新竹',
  //     time: '2小時前',
  //     category: '生科系',
  //     imgUrl: 'assets/bag.jpg',
  //     userImg: 'assets/avatar.jpg'
  //   },
  //   // ... 更多資料
  // ];


  products = [
    {
      title: '極簡黑後背包',
      price: 300,
      time: '2小時前',
      imgUrl: 'assets/bag.jpg',
      location: '新竹',
      user:
        {
          userName: '生科吉娃娃',
          userImg: 'assets/avatar.jpg',
          university: '清大',
          department: '生科系',
          location: ['新竹','高雄']
        }
    },

  ];
}
