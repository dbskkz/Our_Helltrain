import { Component } from '@angular/core';

// 素材庫
import { LucideAngularModule, ArrowUpDown} from 'lucide-angular';

@Component({
  selector: 'app-product-listing',
  imports: [LucideAngularModule],
  templateUrl: './product-listing.component.html',
  styleUrl: './product-listing.component.scss'
})
export class ProductListingComponent {
  // Declare icon
  readonly ArrowUpDownIcon = ArrowUpDown;

  // Declare
  categoryName = "3C 產品"
}
