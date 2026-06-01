import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LucideAngularModule, Search, Shapes, MapPin, Filter, Upload } from 'lucide-angular';
import { EighteenAcademyService } from '../../@Services/eighteen-academy.service';
import { CategoriesService } from '../../@Services/categories.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-bar',
  imports: [LucideAngularModule, CommonModule, FormsModule],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss'
})
export class SearchBarComponent {

  readonly FilterIcon = Filter;
  readonly UploadIcon = Upload;
  readonly SearchIcon = Search;
  readonly ShapesIcon = Shapes;
  readonly MapPinIcon = MapPin;

  isFilterOpen = false;
  keyword = '';

  filterForm = {
    minPrice: null,
    maxPrice: null,
    categories: [] as { label: string; value: string; selected: boolean }[],
    conditions: [] as { label: string; value: string; selected: boolean }[],
    degree: [
      {
        label: '學士', value: 'bachelor', selected: false,
        children: [
          { label: '大一',     value: 'freshman',    selected: false },
          { label: '大二',     value: 'sophomore',   selected: false },
          { label: '大三',     value: 'junior',      selected: false },
          { label: '大四以上', value: 'senior_plus', selected: false }
        ]
      },
      { label: '碩士', value: 'master', selected: false, children: undefined },
      { label: '博士', value: 'phd',    selected: false, children: undefined }
    ],
    academic: [] as { id: number; name: string; value: string; selected: boolean }[]
  };

  constructor(
    private aca: EighteenAcademyService,
    private category: CategoriesService,
    private router: Router
  ) {
    this.filterForm.categories = this.category.categories.map(c => ({
      label: c.label,
      value: c.value,
      selected: false
    }));

    this.filterForm.conditions = this.category.conditions.map(c => ({
      label: c.label,
      value: c.value,
      selected: false
    }));

    this.filterForm.academic = this.aca.academy.map(a => ({ ...a, selected: false }));
  }

  toggleFilter() {
    this.isFilterOpen = !this.isFilterOpen;
  }

  resetFilters() {
    this.filterForm.minPrice = null;
    this.filterForm.maxPrice = null;
    this.filterForm.categories.forEach(c => c.selected = false);
    this.filterForm.conditions.forEach(c => c.selected = false);
    this.filterForm.academic.forEach(a => a.selected = false);
    this.filterForm.degree.forEach(d => {
      d.selected = false;
      d.children?.forEach(c => c.selected = false);
    });
    this.isFilterOpen = false;
  }

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

  onSearch() {
    this.router.navigate(['/product-list/all'], { queryParams: { keyword: this.keyword } });
  }
}
