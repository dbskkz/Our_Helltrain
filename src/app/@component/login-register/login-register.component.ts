import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import { PlatformRulesComponent } from '../platform-rules/platform-rules.component';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { map, Observable, startWith } from 'rxjs';
import { Router } from '@angular/router';
import { SchoolDataService } from '../../@Services/school-data.service';
import Swal from 'sweetalert2';
import {  ValidatorFn } from '@angular/forms';
@Component({
  selector: 'app-login-register',
  imports: [MatDialogModule,MatFormFieldModule, MatInputModule,
     MatButtonModule, MatIconModule,ReactiveFormsModule,FormsModule,
    MatAutocompleteModule,AsyncPipe],
  templateUrl: './login-register.component.html',
  styleUrl: './login-register.component.scss',
   changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginRegisterComponent implements OnInit{

  // 注入 Material 的 Dialog 服務
  constructor(private dialog: MatDialog, private router: Router, private schoolService: SchoolDataService) {}

  isRegister: boolean = false; //是否為註冊頁面
  userEmail: string = ''; //輸入的 Email
  isEmailTouched = false; //用來記錄使用者有沒有點過、或是按了下一步
  registerForm!: FormGroup; // 註冊的總管收納盒
  loginForm!: FormGroup; //登入的總管收納盒
  verificationCode = ''; // 驗證碼欄位
  isCodeTouched = false; // 驗證碼欄位有沒有點過

  // 🔑 倒數計時專用變數
  countdown = signal<number>(0);      // 剩餘秒數
  canResend: boolean = true;  // 是否可以重新發送（預設可以）
  private timer: any;         // 用來存計時器的變數

  // 專門控制「登入分頁」的密碼眼睛
  hideLoginPassword = signal<boolean>(true);

  // 用獨立的訊號控制「密碼」與「確認密碼」的眼睛，避免點一個兩個一起變
  hidePassword = signal<boolean>(true);
  hideConfirmPassword = signal<boolean>(true);

// 負責動態過濾的水管
  filteredAreas!: Observable<string[]> | undefined;
  filteredSchools!: Observable<string[]>| undefined;

  ngOnInit(): void {
    this.initRegisterForm(); // 呼叫註冊箱子初始化
    this.initLoginForm();  // 呼叫登入箱子初始化

    // 從盒子裡把「地區」與「學校」控制項抓出來」
    const registerAreaCtrl = this.registerForm.get('area') as FormControl;
    const registerSchoolCtrl = this.registerForm.get('school') as FormControl;

    //地區動態過濾水管
    if (registerAreaCtrl) {
      this.filteredAreas = registerAreaCtrl.valueChanges.pipe(
        startWith(registerAreaCtrl.value || ''),
        map(value => {
          // 向公車大水庫拿全台灣所有縣市名單
          const allRegions = this.schoolService.allRegions();
          return this._filter(value || '', allRegions);
        })
      );
    }

    // 【學校】動態過濾水管（全新大改版：完全直球對決全台灣總名單，徹底抽離地區干擾）
    if (registerSchoolCtrl) {
      this.filteredSchools = registerSchoolCtrl.valueChanges.pipe(
        startWith(registerSchoolCtrl.value || ''),
        map(value => {
          // 💡 直球呼叫你 Service 裡面的無敵全台學校名單大招
          const allFlattenedSchools = this.schoolService.allFlattenedSchools();
          return this._filter(value || '', allFlattenedSchools);
        })
      );
    }

    // 🕒 貼心初始通水：一進網頁就強迫兩個選單水管通電，點開立刻有完整選單
    setTimeout(() => {
      registerAreaCtrl?.updateValueAndValidity({ emitEvent: true });
      registerSchoolCtrl?.updateValueAndValidity({ emitEvent: true });
    }, 100);
  }

  // (註冊箱子)把所有的欄位通通寫成變數
  private initRegisterForm() {
  // 1. 先從你的 Service 拿到所有的官方學校與縣市總清單陣列
  const allSchools = this.schoolService.allFlattenedSchools();
  const allRegions = this.schoolService.allRegions();

    this.registerForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.maxLength(20)]),
    area: new FormControl('', [Validators.required,this.isInListValidator(allRegions)]),
    school: new FormControl('', [Validators.required, this.isInListValidator(allSchools)]),
     //                新盒子                 必填     ,       長度檢查
    password: new FormControl('',[Validators.required, Validators.minLength(8)]),
    confirmPassword: new FormControl('', [Validators.required]),
    phone: new FormControl('', {
      validators: [Validators.pattern(/^09-\d{8}$/)],
      updateOn: 'blur' // 游標離開這格後，才開始進行格式檢查
    }),
    agreeTerms: new FormControl(false, [Validators.requiredTrue]) //有沒有打勾(平台說明)
  }, {
    validators: this.passwordMatchValidator // 綁定下方比對密碼的方法
  });
  }

  // 萬能過濾器（直接複製你寫好的繁簡通用版）
  private _filter(value: string, options: string[]): string[] {
    let filterValue = value.toLowerCase().replace(/台/g, '臺');
    return options.filter(opt => {
      const optionValue = opt.toLowerCase();
      return optionValue.includes(filterValue) ||
             optionValue.replace(/臺/g, '台').includes(value.toLowerCase());
    });
  }

  //登入箱子
  private initLoginForm() {
  this.loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.edu\.tw$/)]),
    password: new FormControl('', [Validators.required]),
    agreeTerms: new FormControl(false, [Validators.requiredTrue])
  });
  }



  // 自訂驗證器：負責檢查兩次密碼是否一致
  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null{
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    if(!password || !confirmPassword){
      return null;
    }
    if(confirmPassword.value && password.value !== confirmPassword.value){
      confirmPassword.setErrors({ mismatch: true });
      return { passwordMismatch: true };
    }else {
      if (confirmPassword.hasError('mismatch')) {
        confirmPassword.setErrors(null);
      }
      return null;
    }
  }



  /* 點擊觸發彈出視窗(平台說明)的方法 */
  openTermsDialog(event: MouseEvent): void {
    event.preventDefault();  // 阻止原生行為（防止干擾 checkbox 的勾選狀態）
    event.stopPropagation(); // 阻止事件冒泡

    // 打開對話框，並可以透過 width 設定視窗寬度
    this.dialog.open(PlatformRulesComponent, {
      width: '500px',
      disableClose: false // 允許點擊空白處關閉視窗
    });
  }

  /* 檢查 Email 的方法（回傳 true 或 false） */
  isValidSchoolEmail(): boolean {
  if (!this.userEmail) return false;

  // 正規表達式說明：
  // ^[^@]+ ➔ 開頭必須有使用者名稱，且不能是 @ 符號
  // @      ➔ 中間必須有一個 @
  // .+     ➔ 學校的域名（例如 mail.ntu）
  // \.edu\.tw$ ➔ 結尾必須雷打不動是 .edu.tw
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.edu\.tw$/;

  return emailRegex.test(this.userEmail);
}

  //檢查email有沒有內容
  onEmailChange(){
    if (this.userEmail.length > 0) {
      // 只要裡面有字，不管滑鼠有沒有點出來，直接強制拉響安檢機關！
      this.isEmailTouched = true;
    } else {
      // 貼心體驗：如果使用者把字刪光了，畫面就退回最初乾淨的模樣（灰色提示字）
      this.isEmailTouched = false;
    }
  }



  /* 註冊步驟 */

  currentStep = 1;// 用來控制目前註冊走到第幾步（預設是第 1 步）

  // 點擊「下一步：發送驗證信」時觸發的方法
  onNextStep(){
    // 這裡可以寫你們原本的前端驗證或呼叫後端 API

    this.isEmailTouched = true;// 強制讓 Email 亮起「碰過」的狀態

   if (this.registerForm.valid && this.isValidSchoolEmail()) {
      // 資料都填對了，切換到 Step 2 畫面！
      const finalRegisterData = {
        name: this.registerForm.get('name')?.value,
        area: this.registerForm.get('area')?.value,
        school: this.registerForm.get('school')?.value,
        email: this.userEmail,
        password: this.registerForm.get('password')?.value,
        phone: this.registerForm.get('phone')?.value
      };
      console.log('【精準打包】格式全面通關：', finalRegisterData);
      this.currentStep = 2;
    } else {
      // 如果沒填好，逼迫格子噴出紅字錯誤提示
      this.registerForm.markAllAsTouched();
        Swal.fire({
      title: "註冊失敗",
      text: "欄位還沒填寫完整，或者 Email 格式不正確喔！",
      icon: "warning",
      confirmButtonText: "回到表單檢查", // 貼心的按鈕文字
      confirmButtonColor: '#FB831D',
      draggable: true
      });
    }
  }

  /* 驗證碼 */
  // 檢查有沒有乖乖填滿 6 位數字
  isValidCode(): boolean {
    return /^[0-9]{6}$/.test(this.verificationCode);
  }

  // 點擊確認驗證
  onVerifyCode() {
    this.isCodeTouched = true;

    if (this.isValidCode()) {
      // Demo 測試用：如果是 455328 就過關
      if (this.verificationCode === '455328') {
        this.currentStep = 3; // 直接進入成功畫面
        Swal.fire({
          title: '驗證成功！',
          text: '歡迎加入二手GO!',
          icon: 'success',
          confirmButtonColor: '#ffb74d', // 配合你們按鈕的鵝黃色
          timer: 3000,
          showConfirmButton: false
        });
      } else {
        Swal.fire({
          icon: 'error',               // 紅色驚嘆號/打叉動畫
          title: '驗證失敗...',         // 大標題
          text: '您輸入的驗證碼不正確，請重新確認郵件！', // 內容細節
          confirmButtonText: '重新輸入', // 把按鈕文字變親切
          confirmButtonColor: '#e57373',
          // footer: '<a href="#">沒收到驗證信？點我重新發送</a>' // 💡 未來有需要也可以加底部的點選連結喔！
        });
        this.verificationCode = ''; // 清空讓使用者重打
      }
    }
    /* // ==========================================
    // 🌟 情境 B：未來與 Java 後端同學對接時（真正上線版）
    // ==========================================
    const verifyPayload = {
      email: this.userEmail,       // Step 1 留下來的學校信箱
      code: this.verificationCode  // 使用者剛剛打的 6 位數
    };

    // 呼叫你的 HttpClient 服務傳給 Java
    this.authService.verifyEmail(verifyPayload).subscribe({
      next: (response) => {
        // Java 回報成功（status 變成 true 了）
        this.currentStep = 3;
      },
      error: (err) => {
        // Java 回報驗證碼打錯或過期
        alert(err.error.message || '驗證失敗，請重新確認');
        this.verificationCode = '';
      }
    });
    */
  }

    // 點擊「驗證完成，請重新登入」
  goToLogin(){
    this.currentStep = 1;  // 1. 先把註冊進度悄悄重置回第 1 步，這樣下次點註冊時才不會畫面卡在第 2 步
    this.isRegister = false;   // 2. 切換你原本用來控製登入/註冊的 if-else 變數（把它設為 false 觸發登入畫面）
  }

  // 點擊「重新發送驗證信」
  resendEmail(){
    // 防呆：如果目前還在冷卻時間內，直接攔截不執行
    if (!this.canResend) return;

    Swal.fire({
  title: "驗證信已重新發送，請檢查您的學校信箱！",
  icon: "success",
  confirmButtonColor: '#5E9759',
  draggable: true
  });
    // 這裡未來可以放呼叫後端重發信件的 API
    // this.authService.resendEmail(this.userEmail).subscribe();

    // 2. 啟動倒數冷卻機制
    this.startCountdown(60);
  }

  private startCountdown(seconds: number){
    this.countdown.set(seconds);
    this.canResend = false; // 進入冷卻狀態，按鈕鎖起來

    // 如果原本有殘留的計時器，先清除確保安全
    if (this.timer) {
      clearInterval(this.timer);
    }

    // 每一秒鐘進來執行一次
    this.timer = setInterval(() => {
      this.countdown.update(val => val - 1);

      if (this.countdown() <= 0) {
        // 秒數歸零，解除封印
        this.canResend = true;
        clearInterval(this.timer); // 停止計時器
      }
    }, 1000);

  }

  // 貼心防呆：如果組件被銷毀（例如使用者切換頁面或登入成功離開）
  // 記得把背景計時器關掉，記憶體才不會洩漏（Memory Leak）
  ngOnDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  /* 手機格式 */
  onPhoneInput(event: any) {
  // 1. 取得使用者目前的輸入值
  let value = event.target.value;

  // 2. 移除非數字的字元（防止使用者自己亂輸入符號）
  value = value.replace(/\D/g, '');

  // 3. 如果長度大於 2，自動在第 2 碼後面插入破折號 '-'
  if (value.length > 2) {
    value = value.substring(0, 2) + '-' + value.substring(2);
  }

  // 4. 將格式化後的字串塞回表單欄位中
  this.registerForm.get('phone')?.setValue(value, { emitEvent: false });
}

  /* 登入按鈕 */
  onLogin(){
    if(this.loginForm.valid){
      const loginData = {
        email: this.loginForm.get('email')?.value,
        password: this.loginForm.get('password')?.value
      };
      console.log('【登入打包】準備送給後端驗證：', loginData);

    // 接下來就是呼叫後端 API 驗證登入...

       this.router.navigate(['/home'])
    }else{
      // 沒填對就集體炸開紅字紅框！
    this.loginForm.markAllAsTouched();
    }
  }

  /* 回首頁 */
  gotoHome(){
     this.router.navigate(['/home'])
  }



  // 建立一個防呆驗證器：確保輸入的值必須在指定的官方清單陣列裡
isInListValidator(validOptions: string[]): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const value = control.value;

    // 如果使用者還沒填（留空），讓 required 驗證器去抓，這裡先回傳 null (放行)
    if (!value) return null;

    // 檢查使用者輸入的字，有沒有在我們的官方清單陣列中（精確比對）
    const isValid = validOptions.includes(value);

    // 如果不在清單內，就打上 'notInList' 的錯誤標籤；如果在，就回傳 null (沒錯誤)
    return isValid ? null : { 'notInList': true };
  };
}

}
