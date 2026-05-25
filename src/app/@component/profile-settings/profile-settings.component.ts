import { Component, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {AsyncPipe} from '@angular/common';
import { map, Observable, startWith } from 'rxjs';
import { LucideAngularModule, PencilLine, BookUser, ClipboardPenLine, LockKeyhole } from 'lucide-angular';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SchoolDataService } from '../../@Services/school-data.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile-settings',
  imports: [MatIconModule, FormsModule, MatFormFieldModule,
     MatInputModule, MatSelectModule,
    MatAutocompleteModule,MatSnackBarModule,
    ReactiveFormsModule,
    AsyncPipe,LucideAngularModule],
  templateUrl: './profile-settings.component.html',
  styleUrl: './profile-settings.component.scss'
})
export class ProfileSettingsComponent {

  constructor(private fb: FormBuilder,private snackBar: MatSnackBar, private router: Router, private schoolService: SchoolDataService) {}

  readonly pencilIcon = PencilLine; //鉛筆icon
  readonly bookUser = BookUser; //個人資料icon
  readonly clipboardPenLine = ClipboardPenLine; //自介icon
  readonly lockKeyhole = LockKeyhole; //密碼icon

// 預設頭像（可以是妳專案裡的預設圖路徑）
  avatarUrl: string | ArrayBuffer | null = '/img/頭像範例.png';

  name: string = '小明'; //名字
  isEditingName: boolean = false; // 控制是否處於編輯模式
  tempName: string = ''; // 暫存修改中的名字，避免按下取消時原始資料被改掉

  score: number = 4.5; //評分
  tradeNumber: number = 52;  //交易
  onTheShelves: number = 37;  //目前上架

  school: string = '輔仁大學'; //學校
  department: string = '醫學系'; //科系
  area: string = '新北市'; //地區
  isEditingBasic: boolean = false; // 控制基本資訊是否可編輯

  email: string = 'apple@gmail.com';
  profile: string = '本人常駐於台灣大學，偶爾會穿越到輔仁大學'; //個人簡介
  isEditingProfile: boolean = false; // 控制編輯狀態
  profileControl = new FormControl(this.profile);

  isEditingPassword: boolean = false;// 控制編輯狀態

  // 密碼相關的 Control
  passwordForm!: FormGroup;

  hideOldPassword = signal(true);
  hideNewPassword = signal(true);
  hideConfirmPassword = signal(true);

  //建立 Control 負責控制輸入框與獲取目前打什麼字
  schoolControl = new FormControl(this.school);
  deptControl = new FormControl(this.department);
  areaControl = new FormControl(this.area);


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

    this.passwordForm = this.fb.group({
      oldPassword: [{ value: '', disabled: true }, [Validators.required]],
      newPassword: [{ value: '', disabled: true }, [Validators.required, Validators.minLength(8)]],
      confirmPassword: [{ value: '', disabled: true }, [Validators.required]]
    }, {
      validators: this.passwordMatchValidator // 👈 自訂比對大門
    });

// 【地區】過濾水管：直接向大水庫拿最外層的所有縣市
    this.filteredAreas = this.areaControl.valueChanges.pipe(
      startWith(this.areaControl.value || ''),
      map(value => {
        const regions = this.schoolService.allRegions();
        return this._filter(value || '', regions);
      })
    );

    // 【學校】過濾水管：當地區改變時，動態跟 Service 要該地區的學校來過濾
    this.filteredSchools = this.schoolControl.valueChanges.pipe(
      startWith(this.schoolControl.value || ''),
      map(value => {
        // 修正點：因為被 disable 時 .value 會拿不到，改用 .getRawValue() 確保強制拿到目前的值！
        const currentRegion = this.areaControl.getRawValue();
        const schoolsInRegion = this.schoolService.getSchoolsByRegion(currentRegion);
        return this._filter(value || '', schoolsInRegion);
      })
    );

    // 【科系】過濾水管：當學校改變時，動態跟 Service 要該縣市該校的科系來過濾
    this.filteredDepts = this.deptControl.valueChanges.pipe(
      startWith(this.deptControl.value || ''),
      map(value => {
        const currentRegion = this.areaControl.getRawValue();
        const currentSchool = this.schoolControl.getRawValue();
        const deptsInSchool = this.schoolService.getDepartmentsBySchool(currentRegion, currentSchool);
        return this._filter(value || '', deptsInSchool);
      })
    );

