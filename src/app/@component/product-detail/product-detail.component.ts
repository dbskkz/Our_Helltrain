import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, Star, MessageCircle, ShoppingCart, Coins, ShieldCheck, Check, } from 'lucide-angular';

@Component({
  selector: 'app-product-detail',
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss',
})
export class ProductDetailComponent implements OnInit {
  readonly starIcon        = Star;
  readonly messageIcon     = MessageCircle;
  readonly cartIcon        = ShoppingCart;
  readonly coinIcon        = Coins;
  readonly shieldIcon      = ShieldCheck;
  readonly checkIcon       = Check;

  isFavorite = false;
  selectedImage = '';

  //內容假資料
  product = {
    id: 'PROD-1001',
    name: '葬送的芙莉蓮 1',
    productId: 'books',
    product: '書籍',
    location: '台北市',
    school: '國立臺灣大學',
    userId: 'seller-123',
    productName: '賣家帳號',
    price: 180,
    condition: ['二手書', '狀況良好'],//商品狀況
    status: '內頁乾淨，無劃記，書況良好',
    describe: `魔王被勇者一行人打倒後的世界。\n\n勇者欣欣梅與僧侶海塔爾、戰士艾森與魔法使芙莉蓮，\n為了再次體驗各地的人們帶來的感動，\n踏上了各處旅行的旅途。\n\n這是關於某個魔法使的後日談——`,
    images: [
      'https://picsum.photos/seed/book1/400/400',
      'https://picsum.photos/seed/book2/400/400',
      'https://picsum.photos/seed/book3/400/400',
      'https://picsum.photos/seed/book4/400/400',
      'https://picsum.photos/seed/book5/400/400',
    ],
  };

  safetyItems = [
    '僅提供交易平台',
    '實際交易時請注意自身安全',
    '如遇問題，請聯絡客服協助處理',
  ];

  ngOnInit() {
    this.selectedImage = this.product.images[0];
  }

  selectImage(img: string) {
    this.selectedImage = img;
  }

  toggleFavorite() {
    this.isFavorite = !this.isFavorite;
  }

  openChat() {
    // 開啟聊天視窗或跳轉到聊天頁
  }

  addToCart() {
    // 呼叫購物車 API
  }

  buyNow() {
    // 跳轉到結帳頁
  }
}
