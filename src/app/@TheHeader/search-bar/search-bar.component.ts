import { Component } from '@angular/core';

// 素材庫
import { LucideAngularModule, Search, Shapes, MapPin } from 'lucide-angular';

@Component({
  selector: 'app-search-bar',
  imports: [LucideAngularModule],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss'
})
export class SearchBarComponent {
  // Declare icon
  readonly SearchIcon = Search;
  readonly ShapesIcon = Shapes;
  readonly MapPinIcon = MapPin;
}
