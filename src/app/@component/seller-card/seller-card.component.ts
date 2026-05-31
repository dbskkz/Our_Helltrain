import { Component, Input } from '@angular/core';
import { LucideAngularModule, MapPin, School, MessageCircle } from 'lucide-angular';
@Component({
  selector: 'app-seller-card',
  imports: [LucideAngularModule],
  templateUrl: './seller-card.component.html',
  styleUrl: './seller-card.component.scss'
})
export class SellerCardComponent {

  // --- 圖標變數 ---
  readonly MapPin = MapPin;
  readonly School = School;
  readonly MessageCircleIcon = MessageCircle;

  // 💥 投幣口：準備接收父元件傳來的 user 資料
  @Input() sellerData!: {
    userName: string;
    userImg: string;
    university: string;
    department: string;
    location: string[];
  };

  // 這裡可以放專屬於賣家卡片的方法
  gotoStore() {
    console.log('前往賣場:', this.sellerData.userName);
  }

  openChatWithSeller(event: Event) {
    event.stopPropagation(); // 阻止事件冒泡，避免點擊聊聊卻觸發了前往賣場
    console.log('開啟聊天室:', this.sellerData.userName);
  }
}
