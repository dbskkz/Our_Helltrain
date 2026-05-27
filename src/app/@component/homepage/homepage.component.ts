import { ManualComponent } from './../manual/manual.component';
import { Component, ElementRef, ViewChild } from '@angular/core';

// 素材庫
import {
        LucideAngularModule, Home, Book, Box, MoonStar,
        Smartphone, Handbag, Armchair, List, GraduationCap,
        NotebookText, Shirt, BicepsFlexed,
        ChevronDown, CirclePile, School, MapPin} from 'lucide-angular';

import { ProductCardComponent } from "../product-card/product-card.component";
import { Router } from '@angular/router';
import { ProductCard } from '../../@Interface/product-card';
import { ProductServiceService } from '../../@Services/product-service.service';

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

export class HomepageComponent{
  constructor(
    private route: Router,
    private productService:ProductServiceService
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

 @ViewChild('manualSection')
  manualSection!: ElementRef;

  goToManual() {
    this.manualSection.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }

  goToProductListById(type: string){
    this.route.navigate(['/product-list',type]);
  }

  get homeProducts(): ProductCard[] {
    return this.productService.allProducts.slice(0,5);
  }


}
