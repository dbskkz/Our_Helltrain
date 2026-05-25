import { NgFor, NgIf} from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface ProductState {
  images: File[];
  name: string;
  desc: string;
  catMain: string; // 主分類
  catSub: string; // 子分類
  condition: string;
  price: number;
  tags: string[];
}

interface SubCatMap {
  [key: string]: string[];
}

const MAX_IMAGES = 6;
const MIN_DESC_LENGTH = 30;
const MAX_TAGS = 5;

const SUB_CATS: SubCatMap = {
  '書籍': ['教科書', '講義', '小說', '雜誌', '其他'],
  '科系用品': ['繪圖工具', '實驗器材', '文具', '其他'],
  '生活用品': ['廚具', '清潔', '收納', '其他'],
  '3C電子': ['手機', '筆電', '平板', '耳機', '相機', '其他'],
  '家具家電': ['桌椅', '燈具', '冰箱', '洗衣機', '其他'],
  '其他': ['其他'],
};

@Component({
  selector: 'app-launch-product',
  imports: [NgFor, NgIf, FormsModule],
  templateUrl: './launch-product.component.html',
  styleUrl: './launch-product.component.scss'
})
export class LaunchProductComponent implements OnInit{

  activeStep = 1;

  setStep(step: number): void {
    // 只允許點已完成或目前的步驟
  if (step === 1) {
    this.activeStep = 1;
  } else if (step === 2 && this.isStep1Complete()) {
    this.activeStep = 2;
  } else if (step === 3 && this.isStep1Complete() && this.isStep2Complete()) {
    this.activeStep = 3;
  }
  }

  state: ProductState = {
    name: '',
    desc: '',
    catMain: '',
    catSub: '',
    condition: '',
    price: 0,
    tags: ['Nike', '球鞋'],
    images: [],
  };

  // ── 顯示用屬性 ──

  nameCount = '0/60';
  descCount = '0/500';
  descCountColor = '';
  catOptions = Object.keys(SUB_CATS);
  subCats: string[] = [];
  imageSlotUrls: (string | null)[] = [null, null, null, null, null, null];
  isNextDisabled = true;
  tagInputValue = '';

  // ── Toast ──

  toastText = '';
  toastVisible = false;
  private toastTimer: any;


  ngOnInit(): void {
    this.updateNextButton();
  }

  isFormValid(): boolean {
    return (
      this.state.name.trim().length > 0 &&  // 名稱不能空白（trim 去掉頭尾空格）
      this.state.desc.trim().length >= MIN_DESC_LENGTH &&
      this.state.catMain !== '' &&
      this.state.condition !== '' &&
      this.state.price > 0 &&
      this.state.images.length > 0
    );
  }

  updateNextButton(): void {
    this.isNextDisabled = !this.isFormValid();
    this.updateActiveStep();
  }

  isStep1Complete(): boolean {
  return (
    this.state.name.trim().length > 0 &&
    this.state.desc.trim().length >= MIN_DESC_LENGTH &&
    this.state.images.length > 0
  );
}

isStep2Complete(): boolean {
  return (
    this.state.catMain !== '' &&
    this.state.condition !== ''
  );
}

updateActiveStep(): void {
  if (this.isStep1Complete() && this.isStep2Complete() && this.state.price > 0) {
    this.activeStep = 3;
  } else if (this.isStep1Complete()) {
    this.activeStep = 2;
  } else {
    this.activeStep = 1;
  }
}

  // ── Image Upload ──

  //記錄目前點的是第幾格
  private clickedSlotIndex: number = -1;

  onSlotClick(index: number): void {
    this.clickedSlotIndex = index;  // 記錄點的格子
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  }

  onFileChange(event: Event): void {
    const files = Array.from((event.target as HTMLInputElement).files ?? []);  // files 是 FileList 物件，Array.from 轉成一般陣列才能用 spread、slice， ?? [] 避免 files 是 null 時報錯
    if (files.length === 0) return;

  if (this.clickedSlotIndex >= 0 && this.state.images[this.clickedSlotIndex]) {
    // 點的格子已有圖片 → 覆蓋該格
    const newImages = [...this.state.images];
    newImages[this.clickedSlotIndex] = files[0];  // 只取第一張覆蓋
    this.state.images = newImages;
  } else {
    // 點的格子是空的 → 往後累加（原本邏輯）
    this.state.images = [...this.state.images, ...files].slice(0, MAX_IMAGES);
  }
    this.updateImageSlotUrls();
    this.updateNextButton();
    (event.target as HTMLInputElement).value = '';  // 清空 file input 的值，讓同一張圖片可以重複選取，不清空的話選同一張不會觸發 change 事件
    this.clickedSlotIndex = -1;  // 重置
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    const files = Array.from(event.dataTransfer?.files ?? []).filter(f =>  // .filter：只保留圖片檔
      f.type.startsWith('image/')
    );
    this.state.images = [...this.state.images, ...files].slice(0, MAX_IMAGES);
    this.updateImageSlotUrls();
    this.updateNextButton();
  }

  onDragOver(event: DragEvent): void {  //瀏覽器預設行為是不允許放置檔案，此函式為解除預設限制
    event.preventDefault();
  }

