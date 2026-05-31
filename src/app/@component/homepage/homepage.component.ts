import { ManualComponent } from './../manual/manual.component';
import { Component, ElementRef, ViewChild } from '@angular/core';

// 素材庫
import { LucideAngularModule } from 'lucide-angular';

import { ProductCardComponent } from "../product-card/product-card.component";
import { Router } from '@angular/router';
import { ProductCard } from '../../@Interface/product-card';
import { ProductServiceService } from '../../@Services/product-service.service';
import { CategoriesService } from '../../@Services/categories.service';

@Component({
  selector: 'app-homepage',
  imports: [LucideAngularModule, ProductCardComponent, ManualComponent],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss'
})

export class HomepageComponent{
  constructor(
    private route: Router,
    private productService:ProductServiceService,
    private category:CategoriesService
  ) {}

get categories():any[]{
  return this.category.categories;
}

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
