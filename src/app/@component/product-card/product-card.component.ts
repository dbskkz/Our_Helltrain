import { Component, Input } from '@angular/core';

// 素材庫
import { LucideAngularModule, Filter, ArrowUpDown, ChevronDown, MapPin } from 'lucide-angular';
import { ProductCard } from '../../@Interface/product-card';
import { Router } from '@angular/router';


@Component({
  selector: 'app-product-card',
  imports: [LucideAngularModule,],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})


export class ProductCardComponent {

  constructor(
    private router: Router,
    ){}

readonly MapPinIcon= MapPin;


  // 接收外部傳入的商品列表（必填）
  @Input() products: ProductCard[] = [];

  // 最多顯示幾筆，預設不限制（0 = 全部）
  @Input() maxItems: number = 0;

  get displayedProducts(): ProductCard[] {
    if (this.maxItems > 0) {
      return this.products.slice(0, this.maxItems);
    }
    return this.products;
  }

  goToProductDetail(){
    this.router.navigate(['/product_page']);
  }

}
