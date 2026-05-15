import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LucideAngularModule, Search,MapPin,LayoutGrid } from 'lucide-angular';

@Component({
  selector: 'app-back-user',
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './back-user.component.html',
  styleUrl: './back-user.component.scss',
})
export class BackUserComponent {
  readonly SearchIcon=Search;
  readonly mapIcon=MapPin;
  readonly GridIcon=LayoutGrid;
  users: any[] = [];
  getAccountBadge(status: string): string {
    const map: Record<string, string> = {
      正常: 'badge-normal',
      審查中: 'badge-review',
      完全停權: 'badge-banned',
    };
    return map[status] ?? '';
  }

  getVerifyBadge(status: string): string {
    const map: Record<string, string> = {
      已驗證: 'badge-verified',
      待審核: 'badge-pending',
      未驗證: 'badge-none',
    };
    return map[status] ?? '';
  }
}
