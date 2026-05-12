import { Component } from '@angular/core';
// 素材庫
import { LucideAngularModule, Home, Book, Box,
  Smartphone, Handbag, Lamp, List, ChevronDown} from 'lucide-angular';

@Component({
  selector: 'app-side-nav',
  imports: [LucideAngularModule],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.scss'
})
export class SideNavComponent {
  // Declare icon
  readonly HomeIcon = Home;
  readonly BookIcon = Book;
  readonly BoxIcon = Box;
  readonly HandbagIcon = Handbag;
  readonly SmartphoneIcon = Smartphone;
  readonly LampIcon = Lamp;
  readonly ListIcon = List;
  readonly ChevronDownIcon = ChevronDown;

  // 宣告商品種類
  categories= [
    { icon: Home, label: "全部", value: 'all' },
    { icon: Book, label: "書籍", value: 'books' },
    { icon: Box, label: "科系用品", value: 'dept' },
    { icon: Handbag, label: "生活用品", value: 'life' },
    { icon: Smartphone, label: "3C電子", value: 'tech' },
    { icon: Lamp, label: "家具家電", value: 'furniture' },
    { icon: List, label: "其他", value: 'others' }
  ];

  // 被選擇的商品種類
  selectedCategory = 'all';

  // 過濾商品
  selectCategory(value: string){
    this.selectedCategory = value;
    console.log(this.selectedCategory);
    // TODO: 過濾邏輯
  }

  // Switch
  isOpen = false;

  toggle() {
    this.isOpen = !this.isOpen;
  }
}
