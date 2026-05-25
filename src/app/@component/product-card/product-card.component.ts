import { Component, Input } from '@angular/core';

// 素材庫
import { LucideAngularModule, Filter, ArrowUpDown, ChevronDown, MapPin } from 'lucide-angular';

export interface Product {
  title: string;
  price: number;
  time: string;
  imgUrl: string;
  location: string;
  quantity?: number;
  user: {
    userName: string;
    userImg: string;
    university: string;
    department: string;
    location: string[];
  };
}


@Component({
  selector: 'app-product-card',
  imports: [LucideAngularModule,],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})


export class ProductCardComponent {

readonly MapPinIcon= MapPin;


  // 接收外部傳入的商品列表（必填）
  @Input() products: Product[] = [];

  // 最多顯示幾筆，預設不限制（0 = 全部）
  @Input() maxItems: number = 0;

  get displayedProducts(): Product[] {
    if (this.maxItems > 0) {
      return this.products.slice(0, this.maxItems);
    }
    return this.products;
  }

// products = [
//     {
//       title: '極簡黑後背包',
//       price: 300,
//       time: '2小時前',
//       imgUrl: 'assets/bag.jpg',
//       location: '新竹',
//       quantity: 1,
//       user:
//         {
//           userName: '生科吉娃娃甘霖',
//           userImg: 'assets/avatar.jpg',
//           university: '清大',
//           department: '生科系',
//           location: ['新竹','高雄']
//         }
//     },
//    {
//       title: '極簡黑後背包',
//       price: 300,
//       time: '2小時前',
//       imgUrl: 'assets/bag.jpg',
//       location: '新竹',
//       quantity: 1,
//       user:
//         {
//           userName: '生科吉娃娃甘霖',
//           userImg: 'assets/avatar.jpg',
//           university: '清大',
//           department: '生科系',
//           location: ['新竹','高雄']
//         }
//     },{
//       title: '極簡黑後背包',
//       price: 300,
//       time: '2小時前',
//       imgUrl: 'assets/bag.jpg',
//       location: '新竹',
//       quantity: 1,
//       user:
//         {
//           userName: '生科吉娃娃甘霖',
//           userImg: 'assets/avatar.jpg',
//           university: '清大',
//           department: '生科系',
//           location: ['新竹','高雄']
//         }
//     },{
//       title: '極簡黑後背包',
//       price: 300,
//       time: '2小時前',
//       imgUrl: 'assets/bag.jpg',
//       location: '新竹',
//       quantity: 1,
//       user:
//         {
//           userName: '生科吉娃娃甘霖',
//           userImg: 'assets/avatar.jpg',
//           university: '清大',
//           department: '生科系',
//           location: ['新竹','高雄']
//         }
//     },{
//       title: '極簡黑後背包',
//       price: 300,
//       time: '2小時前',
//       imgUrl: 'assets/bag.jpg',
//       location: '新竹',
//       quantity: 1,
//       user:
//         {
//           userName: '生科吉娃娃甘霖',
//           userImg: 'assets/avatar.jpg',
//           university: '清大',
//           department: '生科系',
//           location: ['新竹','高雄']
//         }
//     },
//   ];

}