    setTimeout(() => {

      // 🔑 關鍵：暫時解除封印、強迫通水、再鎖回去！
      this.areaControl.enable({ emitEvent: false });
      this.schoolControl.enable({ emitEvent: false });
      this.deptControl.enable({ emitEvent: false });

      // 發射更新事件讓 Autocomplete 水管通水
      this.areaControl.updateValueAndValidity({ emitEvent: true });
      this.schoolControl.updateValueAndValidity({ emitEvent: true });
      this.deptControl.updateValueAndValidity({ emitEvent: true });

      // 恢復一進網頁時的預設禁用狀態
      this.areaControl.disable({ emitEvent: false });
      this.schoolControl.disable({ emitEvent: false });
      this.deptControl.disable({ emitEvent: false });
    }, 300); // 延遲 300 毫秒，等 JSON 下載完畢後自動觸發
    }

  // 密碼即時比對驗證器（從註冊頁的核心邏輯完美搬遷）
  private passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const newPassword = control.get('newPassword');
    const confirmPassword = control.get('confirmPassword');

    if (!newPassword || !confirmPassword) return null;

    // 只要密碼不一致，立刻在 confirmPassword 身上打上 mismatch 標籤
    if (newPassword.value !== confirmPassword.value) {
      confirmPassword.setErrors({ mismatch: true });
      return { mismatch: true };
    } else {
      // 一致時，如果之前有殘留的 mismatch 錯誤就幫它解鎖
      if (confirmPassword.hasError('mismatch')) {
        const errors = confirmPassword.errors;
        if (errors) {
          delete errors['mismatch'];
          confirmPassword.setErrors(Object.keys(errors).length ? errors : null);
        }
      }
      return null;
    }
  }


 // 萬能過濾器：支援【台/臺】繁簡通用模糊搜尋
  private _filter(value: string, options: string[]): string[] {
    const filterValue = value.toLowerCase().replace(/台/g, '臺');

    // 2. 拿著校正後的「臺」字眼去跟資料庫做比對
    return options.filter(opt => {
      const optionValue = opt.toLowerCase();

      // 💡 雙向防呆：
      // 條件 A: 資料庫的「國立臺灣大學」包含使用者打的「台灣大學」(轉成臺灣大學) ➔ 成功
      // 條件 B: 萬一未來有資料庫寫簡體「台」，使用者打繁體「臺」也包含 ➔ 成功
      return optionValue.includes(filterValue) ||
             optionValue.replace(/臺/g, '台').includes(value.toLowerCase());
    });
  }



/* 改頭像 */

// 當使用者選取檔案時觸發
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files[0]) {
      const file = input.files[0];

      // 1. 檢查檔案大小 (例如不能超過 2MB)
      if (file.size > 2 * 1024 * 1024) {
        Swal.fire({
          title: "檔案太大囉，請選擇2MB以下的圖片!",
          icon: "warning",
          confirmButtonColor: '#FB831D',
          draggable: true
        });
        console.log('檔案太大囉，請選擇');
        return;
      }

      // 2. 讀取檔案並產生預覽圖
      const reader = new FileReader();
      reader.onload = (e) => {
        this.avatarUrl = reader.result; // 將讀取結果存入變數，畫面會自動更新
      };
      reader.readAsDataURL(file);

      // 3. (未來) 在這裡呼叫 Service 把 file 送到 Java 後端
      // this.yourService.uploadAvatar(file).subscribe(...);
    }
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
    this.passwordForm.enable();
    } else {
      // 前端僅做「基本檢查」：確保兩次新密碼一樣
      if (this.passwordForm.invalid) {
        Swal.fire({
          title: "請檢查密碼格式，或確認兩次新密碼一致!",
          icon: "warning",
          confirmButtonText: '知道了',
          confirmButtonColor: '#FB831D',
          draggable: true
        });
        this.isEditingPassword = true; // 保持編輯狀態
        return;
      }
      // 這裡未來接 API...this.passwordForm.value.newPassword 拿新密碼
      console.log('送出修改密碼請求', this.passwordForm.value);
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
    this.passwordForm.disable(); // 一鍵禁用
    this.passwordForm.reset();   // 一鍵清空
  }

  /* 路由 */
  gotoStore(){
     this.router.navigate(['/store'])
  }

  orderInformation(){
     this.router.navigate(['/order_information'])
  }




}
