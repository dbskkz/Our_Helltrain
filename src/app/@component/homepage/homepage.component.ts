import { Component } from '@angular/core';

// 素材庫
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-homepage',
  imports: [LucideAngularModule],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss'
})
export class HomepageComponent {
  products = [
    {
      title: '極簡黑後背包',
      price: 300,
      location: '清大',
      time: '2小時前',
      category: '生科系',
      imgUrl: 'assets/bag.jpg',
      userImg: 'assets/avatar.jpg'
    },
    // ... 更多資料
  ];
}
