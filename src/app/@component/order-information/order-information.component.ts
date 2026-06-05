import { ApiTestService } from './../../@Services/api-test.service';
import { UserService } from './../../@Services/user.service';
import { Component } from '@angular/core';
import {
  CircleCheckBig,
  LucideAngularModule,
  MessageCircleMore,
  CircleX,
  CircleEllipsis,
  CircleDollarSign,
  ChevronRight,
  ChevronLeft,
} from 'lucide-angular';
import Swal from 'sweetalert2';
import { PaginationService } from '../../@Services/pageination.service';
import { Router } from '@angular/router';
import { ReportService } from '../../@Services/report.service';

@Component({
  selector: 'app-order-information',
  imports: [LucideAngularModule],
  templateUrl: './order-information.component.html',
  styleUrl: './order-information.component.scss',
})
export class OrderInformationComponent {
  constructor(
    public pagination: PaginationService,
    private router: Router,
    private reportService: ReportService,
    private userService: UserService,
    private apiTestService: ApiTestService,
  ) { }

  // Declare icon
  readonly CircleCheckBig = CircleCheckBig;
  readonly MessageCircleMore = MessageCircleMore;
  readonly CircleX = CircleX;
  readonly CircleEllipsis = CircleEllipsis;
  readonly CircleDollarSign = CircleDollarSign;
  readonly ChevronRight = ChevronRight;
  readonly ChevronLeft = ChevronLeft;

  //tabs
  currentTab = '全部訂單'; // 預設選中
  // 列表欄位
  tabsColumns: string[] = [
    '全部訂單',
    '交易中',
    '已完成',
    '已取消',
    '交易請求中',
  ];

  // role 切換
  currentRole: string = '全部'; // 預設
  roleColumns: string[] = ['全部', '我購買的', '我販售的'];
  role: string = 'buyer' // 預設

  // tab 對應 status
  statusMap: Record<string, string> = {
    全部訂單: '',
    交易中: 'in_progress',
    已完成: 'completed',
    已取消: 'cancelled',
    交易請求中: 'pending',
  };

  pageSize = 5; // 分頁變數
  orders: any[] = []; // 存放當前頁要顯示的資料

  ngOnInit() {
    let userId = this.userService.currentUser()?.userId;
    // if(userId != buyerId) {this.role = 'seller'} 取得後寫上

    // 初始載入時，直接根據篩選後的總資料量初始化分頁器
    this.updatePaginationTotal();
  }

  // 更新分頁總數
  private updatePaginationTotal() {
    // 1. 取得當前篩選條件下的所有資料總筆數
    const filteredTotal = this.allOrders.filter((order) => {
      let roleMatch =
        this.currentRole === '全部'
          ? true
          : this.currentRole === '我購買的'
            ? order.role === 'buyer'
            : order.role === 'seller';
      let statusMatch =
        this.statusMap[this.currentTab] === ''
          ? true
          : order.status === this.statusMap[this.currentTab];
      return roleMatch && statusMatch;
    }).length;

    // 2. 初始化分頁（這會自動產生對應的 pageNumbers 陣列）
    this.pagination.init(filteredTotal, this.pageSize);
  }

  changeTab(tabName: string) {
    this.currentTab = tabName;
    this.changeRole('全部'); // 重新篩選販售/購買
    this.updatePaginationTotal(); // 重新計算總頁數
    this.pagination.goToPage(1); // 回第一頁
  }

  changeRole(role: string) {
    this.currentRole = role;
    this.updatePaginationTotal(); // 重新計算總頁數
    this.pagination.goToPage(1); // 回第一頁
  }

  chat() { }

  // 分頁
  prevPage() {
    this.pagination.prevPage();
  }
  nextPage() {
    this.pagination.nextPage();
  }
  goToPage(page: number) {
    this.pagination.goToPage(page);
  }

  filteredOrders() {
    let filtered = this.allOrders.filter((order) => {
      // role 篩選
      let roleMatch =
        this.currentRole === '全部'
          ? true
          : this.currentRole === '我購買的'
            ? order.role === 'buyer'
            : order.role === 'seller';

      // tab 篩選
      let statusMatch =
        this.statusMap[this.currentTab] === ''
          ? true
          : order.status === this.statusMap[this.currentTab];

      return roleMatch && statusMatch;
    });

    let start = (this.pagination.currentPage - 1) * this.pageSize;
    return filtered.slice(start, start + this.pageSize);
  }

