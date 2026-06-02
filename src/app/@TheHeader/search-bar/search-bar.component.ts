import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LucideAngularModule, Search, Shapes, MapPin, Filter } from 'lucide-angular';
import { SearchPanelComponent } from '../search-panel/search-panel.component';

@Component({
  selector: 'app-search-bar',
  imports: [LucideAngularModule, CommonModule, FormsModule, SearchPanelComponent],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss'
})
export class SearchBarComponent {

  readonly FilterIcon = Filter;
  readonly SearchIcon = Search;
  readonly ShapesIcon = Shapes;
  readonly MapPinIcon = MapPin;

  isFilterOpen = false;
  keyword = '';

  constructor(private router: Router) {}

  toggleFilter() {
    this.isFilterOpen = !this.isFilterOpen;
  }

  onSearch() {
    this.router.navigate(['/product-list/all'], { queryParams: { keyword: this.keyword } });
  }
}
