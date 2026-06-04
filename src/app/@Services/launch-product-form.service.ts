import { Injectable } from '@angular/core';

// 定義表單資料的介面結構
export interface ProductState {
  catMain: string;
  condition: string;
  price: number;
  tags: string[];
  name: string; // 步驟二的商品名稱（AI 套用會寫入這裡）
  desc: string; // 步驟二的商品描述
  region: string,
  locationRegions: string[],
  grades: string[],
  imageSlotUrls:string[],
}

export interface DraftItem {
  id: string;  // 唯一識別碼
  savedAt: string; // 儲存時間（ISO string）
  state: ProductState;
}

@Injectable({
  providedIn: 'root'
})
export class LaunchProductFormService {

  //草稿
  private readonly DRAFT_KEY = 'product_drafts';

  state: ProductState = this.emptyState();

  currentDraftId: string | null = null; // 記錄當前編輯的草稿 id

  private emptyState(): ProductState {
  return {
    catMain: '',
    condition: '',
    price: 0,
    tags: [],
    name: '',
    desc: '',
    region: '',
    locationRegions: [],
    grades: [],
    imageSlotUrls: new Array(7).fill('') as string[],
  };
}

  constructor() { }

  getDrafts(): DraftItem[] {
    try {
      const raw = localStorage.getItem(this.DRAFT_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  // saveDraft 改為：有 id 就覆蓋，沒有就新增
  saveDraft(): DraftItem {
    const drafts = this.getDrafts();

    if (this.currentDraftId) {
      // 覆蓋原有草稿
      const index = drafts.findIndex(d => d.id === this.currentDraftId);
      if (index !== -1) {
        drafts[index] = {
          ...drafts[index],
          savedAt: new Date().toISOString(),
          state: JSON.parse(JSON.stringify(this.state)),
        };
        localStorage.setItem(this.DRAFT_KEY, JSON.stringify(drafts));
        return drafts[index];
      }
    }
    // 全新草稿
    const newDraft: DraftItem = {
      id: Date.now().toString(),
      savedAt: new Date().toISOString(),
      state: JSON.parse(JSON.stringify(this.state)),
    };
    this.currentDraftId = newDraft.id; // ← 新增後也記住
    drafts.unshift(newDraft);
    localStorage.setItem(this.DRAFT_KEY, JSON.stringify(drafts));
    return newDraft;
  }

  // loadDraft 時記住 id
  loadDraft(id: string): boolean {
    const draft = this.getDrafts().find(d => d.id === id);
    if (!draft) return false;
    this.state = JSON.parse(JSON.stringify(draft.state));
    this.currentDraftId = id; // 記住
    return true;
  }

  deleteDraft(id: string): void {
    const drafts = this.getDrafts().filter(d => d.id !== id);
    localStorage.setItem(this.DRAFT_KEY, JSON.stringify(drafts));
  }

  // 發布或重置時清除 id
  resetState(): void {
    this.state = this.emptyState();
    this.currentDraftId = null; // 清除，下次會再新增
  }

}




