import { Component, EventEmitter, Output } from '@angular/core';
import { RouterOutlet } from "@angular/router";

// 素材庫
import { LucideAngularModule, Menu } from 'lucide-angular';
import { SearchBarComponent } from "../../@TheHeader/search-bar/search-bar.component";
import { UserActionsComponent } from "../../@TheHeader/user-actions/user-actions.component";
import { TopNavComponent } from "../../@TheHeader/top-nav/top-nav.component";
import { SideNavComponent } from "../../@TheSideBar/side-nav/side-nav.component";

@Component({
  selector: 'app-main-layout',
  imports: [LucideAngularModule, RouterOutlet,TopNavComponent, SideNavComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent {

}
