import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { LucideAngularModule, CircleFadingArrowUp, Newspaper, ChevronRight, ChevronLeft,} from 'lucide-angular';
import { AnnounDialogComponent } from '../announcement-dialog/announcement-dialog.component';
import { PaginationService } from '../../@Services/pageination.service';

@Component({
  selector: 'app-announcement',
  imports: [CommonModule, FormsModule, LucideAngularModule, MatDialogModule],
  templateUrl: './announcement.component.html',
  styleUrl: './announcement.component.scss',
})
export class AnnouncementComponent {
  constructor(private dialog: MatDialog) {}
  readonly circleIcon = CircleFadingArrowUp;
  readonly newpaperIcon = Newspaper;
  readonly nextIcon=ChevronRight;
  readonly prevIcon=ChevronLeft;

  readonly pageSize = 5;

  // 兩個獨立的分頁實例，互不干擾
  activePagination = new PaginationService();
  pastPagination = new PaginationService();

  announcementTitle: string = '';
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  activeAnnouncements: Announcement[] = [];
  pastAnnouncements: Announcement[] = [];

  private allAnnouncements: Announcement[] = [
    { id: 1, title: '平台維護公告：本週六凌晨 2-4 點系統維護', startDate: '2026-05-01', endDate: '2026-05-31' },
    { id: 2, title: '五月優惠活動：交易手續費全免',             startDate: '2026-05-01', endDate: '2026-05-15' },
    { id: 3, title: '六月新功能上線公告',                      startDate: '2026-06-01', endDate: '2026-06-30' },
    { id: 4, title: '四月系統升級公告',                        startDate: '2026-04-01', endDate: '2026-04-30' },
    { id: 5, title: '春節假期公告：客服暫停服務',               startDate: '2026-01-27', endDate: '2026-02-02' },
    { id: 6, title: '三月平台條款更新公告',                    startDate: '2026-03-01', endDate: '2026-03-31' },
    { id: 7, title: '三月平台條款更新公告',                    startDate: '2026-03-01', endDate: '2026-03-31' },
    { id: 8, title: '三月平台條款更新公告',                    startDate: '2026-03-01', endDate: '2026-03-31' },
    { id: 9, title: '三月平台條款更新公告',                    startDate: '2026-03-01', endDate: '2026-03-31' },
    { id: 10, title: '平台公告測試',                          startDate: '2026-05-01', endDate: '2026-05-31' },
    { id: 11, title: '平台公告測試',                          startDate: '2026-05-01', endDate: '2026-05-31' },
    { id: 12, title: '平台公告測試',                          startDate: '2026-05-01', endDate: '2026-05-31' },
    { id: 13, title: '平台公告測試',                          startDate: '2026-05-01', endDate: '2026-05-31' },
    { id: 14, title: '平台公告測試',                          startDate: '2026-05-01', endDate: '2026-05-31' },
    { id: 15, title: '平台公告測試',                          startDate: '2026-05-01', endDate: '2026-05-31' },
  ];

  private get today(): string {
    return new Date().toISOString().split('T')[0];
  }

  private get activeList(): Announcement[] {
    return this.allAnnouncements.filter(a => a.endDate >= this.today);
  }

  private get pastList(): Announcement[] {
    return this.allAnnouncements.filter(a => a.endDate < this.today);
  }

  ngOnInit() {
    // 各自初始化一次，之後換頁只跑 load
    this.activePagination.init(this.activeList.length, this.pageSize);
    this.pastPagination.init(this.pastList.length, this.pageSize);
    this.loadActive();
    this.loadPast();
  }

  loadActive() {
    const start = (this.activePagination.currentPage - 1) * this.pageSize;
    this.activeAnnouncements = this.activeList.slice(start, start + this.pageSize);
  }

  loadPast() {
    const start = (this.pastPagination.currentPage - 1) * this.pageSize;
    this.pastAnnouncements = this.pastList.slice(start, start + this.pageSize);
  }

  activePrev() { if (this.activePagination.prevPage()) this.loadActive(); }
  activeNext() { if (this.activePagination.nextPage()) this.loadActive(); }
  activeGoTo(page: number) { if (this.activePagination.goToPage(page)) this.loadActive(); }

  pastPrev() { if (this.pastPagination.prevPage()) this.loadPast(); }
  pastNext() { if (this.pastPagination.nextPage()) this.loadPast(); }
  pastGoTo(page: number) { if (this.pastPagination.goToPage(page)) this.loadPast(); }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.[0]) {
      this.selectedFile = input.files[0];
      this.previewUrl = URL.createObjectURL(this.selectedFile);
    }
  }

  removeImage(event: Event) {
    event.stopPropagation();
    this.selectedFile = null;
    this.previewUrl = null;
  }

  preview() {}

  upload() {
    const dialogRef = this.dialog.open(AnnounDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        // 呼叫上傳 API
      }
    });
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    const file = event.dataTransfer?.files?.[0];
    if (file) {
      this.selectedFile = file;
      this.previewUrl = URL.createObjectURL(file);
    }
  }

  editAnnouncement(item: Announcement) {}
  publish(item: Announcement) {}
  unpublish(item: Announcement) {}
}

export interface Announcement {
  id: number;
  title: string;
  startDate: string;
  endDate: string;
}
