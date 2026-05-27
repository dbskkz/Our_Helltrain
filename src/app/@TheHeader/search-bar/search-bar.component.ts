import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common'; // 為了 @if, @for
import { FormsModule } from '@angular/forms';

// 素材庫
import { LucideAngularModule, Search, Shapes, MapPin, Filter, Upload } from 'lucide-angular';
import { EighteenAcademyService } from '../../@Services/eighteen-academy.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-bar',
  imports: [LucideAngularModule, CommonModule, FormsModule],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss'
})
export class SearchBarComponent {

  constructor (
    private aca: EighteenAcademyService,
    private router: Router ) {}

  ngOnInit() {
    this.filterForm.academic = this.aca.academy;
  }

  // Declare icon
  readonly FilterIcon = Filter;
  readonly UploadIcon = Upload;
  readonly SearchIcon = Search;
  readonly ShapesIcon = Shapes;
  readonly MapPinIcon = MapPin;


  isFilterOpen = false;



// 篩選條件資料模型
  filterForm = {
    minPrice: null,
    maxPrice: null,
    categories: [
      { label: "書籍", value: 'books' , selected:false},
      { label: "專業器材", value: 'dept' , selected:false},
      { label: "生活用品", value: 'life' , selected:false},
      { label: "3C電子", value: 'tech' , selected:false},
      { label: "家具家電", value: 'furniture' , selected:false},
      { label: "其他", value: 'others' , selected:false}
    ],
    degree: [
      {
        label: "學士",
        value: "bachelor",
        selected: false,

        children: [
          { label: "大一", value: "freshman", selected: false },
          { label: "大二", value: "sophomore", selected: false },
          { label: "大三", value: "junior", selected: false },
          { label: "大四以上", value: "senior_plus", selected: false }
        ]
      },

      {
        label: "碩士",
        value: "master",
        selected: false
      },

      {
        label: "博士",
        value: "phd",
        selected: false
      }
    ],

    academic: [] as any



  };

  // 切換視窗
  toggleFilter() {
    this.isFilterOpen = !this.isFilterOpen;
  }

  // 重設篩選
  resetFilters() {
    this.filterForm.minPrice = null;
    this.filterForm.maxPrice = null;
    this.filterForm.categories.forEach(c => c.selected = false);
  }

  // 套用並送出
  applyFilters() {
    const selectedCategories = this.filterForm.categories
      .filter(c => c.selected)
      .map(c => c.label);

    console.log('目前的篩選條件：', {
      priceRange: `${this.filterForm.minPrice} - ${this.filterForm.maxPrice}`,
      categories: selectedCategories
    });

    this.isFilterOpen = false;
  }

  // 路由設定
  keyword = '';

  onSearch(){
    this.router.navigate(['/product-list/all'], { queryParams: {keyword:this.keyword} })
  }
}
