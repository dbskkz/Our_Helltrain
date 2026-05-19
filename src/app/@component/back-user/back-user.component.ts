import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  LucideAngularModule,
  Search,
  MapPin,
  LayoutGrid,
  ChevronRight,
  ChevronLeft,
} from 'lucide-angular';
import { UserDialogComponent } from '../user-dialog/user-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { PaginationService } from '../../@Services/pageination.service';

@Component({
  selector: 'app-back-user',
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './back-user.component.html',
  styleUrl: './back-user.component.scss',
})
export class BackUserComponent {
  constructor(public pagination: PaginationService, private dialog:MatDialog) {}
  readonly SearchIcon = Search;
  readonly mapIcon = MapPin;
  readonly GridIcon = LayoutGrid;
  readonly nextIcon = ChevronRight;
  readonly prevIcon = ChevronLeft;

  readonly pageSize = 5;

  private allUsers: User[] = [
    {
      id: '123456789',
      name: '快樂羊駝',
      avatarUrl: 'https://i.pravatar.cc/40?img=1',
      status: '正常',
      studentVerifiedAt: '已驗證',
      location: '高雄',
      tradeCount: 14,
    },
    {
      id: '987654321',
      name: '朱韻潔',
      avatarUrl: 'https://i.pravatar.cc/40?img=2',
      status: '審查中',
      studentVerifiedAt: '待審核',
      location: '台北',
      tradeCount: 2,
    },
    {
      id: '112233445',
      name: 'bad_seller',
      avatarUrl: 'https://i.pravatar.cc/40?img=3',
      status: '完全停權',
      studentVerifiedAt: '未驗證',
      location: '台中',
      tradeCount: 7,
    },
    {
      id: '556677889',
      name: 'Jason Wang',
      avatarUrl: 'https://i.pravatar.cc/40?img=4',
      status: '正常',
      studentVerifiedAt: '已驗證',
      location: '台南',
      tradeCount: 31,
    },
    {
      id: '223344556',
      name: '林小美',
      avatarUrl: 'https://i.pravatar.cc/40?img=5',
      status: '正常',
      studentVerifiedAt: '已驗證',
      location: '高雄',
      tradeCount: 8,
    },
    {
      id: '445566778',
      name: '王大明',
      avatarUrl: 'https://i.pravatar.cc/40?img=6',
      status: '審查中',
      studentVerifiedAt: '待審核',
      location: '台中',
      tradeCount: 1,
    },
    {
      id: '667788990',
      name: 'Amy Lee',
      avatarUrl: 'https://i.pravatar.cc/40?img=7',
      status: '正常',
      studentVerifiedAt: '已驗證',
      location: '台北',
      tradeCount: 22,
    },
  ];

  users: User[] = [];

  ngOnInit() {
    this.pagination.init(this.allUsers.length, this.pageSize);
    this.loadUsers();
  }

  loadUsers() {
    const start = (this.pagination.currentPage - 1) * this.pageSize;
    this.users = this.allUsers.slice(start, start + this.pageSize);
  }

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

  clearFilters() {}

  viewUser(user:User)
  {
    this.dialog.open(UserDialogComponent, {
    data: user  // 把整個 user 物件傳進去
  });
  }

  prevPage() {
    if (this.pagination.prevPage()) this.loadUsers();
  }
  nextPage() {
    if (this.pagination.nextPage()) this.loadUsers();
  }
  goToPage(page: number) {
    if (this.pagination.goToPage(page)) this.loadUsers();
  }
}

export interface User {
  id: string;
  name: string;
  avatarUrl: string; //頭像儲存地
  status: string; //帳號狀況
  studentVerifiedAt: string; //驗證狀況
  location: string; //所在地
  tradeCount: number; //交易數量
}
