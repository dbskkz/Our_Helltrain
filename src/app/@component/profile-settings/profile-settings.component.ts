import { Component, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {AsyncPipe} from '@angular/common';
import { map, Observable, startWith } from 'rxjs';
import { LucideAngularModule, PencilLine,Box,Mail,Phone, MapPin,BookUser, School, ClipboardPenLine, LockKeyhole } from 'lucide-angular';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SchoolDataService } from '../../@Services/school-data.service';
import { ValidatorFn } from '@angular/forms';
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


  readonly School = School;
  readonly MapPin = MapPin;
  readonly Phone = Phone;
  readonly BoxIcon = Box;
  readonly Mail = Mail;

  constructor(private fb: FormBuilder,private snackBar: MatSnackBar, private router: Router, private schoolService: SchoolDataService) {}

  readonly pencilIcon = PencilLine; //鉛筆icon
  readonly bookUser = BookUser; //個人資料icon
  readonly clipboardPenLine = ClipboardPenLine; //自介icon
  readonly lockKeyhole = LockKeyhole; //密碼icon

// 預設頭像（可以是妳專案裡的預設圖路徑）
  avatarUrl: string | ArrayBuffer | null = '/img/頭像範例.png';
// 專門用來存放「準備送去 Java 後端的二進位 File 檔案」
  selectedAvatarFile: File | null = null;

  name: string = '小明'; //名字
  tempName: string = ''; // 暫存修改中的名字，避免按下取消時原始資料被改掉

  score: number = 4.5; //評分
  tradeNumber: number = 52;  //交易
  onTheShelves: number = 37;  //目前上架

  school: string = '輔仁大學'; //學校
  department: string = '醫學系'; //科系
  areas: string[] = ['新北市', '', '']; //地區
  phone: string = ''; //電話
  phoneControl = new FormControl('', {
      validators: [Validators.pattern(/^09-\d{8}$/)],
      updateOn: 'blur' // 游標離開這格後，才開始進行格式檢查
    }) // 建立電話的控制項
  isEditingBasic: boolean = false; // 控制基本資訊是否可編輯

  email: string = 'apple@gmail.com';
  profile: string = '本人常駐於台灣大學，偶爾會穿越到輔仁大學'; //個人簡介
  profileControl = new FormControl(this.profile);

  isEditingPassword: boolean = false;// 控制編輯狀態
  private backupData: any = {}; // 按下取消時，用來跨時空倒流的記憶箱子

  // 密碼相關的 Control
  passwordForm!: FormGroup;

  hideOldPassword = signal(true);
  hideNewPassword = signal(true);
  hideConfirmPassword = signal(true);

  //建立 Control 負責控制輸入框與獲取目前打什麼字
  schoolControl = new FormControl(this.school, [Validators.required]);
  deptControl = new FormControl(this.department);
  areaFormArray = new FormArray<FormControl<string | null>>([]);


  // 2. 這是畫面顯示用的「動態過濾後的清單」 各自的動態過濾水管 (Observable)
  filteredSchools: Observable<string[]> | undefined;
  filteredDepts: Observable<string[]> | undefined;
  filteredAreas: Observable<string[]> | undefined;
  filteredAreasList: Observable<string[]>[] = [];

  ngOnInit() {

    // 此時 schoolService 已經安全注入，可以放心呼叫了！
  const allSchools = this.schoolService.allFlattenedSchools();
  this.schoolControl.addValidators([this.isInListValidator(allSchools)]);

    // 初始狀態設為禁用
    this.schoolControl.disable();
    this.deptControl.disable();
    this.profileControl.disable();
    this.phoneControl.disable();

//  1. 根據原本的 areas 陣列長度，動態把 FormControl 塞進 FormArray 盒子裡
    this.areas.forEach((areaValue, index) => {
      const allRegions = this.schoolService.allRegions(); // 拿到官方地區清單
      // 如果是 index === 0 (第一格) 就加上必填驗證，其餘格則不用
      const validators = index === 0 ? [
        Validators.required,
        this.isInListValidator(allRegions)
      ] : [];

      const ctrl = new FormControl(
        { value: areaValue, disabled: true },
        validators
      );
      this.areaFormArray.push(ctrl);
    });

    //  2. 神級重構：用一個迴圈，自動幫陣列裡的「每一個」輸入框接上動態互斥水管！
    this.areaFormArray.controls.forEach((control, index) => {
      this.filteredAreasList[index] = control.valueChanges.pipe(
        startWith(control.value || ''),
        map(value => {
          const allRegions = this.schoolService.allRegions();

          // ❌ 剔除邏輯：找出「除了自己以外」，其他輸入框目前已經選了哪些縣市
          const otherSelectedValues = this.areaFormArray.controls
            .filter((_, idx) => idx !== index) // 排除自己
            .map(c => c.value);                // 拿別人的值

          const availableRegions = allRegions.filter(r => !otherSelectedValues.includes(r));
          return this._filter(value || '', availableRegions);
        })
      );
    });

    this.passwordForm = this.fb.group({
      oldPassword: [{ value: '', disabled: true }, [Validators.required]],
      newPassword: [{ value: '', disabled: true }, [Validators.required, Validators.minLength(8)]],
      confirmPassword: [{ value: '', disabled: true }, [Validators.required]]
    }, {
      validators: this.passwordMatchValidator // 👈 自訂比對大門
    });


    // 🏫 2. 【學校】水管：不再受地區限制，直接撈取全台灣不重複學校總名單
    this.filteredSchools = this.schoolControl.valueChanges.pipe(
      startWith(this.schoolControl.value || ''),
      map(value => {
        // 💡 呼叫我們升級後的 Service 管道，拿到全台打散排序好的 130 多所學校名單
        const allTaiwanSchools = this.schoolService.allFlattenedSchools();
        return this._filter(value || '', allTaiwanSchools);
      })
    );

    // 🎓 3. 【科系】水管：完全不需要管區域，直接根據目前填寫的「學校」來動態吐出科系
    this.filteredDepts = this.deptControl.valueChanges.pipe(
      startWith(this.deptControl.value || ''),
      map(value => {
        const currentSchool = this.schoolControl.getRawValue();

        // 💡 呼叫我們在 Service 幫你加開的全新大招方法（getDepartmentsBySchoolOnly）
        // 完全不管地區，直球對焦這間學校有哪些科系！
        const deptsInSchool = this.schoolService.getDepartmentsBySchoolOnly(currentSchool);
        return this._filter(value || '', deptsInSchool);
      })
    );

    // 4.當使用者重新選擇或改動「學校」時，自動啪一聲清空「科系」
    this.schoolControl.valueChanges.subscribe((newValue) => {
      // 只有在處於「編輯模式」時才觸發清空，避免初始化或切換時產生不必要的干擾
      if (this.isEditingBasic) {
      // 🔑 終極防呆：檢查使用者「打的新字（newValue）」跟「原本存在變數裡的舊學校（this.school）」一不一樣
        // 只有在兩者【真正不相等】（代表使用者真的動手去擦掉、改寫、或選新學校）時，才允許清空科系！
        if (newValue !== this.school) {
          // 將科系重置為空字串
          this.deptControl.setValue('', { emitEvent: true });
        }
       }
    });

    setTimeout(() => {

      // 🔑 關鍵：暫時解除封印、強迫通水、再鎖回去！
      this.areaFormArray.enable({ emitEvent: false });
      this.schoolControl.enable({ emitEvent: false });
      this.deptControl.enable({ emitEvent: false });
      this.phoneControl.enable({ emitEvent: false });

      // 發射更新事件讓 Autocomplete 水管通水
      this.areaFormArray.controls.forEach(c => c.updateValueAndValidity({ emitEvent: true }));
      this.schoolControl.updateValueAndValidity({ emitEvent: true });
      this.deptControl.updateValueAndValidity({ emitEvent: true });
      this.phoneControl.updateValueAndValidity({ emitEvent: true });

      // 恢復一進網頁時的預設禁用狀態
      this.areaFormArray.disable({ emitEvent: false });
      this.schoolControl.disable({ emitEvent: false });
      this.deptControl.disable({ emitEvent: false });
      this.phoneControl.disable({ emitEvent: false });
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

  // 🎯 驗證器：確保輸入的值必須存在於 Service 的官方清單中
isInListValidator(validOptions: string[]): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const value = control.value;
    if (!value) return null; // 留空讓 required 去抓

    const normalizedValue = value.toLowerCase().replace(/台/g, '臺');
    const isValid = validOptions.some(opt =>
      opt.toLowerCase().replace(/台/g, '臺') === normalizedValue
    );

    return isValid ? null : { 'notInList': true };
  };
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

      this.selectedAvatarFile = file;

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

  // 🔑 新增：點擊恢復預設頭像的方法
  resetToDefaultAvatar() {
    // 1. 先用 Swal 來個貼心小確認，防止使用者誤觸
    Swal.fire({
      title: "確定要恢復預設頭像嗎？",
      text: "恢復後將會使用系統初始的預設圖片喔！",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "確定恢復",
      cancelButtonText: "先不要",
      confirmButtonColor: '#FB831D', // 派出提醒橘色
      cancelButtonColor: '#999999'
    }).then((result) => {
      if (result.isConfirmed) {
        // 2. 使用者按確定：將圖片路徑打回最初的起點
        this.avatarUrl = '/img/頭像範例.png';

        // 3. 傳遞暗號給後端：塞入 'RESET_DEFAULT' 字串，通知 Java 同學去把資料庫這名使用者的 avatar 欄位清空
        this.selectedAvatarFile = 'RESET_DEFAULT' as any;
      }
    });
  }

  /* 改基本資料 */
  // 切換編輯模式
  toggleEditBasic(){
    this.isEditingBasic = !this.isEditingBasic

   if (this.isEditingBasic) {
      // 🔓 開啟編輯：啟用所有控制項
      this.areaFormArray.enable();
      this.schoolControl.enable();
      this.deptControl.enable();
      this.profileControl.enable();
      this.phoneControl.enable();

      // 重要：開啟編輯的瞬間，把當前的資料存進編輯暫存區（提供 [(ngModel)] 雙向綁定）
      this.tempName = this.name;
      this.backupData = {
        avatarUrl: this.avatarUrl,
        areas: this.areaFormArray.controls.map(c => c.value),
        school: this.schoolControl.value,
        dept: this.deptControl.value,
        phone: this.phoneControl.value,
        profile: this.profileControl.value
      };
      // B. 【點擊確定儲存】
    } else {
      // 防呆安檢:檢查學校、或是地區第一格有沒有通過驗證
      if (this.schoolControl.invalid || this.areaFormArray.controls[0].invalid) {
        Swal.fire({
          title: '儲存失敗',
          text: '請填寫必填欄位（學校與地區第一格）！',
          icon: 'warning',
          confirmButtonColor: '#FB831D'
        });
        this.isEditingBasic = true; // 保持編輯狀態
        return; // 攔截！不讓程式往下跑
      }

      // 💥 優化防呆安檢：全面檢查學校、地區第一格、或是手機格式是否有任何一項 invalid
  if (this.schoolControl.invalid || this.areaFormArray.controls[0].invalid || this.phoneControl.invalid) {

    // 🎯 核心防呆：哪個欄位亂填，就當場強制 markAsTouched() 催生 HTML 錯誤紅字！
    if (this.schoolControl.invalid) {
      this.schoolControl.markAsTouched();
    }
    if (this.areaFormArray.controls[0].invalid) {
      this.areaFormArray.controls[0].markAsTouched();
    }
    if (this.phoneControl.invalid) {
      this.phoneControl.markAsTouched();
    }

    Swal.fire({
      title: '儲存失敗',
      text: '欄位填寫有誤！請檢查必填項，並務必從選單內選擇正確的學校與地區喔！',
      icon: 'warning',
      confirmButtonColor: '#FB831D'
    });

    this.isEditingBasic = true; // 🚨 強制保持在編輯狀態，不讓框框鎖起來
    return; // 攔截！不讓程式往下跑
  }

      // 🚨 防呆安檢：名字是一定要寫，且不能超過 10 個字！
      const trimmedName = this.tempName ? this.tempName.trim() : '';
      if (!trimmedName) {
        Swal.fire({ title: '儲存失敗', text: '名稱為必填欄位，不能留空喔！', icon: 'warning', confirmButtonColor: '#FB831D' });
        this.isEditingBasic = true;
        return; // 攔截！不讓程式往下跑
      }
      if (trimmedName.length > 20) {
        Swal.fire({ title: '儲存失敗', text: '名稱長度不能超過 20 個字喔！', icon: 'warning', confirmButtonColor: '#FB831D' });
        return; // 攔截！
      }

      // 補上電話格式安檢：檢查學校、地區第一格，以及「電話格式」有沒有通過驗證！
      if (this.schoolControl.invalid || this.areaFormArray.controls[0].invalid || this.phoneControl.invalid) {

        // 如果是因為電話錯了，我們主動幫它打上 touched 標籤，讓 HTML 的紅字立刻噴出來
        if (this.phoneControl.invalid) {
          this.phoneControl.markAsTouched();
        }

        Swal.fire({
          title: '儲存失敗',
          text: '請確認手機格式是否正確（09-xxxxxxxx）！',
          icon: 'warning',
          confirmButtonColor: '#FB831D'
        });

        this.isEditingBasic = true; // 🚨 強制保持在編輯狀態，不讓框框鎖起來
        return; // 攔截！不讓程式往下跑
      }

      // 🔒 儲存/關閉編輯：禁用所有控制項
      this.isEditingBasic = false;

      this.areaFormArray.disable();
      this.schoolControl.disable();
      this.deptControl.disable();
      this.profileControl.disable();
      this.phoneControl.disable();

      // 🔑 同步數據：將畫面上編輯好的暫存名字與自介，正式寫回變數中
      this.name = this.tempName;
      this.areas = this.areaFormArray.controls.map(c => c.value ?? '');
      this.school = this.schoolControl.value ?? '';
      this.department = this.deptControl.value ?? '';
      this.profile = this.profileControl.value ?? '';
      this.phone = this.phoneControl.value ?? '';


      // 這裡之後可以寫入呼叫後端 API 的邏輯（整包送給 Java 測試）
      console.log('儲存基本資訊送交後端:', {
        name: this.name,
        areas: this.areas.filter(a => a !== ''), // 🚀 自動過濾掉沒選的空欄位！
        school: this.schoolControl.value,
        dept: this.deptControl.value,
        phone: this.phone,
        profile: this.profile,
        avatarFile: this.selectedAvatarFile
      });

      // 💡 未來 Java 對接小筆記：因為有帶圖片檔案，建議用 FormData 來傳送：
      // const formData = new FormData();
      // if(this.selectedAvatarFile) formData.append('avatar', this.selectedAvatarFile);
      // formData.append('name', this.name);
      // this.userService.updateProfile(formData).subscribe(...);

      // 儲存成功後，清空暫存檔案控制項
      this.selectedAvatarFile = null;
    }
  }

  /* 處理個人設定的手機輸入與自動填入 '-' */
onPhoneInput(event: any) {
  let value = event.target.value;

  // 1. 移除非數字的字元
  value = value.replace(/\D/g, '');

  // 2. 自動在 09 後面補上 '-'
  if (value.length > 2) {
    value = value.substring(0, 2) + '-' + value.substring(2);
  }

  // 3. 將格式化後的字串塞回這個獨立的 phoneControl
  this.phoneControl.setValue(value, { emitEvent: false });
}



/* 點擊「取消修改」的方法 */
  cancelEditBasic() {
    this.isEditingBasic = false;

    // 🔒 關閉編輯模式並集體禁用
    this.areaFormArray.disable();
    this.schoolControl.disable();
    this.deptControl.disable();
    this.profileControl.disable();
    this.phoneControl.disable();

    //  【時空倒流：從記憶箱子裡把舊存檔倒回去】
    this.avatarUrl = this.backupData.avatarUrl; // 🔑 頭像完美變回預設/原圖！
    this.selectedAvatarFile = null;             // 暫存圖片垃圾桶清空
    this.tempName = this.name; // 名字還原
    this.schoolControl.setValue(this.backupData.school, { emitEvent: false });
    this.deptControl.setValue(this.backupData.dept, { emitEvent: false });
    this.phoneControl.setValue(this.backupData.phone, { emitEvent: false });
    this.profileControl.setValue(this.backupData.profile, { emitEvent: false });
    this.areaFormArray.controls.forEach((control, index) => {
      control.setValue(this.backupData.areas[index], { emitEvent: false });
    });
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
