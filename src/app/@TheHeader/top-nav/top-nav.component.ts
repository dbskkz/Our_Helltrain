import { Component, OnInit, OnDestroy, HostListener } from '@angular/core'; // 引入生命週期鉤子
import { Router, NavigationEnd } from '@angular/router'; // 引入 NavigationEnd
import { filter, Subscription } from 'rxjs'; // 引入 RxJS 工具

// 素材庫
import { LucideAngularModule, Menu } from 'lucide-angular';
import { SearchBarComponent } from "../search-bar/search-bar.component";
import { UserActionsComponent } from "../user-actions/user-actions.component";
import { LoginBtnComponent } from "../login-btn/login-btn.component";
import { SideNavComponent } from "../../@TheSideBar/side-nav/side-nav.component";
import { UserService } from '../../@Services/user.service';

@Component({
  selector: 'app-top-nav',
  imports: [LucideAngularModule, SearchBarComponent, UserActionsComponent, LoginBtnComponent, SideNavComponent],
  templateUrl: './top-nav.component.html',
  styleUrl: './top-nav.component.scss'
})
export class TopNavComponent implements OnInit, OnDestroy{

  constructor(
    private router: Router,
  private userService:UserService){}

  private routerSubscription?: Subscription; // 用於存放訂閱，避免記憶體洩漏

  ngOnInit() {
    // 監聽路由事件
    this.routerSubscription = this.router.events.pipe(
      // 篩選出「導航結束」的事件
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      // 只要路由一變動，就關閉側邊欄
      this.isSidebarOpen = false;
    });
  }

  // 良好的習慣：組件銷毀時取消訂閱
  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  // Declare icon
  readonly MenuIcon = Menu;

  // login
  isLogIn(): boolean{
    return this.userService.isLoggedIn();
  }

  goToHome(){
    this.router.navigate(['/home']);
    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  // 用checkbox打開sidebar
  isSidebarOpen = false;

  sidebarSwitch( event: Event){
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar(event:Event):void{
    event.stopPropagation;
    this.isSidebarOpen = false;
  }
}
