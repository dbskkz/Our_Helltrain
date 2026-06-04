import { DatePipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DraftItem, LaunchProductFormService } from '../../@Services/launch-product-form.service';

@Component({
  selector: 'app-draft-list',
  imports: [NgFor, NgIf, DatePipe],
  templateUrl: './draft-list.component.html',
  styleUrl: './draft-list.component.scss'
})
export class DraftListComponent implements OnInit{

  drafts: DraftItem[] = [];
  showConfirm = false;

  private pendingDeleteId: string | null = null;

  // 分頁變數
  currentPage = 1;
  readonly pageSize = 5;

  constructor(
    private formService: LaunchProductFormService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.drafts = this.formService.getDrafts();
    this.clampPage(); // 初始化後確認頁碼不超出範圍
  }

  // 載入草稿並跳回 step1 繼續編輯
  onLoad(id: string): void {
    this.formService.loadDraft(id);
    this.router.navigate(['/launch_product_info']);
  }

  // 草稿縮圖（取第一張有圖的 slot）
  getThumb(draft: DraftItem): string {
    return draft.state.imageSlotUrls.find(u => u !== '') || '';
  }

  // 草稿標題（有名稱就用，否則顯示預設）
  getTitle(draft: DraftItem): string {
    return draft.state.name?.trim() || '（未命名草稿）';
  }

  //防呆
  onDelete(id: string): void {
    this.pendingDeleteId = id;
    this.showConfirm = true;
  }

  // 頁碼超出範圍時自動夾回最後一頁
  private clampPage(): void {
    if (this.currentPage > this.totalPages) {
    this.currentPage = this.totalPages;
    }
  }

  confirmDelete(): void {
    if (this.pendingDeleteId) {
      this.formService.deleteDraft(this.pendingDeleteId);
      this.drafts = this.formService.getDrafts();
      this.clampPage(); // 刪除後頁碼可能超出，需修正
    }
    this.showConfirm = false;
    this.pendingDeleteId = null;
  }

  cancelDelete(): void {
  this.showConfirm = false;
  this.pendingDeleteId = null;
  }

  //分頁
  fetchProduct() {}

  // totalPages產生陣列
  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  // 點擊頁碼
  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.fetchProduct();
  }

  // 動態計算總筆數
  get totalElements(): number {
  return this.drafts.length;
  }

  // 動態計算總頁數
  get totalPages(): number {
  return Math.max(1, Math.ceil(this.totalElements / this.pageSize));
  }

  // 當前頁要顯示的草稿切片
  get pagedDrafts(): DraftItem[] {
  const start = (this.currentPage - 1) * this.pageSize;
  return this.drafts.slice(start, start + this.pageSize);
  }
}
