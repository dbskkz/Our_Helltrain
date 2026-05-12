import { Component } from '@angular/core';
// 素材庫
import { LucideAngularModule, MessageCircleMore, ChevronDownIcon} from 'lucide-angular';

@Component({
  selector: 'app-user-actions',
  imports: [LucideAngularModule],
  templateUrl: './user-actions.component.html',
  styleUrl: './user-actions.component.scss'
})
export class UserActionsComponent {
  // Declare icon
  readonly MessageIcon = MessageCircleMore;
  readonly ChevronDownIcon = ChevronDownIcon;

  // Declare
  userName = "小明";
}
