import { Component, OnInit } from '@angular/core';

import { RouterOutlet } from "@angular/router";
import { ActivatedRoute, Router, RouterLinkActive, RouterLink } from '@angular/router';

import { ProductListingComponent } from '../../@component/product-listing/product-listing.component';
import { LucideAngularModule, House } from "lucide-angular";

import { Options } from '@angular-slider/ngx-slider';
import { FormsModule } from '@angular/forms';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { ProductCard } from '../../@Interface/product-card';
import { ProductListingStateService } from '../../@Services/product-listing-state.service';
import { EduApiGovService } from '../../@Services/edu-api-gov.service';

@Component({
  selector: 'app-school-community-layout',
  imports: [RouterOutlet, LucideAngularModule, RouterLink, RouterLinkActive, FormsModule, NgxSliderModule],
  templateUrl: './school-community-layout.component.html',
  styleUrl: './school-community-layout.component.scss'
})
export class SchoolCommunityLayoutComponent implements OnInit {

  schoolId: number = 0;
  universityName: string = '';

  constructor(
    protected route: ActivatedRoute,
    protected router: Router,
    public state: ProductListingStateService,   // ← 共用同一個 service
    private eduApiGovService: EduApiGovService,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (!params['id']) return;
      this.schoolId = Number(params['id']);

      this.eduApiGovService.getSchools().subscribe({
        next: (data) => {
          const school = data.find(s => Number(s['代碼']) === this.schoolId);
          if (!school) return;

          this.universityName = school['學校名稱'];

          // 覆寫 matchCategory：校版不需要分類篩選
          this.state.matchCategory = () => true;

          this.state.loadByUniversity(this.universityName);
        },
        error: (err) => console.error(err)
      });
    });
  }
}


