import { Component } from '@angular/core';
import { LucideAngularModule, MessageCircleMore, ChevronDownIcon } from 'lucide-angular';

@Component({
  selector: 'app-back-header',
  imports: [LucideAngularModule,],
  templateUrl: './back-header.component.html',
  styleUrl: './back-header.component.scss'
})
export class BackHeaderComponent {
  // Declare icon
  readonly MessageIcon = MessageCircleMore;
  readonly ChevronDownIcon = ChevronDownIcon;

  // Declare
  userName = "小明";

}
