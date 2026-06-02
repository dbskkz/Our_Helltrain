import { Component, Input } from '@angular/core';

// 素材庫
import { LucideAngularModule, MapPin } from 'lucide-angular';
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
    private router: Router
    ){}

  readonly MapPinIcon= MapPin;

  ngOnInit(): void {
  }

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

  // 地點呈現
  formatLocation(locations: string[]): string {
    if (!locations || locations.length === 0) return '未提供地點';
    if (locations.length === 1) return locations[0];

    // 取得第一個地點，並計算剩餘數量
    return `${locations[0]}等 ${locations.length} 個地方`;
  }

  // 日期呈現
  // formatDate(date: string): string{
  //   const exactlyDate: Date = new Date(date);
  //   const today: Date = new Date();
  //   const diffDays = Math.floor((today.getTime() - exactlyDate.getTime()) / (1000 * 3600 * 24));
  //   const diffHours = Math.floor((today.getTime() - exactlyDate.getTime()) / (1000 * 3600));
  //   const diffMinutes = Math.floor((today.getTime() - exactlyDate.getTime()) / (1000 * 60));
  //   const diffSecond = Math.floor((today.getTime() - exactlyDate.getTime()) / (1000));

  //   // 因為商品一個月就自動下架所以不會有超過一個月的問題
  //   if (diffDays > 0)
  //   {
  //     return `${diffDays}天前`
  //   }
  //   else if (diffHours > 0)
  //   {
  //     return `${diffHours}小時前`
  //   }
  //   else if (diffMinutes > 0)
  //   {
  //     return `${diffMinutes}分鐘前`
  //   }

  //   return `${diffSecond}秒鐘前`
  // }

  // Gemini優化版
  formatDate(date: string): string {
    const diffMs = Date.now() - new Date(date).getTime();

    // 處理未來時間或極短時間差
    if (diffMs < 0) return "剛剛";

    const units = [
      { label: "天", seconds: 86400 },
      { label: "小時", seconds: 3600 },
      { label: "分鐘", seconds: 60 },
      { label: "秒鐘", seconds: 1 }
    ];

    const diffSeconds = Math.floor(diffMs / 1000);

    for (const unit of units) {
      const interval = Math.floor(diffSeconds / unit.seconds);
      if (interval >= 1) {
        return `${interval}${unit.label}前`;
      }
    }

    return "剛剛";
  }



  goToProductDetail(){
    this.router.navigate(['/product_page']);
  }

}