  updateImageSlotUrls(): void {
    this.imageSlotUrls = Array.from({ length: MAX_IMAGES }, (_, i) =>
      this.state.images[i] ? URL.createObjectURL(this.state.images[i]) : null
    );
  }

  // ── 商品名稱 ──

  onNameInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.state.name = value;  // 存進 state
    this.nameCount = `${value.length}/60`;  // 更新字數顯示
    this.updateNextButton();  // 重新驗證
  }

  // ── 商品描述 ──

  onDescInput(event: Event): void {
    const value = (event.target as HTMLTextAreaElement).value;
    this.state.desc = value;
    this.descCount = `${value.length}/500`;
    if (value.length < MIN_DESC_LENGTH) {
      this.descCountColor = value.length > 0 ? '#ef4444' : '';  // 有打字但不足 30 字 → 紅色警告
    } else {
      this.descCountColor = '#6b7280';  //達標
    }
    this.updateNextButton();
  }

  // ── 分類 ──────────────────────────────────────────────────────────────────────

  onCatMainChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.state.catMain = value;
    this.subCats = SUB_CATS[value] ?? []; // SUB_CATS[value] 查對應的子分類陣列，?? [] 是 nullish 合併運算子：如果查不到（undefined）就給空陣列，避免錯誤
    this.state.catSub = ''; // 切換主分類時清空子分類，避免舊的子分類殘留
    this.updateNextButton();
  }

  onCatSubChange(event: Event): void {
    this.state.catSub = (event.target as HTMLSelectElement).value;
  }

  // ── 商品狀況 ──

  onConditionChange(event: Event): void {
    this.state.condition = (event.target as HTMLSelectElement).value;
    this.updateNextButton();
  }

  // ── 價格 ──

  onPriceInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.state.price = value ? Number(value) : 0; // value 是字串，Number() 轉成數字，如果輸入框是空的（value = ''），存 0 避免 Not a Number
    this.updateNextButton();
  }

  // ── Tags ──

  get tagPlaceholder(): string {
    return this.state.tags.length >= MAX_TAGS ? '' : '輸入標籤後按 Enter，最多 5 個';
  }

  get tagInputDisabled(): boolean {
    return this.state.tags.length >= MAX_TAGS;
  }

  onTagKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault(); // 防止按 Enter 觸發表單送出
      this.addTag(this.tagInputValue);
      this.tagInputValue = '';
    } else if (
      event.key === 'Backspace' &&
      this.tagInputValue === '' &&
      this.state.tags.length > 0
    ) {
      this.removeTag(this.state.tags[this.state.tags.length - 1]);
    }
  }

  addTag(value: string): void {
    const trimmed = value.trim();
    if (!trimmed || this.state.tags.includes(trimmed) || this.state.tags.length >= MAX_TAGS) return;
    this.state.tags = [...this.state.tags, trimmed]; // 三個條件任一成立就不新增：空字串、已存在、已滿 5 個
  }

  removeTag(value: string): void {
    this.state.tags = this.state.tags.filter(t => t !== value);
  }


  // ── Toast ──
  showToast(msg: string): void {
    this.toastText = msg;
    this.toastVisible = true;
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => { this.toastVisible = false; }, 1500);
  }

  // ── 儲存草稿 ──

  saveDraft(): void {
    const draft = {
      ...this.state,
      images: this.state.images.map(f => f.name),
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem('product_draft', JSON.stringify(draft));
    this.showToast('✓ 草稿已儲存');
  }

  // ── 載入草稿 ──
  loadDraft(): void {
  const raw = localStorage.getItem('product_draft');
  if (!raw) {
    this.showToast('沒有找到草稿');
    return;
  }
  const draft = JSON.parse(raw);
  this.state.name = draft.name ?? '';
  this.state.desc = draft.desc ?? '';
  this.state.catMain = draft.catMain ?? '';
  this.state.catSub = draft.catSub ?? '';
  this.state.condition = draft.condition ?? '';
  this.state.price = draft.price ?? 0;
  this.state.tags = draft.tags ?? [];
  // images 無法還原（File 物件不能存進 localStorage）

  this.nameCount = `${this.state.name.length}/60`;
  this.descCount = `${this.state.desc.length}/500`;
  this.subCats = SUB_CATS[this.state.catMain] ?? [];
  this.updateNextButton();
  this.showToast('✓ 草稿已載入');
}

  // ── 下一步 ──

  onNextClick(): void {
    if (this.isNextDisabled) {
      const missing: string[] = []; // 找出哪些必填欄位還沒填，收集起來一次告訴使用者
      if (this.state.images.length === 0) missing.push('商品圖片');
      if (!this.state.name) missing.push('商品名稱');
      if (this.state.desc.length < MIN_DESC_LENGTH) missing.push('商品描述（至少 30 字）');
      if (!this.state.catMain) missing.push('分類');
      if (!this.state.condition) missing.push('商品狀況');
      if (this.state.price <= 0) missing.push('價格');
      this.showToast(`請填寫：${missing.join('、')}`);
      return;
    }
    this.setStep(this.activeStep + 1);
  }


}
