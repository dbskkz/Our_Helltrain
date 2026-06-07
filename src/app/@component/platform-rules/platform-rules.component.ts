import { Component } from '@angular/core';
import { MatIcon } from "@angular/material/icon";
import { MatDialogContent, MatDialogTitle, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: 'app-platform-rules',
  imports: [MatIcon, MatDialogContent, MatDialogTitle],
  templateUrl: './platform-rules.component.html',
  styleUrl: './platform-rules.component.scss'
})
export class PlatformRulesComponent {

  constructor(private dialogRef: MatDialogRef<PlatformRulesComponent>) {}

  // 使用者點擊「我瞭解了並同意」
  onConfirm(): void {
    this.dialogRef.close(true); // 關閉並傳遞 true 禮物給外層，啟動外層自動打勾
  }

  // 使用者點擊「取消」
  onCancel(): void {
    this.dialogRef.close(false); // 關閉且維持不打勾
  }
}
