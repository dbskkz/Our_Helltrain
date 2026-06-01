import { ReportDialogComponent } from './../report-dialog/report-dialog.component';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, File, ChevronRight, ChevronLeft } from 'lucide-angular';
import { MatDialog } from '@angular/material/dialog';
import { PaginationService } from '../../@Services/pageination.service';
import { AnnounDialogComponent } from '../announcement-dialog/announcement-dialog.component';

@Component({
  selector: 'app-report',
  imports: [FormsModule, LucideAngularModule],
  templateUrl: './report.component.html',
  styleUrl: './report.component.scss',
})
export class ReportComponent {
  constructor(public pagination: PaginationService, public dialog: MatDialog) {}

  readonly panelsIcon = File;
  readonly nextIcon = ChevronRight;
  readonly prevIcon = ChevronLeft;
  readonly pageSize = 5;

  searchQuery: string = '';
  pendingCount: number = 0;
  disputes: Dispute[] = [];

  // Tab 狀態
  activeTab: 'pending' | 'done' = 'pending';

  private allDisputes: Dispute[] = [
    { caseId: 'DISP-001', productName: '快樂羊駝',     productId: '123456789', complainantName: 'Alice Chen',  accusedName: 'Bob Wang',   reportDate: '2026-04-10', status: '待處理', type: '商品', violationType: '描述不符', orderId: 'ORD-10011', description: '商品與描述嚴重不符，實際收到的顏色和尺寸都不對。', filePath: 'https://picsum.photos/seed/file2/400/300' },
    { caseId: 'DISP-002', productName: '可愛草泥馬',    productId: '987654321', complainantName: 'Carol Lin',   accusedName: 'David Wu',   reportDate: '2026-04-18', status: '待處理', type: '交易', violationType: '未出貨',   orderId: 'ORD-10022', description: '付款後超過兩週賣家未出貨也未回應。', filePath: 'https://picsum.photos/seed/file2/400/300' },
    { caseId: 'DISP-003', productName: '羊駝玩偶',     productId: '112233445', complainantName: 'Eva Huang',   accusedName: 'Frank Lee',  reportDate: '2026-04-25', status: '待處理', type: '商品', violationType: '瑕疵品',   orderId: 'ORD-10033', description: '收到商品時包裝破損，內部商品也有明顯刮傷。', filePath: 'https://picsum.photos/seed/file2/400/300' },
    { caseId: 'DISP-004', productName: '手工羊駝公仔',  productId: '556677889', complainantName: 'Grace Tsai',  accusedName: 'Henry Liu',  reportDate: '2026-05-01', status: '待處理', type: '交易', violationType: '拒絕退款', orderId: 'ORD-10044', description: '商品有問題申請退款，賣家拒絕處理。', filePath: 'https://picsum.photos/seed/file4/400/300' },
    { caseId: 'DISP-005', productName: '羊駝羊毛氈',    productId: '998877665', complainantName: 'Iris Chang',  accusedName: 'James Hsu',  reportDate: '2026-05-08', status: '待處理', type: '商品', violationType: '仿冒品',   orderId: 'ORD-10055', description: '懷疑商品為仿冒品，與官方正品有明顯差異。', filePath: 'https://picsum.photos/seed/file5/400/300' },
    { caseId: 'DISP-006', productName: '羊駝抱枕',     productId: '334455667', complainantName: 'Kevin Yang',  accusedName: 'Laura Chen', reportDate: '2026-05-12', status: '待處理', type: '交易', violationType: '描述不符', orderId: 'ORD-10066', description: '賣家標示全新但實際為二手使用過的商品。', filePath: 'https://picsum.photos/seed/file2/400/300' },
  ];

  private allDoneDisputes: Dispute[] = [
    { caseId: 'DISP-101', productName: '羊駝鑰匙圈',   productId: '111222333', complainantName: 'Mary Su',    accusedName: 'Nick Ho',    reportDate: '2026-03-05', status: '已駁回', type: '商品', violationType: '描述不符', orderId: 'ORD-20011', description: '買家認為顏色不符，經查照片標示清楚，駁回檢舉。', filePath: 'https://picsum.photos/seed/file2/400/300' },
    { caseId: 'DISP-102', productName: '迷你草泥馬',   productId: '444555666', complainantName: 'Oscar Liao', accusedName: 'Penny Cheng',reportDate: '2026-03-12', status: '已下架', type: '商品', violationType: '仿冒品',   orderId: 'ORD-20022', description: '確認為仿冒品，商品強制下架並通知賣家。', filePath: 'https://picsum.photos/seed/file6/400/300' },
    { caseId: 'DISP-103', productName: '羊駝束口袋',   productId: '777888999', complainantName: 'Quinn Tseng',accusedName: 'Ray Lin',    reportDate: '2026-03-20', status: '已停權', type: '交易', violationType: '未出貨',   orderId: 'ORD-20033', description: '賣家多次未出貨，已停權處理。', filePath: 'https://picsum.photos/seed/file2/400/300' },
  ];

