import { Component, OnInit } from '@angular/core';
import { ProductListingComponent } from '../../@component/product-listing/product-listing.component';
import { ProductCardComponent } from "../../@component/product-card/product-card.component";
import { LucideAngularModule, Home, ChevronRight, ChevronLeft, RotateCcw, X } from 'lucide-angular';

import { Options } from '@angular-slider/ngx-slider';
import { FormsModule } from '@angular/forms';
import { NgxSliderModule } from '@angular-slider/ngx-slider';

@Component({
  selector: 'app-school-community-product',
  imports: [LucideAngularModule, FormsModule, NgxSliderModule, ProductCardComponent],
  templateUrl: './school-community-product.component.html',
  styleUrl: './school-community-product.component.scss'
})
export class SchoolCommunityProductComponent extends ProductListingComponent implements OnInit{



}
