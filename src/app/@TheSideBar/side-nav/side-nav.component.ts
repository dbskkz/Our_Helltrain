import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

// 素材庫
import {
        LucideAngularModule, Home, Book, Box, MoonStar,
        Smartphone, Handbag, Lamp, List, SmilePlus,
        ChevronDown, CirclePile, School, MapPin} from 'lucide-angular';

@Component({
  selector: 'app-side-nav',
  imports: [LucideAngularModule],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.scss'
})
export class SideNavComponent {

  constructor(
    private router: Router,
    private actRoute:ActivatedRoute){}

  // Declare icon
  readonly HomeIcon = Home;
  readonly BookIcon = Book;
  readonly BoxIcon = Box;
  readonly HandbagIcon = Handbag;
  readonly SmartphoneIcon = Smartphone;
  readonly LampIcon = Lamp;
  readonly ListIcon = List;
  readonly ChevronDownIcon = ChevronDown;
  readonly CirclePileIcon = CirclePile;
  readonly SmilePlusIcon = SmilePlus;
  readonly SchoolIcon = School;
  readonly MapPinIcon = MapPin;
  readonly MoonStarIcon = MoonStar;

  // 宣告商品種類
  categories= [
    { icon: CirclePile, label: "全部", value: 'all' },
    { icon: Book, label: "書籍", value: 'books' },
    { icon: Box, label: "科系用品", value: 'dept' },
    { icon: Handbag, label: "生活用品", value: 'life' },
    { icon: Smartphone, label: "3C電子", value: 'tech' },
    { icon: Lamp, label: "家具家電", value: 'furniture' },
  ];

  // 被選擇的商品種類
  selectedCategory = '';

  // 過濾商品
  selectCategory(value: string){
    this.selectedCategory = value;
    console.log(this.selectedCategory);
    this.goToProductList();
    // TODO: 過濾邏輯
  }

  // 側邊欄的開關
  // isOpen = false;

  // toggle() {
  //   this.isOpen = !this.isOpen;
  // }

  // go back to the home page
  isHomePage = false;

  goToHome(){
    this.router.navigate(['/home']);
    this.router.navigate(['/home'])
  }

  // Navigate to product-list
  goToProductList(){
    this.router.navigate(['/product-list', this.selectedCategory]);
  }
}
