import { Component, OnInit } from '@angular/core';
import { ProductListingComponent } from '../../@component/product-listing/product-listing.component';
import { ProductCardComponent } from "../../@component/product-card/product-card.component";

@Component({
  selector: 'app-school-community-product',
  imports: [ProductCardComponent],
  templateUrl: './school-community-product.component.html',
  styleUrl: './school-community-product.component.scss'
})
export class SchoolCommunityProductComponent extends ProductListingComponent implements OnInit{



}
