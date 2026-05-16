import { Component, HostListener, OnInit } from '@angular/core';
import { Options } from '@angular-slider/ngx-slider';
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { ActivatedRoute } from '@angular/router';
// import { BrowserModule } from "@angular/platform-browser";

// 素材庫
import { LucideAngularModule, ArrowUpDown} from 'lucide-angular';
import { UiBehaviorService } from '../../@Services/ui-behavior.service';

@Component({
  selector: 'app-product-listing',
  imports: [LucideAngularModule,
    // BrowserModule,
    FormsModule,
    NgxSliderModule
  ],
  templateUrl: './product-listing.component.html',
  styleUrl: './product-listing.component.scss'
})
export class ProductListingComponent implements OnInit{

  constructor(
    private route: ActivatedRoute,
    private uiBehavior:UiBehaviorService
  ) {}


  // =========================================================
  // ICON
  // =========================================================

  readonly ArrowUpDownIcon = ArrowUpDown;

  // =========================================================
  // CATEGORY
  // =========================================================

  category: string | null = '';
  categoryName = '3C 產品';

  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {

      this.category = params.get('category');

      console.log('當前分類:', this.category);

      // TODO:
      // this.loadProducts(this.category);

    });

  }


  // =========================================================
  // FILTER PANEL OPEN/CLOSE
  // =========================================================

  panelState = {
    price: false,
    grade: false,
    location: false,
    school: false
  }

  togglePanel(
    event: Event,
    panel: keyof typeof this.panelState
  )
  {
    this.uiBehavior.togglePanel(event, this.panelState, panel)
  }

  @HostListener('document:click')
  closeMenu(): void {

    this.uiBehavior.closeAll(this.panelState);

  }


  // =========================================================
  // PRICE FILTER
  // =========================================================


  priceValue: number = 0;
  priceHighValue: number = 100;

  priceOptions: Options = {
    floor: 0,
    ceil: 10000,
  };


  // =========================================================
  // SELLER RATING FILTER
  // =========================================================


  sellerGrade = 5;

  sellerGradeOptions: Options = {
    showTicksValues: true,
    stepsArray: [
      { value: 1, legend: "Very poor" },
      { value: 2, legend: "Fair" },
      { value: 3, legend: "Average" },
      { value: 4, legend: "Good" },
      { value: 5, legend: "Excellent" }
    ]
  };


  // =========================================================
  // LOCATION FILTER
  // =========================================================


   cities = [

    { id: 1, name: '台北市', selected: false },
    { id: 2, name: '新北市', selected: false },
    { id: 3, name: '桃園市', selected: false },
    { id: 4, name: '台中市', selected: false },
    { id: 5, name: '台南市', selected: false },
    { id: 6, name: '高雄市', selected: false },
    { id: 7, name: '基隆市', selected: false },
    { id: 8, name: '新竹市', selected: false },
    { id: 9, name: '嘉義市', selected: false }

  ];

  onCityChange(): void {

    console.log(this.cities);

  }


  // =========================================================
  // SCHOOL FILTER
  // =========================================================


  selectedSchool = '';

  schools = [
    { id: 1, name: '國立臺灣大學', selected: false },
    { id: 2, name: '國立清華大學', selected: false },
    { id: 3, name: '國立陽明交通大學', selected: false },
    { id: 4, name: '國立成功大學', selected: false },
    { id: 5, name: '國立政治大學', selected: false },
    { id: 6, name: '國立中央大學', selected: false },
    { id: 7, name: '國立中山大學', selected: false },
    { id: 8, name: '國立臺灣師範大學', selected: false },
    { id: 9, name: '國立臺北科技大學', selected: false },
    { id: 10, name: '國立高雄科技大學', selected: false },
    { id: 11, name: '國立雲林科技大學', selected: false },
    { id: 12, name: '國立屏東科技大學', selected: false },
    { id: 13, name: '淡江大學', selected: false },
    { id: 14, name: '輔仁大學', selected: false },
    { id: 15, name: '東海大學', selected: false },
    { id: 16, name: '逢甲大學', selected: false },
    { id: 17, name: '中原大學', selected: false },
    { id: 18, name: '元智大學', selected: false },
    { id: 19, name: '長庚大學', selected: false },
    { id: 20, name: '銘傳大學', selected: false },
    { id: 21, name: '世新大學', selected: false },
    { id: 22, name: '實踐大學', selected: false },
    { id: 23, name: '中國文化大學', selected: false },
    { id: 24, name: '靜宜大學', selected: false },
    { id: 25, name: '亞洲大學', selected: false },
    { id: 26, name: '義守大學', selected: false },
    { id: 27, name: '南臺科技大學', selected: false },
    { id: 28, name: '朝陽科技大學', selected: false },
    { id: 29, name: '樹德科技大學', selected: false },
    { id: 30, name: '崑山科技大學', selected: false }
  ];

  dept = [
    { id: 1, name: '資訊工程學系', selected: false },
    { id: 2, name: '資訊管理學系', selected: false },
    { id: 3, name: '電機工程學系', selected: false },
    { id: 4, name: '電子工程學系', selected: false },
    { id: 5, name: '機械工程學系', selected: false },
    { id: 6, name: '企業管理學系', selected: false },
    { id: 7, name: '財務金融學系', selected: false },
    { id: 8, name: '法律學系', selected: false }
  ];

  onSchoolChange(): void {

    console.log(this.schools);

  }

  onDeptChange(): void {

    console.log(this.dept);

  }


}
