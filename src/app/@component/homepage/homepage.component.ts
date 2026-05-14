import { Component } from '@angular/core';

// 素材庫
import { LucideAngularModule, Filter, ArrowUpDown, ChevronDown, MapPin } from 'lucide-angular';

@Component({
  selector: 'app-homepage',
  imports: [LucideAngularModule],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss'
})
export class HomepageComponent {

  // Declare icon
  readonly FilterIcon = Filter;
  readonly ArrowUpDownIcon = ArrowUpDown;
  readonly ChevronDownIcon= ChevronDown;
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
