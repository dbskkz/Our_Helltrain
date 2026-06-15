import { UserService } from './../../@Services/user.service';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { User } from '../../@Interface/user';


@Component({
  selector: 'app-user-card',
  imports: [RouterLink],
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.scss'
})
export class UserCardComponent {

  // 接收外部傳入的商品列表（必填）
  @Input() users: User[] = [];

  // 最多顯示幾筆，預設不限制（0 = 全部）
  @Input() maxItems: number = 0;

  get displayedUsers(): User[] {
    if (this.maxItems > 0) {
      return this.users.slice(0, this.maxItems);
    }
    return this.users;
  }

}
