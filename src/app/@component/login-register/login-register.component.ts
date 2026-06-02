import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, OnInit, Output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { PlatformRulesComponent } from '../platform-rules/platform-rules.component';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { map, Observable, startWith } from 'rxjs';
import { Router } from '@angular/router';
import { SchoolDataService } from '../../@Services/school-data.service';
import Swal from 'sweetalert2';
import { ValidatorFn } from '@angular/forms';

//佩霖寫的
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../@Services/user.service';

// 絲絨的
import { ApiTestService } from './../../@Services/api-test.service';

@Component({
  selector: 'app-login-register',
  imports: [MatDialogModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatIconModule, ReactiveFormsModule, FormsModule,
    MatAutocompleteModule, AsyncPipe],
  templateUrl: './login-register.component.html',
  styleUrl: './login-register.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginRegisterComponent implements OnInit {

  // 注入 Material 的 Dialog 服務
  constructor(
    private dialog: MatDialog,
    private router: Router,
    private schoolService: SchoolDataService,
    private route: ActivatedRoute,
    private userService: UserService,
    private apiTestService: ApiTestService,
    private cdr: ChangeDetectorRef
  ) { }

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
  filteredSchools!: Observable<string[]> | undefined;


  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {
      this.isRegister = params['mode'] === 'register';
    }); // 佩霖寫的，處理路由

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
    this.registerForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.maxLength(20)]),
      area: new FormControl('', [Validators.required, this.isInListValidator('area')]),
      school: new FormControl('', [Validators.required, this.isInListValidator('school')]),
      //                新盒子                 必填     ,       長度檢查
      password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)]),
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
  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    if (!password || !confirmPassword) {
      return null;
    }
    if (confirmPassword.value && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ mismatch: true });
      return { passwordMismatch: true };
    } else {
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

    // 打開對話框
    const dialogRef = this.dialog.open(PlatformRulesComponent, {
      width: '550px',            // 稍微放大一點點，閱讀體驗更好
      disableClose: true,        // 關鍵防護：不允許點擊旁邊空白處關閉，強迫他看完按按鈕！
      autoFocus: false           // 防止進去直接滾動到按鈕
    });

    // 靈魂監聽：當使用者關閉這個彈出視窗時
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result === true) {
        // 🎯 使用者真的讀完了！自動幫表單的 agreeTerms 控制項打勾
        this.registerForm.get('agreeTerms')?.setValue(true);
        this.registerForm.get('agreeTerms')?.markAsDirty(); // 讓表單知道被改過了
      } else {
        // 如果他是點叉叉或沒看完就離開，確保維持不打勾
        this.registerForm.get('agreeTerms')?.setValue(false);
      }
    });

  }

  /* 專門控制「登入分頁」注意事項的彈出視窗方法 */
  openLoginTermsDialog(event: MouseEvent): void {
    event.preventDefault();  // 阻止原生直接勾選的行為
    event.stopPropagation();

    // 打開一模一樣的平台規範視窗
    const dialogRef = this.dialog.open(PlatformRulesComponent, {
      width: '500px',
      disableClose: true,    // 強制不能點旁邊關閉，一定要滑到最下面按確定
      autoFocus: false
    });

    // 監聽視窗關閉的結果
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result === true) {
        // 🎯 核心差別：讀完之後，自動打勾的對象換成【登入箱子（loginForm）】的 agreeTerms！
        this.loginForm.get('agreeTerms')?.setValue(true);
        this.loginForm.get('agreeTerms')?.markAsDirty();
      } else {
        // 沒看完或點取消，維持不打勾
        this.loginForm.get('agreeTerms')?.setValue(false);
      }
    });
  }

  /* 檢查 Email 的方法（回傳 true 或 false） */
  isValidSchoolEmail(): boolean {
    if (!this.userEmail) return false;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.edu\.tw$/;

    return emailRegex.test(this.userEmail);
  }

  //檢查email有沒有內容
  onEmailChange() {
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
  onNextStep() {
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
  goToLogin() {
    this.currentStep = 1;  // 1. 先把註冊進度悄悄重置回第 1 步，這樣下次點註冊時才不會畫面卡在第 2 步
    this.isRegister = false;   // 2. 切換你原本用來控製登入/註冊的 if-else 變數（把它設為 false 觸發登入畫面）
  }

  // 點擊「重新發送驗證信」
  resendEmail() {
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

  private startCountdown(seconds: number) {
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
  // 韻潔先別動拜託
  userInputLogin = ''
  isAgree = false;

  onLogin() {
    // if(this.loginForm.valid)
    const hasAgreed = this.loginForm.get('agreeTerms')?.value;

    // if (this.isValidLoginEmail() && hasAgreed) // 先隨便寫的，只要email格式正確就能登入 By.佩霖
    // {
    // const loginData = {
    //   email: this.loginForm.get('email')?.value,
    //   password: this.loginForm.get('password')?.value
    // };
    // console.log('【登入打包】準備送給後端驗證：', loginData);

    // 接下來就是呼叫後端 API 驗證登入...
    // this.userService.login(loginData.email, loginData.password).subscribe({
    //   next: (res) => {
    //     if (res.statusCode === 200) {
    //       this.router.navigate(['/home']);
    //     } else {
    //       Swal.fire({
    //         title: '登入失敗',
    //         text: res.message,
    //         icon: 'error',
    //         confirmButtonColor: '#e57373'
    //       });
    //     }
    //   },
    //   error: () => {
    //     Swal.fire({
    //       title: '連線錯誤',
    //       text: '請稍後再試',
    //       icon: 'error',
    //       confirmButtonColor: '#e57373'
    //     });
    //   }
    // });

    // this.userService.isLoggedIn.set(true);
    // localStorage.setItem('isLoggedIn', 'true');
    // this.gotoHome();
    // }
    // else {
    //   // 沒填對就集體炸開紅字紅框！
    //   console.log("帳密錯誤或未同意條款");

    //   this.loginForm.markAllAsTouched();
    // }

    if (this.loginForm.valid) { // 需要可以直接拿去用或者修改，我只是不太敢動別人的程式碼。by.絲絨
      let loginReq = this.loginForm.value;

      // 呼叫 Service 並把參數傳進去
      this.userService.login(loginReq).subscribe({
        next: (res) => {
          this.userService.isLoggedIn.set(true);
          localStorage.setItem('isLoggedIn', 'true');
          if (res.data) { // 未來如果改token動這裡
            localStorage.setItem('userId', res.data.userId.toString());
            this.userService.currentUser.set(res.data);
          }
          console.log('成功取得資料：', res);
          this.router.navigate(['/home']);
        },
        error: (err) => {
          console.error('失敗：', err);
          this.loginForm.markAllAsTouched();
          const status = err?.statusCode;

          if (status === 400) {
            Swal.fire({
              title: '登入失敗',
              text: '帳號或密碼錯誤',
              icon: 'error',
              confirmButtonColor: '#e57373'
            });
          } else if (err.message === 'Please verify' || err.message === 'Verification is invalid') {
            Swal.fire({
              title: '尚未驗證或驗證已過期',
              text: '請驗證後再試',
              icon: 'error',
              confirmButtonColor: '#e57373'
            });
            this.currentStep = 2;
            console.log('【除錯】目前的 currentStep 已經變成：', this.currentStep);
            this.cdr.detectChanges();
          } else {
            Swal.fire({
              title: '連線錯誤',
              text: '請稍後再試',
              icon: 'error',
              confirmButtonColor: '#e57373'
            });
          }
        }
      });
    }
  }

  // 先隨便寫的，只要使用者input的email格式正確就能登入 By.佩霖
  isValidLoginEmail(): boolean {
    if (!this.userInputLogin) return false;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.edu\.tw$/;
    return emailRegex.test(this.userInputLogin);
  }

  /* 回首頁 */
  gotoHome() {
    this.router.navigate(['/home'])
  }



  // 建立一個防呆驗證器：確保輸入的值必須在指定的官方清單陣列裡
  isInListValidator(type: 'school' | 'area'): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;

      // 如果使用者還沒填（留空），讓 required 驗證器去抓，這裡先放行
      if (!value) return null;

      // 💥 核心修正：每一次比對的當下，才即時跟 Service 拿名單，絕不在初始化時定死
      let validOptions: string[] = [];
      if (type === 'school') {
        validOptions = this.schoolService.allFlattenedSchools() || [];
      } else if (type === 'area') {
        validOptions = this.schoolService.allRegions() || [];
      }

      // 防呆機制：如果 Service 剛好在重新加載、名單暫時為空，先寬容放行，避免前端直接卡死
      if (validOptions.length === 0) return null;

      // 🧑‍🎨 設計師精細比對：順手把台轉臺、去空白、轉小寫做進去，確保使用者體驗完美
      const cleanValue = value.trim().toLowerCase().replace(/台/g, '臺');
      const isValid = validOptions.some(
        (opt) => opt.toLowerCase().replace(/台/g, '臺') === cleanValue
      );

      // 如果不在清單內，就打上 'notInList' 錯誤標籤
      return isValid ? null : { 'notInList': true };
    };
  }

}
