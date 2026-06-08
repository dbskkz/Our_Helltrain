import { Component, OnInit } from '@angular/core';
import { ProductListingComponent } from '../../@component/product-listing/product-listing.component';
import { ProductCardComponent } from "../../@component/product-card/product-card.component";
import { LucideAngularModule } from 'lucide-angular';

import { Options } from '@angular-slider/ngx-slider';
import { FormsModule } from '@angular/forms';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { SchoolCommunityLayoutComponent } from '../school-community-layout/school-community-layout.component';
import { ProductCard } from '../../@Interface/product-card';


const CATEGORY_MAP: Record<string, string> = {
  'books':       '教科書',
  'equipment':   '專業器材',
  'daily':       '日用品',
  'electronics': '3C電子',
  'furniture':   '家具家電',
  'notes':       '筆記考古',
  'fashion':     '服飾配件',
  'sports':      '戶外運動',
  'graduation':  '畢業季',
};

@Component({
  selector: 'app-school-community-product',
  imports: [LucideAngularModule, FormsModule, NgxSliderModule, ProductCardComponent],
  templateUrl: './school-community-product.component.html',
  styleUrl: './school-community-product.component.scss'
})
export class SchoolCommunityProductComponent extends ProductListingComponent implements OnInit{


} // The end of the component
