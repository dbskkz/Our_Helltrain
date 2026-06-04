import { Routes } from '@angular/router';
import { AnnouncementComponent } from './@component/announcement/announcement.component';
import { BackIndexComponent } from './@component/back-index/back-index.component';
import { BackUserComponent } from './@component/back-user/back-user.component';
import { BackProductComponent } from './@component/back-product/back-product.component';
import { ReportComponent } from './@component/report/report.component';
import { ProfileSettingsComponent } from './@component/profile-settings/profile-settings.component';
import { OrderInformationComponent } from './@component/order-information/order-information.component';
import { MainLayoutComponent } from './@component/main-layout/main-layout.component';
import { HomepageComponent } from './@component/homepage/homepage.component';
import { ForegroundTestComponent } from './@component/foreground-test/foreground-test.component';
import { BackLayoutComponent } from './@component/back-layout/back-layout.component';
import { LaunchProductInfoComponent } from './@component/launch-product-info/launch-product-info.component';
import { ProductListingComponent } from './@component/product-listing/product-listing.component';
import { StoreComponent } from './@component/store/store.component';
import { ShoppingCartComponent } from './@component/shopping-cart/shopping-cart.component';
import { LoginRegisterComponent } from './@component/login-register/login-register.component';
import { ProductPageComponent } from './@component/product-page/product-page.component';
import { FrontReportComponent } from './@component/front-report/front-report.component';
import { LaunchProductPriceComponent } from './@component/launch-product-price/launch-product-price.component';
import { SchoolCommunityLayoutComponent } from './@SchoolCommunity/school-community-layout/school-community-layout.component';
import { SchoolCommunityProductComponent } from './@SchoolCommunity/school-community-product/school-community-product.component';
import { DraftListComponent } from './@component/draft-list/draft-list.component';

export const routes: Routes = [
  //前台
  // 第一類：需要導覽列和側邊欄的頁面
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: 'home', component: HomepageComponent },
      { path: 'product-list/:category', component: ProductListingComponent },
      { path: 'cart', component: ShoppingCartComponent },
      { path: 'test', component: ForegroundTestComponent },
      { path: 'order_information', component: OrderInformationComponent }, //訂單資料
      { path: 'profile_settings', component: ProfileSettingsComponent }, //個人設定
      { path: 'launch_product_info', component: LaunchProductInfoComponent }, //上架商品頁-資訊
      { path: 'launch_product_price', component: LaunchProductPriceComponent }, //上架商品頁-價格
      { path: 'draft_list', component: DraftListComponent }, //儲存草稿頁
      { path: 'store', component: StoreComponent }, //賣場頁面
      { path: 'product_page', component: ProductPageComponent }, //商品頁
      { path: 'front_report', component: FrontReportComponent }, //檢舉頁

      // TODO: school-community/:universityName
      { path: 'school-community',
        component: SchoolCommunityLayoutComponent,
        children:[
          // TODO : 當路徑是 /school-community/清華大學/school-product 時
          { path: 'school-product', component: SchoolCommunityProductComponent }, //校版商品
        ]}, //校版layout
      { path: '', redirectTo: 'home', pathMatch: 'full' },
    ],
  },
  { path: 'login_register', component: LoginRegisterComponent }, //登入註冊頁面

  //後台
  {
    path: '',
    component: BackLayoutComponent,
    children: [
      { path: 'announcement', component: AnnouncementComponent }, //公告
      // { path: 'back_index', component: BackIndexComponent }, //首頁
      // { path: 'back_product', component: BackProductComponent }, //商品管理頁
      { path: 'back_user', component: BackUserComponent }, //用戶管理
      { path: 'report', component: ReportComponent }, //爭議處理
    ],
  },
];
