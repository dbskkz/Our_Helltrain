import { Component } from '@angular/core';

import { RouterOutlet } from "@angular/router";
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { ProductListingComponent } from '../../@component/product-listing/product-listing.component';
import { LucideAngularModule, House } from "lucide-angular";

@Component({
  selector: 'app-school-community-layout',
  imports: [RouterOutlet, LucideAngularModule, RouterLink,],
  templateUrl: './school-community-layout.component.html',
  styleUrl: './school-community-layout.component.scss'
})
export class SchoolCommunityLayoutComponent extends ProductListingComponent{

  universityName = '國立清華大學';
}
