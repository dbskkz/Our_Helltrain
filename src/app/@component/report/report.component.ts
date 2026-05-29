import { ReportDialogComponent } from './../report-dialog/report-dialog.component';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, File ,ChevronRight ,ChevronLeft} from 'lucide-angular';
import { MatDialog } from '@angular/material/dialog';
import { PaginationService } from '../../@Services/pageination.service';

@Component({
  selector: 'app-report',
  imports: [FormsModule, LucideAngularModule,],
  templateUrl: './report.component.html',
  styleUrl: './report.component.scss',
})
export class ReportComponent {
  constructor(public pagination: PaginationService,public dialog:MatDialog) {}

  readonly panelsIcon=File;
  readonly nextIcon=ChevronRight;
  readonly prevIcon=ChevronLeft;
  readonly pageSize = 5;

  searchQuery: string = '';
  pendingCount: number = 0;
  disputes: Dispute[] = [];

  private allDisputes: Dispute[] = [
    { caseId: 'DISP-001', productName: '快樂羊駝',    productId: '123456789', complainantName: 'Alice Chen',  accusedName: 'Bob Wang',   reportDate: '2026-04-10', status: '待處理', type: '商品',   violationType: '描述不符', orderId: 'ORD-10011', description: '商品與描述嚴重不符，實際收到的顏色和尺寸都不對。', filePath: null },
    { caseId: 'DISP-002', productName: '可愛草泥馬',   productId: '987654321', complainantName: 'Carol Lin',   accusedName: 'David Wu',   reportDate: '2026-04-18', status: '待處理', type: '交易',   violationType: '未出貨',   orderId: 'ORD-10022', description: '付款後超過兩週賣家未出貨也未回應。', filePath: 'https://picsum.photos/seed/file2/400/300' },
    { caseId: 'DISP-003', productName: '羊駝玩偶',    productId: '112233445', complainantName: 'Eva Huang',   accusedName: 'Frank Lee',  reportDate: '2026-04-25', status: '待處理', type: '商品',   violationType: '瑕疵品',   orderId: 'ORD-10033', description: '收到商品時包裝破損，內部商品也有明顯刮傷。', filePath: null },
    { caseId: 'DISP-004', productName: '手工羊駝公仔', productId: '556677889', complainantName: 'Grace Tsai',  accusedName: 'Henry Liu',  reportDate: '2026-05-01', status: '待處理', type: '交易',   violationType: '拒絕退款', orderId: 'ORD-10044', description: '商品有問題申請退款，賣家拒絕處理。', filePath: 'https://picsum.photos/seed/file4/400/300' },
    { caseId: 'DISP-005', productName: '羊駝羊毛氈',   productId: '998877665', complainantName: 'Iris Chang',  accusedName: 'James Hsu',  reportDate: '2026-05-08', status: '待處理', type: '商品',   violationType: '仿冒品',   orderId: 'ORD-10055', description: '懷疑商品為仿冒品，與官方正品有明顯差異。', filePath: 'https://picsum.photos/seed/file5/400/300' },
    { caseId: 'DISP-006', productName: '羊駝抱枕',    productId: '334455667', complainantName: 'Kevin Yang',  accusedName: 'Laura Chen', reportDate: '2026-05-12', status: '待處理', type: '交易',   violationType: '描述不符', orderId: 'ORD-10066', description: '賣家標示全新但實際為二手使用過的商品。', filePath: null },
  ];

  private get filtered(): Dispute[] {
    if (!this.searchQuery) return this.allDisputes;
    return this.allDisputes.filter(d =>
      d.caseId.includes(this.searchQuery) ||
      d.productName.includes(this.searchQuery) ||
      d.complainantName.includes(this.searchQuery) ||
      d.accusedName.includes(this.searchQuery)
    );
  }

  ngOnInit() {
    this.pagination.init(this.allDisputes.length, this.pageSize);
    this.loadDisputes();
  }

  loadDisputes() {
    const data = this.filtered;
    this.pendingCount = data.length;
    const start = (this.pagination.currentPage - 1) * this.pageSize;
    this.disputes = data.slice(start, start + this.pageSize);
  }

  search() {
    this.pagination.init(this.filtered.length, this.pageSize);
    this.loadDisputes();
  }

  openFilter() {}
  viewReason(dispute: Dispute) {
    this.dialog.open(ReportDialogComponent, {
    data: dispute
  });
  }
  reject(dispute: Dispute) {}
  approve(dispute: Dispute) {}

  prevPage() { if (this.pagination.prevPage()) this.loadDisputes(); }
  nextPage() { if (this.pagination.nextPage()) this.loadDisputes(); }
  goToPage(page: number) { if (this.pagination.goToPage(page)) this.loadDisputes(); }
}

export interface Dispute {
  caseId: string;          // report_id
  productId: string;       // product_id
  productName: string;       // productName
  complainantName: string;   // 檢舉人
  accusedName: string;       // 被檢舉人
  description: string;     // 案件描述
  filePath?: string | null;       // 附件（非必填）
  reportDate: string;      // 檢舉日期
  status: string;          // 狀態
  type: string;            // 檢舉類型（商品、交易）
  violationType: string;   // 違規類型
  orderId: string;         // 訂單 ID
}


/*// 把字串分割成陣列
const files = dispute.filePath ? dispute.filePath.split(',') : [];

// 顯示每個檔案
files.forEach(file => {
    const url = `http://localhost:8080/uploads/${file}`;
    // 圖片就顯示 <img>
    // PDF 就顯示連結
})*/
