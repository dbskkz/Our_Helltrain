import { Component, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { map, Observable, startWith } from 'rxjs';
import {
  LucideAngularModule,
  PencilLine,
  Box,
  Mail,
  Phone,
  MapPin,
  BookUser,
  School,
  ClipboardPenLine,
  LockKeyhole,
} from 'lucide-angular';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SchoolDataService } from '../../@Services/school-data.service';
import Swal from 'sweetalert2';
import { UserService } from '../../@Services/user.service';
import { SetInfoVo } from '../../@Interface/user';

@Component({
  selector: 'app-profile-settings',
  imports: [
    MatIconModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    AsyncPipe,
    LucideAngularModule,
  ],
  templateUrl: './profile-settings.component.html',
  styleUrl: './profile-settings.component.scss',
})
export class ProfileSettingsComponent {
  // --- 唯讀常數與圖標 ---
readonly icons = { School, MapPin, Phone, Box, Mail, PencilLine, BookUser, ClipboardPenLine, LockKeyhole };

  // --- 狀態變數 ---
  isEditingBasic = false;
  isEditingPassword = false;
  hideOldPassword = signal(true);
  hideNewPassword = signal(true);
  hideConfirmPassword = signal(true);

  // --- 使用者原始數據 (與後端對接用) ---
  name = '';
  school = '';
  department = '';
  areas: string[] = ['', '', ''];
  phone = '';
  email = '';
  profile = '';
  avatarUrl: string | ArrayBuffer | null = '';

  score: number = 0; //評分
  onTheShelves: number = 37;  //目前上架

  // --- 暫存與記憶箱子 ---
  tempName = '';
  selectedAvatarFile: File | null = null; //照片暫存
  private backupData: any = {}; // 按下取消時，用來跨時空倒流的記憶箱子

  // --- 表單控制項 (獨立的盒子) ---
  schoolControl = new FormControl(this.school, [Validators.required]);
  deptControl = new FormControl(this.department);
  phoneControl = new FormControl('', [Validators.pattern(/^09-\d{8}$/)]);
  profileControl = new FormControl(this.profile);
  areaFormArray = new FormArray<FormControl<string | null>>([]);
  passwordForm!: FormGroup;

  // 用一個物件把所有基本資料的控制項打包打包！
  // 未來如果有增加「生日、性別」，接直往這裡塞一列就好，下方所有邏輯都不用動！
  private get basicControlsMap() {
    return {
      school: this.schoolControl,
      dept: this.deptControl,
      phone: this.phoneControl,
      profile: this.profileControl,
      areas: this.areaFormArray,
    };
  }

  // --- RxJS 動態水管 ---
  filteredSchools!: Observable<string[]>;
  filteredDepts!: Observable<string[]>;
  filteredAreasList: Observable<string[]>[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private schoolService: SchoolDataService,
    private userService: UserService
  ) {}

  // --- 串接後端：載入個人資料 ---
  loadUserProfile() {
// 實戰中，這裡的 ID 應該是從登入時存的 localStorage 拿出來的
/**💡💡💡這裡12是測試用，之後要拿掉 💡💡💡*/
    const currentUserId = Number(localStorage.getItem('userId')) || 12;
  this.userService.getUserData(currentUserId).subscribe({
    next:(res)=>{
      if(res.statusCode === 200){
        const user = res.user;

        this.name = user.userName;
        this.email = user.userEmail;
        this.school = user.school;
        this.department = user.department || '';
        this.phone = user.phone || '';
        this.profile = user.msg || '';
        this.score = user.goodLevel || 5;

      if (user.imgPath) {
        this.avatarUrl = 'http://localhost:8080/uploads/' + user.imgPath;
      }

        // 2. 處理地區 (後端給 String，前端要塞進 Array)
        const backendAreas = (user.location || '').split(',');
        this.areas = [
          backendAreas[0] || '',
          backendAreas[1] || '',
          backendAreas[2] || ''
        ];

        // 3. 將資料灌進表單控制項 (FormControl)
          this.schoolControl.setValue(this.school, { emitEvent: false });
          this.deptControl.setValue(this.department, { emitEvent: false });
          this.phoneControl.setValue(this.phone, { emitEvent: false });
          this.profileControl.setValue(this.profile, { emitEvent: false });

          // 4. 重建並灌入地區 FormArray
          this.areaFormArray.clear(); // 先把原本空的清掉
          this.areas.forEach((areaValue, index) => {
            const validators = index === 0 ? [Validators.required] : [];
            this.areaFormArray.push(
              new FormControl({ value: areaValue, disabled: true }, validators)
            );
          });

          // 因為我們重新建立了 FormArray，所以要重新接上地區的水管！
          this.initAutocompletePipelines();
      }
    },
    error: (err) =>{
      console.error('取得個人資料失敗', err);
      this.showWarningAlert('無法載入個人資料，請稍後再試。');
    }
  });
  }

