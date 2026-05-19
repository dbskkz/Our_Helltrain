import { Component } from '@angular/core';

import { LucideAngularModule, MessageCircleMore, Trash2, HeartIcon, MapPin} from 'lucide-angular';

@Component({
  selector: 'app-shopping-cart',
  imports: [LucideAngularModule],
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.scss'
})
export class ShoppingCartComponent {

  // =========================================================
  // ICON
  // =========================================================


  readonly Trash2Icon = Trash2;
  readonly MapPinIcon = MapPin;
  readonly HeartIcon = HeartIcon;
  readonly MessageCircleIcon = MessageCircleMore;


  // =========================================================


  // PURCHASE QUANTITY
  // =========================================================



  // increasePQ(item: any){

  //   if(item.quantity < item.stock)
  //   {
  //     item.quantity++;
  //   }

  //   else
  //   {
  //     // TODO: Dialog「商品數量不足!」
  //     console.log("商品數量不足!");
  //   }

  // }

  // decreasePQ(item: any){

  //   if(item.quantity > 1)
  //   {
  //     item.quantity--;
  //   }

  //   else
  //   {
  //     const sure = confirm('確定要移除商品嗎？');

  //     if(sure)
  //     {
  //       this.products = this.products.filter(
  //         product => product.listId !== item.listId
  //       );
  //     }
  //   }

  // }

  // 假資料


  productAmount = 3;

  products = [
    {
      listId: 1,
      userId: 1,
      productId: 101,

      quantity: 1,

      title: '極簡黑後背包',
      price: 300,
      stock: 5,

      imgUrl: 'assets/bag.jpg',

      sellerName: '生科吉娃娃甘霖',
      university: '清大',
      location: '新竹'
    },

    {
      listId: 2,
      userId: 1,
      productId: 102,

      quantity: 2,

      title: '奶茶色帆布袋',
      price: 250,
      stock: 3,

      imgUrl: 'assets/bag.jpg',

      sellerName: '不吉掰娃娃',
      university: '清大',
      location: '花蓮'
    }
  ];
}
