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
    this.goToPage(1);
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

  prevPage()              { this.pagination.prevPage(); window.scrollTo({ top: 0, behavior: 'smooth' }); }
  nextPage()              { this.pagination.nextPage(); window.scrollTo({ top: 0, behavior: 'smooth' }); }
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
    // this.pagination.goToPage(1);
  }

  // .ts 加這個
  clearAllFilters(event: Event): void {
    event.stopPropagation();
    this.resetFilters();
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
      title: '極簡黑後背包',
      price: 300,
      time: '2小時前',
      imgUrl: 'assets/bag.jpg',
      location: '新竹',
      quantity: 1,
      user: {
        userName: '生科吉娃娃甘霖',
        userImg: 'assets/avatar.jpg',
        university: '清大',
        department: '生科系',
        location: ['新竹', '高雄']
      }
    },

    {
      title: '二手 iPad 支架',
      price: 150,
      time: '5小時前',
      imgUrl: 'assets/ipad-stand.jpg',
      location: '台中',
      quantity: 1,
      user: {
        userName: '資工小海豹',
        userImg: 'assets/avatar2.jpg',
        university: '逢甲',
        department: '資工系',
        location: ['台中']
      }
    },

    {
      title: '日系奶茶色帆布袋',
      price: 220,
      time: '1天前',
      imgUrl: 'assets/bag2.jpg',
      location: '台北',
      quantity: 1,
      user: {
        userName: '企管水豚',
        userImg: 'assets/avatar3.jpg',
        university: '政大',
        department: '企管系',
        location: ['台北', '桃園']
      }
    },

    {
      title: '羅技無線滑鼠',
      price: 450,
      time: '3小時前',
      imgUrl: 'assets/mouse.jpg',
      location: '高雄',
      quantity: 1,
      user: {
        userName: '電機企鵝',
        userImg: 'assets/avatar4.jpg',
        university: '中山',
        department: '電機系',
        location: ['高雄']
      }
    },

    {
      title: '微積分課本',
      price: 180,
      time: '2天前',
      imgUrl: 'assets/book.jpg',
      location: '台南',
      quantity: 1,
      user: {
        userName: '數學狐狸',
        userImg: 'assets/avatar5.jpg',
        university: '成大',
        department: '數學系',
        location: ['台南']
      }
    },

    {
      title: '木質藍牙音響',
      price: 680,
      time: '4小時前',
      imgUrl: 'assets/speaker.jpg',
      location: '新竹',
      quantity: 1,
      user: {
        userName: '設計小鹿',
        userImg: 'assets/avatar6.jpg',
        university: '交大',
        department: '工設系',
        location: ['新竹', '台北']
      }
    },

    {
      title: '韓系白色桌燈',
      price: 350,
      time: '6小時前',
      imgUrl: 'assets/lamp.jpg',
      location: '嘉義',
      quantity: 1,
      user: {
        userName: '中文柴犬',
        userImg: 'assets/avatar7.jpg',
        university: '中正',
        department: '中文系',
        location: ['嘉義']
      }
    },

    {
      title: 'UNIQLO 連帽外套',
      price: 500,
      time: '1天前',
      imgUrl: 'assets/hoodie.jpg',
      location: '桃園',
      quantity: 1,
      user: {
        userName: '歷史貓咪',
        userImg: 'assets/avatar8.jpg',
        university: '中央',
        department: '歷史系',
        location: ['桃園']
      }
    },

    {
      title: '機械鍵盤',
      price: 1200,
      time: '8小時前',
      imgUrl: 'assets/keyboard.jpg',
      location: '高雄',
      quantity: 1,
      user: {
        userName: '資安鸚鵡',
        userImg: 'assets/avatar9.jpg',
        university: '高科大',
        department: '資安系',
        location: ['高雄', '屏東']
      }
    },

    {
      title: '無印風收納盒',
      price: 90,
      time: '30分鐘前',
      imgUrl: 'assets/storage.jpg',
      location: '台北',
      quantity: 2,
      user: {
        userName: '心理倉鼠',
        userImg: 'assets/avatar10.jpg',
        university: '台大',
        department: '心理系',
        location: ['台北']
      }
    },

    {
      title: 'Canon 相機腳架',
      price: 750,
      time: '3天前',
      imgUrl: 'assets/tripod.jpg',
      location: '宜蘭',
      quantity: 1,
      user: {
        userName: '傳播海豚',
        userImg: 'assets/avatar11.jpg',
        university: '世新',
        department: '傳播系',
        location: ['宜蘭', '台北']
      }
    },

    {
      title: 'AirPods 保護殼',
      price: 120,
      time: '5天前',
      imgUrl: 'assets/case.jpg',
      location: '彰化',
      quantity: 3,
      user: {
        userName: '法律松鼠',
        userImg: 'assets/avatar12.jpg',
        university: '東海',
        department: '法律系',
        location: ['彰化']
      }
    },

    {
      title: '小米行動電源',
      price: 400,
      time: '7小時前',
      imgUrl: 'assets/powerbank.jpg',
      location: '台中',
      quantity: 1,
      user: {
        userName: '物理狼犬',
        userImg: 'assets/avatar13.jpg',
        university: '中興',
        department: '物理系',
        location: ['台中']
      }
    },

    {
      title: '可折疊電腦桌',
      price: 900,
      time: '2天前',
      imgUrl: 'assets/table.jpg',
      location: '花蓮',
      quantity: 1,
      user: {
        userName: '地科海獺',
        userImg: 'assets/avatar14.jpg',
        university: '東華',
        department: '地科系',
        location: ['花蓮']
      }
    },

    {
      title: 'CASIO 電子錶',
      price: 650,
      time: '11小時前',
      imgUrl: 'assets/watch.jpg',
      location: '新北',
      quantity: 1,
      user: {
        userName: '哲學兔子',
        userImg: 'assets/avatar15.jpg',
        university: '輔大',
        department: '哲學系',
        location: ['新北']
      }
    },

    {
      title: '床邊小推車',
      price: 260,
      time: '4天前',
      imgUrl: 'assets/cart.jpg',
      location: '苗栗',
      quantity: 1,
      user: {
        userName: '化學河馬',
        userImg: 'assets/avatar16.jpg',
        university: '聯大',
        department: '化學系',
        location: ['苗栗']
      }
    },

    {
      title: 'Sony 耳罩耳機',
      price: 1800,
      time: '9小時前',
      imgUrl: 'assets/headphone.jpg',
      location: '台南',
      quantity: 1,
      user: {
        userName: '音樂熊貓',
        userImg: 'assets/avatar17.jpg',
        university: '南藝大',
        department: '音樂系',
        location: ['台南']
      }
    },

    {
      title: '白色洞洞板',
      price: 140,
      time: '1小時前',
      imgUrl: 'assets/board.jpg',
      location: '基隆',
      quantity: 1,
      user: {
        userName: '航管企鵝',
        userImg: 'assets/avatar18.jpg',
        university: '海大',
        department: '航管系',
        location: ['基隆']
      }
    },

    {
      title: '日文單字書',
      price: 200,
      time: '2天前',
      imgUrl: 'assets/japanese-book.jpg',
      location: '台北',
      quantity: 1,
      user: {
        userName: '日文狐狸',
        userImg: 'assets/avatar19.jpg',
        university: '淡江',
        department: '日文系',
        location: ['台北']
      }
    },

    {
      title: '宿舍小冰箱',
      price: 2500,
      time: '6天前',
      imgUrl: 'assets/fridge.jpg',
      location: '高雄',
      quantity: 1,
      user: {
        userName: '機械老虎',
        userImg: 'assets/avatar20.jpg',
        university: '高應大',
        department: '機械系',
        location: ['高雄']
      }
    },

    {
      title: '藍色瑜珈墊',
      price: 320,
      time: '13小時前',
      imgUrl: 'assets/yoga.jpg',
      location: '台中',
      quantity: 1,
      user: {
        userName: '護理綿羊',
        userImg: 'assets/avatar21.jpg',
        university: '中國醫',
        department: '護理系',
        location: ['台中']
      }
    },

    {
      title: '全新保溫杯',
      price: 280,
      time: '7天前',
      imgUrl: 'assets/cup.jpg',
      location: '屏東',
      quantity: 2,
      user: {
        userName: '海洋章魚',
        userImg: 'assets/avatar22.jpg',
        university: '屏大',
        department: '海洋系',
        location: ['屏東']
      }
    },

    {
      title: '拍立得相機',
      price: 2200,
      time: '10小時前',
      imgUrl: 'assets/camera.jpg',
      location: '新竹',
      quantity: 1,
      user: {
        userName: '攝影小貓',
        userImg: 'assets/avatar23.jpg',
        university: '玄奘',
        department: '影傳系',
        location: ['新竹']
      }
    },

    {
      title: '桌上型小風扇',
      price: 180,
      time: '2小時前',
      imgUrl: 'assets/fan.jpg',
      location: '雲林',
      quantity: 1,
      user: {
        userName: '農業水獺',
        userImg: 'assets/avatar24.jpg',
        university: '虎尾',
        department: '農業系',
        location: ['雲林']
      }
    },

    {
      title: '黑色長裙',
      price: 390,
      time: '1天前',
      imgUrl: 'assets/skirt.jpg',
      location: '台北',
      quantity: 1,
      user: {
        userName: '社會企鵝',
        userImg: 'assets/avatar25.jpg',
        university: '師大',
        department: '社教系',
        location: ['台北']
      }
    },

    {
      title: '繪圖板',
      price: 1600,
      time: '3天前',
      imgUrl: 'assets/tablet.jpg',
      location: '高雄',
      quantity: 1,
      user: {
        userName: '動畫狐狸',
        userImg: 'assets/avatar26.jpg',
        university: '樹德',
        department: '動畫系',
        location: ['高雄']
      }
    },

    {
      title: '透明資料夾組',
      price: 60,
      time: '5小時前',
      imgUrl: 'assets/folder.jpg',
      location: '台南',
      quantity: 5,
      user: {
        userName: '教育熊熊',
        userImg: 'assets/avatar27.jpg',
        university: '嘉藥',
        department: '教育系',
        location: ['台南']
      }
    },

    {
      title: '宿舍閱讀燈',
      price: 210,
      time: '12小時前',
      imgUrl: 'assets/reading-lamp.jpg',
      location: '新北',
      quantity: 1,
      user: {
        userName: '外文兔兔',
        userImg: 'assets/avatar28.jpg',
        university: '文化',
        department: '英文系',
        location: ['新北']
      }
    },

    {
      title: 'Switch 遊戲片',
      price: 980,
      time: '9天前',
      imgUrl: 'assets/game.jpg',
      location: '桃園',
      quantity: 1,
      user: {
        userName: '資管狐狸',
        userImg: 'assets/avatar29.jpg',
        university: '元智',
        department: '資管系',
        location: ['桃園']
      }
    },

    {
      title: '簡約白襯衫',
      price: 330,
      time: '8小時前',
      imgUrl: 'assets/shirt.jpg',
      location: '彰化',
      quantity: 1,
      user: {
        userName: '經濟海豹',
        userImg: 'assets/avatar30.jpg',
        university: '彰師大',
        department: '經濟系',
        location: ['彰化']
      }
    },

    {
      title: '藍芽小鍵盤',
      price: 520,
      time: '14小時前',
      imgUrl: 'assets/bluetooth-keyboard.jpg',
      location: '台中',
      quantity: 1,
      user: {
        userName: '統計小鹿',
        userImg: 'assets/avatar31.jpg',
        university: '靜宜',
        department: '統計系',
        location: ['台中']
      }
    },

    {
      title: '宿舍地毯',
      price: 450,
      time: '2天前',
      imgUrl: 'assets/carpet.jpg',
      location: '高雄',
      quantity: 1,
      user: {
        userName: '土木柴犬',
        userImg: 'assets/avatar32.jpg',
        university: '義守',
        department: '土木系',
        location: ['高雄']
      }
    }
  ];
}
