import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // 1. Import FormsModule


import { LucideAngularModule, MessageCircleMore, Trash2, HeartIcon, MapPin} from 'lucide-angular';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-shopping-cart',
  imports: [LucideAngularModule, FormsModule],
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

  productAmount = 2;
  alert ="";

  deleteList() {
    for (const item of this.products){
      if(this.products.filter(p => p.selected).length > 0)
      {


      Swal.fire({
            title: "確定要刪除這些商品嗎",
            text: "",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "確定刪除",
            cancelButtonText: "取消"
          }).then((result) => {
            if (result.isConfirmed){

            Swal.fire({
              title: "已刪除 "　+ this.products.filter(p => p.selected).length + " 筆商品！" ,
              text: "",
              icon: "success"
            });
            this.products = this.products.filter(p => !p.selected);
            this.productAmount = this.products.length;
            }
      });

      }
      else
      {
        this.alert = "請選擇您要刪除的商品！"
      }
    }
  }


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
      location: '新竹',
      selected: false
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

      sellerName: '不吉娃娃',
      university: '清大',
      location: '花蓮',
      selected: false
    }
  ];
}
