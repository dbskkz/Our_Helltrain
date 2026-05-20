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

  // 篩選選項
  accountStatuses = ['正常', '審查中', '停權'];
  verifyStatuses  = ['已驗證', '待審查','已過期', '未驗證'];

  selectedAccountStatus = '';
  selectedVerifyStatus  = '';

  private allUsers: User[] = [
    { id: '123456789', name: '快樂羊駝',   avatarUrl: 'https://i.pravatar.cc/40?img=1', status: '正常',    studentVerifiedAt: '2024-03-01', location: '高雄', tradeCount: 14 },
    { id: '987654321', name: '朱韻潔',     avatarUrl: 'https://i.pravatar.cc/40?img=2', status: '審查中',  studentVerifiedAt: null,          location: '台北', tradeCount: 2  },
    { id: '112233445', name: 'bad_seller',  avatarUrl: 'https://i.pravatar.cc/40?img=3', status: '完全停權', studentVerifiedAt: null,          location: '台中', tradeCount: 7  },
    { id: '556677889', name: 'Jason Wang',  avatarUrl: 'https://i.pravatar.cc/40?img=4', status: '正常',    studentVerifiedAt: '2025-11-15', location: '台南', tradeCount: 31 },
    { id: '223344556', name: '林小美',     avatarUrl: 'https://i.pravatar.cc/40?img=5', status: '正常',    studentVerifiedAt: '2026-01-20', location: '高雄', tradeCount: 8  },
    { id: '445566778', name: '王大明',     avatarUrl: 'https://i.pravatar.cc/40?img=6', status: '審查中',  studentVerifiedAt: null,          location: '台中', tradeCount: 1  },
    { id: '667788990', name: 'Amy Lee',    avatarUrl: 'https://i.pravatar.cc/40?img=7', status: '正常',    studentVerifiedAt: '2024-06-10', location: '台北', tradeCount: 22 },
  ];

  users: User[] = [];

  ngOnInit() {
    this.applyFilter();
  }

  // 驗證日期 → 驗證狀態
  getVerifyStatus(verifiedAt: string | null,accountstatuses:string): string {
    if(accountstatuses=='審查中') return'待審查';
    if (!verifiedAt) return '未驗證';
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    return new Date(verifiedAt) < oneYearAgo ? '已過期' : '已驗證';
  }

  getAccountBadge(status: string): string {
    const map: Record<string, string> = {
      正常:     'badge-normal',
      審查中:   'badge-review',
      完全停權: 'badge-banned',
    };
    return map[status] ?? '';
  }

  getVerifyBadge(verifiedAt: string | null, accountstatuses:string): string {
    const status = this.getVerifyStatus(verifiedAt,accountstatuses);
    const map: Record<string, string> = {
      已驗證: 'badge-verified',
      已過期: 'badge-expired',
      待審查: 'badge-pending',
      未驗證: 'badge-none',
    };
    return map[status] ?? '';
  }

  // 篩選
  selectAccountStatus(status: string) {
    this.selectedAccountStatus = this.selectedAccountStatus === status ? '' : status;
    this.applyFilter();
  }

  selectVerifyStatus(status: string) {
    this.selectedVerifyStatus = this.selectedVerifyStatus === status ? '' : status;
    this.applyFilter();
  }

  applyFilter() {
    let filtered = this.allUsers;

    if (this.selectedAccountStatus) {
      filtered = filtered.filter(u => u.status === this.selectedAccountStatus);
    }

    if (this.selectedVerifyStatus) {
      filtered = filtered.filter(u =>
        this.getVerifyStatus(u.studentVerifiedAt,u.status) === this.selectedVerifyStatus
      );
    }

    this.pagination.init(filtered.length, this.pageSize);
    const start = (this.pagination.currentPage - 1) * this.pageSize;
    this.users = filtered.slice(start, start + this.pageSize);
  }

  loadUsers() {
    this.applyFilter();
  }

  viewUser(user: User) {
    this.dialog.open(UserDialogComponent, { data: user });
  }

  prevPage() { if (this.pagination.prevPage()) this.loadUsers(); }
  nextPage() { if (this.pagination.nextPage()) this.loadUsers(); }
  goToPage(page: number) { if (this.pagination.goToPage(page)) this.loadUsers(); }
}

export interface User {
  id: string;
  name: string;
  avatarUrl: string; //頭像
  status: string;   //狀態
  studentVerifiedAt: string | null; // 驗證日期，null 表示未驗證
  location: string;
  tradeCount: number;
}
