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

 // 💥 用來記錄使用者有沒有滑到最下面（預設：尚未看完）
  isReadToBottom = false;

  constructor(private dialogRef: MatDialogRef<PlatformRulesComponent>) {}

  // 💥 滾動條監聽機關
  onScroll(event: Event): void {
    const element = event.target as HTMLElement;

    // 公式：當「滾上去的高度」+「目前看見的視窗高度」>=「內文總高度」
    // -5 是為了防禦各家瀏覽器小數點像素的四捨五入誤差
    const isAtBottom = element.scrollTop + element.clientHeight >= element.scrollHeight - 5;

    if (isAtBottom && !this.isReadToBottom) {
      this.isReadToBottom = true; // 🎉 抓到你滑到最下面了！
    }
  }

  // 使用者點擊「我瞭解了並同意」
  onConfirm(): void {
    this.dialogRef.close(true); // 關閉並傳遞 true 禮物給外層，啟動外層自動打勾
  }

  // 使用者點擊「取消」
  onCancel(): void {
    this.dialogRef.close(false); // 關閉且維持不打勾
  }
}
