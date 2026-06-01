import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FrontReportComponent } from '../@component/front-report/front-report.component';

export interface ReportDialogData {
  type: 'product' | 'user'; // 決定預設顯示哪個 tab
  targetName: string; // 被檢舉者名稱
  targetId: string; // 被檢舉者 ID
  productId?: string; // 商品 ID（商品檢舉才需要）
}

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  constructor(private dialog: MatDialog) {}

  /**
   * 開啟檢舉 Dialog
   * @param type     'product' = 檢舉商品 | 'user' = 檢舉用戶
   * @param targetName  被檢舉者名稱
   * @param targetId    被檢舉者 ID
   * @param productId   商品 ID（檢舉商品時才傳）
   */
  openReportDialog(
    type: 'product' | 'user',
    targetName: string,
    targetId: string,
    productId?: string,
  ) {
    this.dialog.open(FrontReportComponent, {
      width: '600px',
      disableClose: true, // 點外部不關閉，防止誤觸
      data: {
        type,
        targetName,
        targetId,
        productId,
      } as ReportDialogData,
    });
  }
}
