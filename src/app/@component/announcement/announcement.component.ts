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
  // 未發布 / 編輯中（isPublished: false，或 isPublished: true 但 startDate > today）
  { id: 1,  title: '七月會員回饋活動',       startDate: '2026-07-01', endDate: '2026-07-31', isPublished: false, content: '七月份消費滿額即享回饋金，詳情請見活動頁面。',                       imgPath: 'https://picsum.photos/seed/ann1/400/200' },
  { id: 2,  title: '八月系統升級預告',       startDate: '2026-08-01', endDate: '2026-08-31', isPublished: false, content: '八月將進行重大系統升級，部分功能將暫時停用。',                       imgPath: 'https://picsum.photos/seed/ann2/400/200' },
  { id: 3,  title: '新版搜尋功能上線',       startDate: '2026-07-15', endDate: '2026-07-30', isPublished: false, content: '全新搜尋引擎即將上線，支援更精準的商品篩選。',                       imgPath: 'https://picsum.photos/seed/ann3/400/200' },
  { id: 4,  title: '暑期促銷活動預告',       startDate: '2026-07-15', endDate: '2026-08-15', isPublished: true,  content: '暑期大促即將開跑，多項商品限時折扣，敬請期待。',                     imgPath: 'https://picsum.photos/seed/ann4/400/200' },
  { id: 5,  title: '金流系統更新公告',       startDate: '2026-07-20', endDate: '2026-07-25', isPublished: true,  content: '金流服務將於六月下旬進行更新，更新期間請避免進行交易。',             imgPath: 'https://picsum.photos/seed/ann5/400/200' },
  { id: 6,  title: '客服系統升級通知',       startDate: '2026-07-05', endDate: '2026-07-10', isPublished: false, content: '客服系統升級期間回覆時間可能延長，造成不便敬請見諒。',               imgPath: 'https://picsum.photos/seed/ann6/400/200' },

  // 發布中（isPublished: true，startDate <= today，endDate >= today）
  { id: 7,  title: '平台維護公告',           startDate: '2026-06-01', endDate: '2026-06-30', isPublished: true,  content: '本週六凌晨 2-4 點進行系統維護，期間服務暫停，請提前安排交易時間。', imgPath: 'https://picsum.photos/seed/ann7/400/200' },
  { id: 8,  title: '五月交易手續費優惠',     startDate: '2026-06-01', endDate: '2026-06-30', isPublished: true,  content:  '六月份交易手續費全免，把握機會多多交易！',                           imgPath: 'https://picsum.photos/seed/ann8/400/200' },
  { id: 9,  title: '實名驗證公告',           startDate: '2026-06-01', endDate: '2026-06-30', isPublished: true,  content: '即日起新用戶須完成實名驗證方可進行交易，請於期限內完成。',           imgPath: 'https://picsum.photos/seed/ann9/400/200' },
  { id: 10, title: '商品評價功能上線',       startDate: '2026-06-01', endDate: '2026-06-30', isPublished: true,  content: '全新交易評價功能正式上線，完成交易後可對買賣雙方進行評分。',           imgPath: 'https://picsum.photos/seed/ann10/400/200' },
  { id: 11, title: '防詐騙提醒公告',         startDate: '2026-06-01', endDate: '2026-06-30', isPublished: true,  content: '近期詐騙案件增加，請勿在平台外進行交易，謹慎保護個人資料。',           imgPath: 'https://picsum.photos/seed/ann11/400/200' },
  { id: 12, title: '平台服務條款更新',       startDate: '2026-06-01', endDate: '2026-06-30', isPublished: true,  content: '平台服務條款已更新，請至官網查閱最新版本，繼續使用即視為同意。',     imgPath: 'https://picsum.photos/seed/ann12/400/200' },

  // 已結束（isPublished: true，endDate < today）
  { id: 13, title: '四月系統升級公告',       startDate: '2026-04-01', endDate: '2026-04-30', isPublished: true,  content: '系統已完成升級，效能提升約 30%，感謝耐心等待。',                     imgPath: 'https://picsum.photos/seed/ann13/400/200' },
  { id: 14, title: '春節假期公告',           startDate: '2026-01-27', endDate: '2026-02-02', isPublished: true,  content: '春節期間客服暫停服務，緊急問題請來信，將於年後盡快回覆。',           imgPath: 'https://picsum.photos/seed/ann14/400/200' },
  { id: 15, title: '三月條款更新公告',       startDate: '2026-03-01', endDate: '2026-03-31', isPublished: true,  content: '平台服務條款三月版本已更新，請用戶詳閱最新內容。',                   imgPath: 'https://picsum.photos/seed/ann15/400/200' },
  { id: 16, title: '二月例行維護公告',       startDate: '2026-02-10', endDate: '2026-02-10', isPublished: true,  content: '二月十日凌晨 1-3 點進行例行維護，屆時服務將暫時中斷。',             imgPath: 'https://picsum.photos/seed/ann16/400/200' },
  { id: 17, title: '一月新功能發布公告',     startDate: '2026-01-05', endDate: '2026-01-20', isPublished: true,  content: '一月份新增商品收藏與比較功能，歡迎用戶體驗並回饋意見。',             imgPath: 'https://picsum.photos/seed/ann17/400/200' },
  { id: 18, title: '去年底年終活動總結',     startDate: '2025-12-20', endDate: '2025-12-31', isPublished: true,  content: '年終活動圓滿結束，感謝所有參與的買賣雙方，明年見！',                 imgPath: 'https://picsum.photos/seed/ann18/400/200' },
];

  private get today(): string {
    return new Date().toISOString().split('T')[0];
  }
  private get activeList(): Announcement[] {
    return this.allAnnouncements.filter(
      (a) => a.endDate >= this.today && a.isPublished &&a.startDate<=this.today,
    );
  }
  private get pastList(): Announcement[] {
    return this.allAnnouncements.filter(
      (a) => a.endDate < this.today && a.isPublished,
    );
  }
  private get neverList(): Announcement[] {
    return this.allAnnouncements.filter((a) => !a.isPublished || (a.isPublished && a.startDate > this.today));
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
    if (this.neverPagination.prevPage()) this.loadNever();
  }
  neverNext() {
    if (this.neverPagination.nextPage()) this.loadNever();
  }
  neverGoTo(page: number) {
    if (this.neverPagination.goToPage(page)) this.loadNever();
  }