  // 確認完成交易
  confirmComplete(order: any) {
    Swal.fire({
      title: '確認完成交易？',
      text: '確認後將無法撤回！',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '確認完成',
      cancelButtonText: '再想想',
    }).then((result) => {
      if (result.isConfirmed) {
        order.status = 'completed';
        Swal.fire({
          title: '交易完成！',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  }

  // 進行評分
  submitReview(order: any) {
    Swal.fire({
      title: '為這次交易評分',
      html: `
      <p>${order.counterpart.label}：${order.counterpart.name}</p>
      <input id="swal-score" type="number" min="1" max="5"
        class="swal2-input" placeholder="請輸入 1-5 分"
        style="width: 50%; font-size: 16px;">`,
      confirmButtonText: '送出評價',
      cancelButtonText: '取消',
      showCancelButton: true,
      preConfirm: () => {
        let score = (document.getElementById('swal-score') as HTMLInputElement)
          .value;
        // let comment = (
        //   document.getElementById('swal-comment') as HTMLTextAreaElement
        // ).value;

        if (!score || Number(score) < 1 || Number(score) > 5) {
          Swal.showValidationMessage('請輸入 1 到 5 之間的分數！');
          return false;
        }
        return { score: Number(score) };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        order.hasReview = true;
        order.review = result.value;
        Swal.fire({
          title: '評價已送出！',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  }

  // 查看評價
  viewReview(order: any) {
    Swal.fire({
      title: '我的評價',
      html: `
      <p>${order.counterpart.label}：${order.counterpart.name}</p>
      <p>評分：${order.review?.score ?? '-'} 分</p>`,
      confirmButtonText: '關閉',
    });
  }

  // 檢舉
  goRepot() {
    // 檢舉用戶
    this.reportService.openReportDialog('user', '用戶名稱', '用戶ID');
  }

  // 假資料
  allOrders: any[] = [
    // 我購買的
    {
      orderId: 'ORD202405160001',
      orderDate: '2024/05/16 14:32',
      role: 'buyer', // 我購買的
      status: 'completed', // 完成交易
      product: {
        name: 'AirPods (第二代)',
        price: 180,
        image:
          'https://d2lfcsub12kx0l.cloudfront.net/tw/product/img/Apple_apple_airpods_pro_2_0907194607052_640x480.jpg',
      },
      counterpart: { label: '賣家', name: '小麗的生活選物' },
      hasReview: true, // 已評價
    },
    {
      orderId: 'ORD202405170002',
      orderDate: '2024/05/17 10:15',
      role: 'buyer',
      status: 'in_progress', // 訂單成立（交易中）
      product: {
        name: '無印良品 LED 檯燈',
        price: 350,
        image:
          'https://d2lfcsub12kx0l.cloudfront.net/tw/product/img/Apple_apple_airpods_pro_2_0907194607052_640x480.jpg',
      },
      counterpart: { label: '賣家', name: '阿明的雜貨鋪' },
      hasReview: false,
    },
    {
      orderId: 'ORD202405180003',
      orderDate: '2024/05/18 09:00',
      role: 'buyer',
      status: 'pending', // 等待回應中
      product: {
        name: 'FUJIFILM Instax Mini 11',
        price: 800,
        image:
          'https://d2lfcsub12kx0l.cloudfront.net/tw/product/img/Apple_apple_airpods_pro_2_0907194607052_640x480.jpg',
      },
      counterpart: { label: '賣家', name: '相機控小陳' },
      hasReview: false,
    },
    {
      orderId: 'ORD202405190004',
      orderDate: '2024/05/19 16:45',
      role: 'buyer',
      status: 'cancelled', // 已取消
      // cancelReason: 'seller_chose_other', // 賣家選擇其他買家
      product: {
        name: 'A.P.C. 米色帆布包',
        price: 1200,
        image:
          'https://d2lfcsub12kx0l.cloudfront.net/tw/product/img/Apple_apple_airpods_pro_2_0907194607052_640x480.jpg',
      },
      counterpart: { label: '賣家', name: '精品控小美' },
      hasReview: false,
    },

    // 我販售的
    {
      orderId: 'ORD202405200005',
      orderDate: '2024/05/20 11:30',
      role: 'seller', // 我販售的
      status: 'in_progress',
      product: {
        name: '解憂雜貨店（書）',
        price: 120,
        image:
          'https://d2lfcsub12kx0l.cloudfront.net/tw/product/img/Apple_apple_airpods_pro_2_0907194607052_640x480.jpg',
      },
      counterpart: { label: '買家', name: '書蟲小志' },
      hasReview: false,
    },
    {
      orderId: 'ORD202405210006',
      orderDate: '2024/05/21 13:20',
      role: 'seller',
      status: 'completed',
      product: {
        name: '被討厭的勇氣（書）',
        price: 150,
        image:
          'https://d2lfcsub12kx0l.cloudfront.net/tw/product/img/Apple_apple_airpods_pro_2_0907194607052_640x480.jpg',
      },
      counterpart: { label: '買家', name: '哲學控阿哲' },
      hasReview: false,
    },
    {
      orderId: 'ORD202405220007',
      orderDate: '2024/05/22 15:00',
      role: 'seller',
      status: 'cancelled',
      // cancelReason: 'transaction_cancelled', // 交易取消
      product: {
        name: '復古皮革錢包',
        price: 450,
        image:
          'https://d2lfcsub12kx0l.cloudfront.net/tw/product/img/Apple_apple_airpods_pro_2_0907194607052_640x480.jpg',
      },
      counterpart: { label: '買家', name: '皮件控小林' },
      hasReview: false,
    },
  ];
}
