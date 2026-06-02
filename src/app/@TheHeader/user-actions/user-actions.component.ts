import { Component, computed, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

// 素材庫
import { LucideAngularModule, MessageCircleMore, ChevronDownIcon } from 'lucide-angular';
import { UserService } from '../../@Services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-actions',
  imports: [LucideAngularModule],
  templateUrl: './user-actions.component.html',
  styleUrl: './user-actions.component.scss'
})
export class UserActionsComponent {
  constructor(
    private router: Router,
    private actRoute: ActivatedRoute,
    private userService: UserService) { }

  // Declare icon
  readonly MessageIcon = MessageCircleMore;
  readonly ChevronDownIcon = ChevronDownIcon;

  // // Declare
  // userName = "小明";

  // Show menu
  isDisplayed = false;

  // 取得資料by.絲絨
  get userName(): string {
    const user = this.userService.currentUser();
    return user ? user.userName : '小明';
  }

  // get imgPath(): string {
  //   let img = this.userService.currentUser();
  //   return img;
  // }



  showMenu(event: Event) {
    event.stopPropagation();
    this.isDisplayed = !this.isDisplayed;
  }

  @HostListener('document:click')
  closeMenu() {
    this.isDisplayed = false;
  }

  goToCart() {
    this.router.navigate(['/cart']);
  }
  goToStore() {
    this.router.navigate(['/store']);
  }
  goToSetting() {
    this.router.navigate(['/profile_settings']);
  }
  goToSell() {
    this.router.navigate(['/launch_product_info']);
  }
  goToOrder() {
    this.router.navigate(['/order_information']);
  }

  logout() {
    Swal.fire({
      title: "您確定要登出嗎",
      text: "",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "登出",
      cancelButtonText: "取消"
    }).then((result) => {
      if (result.isConfirmed) {

        Swal.fire({
          title: "您已登出",
          text: "歡迎再次使用",
          icon: "success"
        });
        this.userService.logout();
        this.router.navigate(['/home']);
      }
    });

  }
}
