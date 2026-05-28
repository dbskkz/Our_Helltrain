import { Component, EventEmitter, Output } from '@angular/core';
import { RouterOutlet } from "@angular/router";

// 素材庫
import { LucideAngularModule, Menu, ArrowUp } from 'lucide-angular';
import { SearchBarComponent } from "../../@TheHeader/search-bar/search-bar.component";
import { UserActionsComponent } from "../../@TheHeader/user-actions/user-actions.component";
import { TopNavComponent } from "../../@TheHeader/top-nav/top-nav.component";
import { FooterComponent } from '../../@TheFooter/footer/footer.component';
import { SubBarComponent } from "../../@TheHeader/sub-bar/sub-bar.component";
import { UserService } from '../../@Services/user.service';

@Component({
  selector: 'app-main-layout',
  imports: [LucideAngularModule, RouterOutlet, TopNavComponent, FooterComponent, SubBarComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent {

  constructor(private userService:UserService){

  }
    readonly ArrowUpIcon = ArrowUp;

    get isLogIn() {
      return this.userService.isLoggedIn;
    }
    isClose = false;

    scrollToTop(){
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

}
