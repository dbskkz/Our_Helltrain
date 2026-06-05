import { Component } from '@angular/core';

import { RouterOutlet } from "@angular/router";
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { ProductListingComponent } from '../../@component/product-listing/product-listing.component';
import { LucideAngularModule, House } from "lucide-angular";
import { ProductCardComponent } from "../../@component/product-card/product-card.component";

import { Options } from '@angular-slider/ngx-slider';
import { FormsModule } from '@angular/forms';
import { NgxSliderModule } from '@angular-slider/ngx-slider';

@Component({
  selector: 'app-school-community-layout',
  imports: [RouterOutlet, LucideAngularModule, RouterLink, FormsModule, NgxSliderModule, ProductCardComponent],
  templateUrl: './school-community-layout.component.html',
  styleUrl: './school-community-layout.component.scss'
})
export class SchoolCommunityLayoutComponent extends ProductListingComponent{

  universityName = '國立清華大學';

  goToSchoolProduct(){
    this.router.navigate(['/school-community/school-product'])
  }

  goToClassmates(){
    this.router.navigate(['/school-community/school-product'])
  }
}
