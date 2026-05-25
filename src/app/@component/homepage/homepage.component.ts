import { Component, ElementRef, ViewChild } from '@angular/core';

// 素材庫
import {
        LucideAngularModule, Home, Book, Box, MoonStar,
        Smartphone, Handbag, Armchair, List, GraduationCap,
        Filter, ArrowUpDown, NotebookText, Shirt,
        ChevronDown, CirclePile, School, MapPin} from 'lucide-angular';

import { ProductCardComponent } from "../product-card/product-card.component";
import { ManualComponent } from "../manual/manual.component";

@Component({
  selector: 'app-homepage',
  imports: [LucideAngularModule, ProductCardComponent, ManualComponent],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss'
})
export class HomepageComponent {

  // Declare icon
  // readonly FilterIcon = Filter;
  readonly ArrowUpDownIcon = ArrowUpDown;
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


  categories= [
    { icon: Book, label: "教科書", value: 'books' },
    { icon: Box, label: "專業器材", value: 'dept' },
    { icon: Handbag, label: "生活用品", value: 'life' },
    { icon: Smartphone, label: "3C電子", value: 'tech' },
    { icon: Armchair, label: "家具家電", value: 'furniture' },
    { icon: NotebookText, label: "筆記考古", value: 'furniture' },
    { icon: Shirt, label: "服飾配件", value: 'furniture' },
    { icon: Shirt, label: "戶外運動", value: 'furniture' },
    { icon: GraduationCap, label: "畢業季", value: 'furniture' },
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



}
