import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, File } from 'lucide-angular';

@Component({
  selector: 'app-report',
  imports: [FormsModule, LucideAngularModule],
  templateUrl: './report.component.html',
  styleUrl: './report.component.scss',
})
export class ReportComponent {


  readonly panelsIcon=File;

  searchQuery: string = '';
  disputes: Dispute[] = [];
  pendingCount: number = 0;
  currentPage: number = 1;
  totalPages: number = 1;
  pageNumbers: number[] = [];

  search() {
    this.currentPage = 1;
    this.loadDisputes();
  }

  viewReason(dispute: Dispute) {
    /* 開啟事由彈窗 */
  }
  reject(dispute: Dispute) {
    /* 呼叫駁回 API */
  }
  approve(dispute: Dispute) {
    /* 呼叫驗證通過 API */
  }

  loadDisputes() {}

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadDisputes();
    }
  }
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadDisputes();
    }
  }
  goToPage(page: number) {
    this.currentPage = page;
    this.loadDisputes();
  }
}

export interface Dispute {
  caseId: number;
  productName: string;
  productId: number;
  buyerName: string;
  sellerName: string;
  submittedAt: string; //檢舉日期
  status: string;
}
