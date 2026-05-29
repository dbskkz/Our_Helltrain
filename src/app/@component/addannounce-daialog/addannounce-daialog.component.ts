import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { LucideAngularModule, CloudUpload, ChevronDown } from 'lucide-angular';
import { AnnounDialogComponent } from '../announcement-dialog/announcement-dialog.component';
import { from } from 'rxjs';
@Component({
  selector: 'app-addannounce-daialog',
  imports: [CommonModule, FormsModule, MatDialogModule, LucideAngularModule],
  templateUrl: './addannounce-daialog.component.html',
  styleUrl: './addannounce-daialog.component.scss',
})
export class AddannounceDaialogComponent {
  constructor(
    private diao: MatDialog,
    private dialogRef: MatDialogRef<AddannounceDaialogComponent>,
  ) {}

  readonly uploadIcon = CloudUpload;
  readonly chevronIcon = ChevronDown;

  // 接收傳進來的資料，沒有傳就是 null（新增模式）
  private data = inject(MAT_DIALOG_DATA);

  today: string = new Date().toISOString().split('T')[0];
  selectedFile: File | null = null;

  // 編輯模式時，存放現有的圖片網址
  existingImgUrl: string | null = null;
  // 使用者選了新圖片時的預覽
  previewUrl: string | null = null;

  form = {
    title: '',
    shelfDate: '',
    removalDate: '',
    content: '',
    imgFile: null as File | null, //as...類型可能是A或B(A | B)
    isPublished: null as boolean | null,
    publishMode: null as string | null,
  };

  // 判斷是新增還是編輯模式
  get isEditMode(): boolean {
    return !!this.data;
  }

  // 目前顯示的圖片：優先顯示新選的，沒有就顯示舊的
  get displayImgUrl(): string | null {
    return this.previewUrl ?? this.existingImgUrl;
  }

  ngOnInit() {
    if (this.data) {
      // 有資料就是編輯模式，把資料填入表單
      this.form.title = this.data.title;
      this.form.shelfDate = this.data.startDate;
      this.form.removalDate = this.data.endDate;
      this.form.content = this.data.content;
      this.form.publishMode = this.data.isPublished ? 'publish' : 'draft';
      this.existingImgUrl = this.data.imgPath;
      console.log('existingImgUrl:', this.existingImgUrl);
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.[0]) {
      const file = input.files[0];
      if (file.size > 5 * 1024 * 1024) {
        alert('檔案大小不能超過 5MB');
        return;
      }
      this.form.imgFile = file;
      this.previewUrl = URL.createObjectURL(file); // 新圖片的預覽
    }
  }

  removeImage(event: Event) {
    event.stopPropagation();
    this.form.imgFile = null;
    this.previewUrl = null;
    this.existingImgUrl = null; // 舊圖片也一起清掉
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    const file = event.dataTransfer?.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('檔案大小不能超過 2MB');
        return;
      }
      this.selectedFile = file;
      this.form.imgFile = file;
      this.previewUrl = URL.createObjectURL(file);
    }
  }

  submit() {
    //isPublished 布林值，取值依據是比對表單中的publishMode是否為publish
    const isPublished = this.form.publishMode === 'publish';
    //isPublished為true開啟確認用dialog
    if (isPublished) {
      const confirmRef = this.diao.open(AnnounDialogComponent);
      confirmRef.afterClosed().subscribe((confirmed) => {
        if (confirmed === true) {
          const payload = {
            ...this.form,
            isPublished,
            existingImgUrl: this.existingImgUrl, // 傳給後端，沒換圖就保留舊的
          };
          this.dialogRef.close(payload);
        }
      });
    } //
    //isPublished為false儲存資料並直接關閉dialog
    else {
      this.dialogRef.close({
        ...this.form,
        isPublished,
        existingImgUrl: this.existingImgUrl,
      });
    }
  }

  cancel() {
    this.dialogRef.close(null);
  }
}
