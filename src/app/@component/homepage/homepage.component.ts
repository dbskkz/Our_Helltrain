import { Component } from '@angular/core';

// 素材庫
import { LucideAngularModule, Filter, ArrowUpDown, ChevronDown, MapPin } from 'lucide-angular';
import { ProductCardComponent } from "../product-card/product-card.component";

@Component({
  selector: 'app-homepage',
  imports: [LucideAngularModule, ProductCardComponent],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss'
})
export class HomepageComponent {

  // Declare icon
  readonly FilterIcon = Filter;
  readonly ArrowUpDownIcon = ArrowUpDown;
  readonly ChevronDownIcon= ChevronDown;
  readonly MapPinIcon= MapPin;
}
