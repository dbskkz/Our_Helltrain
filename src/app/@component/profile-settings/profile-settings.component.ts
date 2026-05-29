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
import { ValidatorFn } from '@angular/forms';
import Swal from 'sweetalert2';

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
  readonly School = School;
  readonly MapPin = MapPin;
  readonly Phone = Phone;
  readonly BoxIcon = Box;
  readonly Mail = Mail;
  readonly pencilIcon = PencilLine;
  readonly bookUser = BookUser;
  readonly clipboardPenLine = ClipboardPenLine;
  readonly lockKeyhole = LockKeyhole;

  // --- 狀態變數 ---
  isEditingBasic = false;
  isEditingPassword = false;
  hideOldPassword = signal(true);
  hideNewPassword = signal(true);
  hideConfirmPassword = signal(true);

  // --- 使用者原始數據 (與後端對接用) ---
  name = '小明';
  school = '輔仁大學';
  department = '醫學系';
  areas: string[] = ['新北市', '', ''];
  phone = '';
  email = '401338013@gapp.fju.edu.tw';
  profile = '本人常駐於輔仁大學，偶爾會穿越到台灣大學';
  avatarUrl: string | ArrayBuffer | null = '/img/頭像範例.png';

  score: number = 4.5; //評分
  tradeNumber: number = 52;  //交易
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
    private snackBar: MatSnackBar,
    private router: Router,
    private schoolService: SchoolDataService,
  ) {}

  ngOnInit() {
    // 1. 初始化集體禁用
    this.setBasicControlsStatus(false);

    // 2. 初始化地區 FormArray
    this.areas.forEach((areaValue, index) => {
      const validators = index === 0 ? [Validators.required] : [];
      this.areaFormArray.push(
        new FormControl({ value: areaValue, disabled: true }, validators),
      );
    });

    // 3. 串接所有 Autocomplete 監聽水管
    this.initAutocompletePipelines();

    // 4. 密碼表單初始化
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

    // 5. 延遲通水機制
    setTimeout(() => {
      this.setBasicControlsStatus(true, { emitEvent: false });
      Object.values(this.basicControlsMap).forEach((c) => {
        if (c instanceof FormArray)
          c.controls.forEach((ctrl) =>
            ctrl.updateValueAndValidity({ emitEvent: true }),
          );
        else c.updateValueAndValidity({ emitEvent: true });
      });
      this.setBasicControlsStatus(false, { emitEvent: false });
    }, 300);
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

      // 🔒 驗證全過，一鍵集體鎖定
      this.setBasicControlsStatus(false);

      // 數據同步
      this.name = this.tempName;
      this.school = this.schoolControl.value ?? '';
      this.department = this.deptControl.value ?? '';
      this.phone = this.phoneControl.value ?? '';
      this.profile = this.profileControl.value ?? '';
      this.areas = this.areaFormArray.controls.map((c) => c.value ?? '');

      console.log('正式送交 Java 後端:', {
        name: this.name,
        school: this.school,
        dept: this.department,
        phone: this.phone,
        profile: this.profile,
        areas: this.areas.filter((a) => a !== ''),
        avatarFile: this.selectedAvatarFile,
      });
      this.selectedAvatarFile = null;
    }
  }

  /* 點擊取消修改：一鍵時空倒流 */
  cancelEditBasic() {
    this.isEditingBasic = false;
    this.setBasicControlsStatus(false);

    // 從記憶箱子倒回去
    this.avatarUrl = this.backupData.avatarUrl;
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

  // --- 頭像與密碼等其餘方法保持原本邏輯 ---
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
      };
      reader.readAsDataURL(file);
    }
  }

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
      }
    });
  }


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
