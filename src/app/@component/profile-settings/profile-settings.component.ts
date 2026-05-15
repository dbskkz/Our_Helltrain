import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AsyncPipe} from '@angular/common';
import { map, Observable, startWith } from 'rxjs';
import { LucideAngularModule, PencilLine, BookUser, ClipboardPenLine, LockKeyhole } from 'lucide-angular';
@Component({
  selector: 'app-profile-settings',
  imports: [MatIconModule, FormsModule, MatFormFieldModule,
     MatInputModule, MatSelectModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe,LucideAngularModule],
  templateUrl: './profile-settings.component.html',
  styleUrl: './profile-settings.component.scss'
})
export class ProfileSettingsComponent {

  readonly pencilIcon = PencilLine; //鉛筆icon
  readonly bookUser = BookUser; //個人資料icon
  readonly clipboardPenLine = ClipboardPenLine; //自介icon
  readonly lockKeyhole = LockKeyhole; //密碼icon


  name: string = '小明'; //名字
  isEditingName: boolean = false; // 控制是否處於編輯模式
  tempName: string = ''; // 暫存修改中的名字，避免按下取消時原始資料被改掉

  score: number = 4.5; //評分
  tradeNumber: number = 52;  //交易
  onTheShelves: number = 37;  //目前上架

  school: string = '台灣大學'; //學校
  department: string = '醫學系'; //科系
  area: string = '台北'; //地區
  isEditingBasic: boolean = false; // 控制基本資訊是否可編輯

  email: string = 'apple@gmail.com';
  profile: string = '本人常駐於台灣大學，偶爾會穿越到輔仁大學'; //個人簡介
  isEditingProfile: boolean = false; // 控制編輯狀態
  profileControl = new FormControl(this.profile);

  isEditingPassword: boolean = false;// 控制編輯狀態
  // 密碼相關的 Control
  oldPasswordControl = new FormControl('');
  newPasswordControl = new FormControl('');
  confirmPasswordControl = new FormControl('');

  //建立 Control 負責控制輸入框與獲取目前打什麼字
  schoolControl = new FormControl(this.school);
  deptControl = new FormControl(this.department);
  areaControl = new FormControl(this.area);

  // 1. 這是你要過濾的「原始資料來源」負責存放所有大學的名字（資料庫）
  schoolOptions: string[] = ['台灣大學', '政治大學', '清華大學', '陽明交通大學'];
  deptOptions:  string[] = ['醫學系', '室內設計系', '企業管理', '商業管理'];
  areaOptions: string[] =  ['台北', '台中', '台南', '苗栗'];
 // 2. 這是畫面顯示用的「動態過濾後的清單」 各自的動態過濾水管 (Observable)
  filteredSchools: Observable<string[]> | undefined;
  filteredDepts: Observable<string[]> | undefined;
  filteredAreas: Observable<string[]> | undefined;


  ngOnInit() {
    // 初始狀態設為禁用
    this.areaControl.disable();
    this.schoolControl.disable();
    this.deptControl.disable();
    this.profileControl.disable();

  // 學校管線
  this.filteredSchools = this.setupFilter(this.schoolControl, this.schoolOptions);

  // 科系管線
  this.filteredDepts = this.setupFilter(this.deptControl, this.deptOptions);

  // 地區管線
  this.filteredAreas = this.setupFilter(this.areaControl, this.areaOptions);

  }

  private setupFilter(control: FormControl, options: string[]): Observable<string[]>{
    // startWith 確保一進頁面，即使沒打字也會根據「預設值」執行一次過濾
    return control.valueChanges.pipe(
      startWith(control.value || ''),
                    //_filter: 負責執行比對邏輯
      map(value =>this._filter(value, options))
    )
  }

 // 這裡的 options 參數，接收的就是上面傳進來的 this.schoolOptions
  private _filter(value: string, options: string[]): string[] {
    const filterValue = value.toLowerCase();
    return options.filter(opt => opt.toLowerCase().includes(filterValue));
  }

  /* 改名字 */

  // 點擊鉛筆圖示
  startEdit() {
    this.tempName = this.name; // 把現有的名字存進暫存
    this.isEditingName = true;
  }

  //按下確定
  saveName() {
    this.name = this.tempName; // 將暫存值正式寫回
    this.isEditingName = false;
    // 這裡之後可以呼叫 Service 把 this.name 送去後端 API
    console.log('已更新資料庫:', this.name);
  }

  // 按下取消
  cancelEdit(){
    this.isEditingName = false;
  }

  /* 改基本資料 */

  // 切換編輯模式
  toggleEditBasic(){
    this.isEditingBasic = !this.isEditingBasic

    if(this.isEditingBasic){
      // 開啟編輯：啟用控制項
      this.areaControl.enable();
      this.schoolControl.enable();
      this.deptControl.enable();
    } else{
      // 儲存/關閉編輯：禁用控制項
      this.areaControl.disable();
      this.schoolControl.disable();
      this.deptControl.disable();

      // 這裡之後可以寫入呼叫後端 API 的邏輯
      console.log('儲存基本資訊:',{
        area: this.areaControl.value,
        school: this.schoolControl.value,
        dept: this.deptControl.value
      });
    }
  }

/* 修改自介 */

  //  切換編輯模式的函式
  toggleEditProfile() {
    this.isEditingProfile = !this.isEditingProfile;

    if (this.isEditingProfile) {
      this.profileControl.enable();
    } else {
      // 儲存時把控制項的值更新回變數
      this.profile = this.profileControl.value ?? '';
      this.profileControl.disable();

      // 這裡可以呼叫 API 送到後端
      console.log('儲存個人簡介:', this.profile);
    }
  }


  /* 改密碼 */

  //  切換編輯模式的函式
  toggleEditPassword() {
    this.isEditingPassword = !this.isEditingPassword;

    if (this.isEditingPassword) {
      // 開啟編輯：啟用輸入
    this.enablePasswordControls();
    } else {
      // 前端僅做「基本檢查」：確保兩次新密碼一樣
      if (this.newPasswordControl.value !== this.confirmPasswordControl.value) {
        alert('新密碼與確認密碼不符');
        this.isEditingPassword = true; // 保持編輯狀態
        return;
      }
      // 這裡未來接 API...
      this.finalizeEdit();
    }
  }

  // 取消修改的函式
  cancelEditPassword() {
    this.isEditingPassword = false;
    this.finalizeEdit();
  }

  // 封裝重複的動作：禁用並清空
  private finalizeEdit() {
    this.oldPasswordControl.disable();
    this.newPasswordControl.disable();
    this.confirmPasswordControl.disable();

    this.oldPasswordControl.reset();
    this.newPasswordControl.reset();
    this.confirmPasswordControl.reset();
  }

  private enablePasswordControls() {
    this.oldPasswordControl.enable();
    this.newPasswordControl.enable();
    this.confirmPasswordControl.enable();
  }

}
