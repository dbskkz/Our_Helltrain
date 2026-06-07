import { Component, OnInit } from '@angular/core';
import { ProductListingComponent } from '../../@component/product-listing/product-listing.component';
import { ProductCardComponent } from "../../@component/product-card/product-card.component";
import { LucideAngularModule, Home, ChevronRight, ChevronLeft, RotateCcw, X } from 'lucide-angular';

import { Options } from '@angular-slider/ngx-slider';
import { FormsModule } from '@angular/forms';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { SchoolCommunityLayoutComponent } from '../school-community-layout/school-community-layout.component';

@Component({
  selector: 'app-school-community-product',
  imports: [LucideAngularModule, FormsModule, NgxSliderModule, ProductCardComponent],
  templateUrl: './school-community-product.component.html',
  styleUrl: './school-community-product.component.scss'
})
export class SchoolCommunityProductComponent extends SchoolCommunityLayoutComponent implements OnInit{

  override loadProducts(){
    this.loadUniversityProducts();
  }

  loadUniversityProducts() {
    console.log('universityName:', this.universityName);
    this.productservice.getByUniversity(this.universityName).subscribe({
      next: (res) => {
        console.log('API 回應:', res); // 確認後端回了什麼
      },
      error: (err) => {
        console.error('API 錯誤:', err);
      }
    });
  }
}
