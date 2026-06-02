import { Component, EventEmitter, Output } from '@angular/core';
import { EighteenAcademyService } from '../../@Services/eighteen-academy.service';
import { CategoriesService } from '../../@Services/categories.service';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Upload } from 'lucide-angular';
import { ProductServiceService, SearchProductReq } from '../../@Services/product-service.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-search-panel',
  imports: [LucideAngularModule, FormsModule],
  templateUrl: './search-panel.component.html',
  styleUrl: './search-panel.component.scss'
})
export class SearchPanelComponent {

  readonly UploadIcon = Upload;


  @Output() closePanel = new EventEmitter<void>();

  constructor(
      private aca: EighteenAcademyService,
      private category: CategoriesService,
      private router: Router,
      private route: ActivatedRoute,
      private productService: ProductServiceService
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

    this.closePanel.emit();
  }

  applyFilters() {

    // 先取得目前網址上的 filter
    const currentFilter =
      this.route.snapshot.queryParamMap.get('filter');

    const req: SearchProductReq =
      currentFilter
        ? JSON.parse(currentFilter)
        : {};

    // 價格
    if (this.filterForm.minPrice != null) {
      req.minPrice = this.filterForm.minPrice;
    }

    if (this.filterForm.maxPrice != null) {
      req.maxPrice = this.filterForm.maxPrice;
    }

    // 分類
    const selectedTypes = this.filterForm.categories
      .filter(c => c.selected)
      .map(c => c.value);

    if (selectedTypes.length) {
      req.types = selectedTypes;
    }

    // 年級
    const selectedDegrees = this.filterForm.degree
      .flatMap(d => {

        if (!d.selected) {
          return [];
        }

        const selectedChildren =
          d.children
            ?.filter(c => c.selected)
            .map(c => c.value) ?? [];

        return selectedChildren.length
          ? selectedChildren
          : [d.value];
      });

    if (selectedDegrees.length) {
      req.grade = selectedDegrees.join(',');
    }

    this.router.navigate(
      ['/product-list/all'],
      {
        queryParams: {
          filter: JSON.stringify(req)
        }
      }
    );

    this.closePanel.emit();
  }

}
