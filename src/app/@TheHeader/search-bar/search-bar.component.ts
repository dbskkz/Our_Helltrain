import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // 為了 @if, @for
import { FormsModule } from '@angular/forms';

// 素材庫
import { LucideAngularModule, Search, Shapes, MapPin, Filter, Upload } from 'lucide-angular';

@Component({
  selector: 'app-search-bar',
  imports: [LucideAngularModule, CommonModule, FormsModule],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss'
})
export class SearchBarComponent {
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

    academic: [
      { label: "資訊學群", value: "information", selected: false },
      { label: "工程學群", value: "engineering", selected: false },
      { label: "數理化學群", value: "science_math", selected: false },
      { label: "醫藥衛生學群", value: "medical", selected: false },
      { label: "生命科學學群", value: "life_science", selected: false },
      { label: "生物資源學群", value: "bio_resource", selected: false },
      { label: "地球與環境學群", value: "earth_environment", selected: false },
      { label: "建築與設計學群", value: "design_architecture", selected: false },
      { label: "藝術學群", value: "arts", selected: false },
      { label: "社會與心理學群", value: "social_psychology", selected: false },
      { label: "大眾傳播學群", value: "mass_communication", selected: false },
      { label: "外語學群", value: "foreign_language", selected: false },
      { label: "文史哲學群", value: "humanities", selected: false },
      { label: "教育學群", value: "education", selected: false },
      { label: "法政學群", value: "law_politics", selected: false },
      { label: "管理學群", value: "management", selected: false },
      { label: "財經學群", value: "finance", selected: false },
      { label: "遊憩與運動學群", value: "sports_leisure", selected: false }
  ],



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
}
