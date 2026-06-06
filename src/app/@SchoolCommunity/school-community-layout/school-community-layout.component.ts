import { Component } from '@angular/core';

import { RouterOutlet } from "@angular/router";
import { ActivatedRoute, Router, RouterLinkActive, RouterLink } from '@angular/router';

import { ProductListingComponent } from '../../@component/product-listing/product-listing.component';
import { LucideAngularModule, House } from "lucide-angular";

import { Options } from '@angular-slider/ngx-slider';
import { FormsModule } from '@angular/forms';
import { NgxSliderModule } from '@angular-slider/ngx-slider';

@Component({
  selector: 'app-school-community-layout',
  imports: [RouterOutlet, LucideAngularModule, RouterLink, RouterLinkActive, FormsModule, NgxSliderModule],
  templateUrl: './school-community-layout.component.html',
  styleUrl: './school-community-layout.component.scss'
})
export class SchoolCommunityLayoutComponent extends ProductListingComponent{

  override ngOnInit(): void {
    this.loadSchool();

  }

  schools: any[] = [];
  loading = true;
  error = '';

  loadSchool(){
    this.eduApiGovService.getSchools().subscribe({
      next: (res) => {
        this.schools = res;
        console.log(res);
        this.loading = false;
      },

      error: (err) => {
        this.error = '載入失敗';
        this.loading = false;
      }
    });
  }

  universityName = '國立清華大學';

}