  // 根據目前 tab 取得對應資料來源
  private get source(): Dispute[] {
    return this.activeTab === 'pending' ? this.allDisputes : this.allDoneDisputes;
  }

  private get filtered(): Dispute[] {
    if (!this.searchQuery) return this.source;
    return this.source.filter(d =>
      d.caseId.includes(this.searchQuery) ||
      d.productName.includes(this.searchQuery) ||
      d.complainantName.includes(this.searchQuery) ||
      d.accusedName.includes(this.searchQuery)
    );
  }

  ngOnInit() {
    this.pagination.init(this.source.length, this.pageSize);
    this.loadDisputes();
  }

  loadDisputes() {
    const data = this.filtered;
    this.pendingCount = data.length;
    const start = (this.pagination.currentPage - 1) * this.pageSize;
    this.disputes = data.slice(start, start + this.pageSize);
  }

  // 切換 tab
  switchTab(tab: 'pending' | 'done') {
    this.activeTab = tab;
    this.searchQuery = '';
    this.pagination.init(this.source.length, this.pageSize);
    this.loadDisputes();
  }

  search() {
    this.pagination.init(this.filtered.length, this.pageSize);
    this.loadDisputes();
  }

viewReason(dispute: Dispute) {
  const dialogRef = this.dialog.open(ReportDialogComponent, {
    data: dispute,
  });

  dialogRef.afterClosed().subscribe(result => {
    if (!result) return;

    // 從待處理移除
    const idx = this.allDisputes.findIndex(d => d.caseId === dispute.caseId);
    if (idx !== -1) this.allDisputes.splice(idx, 1);

    // 決定最終狀態
    let finalStatus = '';
    if (result.action === 'reject') {
      finalStatus = '已駁回';
    } else if (result.action === 'approve') {
      finalStatus = dispute.type === '商品' ? '已下架' : '已停權';
    }

    // 推入已處理
    this.allDoneDisputes.unshift({ ...dispute, status: finalStatus });

    // 重新整理目前 tab
    this.pagination.init(this.source.length, this.pageSize);
    this.loadDisputes();
  });
}


 reject(dispute: Dispute) {
  const confirmRef = this.dialog.open(AnnounDialogComponent);
  confirmRef.afterClosed().subscribe(confirmed => {
    if (!confirmed) return;

    const idx = this.allDisputes.findIndex(d => d.caseId === dispute.caseId);
    if (idx !== -1) this.allDisputes.splice(idx, 1);

    this.allDoneDisputes.unshift({ ...dispute, status: '已駁回' });

    this.pagination.init(this.source.length, this.pageSize);
    this.loadDisputes();
  });
}

approve(dispute: Dispute) {
  const confirmRef = this.dialog.open(AnnounDialogComponent);
  confirmRef.afterClosed().subscribe(confirmed => {
    if (!confirmed) return;

    const idx = this.allDisputes.findIndex(d => d.caseId === dispute.caseId);
    if (idx !== -1) this.allDisputes.splice(idx, 1);

    const finalStatus = dispute.type === '商品' ? '已下架' : '已停權';
    this.allDoneDisputes.unshift({ ...dispute, status: finalStatus });

    this.pagination.init(this.source.length, this.pageSize);
    this.loadDisputes();
  });
}

  prevPage()  { if (this.pagination.prevPage())        this.loadDisputes(); }
  nextPage()  { if (this.pagination.nextPage())        this.loadDisputes(); }
  goToPage(page: number) { if (this.pagination.goToPage(page)) this.loadDisputes(); }
}

export interface Dispute {
  caseId: string;
  productId: string;
  productName: string;
  complainantName: string;
  accusedName: string;
  description: string;
  filePath: string;
  reportDate: string;
  status: string;
  result?: string;  type: string;
  violationType: string;
  orderId: string;
}
