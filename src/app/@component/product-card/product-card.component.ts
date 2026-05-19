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

  // products = [
  //   {
  //     title: '極簡黑後背包',
  //     price: 300,
  //     university: '清大',
  //     location: '新竹',
  //     time: '2小時前',
  //     category: '生科系',
  //     imgUrl: 'assets/bag.jpg',
  //     userImg: 'assets/avatar.jpg'
  //   },
  //   {
  //     title: '極簡黑後背包',
  //     price: 300,
  //     university: '清大',
  //     location: '新竹',
  //     time: '2小時前',
  //     category: '生科系',
  //     imgUrl: 'assets/bag.jpg',
  //     userImg: 'assets/avatar.jpg'
  //   },
  //   {
  //     title: '極簡黑後背包',
  //     price: 300,
  //     university: '清大',
  //     location: '新竹',
  //     time: '2小時前',
  //     category: '生科系',
  //     imgUrl: 'assets/bag.jpg',
  //     userImg: 'assets/avatar.jpg'
  //   },
  //   {
  //     title: '極簡黑後背包',
  //     price: 300,
  //     university: '清大',
  //     location: '新竹',
  //     time: '2小時前',
  //     category: '生科系',
  //     imgUrl: 'assets/bag.jpg',
  //     userImg: 'assets/avatar.jpg'
  //   },
  //   {
  //     title: '極簡黑後背包',
  //     price: 300,
  //     university: '清大',
  //     location: '新竹',
  //     time: '2小時前',
  //     category: '生科系',
  //     imgUrl: 'assets/bag.jpg',
  //     userImg: 'assets/avatar.jpg'
  //   },
  //   // ... 更多資料
  // ];
products = [
    {
      title: '極簡黑後背包',
      price: 300,
      time: '2小時前',
      imgUrl: 'assets/bag.jpg',
      location: '新竹',
      quantity: 1,
      user:
        {
          userName: '生科吉娃娃甘霖',
          userImg: 'assets/avatar.jpg',
          university: '清大',
          department: '生科系',
          location: ['新竹','高雄']
        }
    },
   {
      title: '極簡黑後背包',
      price: 300,
      time: '2小時前',
      imgUrl: 'assets/bag.jpg',
      location: '新竹',
      quantity: 1,
      user:
        {
          userName: '生科吉娃娃甘霖',
          userImg: 'assets/avatar.jpg',
          university: '清大',
          department: '生科系',
          location: ['新竹','高雄']
        }
    },{
      title: '極簡黑後背包',
      price: 300,
      time: '2小時前',
      imgUrl: 'assets/bag.jpg',
      location: '新竹',
      quantity: 1,
      user:
        {
          userName: '生科吉娃娃甘霖',
          userImg: 'assets/avatar.jpg',
          university: '清大',
          department: '生科系',
          location: ['新竹','高雄']
        }
    },{
      title: '極簡黑後背包',
      price: 300,
      time: '2小時前',
      imgUrl: 'assets/bag.jpg',
      location: '新竹',
      quantity: 1,
      user:
        {
          userName: '生科吉娃娃甘霖',
          userImg: 'assets/avatar.jpg',
          university: '清大',
          department: '生科系',
          location: ['新竹','高雄']
        }
    },{
      title: '極簡黑後背包',
      price: 300,
      time: '2小時前',
      imgUrl: 'assets/bag.jpg',
      location: '新竹',
      quantity: 1,
      user:
        {
          userName: '生科吉娃娃甘霖',
          userImg: 'assets/avatar.jpg',
          university: '清大',
          department: '生科系',
          location: ['新竹','高雄']
        }
    },
  ];



}
