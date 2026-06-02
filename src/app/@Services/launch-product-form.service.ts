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

@Injectable({
  providedIn: 'root'
})
export class LaunchProductFormService {

  // 初始化暫存的資料狀態
  state: ProductState = {
    catMain: '',
    condition: '',
    price: 0,
    tags: [],
    name: '',
    desc: '',
    region: '',
    locationRegions: [],
    grades: [] , // 用於存放勾選的年級陣列
    imageSlotUrls: new Array(7).fill('') as string[],
  };

  constructor() { }

  // 清空表單資料（通常在成功上架後呼叫）
  resetState(): void {
    this.state = {
      catMain: '',
      condition: '',
      price: 0,
      tags: [],
      name: '',
      desc: '',
      region: '',
      locationRegions: [],
      grades: [],
      imageSlotUrls: new Array(7).fill(''),
    };
  }
}
