import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Data } from '@angular/router';
import { LucideAngularModule, CircleFadingArrowUp, Newspaper} from 'lucide-angular';
import { AnnounDialogComponent } from '../report-dialog/report-dialog.component';

@Component({
  selector: 'app-announcement',
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './announcement.component.html',
  styleUrl: './announcement.component.scss',
})
export class AnnouncementComponent {
  constructor(private dialog: MatDialog){}
  readonly circleIcon=CircleFadingArrowUp;
  readonly newpaperIcon=Newspaper;

  announcementTitle: string = '';
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  activeAnnouncements: announ[] = [];
  pastAnnouncements: past[] = [];

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.[0]) {
      this.selectedFile = input.files[0];
      this.previewUrl = URL.createObjectURL(this.selectedFile);
    }
  }

  removeImage(event: Event) {
    event.stopPropagation(); // 防止觸發上傳區的 click
    this.selectedFile = null;
    this.previewUrl = null;
  }
  preview() {}
  upload() {
    const dialogRef=this.dialog.open(AnnounDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
    // result 就是 [mat-dialog-close] 回傳的值
    if (result === true) {
      // 使用者按了確認
    } else {
      // 使用者按了取消或直接關掉
    }
  });
  }
  onDrop(event: any) {}
  editAnnouncement(item: any) {}
  publish(item: any) {}
  unpublish(item: any) {}
}

export interface announ {
  id: number;
  content: number;
  startDate: Data;
  endDate: Date;
}
export interface past {
  id: number;
  content: number;
  startDate: Data;
  endDate: Date;
}
