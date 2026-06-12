import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

// nav bar
import { SideNavComponent } from "./@TheSideBar/side-nav/side-nav.component";
import { UserService } from './@Services/user.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'our_helltrain';

  constructor(private userService: UserService) { };

  ngOnInit(): void {
    // 全站一啟動（包括按 F5），就立刻發非同步 API 去後端撈取使用者資料！
    this.userService.getMyInfo().subscribe({
      next: (info) => {
        if (info && info.user) {
          this.userService.currentUser.set(info.user);
          this.userService.updateAvatar(info.user.imgPath);
        }
      },
      error: (err) => {
        console.log('未登入或 Session 已過期', err);
      }
    });
  }
}
