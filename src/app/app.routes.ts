import { Routes } from '@angular/router';
import { AnnouncementComponent } from './@component/announcement/announcement.component';
import { BackIndexComponent } from './@component/back-index/back-index.component';
import { BackUserComponent } from './@component/back-user/back-user.component';
import { BackProductComponent } from './@component/back-product/back-product.component';
import { ReportComponent } from './@component/report/report.component';
import { ProfileSettingsComponent } from './@component/profile-settings/profile-settings.component';

export const routes: Routes = [
  //後台
  {path: 'announcement', component:AnnouncementComponent},//公告
  {path: 'back_index', component:BackIndexComponent},//首頁
  {path: 'back_product', component:BackProductComponent},//商品管理頁
  {path: 'back_user', component:BackUserComponent},//用戶管理
  {path: 'report', component:ReportComponent},//爭議處理

  //前台
  {path: 'profile_settings',component:ProfileSettingsComponent}//個人設定
];
