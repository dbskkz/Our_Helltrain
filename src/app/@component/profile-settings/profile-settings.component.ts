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
import { BehaviorSubject, combineLatest, map, Observable, startWith } from 'rxjs';
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
import { ChangePasswordVo, SetInfoVo } from '../../@Interface/user';

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
  onTheShelves: number = 7;  //目前上架

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

      if (user.imgPath && user.imgPath.trim() !== '') {
          if (user.imgPath.startsWith('http')) {
            this.avatarUrl = user.imgPath; // 👉 如果是 Cloudinary 網址，直球對決直接用！
          } else {
            this.avatarUrl = 'http://localhost:8080/uploads/' + user.imgPath;
          }
        } else {
          this.avatarUrl = 'https://res.cloudinary.com/df8kviidh/image/upload/v1780243053/default_avatar_lvgh1a.png';
        }

        // 同步通知全站右上角
        this.userService.updateAvatar(this.avatarUrl as string);

       // 2. 處理地區 (🌟 終極拆彈防禦：管他資料庫是字串、陣列、還是帶括號的亂碼，前端統統相容！)
        let backendAreas: string[] = [];

        if (Array.isArray(user.location)) {
          // 情境 A：後端給的是標準陣列 (例如：["臺南市"])
          backendAreas = user.location;
        } else if (user.location && typeof user.location === 'string') {
          const cleanStr = user.location.trim();

          // 情境 B：後端給的是「長得像陣列的字串」 (例如：'["臺北市"]')
          if (cleanStr.startsWith('[') && cleanStr.endsWith(']')) {
            try {
              backendAreas = JSON.parse(cleanStr);
            } catch (e) {
              // 萬一 JSON 解析失敗，用正規表達式把中括號和雙引號暴力濾掉
              backendAreas = [cleanStr.replace(/[\[\]"']/g, '')];
            }
          } else {
            // 情境 C：後端給的是最單純的純字串 (例如：'臺北市')
            backendAreas = [cleanStr];
          }
        }
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
      let base64Img: string | null = null;
      let isDelete = false;

      if (this.selectedAvatarFile === 'RESET_DEFAULT' as any) {
        isDelete = true;
      } else if (this.selectedAvatarFile instanceof File) {
        base64Img = this.avatarUrl as string;
      }

      // 🌟 2. 打包成 SetInfoVo 物件 (準備送給 Java)
      const updateData: SetInfoVo = {
        email: this.email,
        name: this.tempName,
        school: this.schoolControl.value ?? '',
        department: this.deptControl.value || null,
        phone: this.phoneControl.value || null,
        msg: this.profileControl.value || null,
        location: this.areaFormArray.controls
                    .map(c => c.value ?? '')
                    .filter(val => val.trim() !== ''), // 過濾掉空字串
        img: base64Img,
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
            this.department = updateData.department ?? '';
            this.phone = updateData.phone  ?? '';
            this.profile = updateData.msg  ?? '';
            this.areas = updateData.location;
            this.selectedAvatarFile = null;

          } else if (res.statusCode === 401 && res.message === 'Please login first') {
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
    const cleanSchool = this.normalize(this.schoolControl.value);
    this.areaFormArray.controls.forEach(c => {
    if (c.value) this.validateAreaControl(c);
    });
    // 檢查是否在清單內
    if (
      cleanSchool &&!allSchools.some((opt) => opt.toLowerCase().replace(/台/g, '臺') === cleanSchool,)) {
      this.schoolControl.setErrors({ notInList: true });
    }

    const isAnyAreaInvalid = this.areaFormArray.controls.some(c => c.invalid);

    // 催生紅字判定
    if (this.schoolControl.invalid || isAnyAreaInvalid || this.phoneControl.invalid) {
      this.schoolControl.markAsTouched();
      this.phoneControl.markAsTouched();
      this.areaFormArray.controls.forEach(c => c.markAsTouched());
      this.showWarningAlert('欄位填寫有誤！請務必填寫必填項、確認手機格式，並確認出沒地區沒有重複選取喔！');
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
validateOnBlur(control: AbstractControl, type: 'school' | 'area') {
  setTimeout(() => {
    control.markAsTouched();
    const value = this.normalize(control.value);
    if (!value) { control.setErrors(null); return; }

    if (type === 'area') this.validateAreaControl(control);
    else this.validateSchoolControl(control);
  }, 200);
}

private validateAreaControl(control: AbstractControl) {
  const allRegions = this.schoolService.allRegions();
  const value = this.normalize(control.value);

  const otherSelected = this.areaFormArray.controls
    .filter(c => c !== control)
    .map(c => this.normalize(c.value));

  // 模糊補全
  const matched = allRegions.find(opt =>
    this.normalize(opt).includes(value) &&
    !otherSelected.includes(this.normalize(opt))
  );
  if (matched) { control.setValue(matched); this.areaRefreshTrigger.next(); return; }

  // 安檢
  const isInList = allRegions.some(opt => this.normalize(opt) === value);
  if (!isInList) { control.setErrors({ notInList: true }); return; }

  // 重複檢查
  const allValues = this.areaFormArray.controls.map(c =>this.normalize(c.value));
  this.areaFormArray.controls.forEach(c => {
    const v = this.normalize(c.value);
    if (!v) return;
    allValues.filter(x => x === v).length > 1
      ? c.setErrors({ duplicated: true })
      : c.hasError('duplicated') && c.setErrors(null);
  });
}

private validateSchoolControl(control: AbstractControl) {
  const value = this.normalize(control.value);
  const isValid = this.schoolService.allFlattenedSchools()
    .some(opt => this.normalize(opt) === value);
  control.setErrors(isValid ? null : { notInList: true });
}

  // --- 各類獨立小工具方法 (Helper Functions) ---

//台→臺
private normalize(value: string | null): string {
 return (value || '').trim().toLowerCase().replace(/台/g, '臺');
}

private areaRefreshTrigger = new BehaviorSubject<void>(undefined);

  private initAutocompletePipelines() {
    // 地區動態互斥水管
  this.areaFormArray.controls.forEach((control, index) => {
    this.filteredAreasList[index] = combineLatest([
      control.valueChanges.pipe(startWith(control.value || '')),
      this.areaRefreshTrigger  // ✅ 加入這個，讓其他格選完後可以強迫此格重新過濾
    ]).pipe(
      map(([value]) => {
        const allRegions = this.schoolService.allRegions();
        const otherSelected = this.areaFormArray.controls
          .filter((_, idx) => idx !== index)
          .map((c) => this.normalize(c.value))
          .filter(val => val !== '');

        // ✅ 過濾掉已被其他格選走的選項
        const available = allRegions.filter(
          (r) => !otherSelected.includes(r.toLowerCase().replace(/台/g, '臺'))
        );
        return this._filter(value || '', available);
      }),
    );
    // 值改變時，重新檢查所有格的重複狀態
    control.valueChanges.subscribe(() => {
      this.recheckDuplicates();
    });
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

  // 專門負責重複檢查的方法，隨時可以呼叫
private recheckDuplicates() {
  const allValues = this.areaFormArray.controls.map(c => this.normalize(c.value));

  this.areaFormArray.controls.forEach(c => {
    const v = this.normalize(c.value);
    if (!v) return;

    if (allValues.filter(x => x === v).length > 1) {
      c.setErrors({ duplicated: true });
    } else if (c.hasError('duplicated')) {
      c.setErrors(null);
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
        const defaultAvatar = 'https://res.cloudinary.com/df8kviidh/image/upload/v1780243053/default_avatar_lvgh1a.png';
        this.avatarUrl = defaultAvatar;
        this.selectedAvatarFile = 'RESET_DEFAULT' as any;
        this.userService.updateAvatar(defaultAvatar);
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

      const requestData: ChangePasswordVo = {
      nowPad: this.passwordForm.value.oldPassword,
      newPad: this.passwordForm.value.newPassword
      };

      this.userService.changePassword(requestData).subscribe({
        next:(res) => {
          if(res.statusCode === 200){
          Swal.fire({
            title: '密碼修改成功！',
            icon: 'success',
            confirmButtonText: '確定',
            confirmButtonColor: '#FB831D',
          });
          // 成功後才執行收尾動作 (禁用並清空密碼表單)
          this.finalizeEdit();
          }else{
            console.error('修改密碼被後端拒絕:', res.message);
            Swal.fire({
            title: '修改失敗',
            text: '舊密碼輸入錯誤，請確認後再試！',
            icon: 'error',
            confirmButtonText: '知道了',
            confirmButtonColor: '#FB831D',
          });
          this.isEditingPassword = true;
          }
        },
        error: (err) => {
        console.error('更換密碼 API 錯誤', err);
        Swal.fire('系統錯誤', '無法連線到伺服器，請稍後再試！', 'error');
        this.isEditingPassword = true;
        }
      });

      console.log('送出修改密碼請求', this.passwordForm.value);
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
    if (this.isEditingBasic) return;
    const myId = localStorage.getItem('userId');
    this.router.navigate(['/store', myId]);
  }

}
