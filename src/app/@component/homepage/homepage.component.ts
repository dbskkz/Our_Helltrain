import { Component, ElementRef, ViewChild } from '@angular/core';

// 素材庫
import {
        LucideAngularModule, Home, Book, Box, MoonStar,
        Smartphone, Handbag, Armchair, List, GraduationCap,
        NotebookText, Shirt, BicepsFlexed,
        ChevronDown, CirclePile, School, MapPin} from 'lucide-angular';

import { ProductCardComponent } from "../product-card/product-card.component";
import { ManualComponent } from "../manual/manual.component";
import { Router } from '@angular/router';

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
  selector: 'app-homepage',
  imports: [LucideAngularModule, ProductCardComponent, ManualComponent],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss'
})
export class HomepageComponent {
  constructor(
    private route: Router,
  ) {}

  // Declare icon
  readonly HomeIcon = Home;
  readonly BookIcon = Book;
  readonly BoxIcon = Box;
  readonly HandbagIcon = Handbag;
  readonly SmartphoneIcon = Smartphone;
  readonly ArmchairIcon = Armchair;
  readonly ListIcon = List;
  readonly ChevronDownIcon = ChevronDown;
  readonly CirclePileIcon = CirclePile;
  readonly SchoolIcon = School;
  readonly MapPinIcon = MapPin;
  readonly MoonStarIcon = MoonStar;
  readonly NotebookTextIcon = NotebookText;
  readonly ShirtIcon = Shirt;
  readonly GraduationCapIcon = GraduationCap;
  readonly BicepsFlexedIcon = BicepsFlexed;


categories = [
  { icon: Book, label: "教科書", value: 'books' },
  { icon: Box, label: "專業器材", value: 'equipment' },
  { icon: Handbag, label: "生活用品", value: 'daily' },
  { icon: Smartphone, label: "3C電子", value: 'electronics' },
  { icon: Armchair, label: "家具家電", value: 'furniture' },
  { icon: NotebookText, label: "筆記考古", value: 'notes' },
  { icon: Shirt, label: "服飾配件", value: 'fashion' },
  { icon: BicepsFlexed, label: "戶外運動", value: 'sports' },
  { icon: GraduationCap, label: "畢業季", value: 'graduation' },
];

  //類型輪播效果
  @ViewChild('categoryScroll')
  categoryScroll!: ElementRef;



  scrollLeft() {
    this.categoryScroll.nativeElement.scrollBy({
      left: -300,
      behavior: 'smooth'
    });
  }

  scrollRight() {
    this.categoryScroll.nativeElement.scrollBy({
      left: 300,
      behavior: 'smooth'
    });
  }

  goToProductListById(type:string){
    this.route.navigate(['/product-list', type]);
  }

  homeProducts: Product[] = [
    {
      title: '極簡黑後背包',
      price: 300,
      time: '2小時前',
      imgUrl: 'assets/bag.jpg',
      location: '新竹',
      quantity: 1,
      user: {
        userName: '生科吉娃娃甘霖',
        userImg: 'assets/avatar.jpg',
        university: '清大',
        department: '生科系',
        location: ['新竹', '高雄']
      }
    },

    {
      title: '二手 iPad 支架',
      price: 150,
      time: '5小時前',
      imgUrl: 'assets/ipad-stand.jpg',
      location: '台中',
      quantity: 1,
      user: {
        userName: '資工小海豹',
        userImg: 'assets/avatar2.jpg',
        university: '逢甲',
        department: '資工系',
        location: ['台中']
      }
    },

    {
      title: '日系奶茶色帆布袋',
      price: 220,
      time: '1天前',
      imgUrl: 'assets/bag2.jpg',
      location: '台北',
      quantity: 1,
      user: {
        userName: '企管水豚',
        userImg: 'assets/avatar3.jpg',
        university: '政大',
        department: '企管系',
        location: ['台北', '桃園']
      }
    },

    {
      title: '羅技無線滑鼠',
      price: 450,
      time: '3小時前',
      imgUrl: 'assets/mouse.jpg',
      location: '高雄',
      quantity: 1,
      user: {
        userName: '電機企鵝',
        userImg: 'assets/avatar4.jpg',
        university: '中山',
        department: '電機系',
        location: ['高雄']
      }
    },

    {
      title: '微積分課本',
      price: 180,
      time: '2天前',
      imgUrl: 'assets/book.jpg',
      location: '台南',
      quantity: 1,
      user: {
        userName: '數學狐狸',
        userImg: 'assets/avatar5.jpg',
        university: '成大',
        department: '數學系',
        location: ['台南']
      }
    },
  ]


}