  ngOnInit() {
    // 1. 初始化集體禁用
    this.setBasicControlsStatus(false);

    // 2. 密碼表單初始化
    this.passwordForm = this.fb.group(
      {
        oldPassword: [{ value: '', disabled: true }, [Validators.required]],
        newPassword: [
          { value: '', disabled: true },
          [Validators.required, Validators.minLength(8),Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)],
        ],
        confirmPassword: [{ value: '', disabled: true }, [Validators.required]],
      },
      { validators: this.passwordMatchValidator },
    );

  // 3. 呼叫 API 載入資料 (這裡面會自動幫你處理 FormArray 和水管)
    this.loadUserProfile();
  }

  // 神級重構 B：集體控制狀態的萬能開關工具
  private setBasicControlsStatus(enable: boolean, options = {}) {
    Object.values(this.basicControlsMap).forEach((control) => {
      if (enable) control.enable(options);
      else control.disable(options);
    });
  }

  // --- 改基本資料核心邏輯 ---
  toggleEditBasic() {
    this.isEditingBasic = !this.isEditingBasic;

    if (this.isEditingBasic) {
      // 🔓 一鍵解鎖所有控制項！
      this.setBasicControlsStatus(true);
      this.tempName = this.name;
      this.backupData = {
        avatarUrl: this.avatarUrl,
        school: this.schoolControl.value,
        dept: this.deptControl.value,
        phone: this.phoneControl.value,
        profile: this.profileControl.value,
        areas: this.areaFormArray.controls.map((c) => c.value),
      };
    } else {
      // 確定儲存時的前端大檢查
      if (this.validateAndMarkBasicFields()) return; // 遭攔截則中斷

      // 🌟 1. 判斷圖片狀態
      let currentFile: File | null = null;
      let isDelete = false;

      if (this.selectedAvatarFile === 'RESET_DEFAULT' as any) {
        isDelete = true;
      } else if (this.selectedAvatarFile instanceof File) {
        currentFile = this.selectedAvatarFile;
      }

      // 🌟 2. 打包成 SetInfoVo 物件 (準備送給 Java)
      const updateData: SetInfoVo = {
        name: this.tempName,
        school: this.schoolControl.value ?? '',
        department: this.deptControl.value ?? '',
        phone: this.phoneControl.value ?? '',
        msg: this.profileControl.value ?? '',
        location: this.areaFormArray.controls
                    .map(c => c.value ?? '')
                    .filter(val => val.trim() !== ''), // 過濾掉空字串
        img: currentFile,
        deleteImg: isDelete
      };

      // 🌟 3. 正式發送給後端！
      this.userService.updateProfile(updateData).subscribe({
        next: (res) => {
          if (res.statusCode === 200) {
            // ✅ 後端說存檔成功了！
            Swal.fire({ title: '儲存成功！', icon: 'success', confirmButtonColor: '#FB831D' });

            // 確定成功後，才一鍵集體鎖定表單並關閉編輯模式
            this.setBasicControlsStatus(false);
            this.isEditingBasic = false;

            // 數據同步：用剛剛送出去的資料，來更新畫面上的變數
            this.name = updateData.name;
            this.school = updateData.school;
            this.department = updateData.department;
            this.phone = updateData.phone;
            this.profile = updateData.msg;
            this.areas = updateData.location;
            this.selectedAvatarFile = null;

          } else if (res.statusCode === 400 && res.message === 'Please login first') {
            // ⚠️ 假設這是你們後端「未登入」的代碼，依你們實際情況調整
            Swal.fire({ title: '登入已過期', text: '請重新登入', icon: 'error' }).then(() => {
              this.router.navigate(['/login']);
            });
          } else {
            // ❌ 存檔失敗 (例如名字格式錯誤)，維持編輯狀態讓使用者改
            this.showWarningAlert(res.message);
          }
        },
        error: () => {
          this.showWarningAlert('伺服器連線異常，請稍後再試！');
        }
      });
    }
  }

  /* 點擊取消修改：一鍵時空倒流 */
  cancelEditBasic() {
    this.isEditingBasic = false;
    this.setBasicControlsStatus(false);

    // 從記憶箱子倒回去
    this.avatarUrl = this.backupData.avatarUrl;
    this.userService.updateAvatar(this.backupData.avatarUrl);
    this.selectedAvatarFile = null;
    this.tempName = this.name;
    this.schoolControl.setValue(this.backupData.school, { emitEvent: false });
    this.deptControl.setValue(this.backupData.dept, { emitEvent: false });
    this.phoneControl.setValue(this.backupData.phone, { emitEvent: false });
    this.profileControl.setValue(this.backupData.profile, { emitEvent: false });
    this.areaFormArray.controls.forEach((c, i) =>
      c.setValue(this.backupData.areas[i], { emitEvent: false }),
    );
  }

  // ✨ 神級重構 C：把又臭又長的比對安檢抽出來獨立
  private validateAndMarkBasicFields(): boolean {
    const allSchools = this.schoolService.allFlattenedSchools();
    const allRegions = this.schoolService.allRegions();

    const cleanSchool = (this.schoolControl.value || '')
      .trim()
      .toLowerCase()
      .replace(/台/g, '臺');
    const cleanArea = (this.areaFormArray.controls[0].value || '')
      .trim()
      .toLowerCase()
      .replace(/台/g, '臺');

    // 檢查是否在清單內
    if (
      cleanSchool &&
      !allSchools.some(
        (opt) => opt.toLowerCase().replace(/台/g, '臺') === cleanSchool,
      )
    ) {
      this.schoolControl.setErrors({ notInList: true });
    }
    if (
      cleanArea &&
      !allRegions.some(
        (opt) => opt.toLowerCase().replace(/台/g, '臺') === cleanArea,
      )
    ) {
      this.areaFormArray.controls[0].setErrors({ notInList: true });
    }

    // 催生紅字判定
    if (
      this.schoolControl.invalid ||
      this.areaFormArray.controls[0].invalid ||
      this.phoneControl.invalid
    ) {
      this.schoolControl.markAsTouched();
      this.areaFormArray.controls[0].markAsTouched();
      this.phoneControl.markAsTouched();
      this.showWarningAlert(
        '欄位填寫有誤！請務必填寫必填項、確認手機格式，並自下拉選單內選取學校與地區。',
      );
      this.isEditingBasic = true;
      return true;
    }

    // 名字檢查
    const trimmedName = (this.tempName || '').trim();
    if (!trimmedName) {
      this.showWarningAlert('名稱為必填欄位，不能留空喔！');
      this.isEditingBasic = true;
      return true;
    }
    if (trimmedName.length > 20) {
      this.showWarningAlert('名稱長度不能超過 20 個字喔！');
      this.isEditingBasic = true;
      return true;
    }

    return false; // 代表完全沒問題，放行儲存
  }

  //讓地區（或學校）在 Blur 失去焦點時當場進行清單安檢
 validateOnBlur(control: any, type: 'school' | 'area') {
  control.markAsTouched();

  let value = (control.value || '').trim().toLowerCase().replace(/台/g, '臺');

  // 🔑 如果使用者把字擦掉變空字串，清空所有自訂錯誤，回歸 required 判斷
  if (!value) {
    control.setErrors(null);
    return;
  }

  if (type === 'area') {
    const allRegions = this.schoolService.allRegions();

    //  精準加在這：如果他打「高雄」，幫他模糊搜尋出全名「高雄市」
  const matched = allRegions.find(opt => opt.includes(value));
  if (matched) {
    control.setValue(matched);
    value = matched.toLowerCase().replace(/台/g, '臺');
  }

    // 🔍 安檢 A：檢查是否在合法縣市選單內
    const isInList = allRegions.some(
      (opt) => opt.toLowerCase().replace(/台/g, '臺') === value
    );

    if (!isInList) {
      control.setErrors({ notInList: true });
      return; // 亂打直接封殺，不用往下檢查重複了
    }

    // 🔍 安檢 B：檢查是否與其他格子「重複選取」
    // 撈出目前三格裡面，所有「其他格」填寫的值
    const allFormValues = this.areaFormArray.controls.map(c =>
      (c.value || '').trim().toLowerCase().replace(/台/g, '臺')
    );

    // 算出這個值在三格裡面出現了幾次
    const count = allFormValues.filter(v => v === value).length;

    if (count > 1) {
      // 💥 抓到重複了！當場打上重複標籤！
      control.setErrors({ duplicated: true });
    } else {
      // ✨ 沒亂打也沒重複，清空錯誤，紅字秒消失！
      control.setErrors(null);

      // 💡 貼心連動修復：當某一格被改掉不重複時，我們要叫「其他格子」也重新檢查一遍，避免隔壁格的紅字卡住
      this.areaFormArray.controls.forEach(c => {
        if (c !== control && c.hasError('duplicated')) {
          // 讓隔壁重複的格子也重新驗證一下
          const cValue = (c.value || '').trim().toLowerCase().replace(/台/g, '臺');
          const cCount = allFormValues.filter(v => v === cValue).length;
          if (cCount <= 1) c.setErrors(null);
        }
      });
    }
  }
  else if (type === 'school') {
    const allSchools = this.schoolService.allFlattenedSchools();
    const isValid = allSchools.some(
      (opt) => opt.toLowerCase().replace(/台/g, '臺') === value
    );
    if (!isValid) {
      control.setErrors({ notInList: true });
    } else {
      control.setErrors(null);
    }
  }
}

  // --- 各類獨立小工具方法 (Helper Functions) ---

  private initAutocompletePipelines() {
    // 地區動態互斥水管
    this.areaFormArray.controls.forEach((control, index) => {
      this.filteredAreasList[index] = control.valueChanges.pipe(
        startWith(control.value || ''),
        map((value) => {
          const allRegions = this.schoolService.allRegions();
          const otherSelected = this.areaFormArray.controls
            .filter((_, idx) => idx !== index)
            .map((c) => c.value)
            .filter(val => val !== null && val !== '');
          const available = allRegions.filter(
            (r) => !otherSelected.includes(r),
          );
          return this._filter(value || '', available);
        }),
      );
    });

    // 學校水管
    this.filteredSchools = this.schoolControl.valueChanges.pipe(
      startWith(this.schoolControl.value || ''),
      map((value) =>
        this._filter(value || '', this.schoolService.allFlattenedSchools()),
      ),
    );

    // 科系水管
    this.filteredDepts = this.deptControl.valueChanges.pipe(
      startWith(this.deptControl.value || ''),
      map((value) =>
        this._filter(
          value || '',
          this.schoolService.getDepartmentsBySchoolOnly(
            this.schoolControl.getRawValue(),
          ),
        ),
      ),
    );

    // 換學校清空科系
    this.schoolControl.valueChanges.subscribe((newValue) => {
      if (this.isEditingBasic && newValue !== this.school) {
        this.deptControl.setValue('', { emitEvent: true });
      }
    });
  }

  /* 處理手機輸入與自動填入 '-' */
  onPhoneInput(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length > 2)
      value = value.substring(0, 2) + '-' + value.substring(2);
    this.phoneControl.setValue(value, { emitEvent: false });
  }

  // 萬能過濾器：支援【台/臺】繁簡通用模糊搜尋
  private _filter(value: string, options: string[]): string[] {
    const filterValue = value.toLowerCase().replace(/台/g, '臺');
    return options.filter(
      (opt) =>
        opt.toLowerCase().includes(filterValue) ||
        opt.toLowerCase().replace(/臺/g, '台').includes(value.toLowerCase()),
    );
  }

   // 驗證器：確保輸入的值必須存在於 Service 的官方清單中
  private passwordMatchValidator(control: AbstractControl) {
    const newPwd = control.get('newPassword');
    const cfPwd = control.get('confirmPassword');
    if (!newPwd || !cfPwd) return null;

    if (newPwd.value !== cfPwd.value) {
      cfPwd.setErrors({ mismatch: true });
      return { mismatch: true };
    } else {
      if (cfPwd.hasError('mismatch')) {
        const errs = cfPwd.errors;
        if (errs) {
          delete errs['mismatch'];
          cfPwd.setErrors(Object.keys(errs).length ? errs : null);
        }
      }
      return null;
    }
  }

  // 當任何一格地區選好時，強迫三格水管集體通電重新整理
