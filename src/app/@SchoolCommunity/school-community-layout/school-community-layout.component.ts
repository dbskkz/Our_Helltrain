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

  schoolId: number = 0;
  universityName: string = '';

  override ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (!params['id']) return;
      this.schoolId = Number(params['id']);

        // 2. 用 id 查學校名稱
        this.eduApiGovService.getSchools().subscribe({
          next: (data) => {
            const school = data.find(s => Number(s['代碼']) === this.schoolId);

            if (!school) {
              console.warn('找不到學校，schoolId:', this.schoolId);
              return;
            }

            this.universityName = school ? school['學校名稱'] : '未知學校';
            this.schoolId = Number(params['id']);
          },
          error: (err) => console.error(err)
        });
    });
  }



}



