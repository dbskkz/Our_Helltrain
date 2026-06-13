import { DatePipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DraftItem, LaunchProductFormService } from '../../@Services/launch-product-form.service';

interface PublishedProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  createdAt: Date;
}

@Component({
  selector: 'app-draft-list',
  imports: [NgFor, NgIf, DatePipe],
  templateUrl: './draft-list.component.html',
  styleUrl: './draft-list.component.scss'
})
export class DraftListComponent implements OnInit{

  //tabs
  currentTab = '全部商品'; // 預設選中
  // 列表欄位
  tabsColumns: string[] = [
    '全部商品',
    '已上架',
    '未上架(草稿)',
  ];



  drafts: DraftItem[] = [];
  showConfirm = false;

  publishedProducts: PublishedProduct[] = [
  {
    id: 'P001',
    name: 'Nike Air Max 90',
    price: 1200,
    image: '',
    category: '服飾配件',
    createdAt: new Date('2024/05/16'),
  },
  ];

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

  changeTab(tabName: string) {
    this.currentTab = tabName;
    this.currentPage = 1;
  }

  //tab按鈕點擊
  get isAllTab(): boolean { return this.currentTab === '全部商品'; }
  get isPublishedTab(): boolean { return this.currentTab === '已上架'; }
  get isDraftTab(): boolean { return this.currentTab === '未上架(草稿)'; }

  goAddProduct(): void {
  this.router.navigate(['/launch_product_price']);
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
    if (this.isAllTab) return this.publishedProducts.length + this.drafts.length;
    if (this.isPublishedTab) return this.publishedProducts.length;
    return this.drafts.length;
  }

  // 動態計算總頁數
  get totalPages(): number {
  return Math.max(1, Math.ceil(this.totalElements / this.pageSize));
  }

  // 當前頁要顯示的草稿切片
  get pagedDrafts(): DraftItem[] {
    if (this.isPublishedTab) return [];
    const start = (this.currentPage - 1) * this.pageSize;
    return this.drafts.slice(start, start + this.pageSize);
  }

  get pagedPublished(): PublishedProduct[] {
    if (this.isDraftTab) return [];
    const start = (this.currentPage - 1) * this.pageSize;
      if (this.isAllTab) {
      const allPublished = this.publishedProducts.slice(start, start + this.pageSize);
      return allPublished;
      }
    return this.publishedProducts.slice(start, start + this.pageSize);
  }

}
