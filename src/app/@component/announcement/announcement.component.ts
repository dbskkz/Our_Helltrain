import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  LucideAngularModule,
  Newspaper,
  ChevronRight,
  ChevronLeft,
  Plus,
} from 'lucide-angular';
import { PaginationService } from '../../@Services/pageination.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddannounceDaialogComponent } from '../addannounce-daialog/addannounce-daialog.component';

@Component({
  selector: 'app-announcement',
  imports: [CommonModule, FormsModule, LucideAngularModule, MatDialogModule],
  templateUrl: './announcement.component.html',
  styleUrl: './announcement.component.scss',
})
export class AnnouncementComponent {
  constructor(private dialog: MatDialog) {}

  readonly addInco = Plus;
  readonly newpaperIcon = Newspaper;
  readonly nextIcon = ChevronRight;
  readonly prevIcon = ChevronLeft;

  readonly pageSize = 5;

  // 兩個獨立的分頁實例，互不干擾
  activePagination = new PaginationService();
  pastPagination = new PaginationService();
  neverPagination = new PaginationService();

  activeAnnouncements: Announcement[] = [];
  pastAnnouncements: Announcement[] = [];
  neverAnnouncements: Announcement[] = [];

private allAnnouncements: Announcement[] = [
  { id: 1,  title: '平台維護公告',         startDate: '2026-05-01', endDate: '2026-05-31', isPublished: true,  content: '本週六凌晨 2-4 點進行系統維護，期間服務暫停，請提前安排交易時間。',     imgPath: 'https://picsum.photos/seed/ann1/400/200' },
  { id: 2,  title: '五月優惠活動',         startDate: '2026-05-01', endDate: '2026-05-20', isPublished: true,  content: '五月份交易手續費全免，把握機會多多交易！',                           imgPath: null },
  { id: 3,  title: '六月新功能上線公告',   startDate: '2026-06-01', endDate: '2026-06-30', isPublished: false, content: '六月將上線全新的商品推薦功能，敬請期待。',                           imgPath: 'https://picsum.photos/seed/ann3/400/200' },
  { id: 4,  title: '四月系統升級公告',     startDate: '2026-04-01', endDate: '2026-04-30', isPublished: true,  content: '系統已完成升級，效能提升約 30%，感謝耐心等待。',                     imgPath: null },
  { id: 5,  title: '春節假期公告',         startDate: '2026-01-27', endDate: '2026-02-02', isPublished: true,  content: '春節期間客服暫停服務，緊急問題請來信，將於年後盡快回覆。',           imgPath: null },
  { id: 6,  title: '三月平台條款更新公告', startDate: '2026-03-01', endDate: '2026-03-31', isPublished: true,  content: '平台服務條款已更新，請至官網查閱最新版本，繼續使用即視為同意。',     imgPath: null },
  { id: 7,  title: '用戶實名制公告',       startDate: '2026-03-15', endDate: '2026-03-31', isPublished: false, content: '即日起新用戶須完成實名驗證方可進行交易，舊用戶請於期限內完成驗證。', imgPath: 'https://picsum.photos/seed/ann7/400/200' },
  { id: 8,  title: '二月系統維護公告',     startDate: '2026-02-10', endDate: '2026-02-10', isPublished: true,  content: '二月十日凌晨 1-3 點進行例行維護，屆時服務將暫時中斷。',             imgPath: null },
  { id: 9,  title: '評價功能上線公告',     startDate: '2026-03-01', endDate: '2026-03-31', isPublished: false, content: '全新交易評價功能正式上線，完成交易後可對買賣雙方進行評分。',           imgPath: 'https://picsum.photos/seed/ann9/400/200' },
  { id: 10, title: '平台公告測試 A',       startDate: '2026-05-01', endDate: '2026-05-31', isPublished: true,  content: '這是一則測試公告 A。',                                             imgPath: null },
  { id: 11, title: '平台公告測試 B',       startDate: '2026-05-01', endDate: '2026-05-31', isPublished: false, content: '這是一則測試公告 B。',                                             imgPath: null },
  { id: 12, title: '平台公告測試 C',       startDate: '2026-05-01', endDate: '2026-05-31', isPublished: true,  content: '這是一則測試公告 C。',                                             imgPath: null },
  { id: 13, title: '平台公告測試 D',       startDate: '2026-05-01', endDate: '2026-05-31', isPublished: false, content: '這是一則測試公告 D。',                                             imgPath: null },
  { id: 14, title: '平台公告測試 E',       startDate: '2026-05-01', endDate: '2026-05-31', isPublished: true,  content: '這是一則測試公告 E。',                                             imgPath: null },
  { id: 15, title: '平台公告測試 F',       startDate: '2026-05-01', endDate: '2026-05-31', isPublished: true,  content: '這是一則測試公告 F。',                                             imgPath: null },
];
  private get today(): string {
    return new Date().toISOString().split('T')[0];
  }

