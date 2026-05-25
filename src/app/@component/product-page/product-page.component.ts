import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component } from '@angular/core';



export interface Product {
  title: string;
  region: string;
  school: string;
  seller: string;
  condition: string;
  conditionNote: string;
  price: number;
  images: (string | null)[];
  safetyFeatures: string[];
  description: string[];
}

@Component({
  selector: 'app-product-page',
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './product-page.component.html',
  styleUrl: './product-page.component.scss'
})
export class ProductPageComponent {

     product: Product = {
    title: '葬送的芙莉蓮 1',
    region: '台北市',
    school: '國立臺灣大學',
    seller: '賣家帳號',
    condition: '狀況良好',
    conditionNote: '內頁乾淨，無劃記，書況良好',
    price: 180,
    images: [
      'https://upload.wikimedia.org/wikipedia/zh/thumb/e/e7/Frieren_volume_1.jpg/220px-Frieren_volume_1.jpg',
      null,
      null,
      null,
    ],
    safetyFeatures: [
      '平台提供交易保障機制',
      '請透過平台進行交易，避免私下交易風險',
      '如遇問題，請聯絡客服協助處理',
    ],
    description: [
      '魔王被勇者一行人打倒後的世界。',
      '勇者欣梅爾與僧侶海塔爾、戰士艾森與魔法使芙莉蓮，\n為了再次體驗各地的人們帶來的感動，\n踏上了各處旅行的旅途。',
      '這是關於某個魔法使的後日談——',
    ],
  };

  selectedImageIndex = 0;

  get selectedImage(): string {
    return this.product.images[this.selectedImageIndex] as string;
  }

  ngOnInit(): void {}

  selectImage(index: number): void {
    if (this.product.images[index]) {
      this.selectedImageIndex = index;
    }
  }

  addToCart(): void {
    alert(`已將「${this.product.title}」加入購物車！`);
  }

  buyNow(): void {
    alert(`前往購買「${this.product.title}」！`);
  }

}