reloadAll() {
  this.neverPagination.init(this.neverList.length, this.pageSize);
  this.activePagination.init(this.activeList.length, this.pageSize);
  this.pastPagination.init(this.pastList.length, this.pageSize);
  this.loadNever();
  this.loadActive();
  this.loadPast();
}

addAnnounce() {
  const dialogRef = this.dialog.open(AddannounceDaialogComponent, {
    width: '520px',
  });

  dialogRef.afterClosed().subscribe((result) => {
    if (!result) return;

    const newItem: Announcement = {
      id: 19,
      title: result.title,
      startDate: result.shelfDate,
      endDate: result.removalDate,
      isPublished: result.isPublished,
      content: result.content,
      imgPath: result.existingImgUrl ?? null,
    };
    this.allAnnouncements.push(newItem);
    this.reloadAll();
  });
}

editAnnouncement(item: Announcement) {
  const dialogRef = this.dialog.open(AddannounceDaialogComponent, {
    width: '520px',
    data: item,
  });

  dialogRef.afterClosed().subscribe((result) => {
    if (!result) return;

    const idx = this.allAnnouncements.findIndex(a => a.id === item.id);
    if (idx !== -1) {
      this.allAnnouncements[idx] = {
        ...this.allAnnouncements[idx],
        title: result.title,
        startDate: result.shelfDate,
        endDate: result.removalDate,
        isPublished: result.isPublished,
        content: result.content,
        imgPath: result.existingImgUrl ?? null,
      };
    }
    this.reloadAll();
  });
}

}

export interface Announcement {
  id: number;
  title: string;
  startDate: string;
  endDate: string;
  isPublished: boolean;
  content?: string;
  imgPath: string ;
}