onAreaSelected() {
  // 用一個小小的延遲，確保 Angular 已經把選好的值塞進 FormControl 裡了
  setTimeout(() => {
    this.areaFormArray.controls.forEach(control => {
      // ⚡ 強迫每一格都對外發射一次「值已更新」的訊號，但【不要】觸發表單被修改的狀態
      control.updateValueAndValidity({ emitEvent: true, onlySelf: true });
    });
  }, 50);
}

  private showWarningAlert(text: string) {
    Swal.fire({
      title: '儲存失敗',
      text,
      icon: 'warning',
      confirmButtonColor: '#FB831D',
    });
  }

  //更換照片
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      if (file.size > 2 * 1024 * 1024) {
        Swal.fire({
          title: '檔案太大囉，請選擇2MB以下的圖片!',
          icon: 'warning',
          confirmButtonColor: '#FB831D',
        });
        return;
      }
      this.selectedAvatarFile = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.avatarUrl = reader.result;
        if (reader.result) {
        this.userService.updateAvatar(reader.result as string);
      }
      };
      reader.readAsDataURL(file);
    }
  }

  //恢復預設頭像
  resetToDefaultAvatar() {
    Swal.fire({
      title: '確定要恢復預設頭像嗎？',
      text: '恢復後將會使用系統初始的預設圖片喔！',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: '確定恢復',
      cancelButtonText: '先不要',
      confirmButtonColor: '#FB831D',
      cancelButtonColor: '#999999',
    }).then((result) => {
      if (result.isConfirmed) {
        this.avatarUrl = '/img/頭像範例.png';
        this.selectedAvatarFile = 'RESET_DEFAULT' as any;
        this.userService.updateAvatar('/img/頭像範例.png');
      }
    });
  }

//密碼確認修改按鈕
  toggleEditPassword() {
    this.isEditingPassword = !this.isEditingPassword;
    if (this.isEditingPassword) {
      this.passwordForm.enable();
    } else {
      if (this.passwordForm.invalid) {
        Swal.fire({
          title: '請檢查密碼格式，或確認兩次新密碼一致!',
          icon: 'warning',
          confirmButtonText: '知道了',
          confirmButtonColor: '#FB831D',
        });
        this.isEditingPassword = true;
        return;
      }
      console.log('送出修改密碼請求', this.passwordForm.value);
      this.finalizeEdit();
    }
  }

  // 密碼取消修改的函式
  cancelEditPassword() {
    this.isEditingPassword = false;
    this.finalizeEdit();
  }

  // 密碼封裝重複的動作：禁用並清空
  private finalizeEdit() {
    this.passwordForm.disable();
    this.passwordForm.reset();
  }

  gotoStore() {
    this.router.navigate(['/store']);
  }
  orderInformation() {
    this.router.navigate(['/order_information']);
  }
}
