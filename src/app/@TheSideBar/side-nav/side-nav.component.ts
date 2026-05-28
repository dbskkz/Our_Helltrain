import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

// 素材庫
import {
        LucideAngularModule,Home, Book, Box, MoonStar,
        Smartphone, Handbag, Armchair, List, GraduationCap,
        NotebookText, Shirt, BicepsFlexed,
        ChevronDown, CirclePile, School, MapPin,Lamp,SmilePlus,CircleQuestionMark } from 'lucide-angular';
import { UiBehaviorService } from '../../@Services/ui-behavior.service';
import { EighteenAcademyService } from '../../@Services/eighteen-academy.service';

@Component({
  selector: 'app-side-nav',
  imports: [LucideAngularModule],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.scss'
})
export class SideNavComponent {

  constructor(
    private router: Router,
    private uiBehavior: UiBehaviorService,
    private actRoute:ActivatedRoute,
    private eac:EighteenAcademyService
  ){}

  // Declare icon
  readonly HomeIcon = Home;
  readonly BookIcon = Book;
  readonly BoxIcon = Box;
  readonly HandbagIcon = Handbag;
  readonly SmartphoneIcon = Smartphone;
  readonly LampIcon = Lamp;
  readonly ListIcon = List;
  readonly ChevronDownIcon = ChevronDown;
  readonly CirclePileIcon = CirclePile;
  readonly SmilePlusIcon = SmilePlus;
  readonly SchoolIcon = School;
  readonly MapPinIcon = MapPin;
  readonly MoonStarIcon = MoonStar;
  readonly CircleQuestionMarkIcon = CircleQuestionMark;

  // 宣告商品種類
  categories = [
    { icon: Book, label: "教科書", value: 'books' },
    { icon: Box, label: "專業器材", value: 'equipment' },
    { icon: Handbag, label: "生活用品", value: 'daily' },
    { icon: Smartphone, label: "3C電子", value: 'electronics' },
    { icon: Armchair, label: "家具家電", value: 'furniture' },
    { icon: NotebookText, label: "筆記考古", value: 'notes' },
    { icon: Shirt, label: "服飾配件", value: 'fashion' },
    { icon: BicepsFlexed, label: "戶外運動", value: 'sports' },
    { icon: GraduationCap, label: "畢業季", value: 'graduation' },
  ];

  // 被選擇的商品種類
  selectedCategory = '';

  // 過濾商品
  selectCategory(value: string){
    this.selectedCategory = value;
    console.log(this.selectedCategory);
    this.goToProductList();
    // TODO: 過濾邏輯
  }

  isHomePage = false;

  goToHome(){
    this.router.navigate(['/home']);
    window.scrollTo({top: 0,
      left: 0,
      behavior: "smooth"});
    }

  // =========================================================
  // PANEL OPEN / CLOSE
  // =========================================================
  ngOnInit(): void {
  //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
  //Add 'implements OnInit' to the class.
  if(this.panelState.academic)
  {
      console.log("Success");
  }
  else
  {
    console.log("false");

  }
}
  panelState = {
    academic: false,
    category: false,
  };

  togglePanel(event: Event, panel: keyof typeof this.panelState) {
    console.log('togglePanel called:', panel); // ← 加這行
    this.uiBehavior.togglePanel(event, this.panelState, panel);
    console.log('panelState after:', this.panelState); // ← 加這行
  }

  @HostListener('document:click')
  closeMenu(): void {
    this.uiBehavior.closeAll(this.panelState);
  }


  goToManual() {
    // 檢查目前是否已在 home
    if (this.router.url.includes('/home')) {
      const element = document.getElementById('manual');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      this.router.navigate(['/home'], { fragment: 'manual' });
    }
  }

  // Navigate to product-list
  goToProductList(){
    this.router.navigate(['/product-list', this.selectedCategory]);
  }

  get academics(): any[]{
    return this.eac.academy
  }
}
