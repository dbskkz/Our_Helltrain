import { Component } from '@angular/core';

// 素材庫
import { LucideAngularModule, Filter, ArrowUpDown, ChevronDown, MapPin } from 'lucide-angular';


@Component({
  selector: 'app-product-card',
  imports: [LucideAngularModule,],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})
export class ProductCardComponent {

  readonly MapPinIcon= MapPin;

  products = [
    {
      title: '極簡黑後背包',
      price: 300,
      university: '清大',
      location: '新竹',
      time: '2小時前',
      category: '生科系',
      imgUrl: 'assets/bag.jpg',
      userImg: 'assets/avatar.jpg'
    },
    {
      title: '極簡黑後背包',
      price: 300,
      university: '清大',
      location: '新竹',
      time: '2小時前',
      category: '生科系',
      imgUrl: 'assets/bag.jpg',
      userImg: 'assets/avatar.jpg'
    },
    {
      title: '極簡黑後背包',
      price: 300,
      university: '清大',
      location: '新竹',
      time: '2小時前',
      category: '生科系',
      imgUrl: 'assets/bag.jpg',
      userImg: 'assets/avatar.jpg'
    },
    {
      title: '極簡黑後背包',
      price: 300,
      university: '清大',
      location: '新竹',
      time: '2小時前',
      category: '生科系',
      imgUrl: 'assets/bag.jpg',
      userImg: 'assets/avatar.jpg'
    },
    {
      title: '極簡黑後背包',
      price: 300,
      university: '清大',
      location: '新竹',
      time: '2小時前',
      category: '生科系',
      imgUrl: 'assets/bag.jpg',
      userImg: 'assets/avatar.jpg'
    },
    // ... 更多資料
  ];

}
