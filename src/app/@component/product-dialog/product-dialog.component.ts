import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { LucideAngularModule, X } from 'lucide-angular';
import { AnnounDialogComponent } from '../announcement-dialog/announcement-dialog.component';

export interface ProductDialogData {
  id: string;
  name: string;
  imageUrl: string;
  sellerName: string;
  description: string;
  price: number;
  category: string[];   // 多分類，顯示時以「，」區隔
  listedAt: string;
  condition: string;      // 商品狀況，例如：全新、二手
  status: string;         // 販售中 | 違規下架
  gradeUsed: string;      // 商品使用年級
  location: string;       // 商品在地
}

@Component({
  selector: 'app-product-dialog',
  imports: [CommonModule, LucideAngularModule,MatDialogModule],
  templateUrl: './product-dialog.component.html',
  styleUrl: './product-dialog.component.scss',
})
export class ProductDialogComponent {
  readonly closeIcon = X;

  // 目前狀態（可在 dialog 內即時切換）
  currentStatus: string;

  constructor(
    private dialog:MatDialog,
    public dialogRef: MatDialogRef<ProductDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProductDialogData
  ) {
    this.currentStatus = data.status;
  }

  /** 違規下架：更新狀態並關閉 dialog */
  setStatus(status: string) {
    const confirmRef=this.dialog.open(AnnounDialogComponent);
    confirmRef.afterClosed().subscribe((confirm)=>{
      if(confirm==true){
      this.currentStatus = status;
        // 若需要呼叫 API，在這裡加入然後執行
        // this.productService.updateStatus(this.data.id, status).subscribe(() => {
        //   this.currentStatus = status;
          this.dialogRef.close({ updatedStatus: this.currentStatus });
        // });
      }
    })

  }

  /** badge class 對應 */
  getStatusBadge(status: string): string {
    const map: Record<string, string> = {
      '販售中':  'badge-normal',
      '違規下架': 'badge-banned',
    };
    return map[status] ?? '';
  }


}
