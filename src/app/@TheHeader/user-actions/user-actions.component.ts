import { Component, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

// 素材庫
import { LucideAngularModule, MessageCircleMore, ChevronDownIcon} from 'lucide-angular';

@Component({
  selector: 'app-user-actions',
  imports: [LucideAngularModule],
  templateUrl: './user-actions.component.html',
  styleUrl: './user-actions.component.scss'
})
export class UserActionsComponent {
  constructor(
    private router: Router,
    private actRoute:ActivatedRoute){}

  // Declare icon
  readonly MessageIcon = MessageCircleMore;
  readonly ChevronDownIcon = ChevronDownIcon;

  // Declare
  userName = "小明";

  // Show menu
  isDisplayed = false;

  showMenu(event:Event){
    event.stopPropagation();
    this.isDisplayed = !this.isDisplayed;
  }

  @HostListener('document:click')
  closeMenu(){
    this.isDisplayed = false;
  }

  goToCart(){
    this.router.navigate(['/cart']);
  }
  goToStore(){
    this.router.navigate(['/store']);
  }
  goToSetting(){
    this.router.navigate(['/profile_settings']);
  }
  goToSell(){
    this.router.navigate(['/launch_product_info']);
  }
  goToOrder(){
    this.router.navigate(['/order_information']);
  }
}
