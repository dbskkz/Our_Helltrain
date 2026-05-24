import { Component, EventEmitter, Output } from '@angular/core';

// 素材庫
import { LucideAngularModule, Menu } from 'lucide-angular';
import { SearchBarComponent } from "../search-bar/search-bar.component";
import { UserActionsComponent } from "../user-actions/user-actions.component";
import { Router } from '@angular/router';
import { LoginBtnComponent } from "../login-btn/login-btn.component";
import { SideNavComponent } from "../../@TheSideBar/side-nav/side-nav.component";

@Component({
  selector: 'app-top-nav',
  imports: [LucideAngularModule, SearchBarComponent, UserActionsComponent, LoginBtnComponent, SideNavComponent],
  templateUrl: './top-nav.component.html',
  styleUrl: './top-nav.component.scss'
})
export class TopNavComponent {

  constructor(
    private router: Router,){}


  // Declare icon
  readonly MenuIcon = Menu;

  // login
  islogin = true;

  // Call the side-bar
  // @Output() menuClick = new EventEmitter<void>();

  // onMenuBtnClick() {
  //   this.menuClick.emit(); // 按下時，把訊號射出去
  // }

  goToHome(){
    this.router.navigate(['/home'])
  }

  // 用checkbox打開sidebar
  isSidebarOpen = false;

  sidebarSwitch( event: Event){
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
