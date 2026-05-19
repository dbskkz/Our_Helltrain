import { Component } from '@angular/core';

interface ProductState {
  name: string;
  desc: string;
  catMain: string;
  catSub: string;
  condition: string;
  tags: string[];
  images: File[];
}

interface SubCatMap {
  [key: string]: string[];
}

const MAX_TAGS = 5;
const MIN_DESC_LENGTH = 30;
const MAX_IMAGES = 5;

const SUB_CATS: SubCatMap = {
  '書籍': ['教科書', '參考書', '小說', '雜誌', '其他'],
  '科系用品': ['繪圖工具', '實驗器材', '文具', '其他'],
  '生活用品': ['廚房', '清潔', '收納', '其他'],
  '3C電子': ['手機', '筆電', '平板', '耳機', '相機', '其他'],
  '家具家電': ['桌椅', '燈具', '冰箱', '洗衣機', '其他'],
  '其他': ['其他'],
};

@Component({
  selector: 'app-launch-product',
  imports: [],
  templateUrl: './launch-product.component.html',
  styleUrl: './launch-product.component.scss'
})
export class LaunchProductComponent {

    //activeStep的部分 暫存
    activeStep = 1; // 預設第一步是 active

  setStep(step: number): void {
    this.activeStep = step;
  }



}
