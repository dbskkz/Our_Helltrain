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
  constructor(private dialog: MatDialog, private router: Router) {}

  isRegister: boolean = false; //是否為註冊頁面
  userEmail: string = ''; //輸入的 Email
  isEmailTouched = false; //用來記錄使用者有沒有點過、或是按了下一步
  registerForm!: FormGroup; // 註冊的總管收納盒
  loginForm!: FormGroup; //登入的總管收納盒
  verificationCode = ''; // 驗證碼欄位
  isCodeTouched = false; // 驗證碼欄位有沒有點過

  // 專門控制「登入分頁」的密碼眼睛
  hideLoginPassword = signal<boolean>(true);

  // 用獨立的訊號控制「密碼」與「確認密碼」的眼睛，避免點一個兩個一起變
  hidePassword = signal<boolean>(true);
  hideConfirmPassword = signal<boolean>(true);

   /* 學校的下拉選單 */
  schoolOptions: string[] = ['台灣大學', '政治大學', '清華大學', '陽明交通大學', '成功大學', '中山大學', '高雄大學'];  // 1. 學校的資料庫來源
  filteredSchools!: Observable<string[]>| undefined;  // 2. 負責動態過濾的水管

  ngOnInit(): void {
    this.initRegisterForm(); // 呼叫註冊箱子初始化
    this.initLoginForm();  // 呼叫登入箱子初始化

    // 綁定學校過濾管線
    this.filteredSchools = this.setupFilter(
      this.registerForm.get('school') as FormControl,
      this.schoolOptions);
  }

  // (註冊箱子)把所有的欄位通通寫成變數
  private initRegisterForm() {
    this.registerForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    school: new FormControl('', [Validators.required]),
     //                新盒子                 必填     ,       長度檢查
    password: new FormControl('',[Validators.required, Validators.minLength(8)]),
    confirmPassword: new FormControl('', [Validators.required]),
    phone: new FormControl(''),
    agreeTerms: new FormControl(false, [Validators.requiredTrue]) //有沒有打勾(平台說明)
  }, {
    validators: this.passwordMatchValidator // 綁定下方比對密碼的方法
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

  // 處理學校關鍵字過濾的專屬水管
  private setupFilter(control: FormControl, options: string[]): Observable<string[]> {
    return control.valueChanges.pipe(
      startWith(control.value || ''),
      map(value => this._filter(value, options))
    );
  }

  // 負責執行比對的邏輯(學校關鍵字)
  private _filter(value: string, options: string[]): string[] {
    const filterValue = value.toLowerCase();
    return options.filter(opt => opt.toLowerCase().includes(filterValue));
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
      } else {
        alert('驗證碼錯誤，請重新輸入！');
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
    alert('驗證信已重新發送，請檢查您的學校信箱！');
    // 這裡未來可以放呼叫後端重發信件的 API
  }


  /* 登入按鈕 */
  onLogin(){
    if(this.loginForm.valid){
      const loginData = {
        email: this.loginForm.get('email')?.value,
        password: this.loginForm.get('paseword')?.value
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

}
