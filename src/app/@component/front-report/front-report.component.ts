import { Component } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-front-report',
  imports: [ReactiveFormsModule],
  templateUrl: './front-report.component.html',
  styleUrl: './front-report.component.scss',
})
export class FrontReportComponent {
  reportForm!: FormGroup;

  //tabs
  currentTab = '檢舉商品'; // 預設選中
  tabsColumns: string[] = ['檢舉商品', '檢舉用戶'];

  changeTab(tabName: string) {
    this.currentTab = tabName;
  }
}