  private get activeList(): Announcement[] {
    return this.allAnnouncements.filter(
      (a) => a.endDate >= this.today && a.isPublished,
    );
  }

  private get pastList(): Announcement[] {
    return this.allAnnouncements.filter(
      (a) => a.endDate < this.today && a.isPublished,
    );
  }

  private get neverList(): Announcement[] {
    return this.allAnnouncements.filter((a) => !a.isPublished);
  }

  ngOnInit() {
    // 各自初始化一次，之後換頁只跑 load
    this.activePagination.init(this.activeList.length, this.pageSize);
    this.pastPagination.init(this.pastList.length, this.pageSize);
    this.neverPagination.init(this.neverList.length, this.pageSize);
    this.loadActive();
    this.loadPast();
    this.loadNever();
  }

  loadActive() {
    const start = (this.activePagination.currentPage - 1) * this.pageSize;
    this.activeAnnouncements = this.activeList.slice(
      start,
      start + this.pageSize,
    );
  }

  loadPast() {
    const start = (this.pastPagination.currentPage - 1) * this.pageSize;
    this.pastAnnouncements = this.pastList.slice(start, start + this.pageSize);
  }

  loadNever() {
    const start = (this.neverPagination.currentPage - 1) * this.pageSize;
    this.neverAnnouncements = this.neverList.slice(
      start,
      start + this.pageSize,
    );
  }

  activePrev() {
    if (this.activePagination.prevPage()) this.loadActive();
  }
  activeNext() {
    if (this.activePagination.nextPage()) this.loadActive();
  }
  activeGoTo(page: number) {
    if (this.activePagination.goToPage(page)) this.loadActive();
  }

  pastPrev() {
    if (this.pastPagination.prevPage()) this.loadPast();
  }
  pastNext() {
    if (this.pastPagination.nextPage()) this.loadPast();
  }
  pastGoTo(page: number) {
    if (this.pastPagination.goToPage(page)) this.loadPast();
  }

  neverPrev() {
    if (this.pastPagination.prevPage()) this.loadNever();
  }
  neverNext() {
    if (this.pastPagination.nextPage()) this.loadNever();
  }
  neverGoTo(page: number) {
    if (this.pastPagination.goToPage(page)) this.loadNever();
  }

  addAnnounce() {
    const dialogRef = this.dialog.open(AddannounceDaialogComponent, {
      width: '520px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // this.announcementService.create(result).subscribe
        () => {
          // API 在這裡呼叫
          this.loadActive();
          this.loadPast();
        };
      }
    });
  }

 editAnnouncement(item: Announcement) {
  const dialogRef = this.dialog.open(AddannounceDaialogComponent, {
    width: '520px',
    data: item  // 把整筆公告資料傳進去
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.loadActive();
      this.loadPast();
    }
  });
}
  publish(item: Announcement) {}
  unpublish(item: Announcement) {}
}

export interface Announcement {
  id: number;
  title: string;
  startDate: string;
  endDate: string;
  isPublished: boolean;
  content: string;
  imgPath: string | null;
}
