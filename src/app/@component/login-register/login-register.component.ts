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
  constructor(private dialog: MatDialog) {}

  isRegister: boolean = false; //是否為註冊頁面
  userEmail: string = ''; //輸入的 Email
  registerForm!: FormGroup; // 密碼與確認密碼的總管收納盒

  // 用獨立的訊號控制「密碼」與「確認密碼」的眼睛，避免點一個兩個一起變
  hidePassword = signal<boolean>(true);
  hideConfirmPassword = signal<boolean>(true);

   /* 學校的下拉選單 */
  schoolControl = new FormControl('');  // 註冊時學校預設是空的，讓使用者自己輸入
  schoolOptions: string[] = ['台灣大學', '政治大學', '清華大學', '陽明交通大學', '成功大學', '中山大學', '高雄大學'];  // 1. 學校的資料庫來源
  filteredSchools!: Observable<string[]>| undefined;  // 2. 負責動態過濾的水管

  ngOnInit(): void {
  // 初始化密碼收納盒的驗證規則
  this.registerForm = new FormGroup({
    //                新盒子                 必填     ,       長度檢查
    password: new FormControl('',[Validators.required, Validators.minLength(8)]),
    confirmPassword: new FormControl('', [Validators.required])
  }, {
    validators: this.passwordMatchValidator // 綁定下方比對密碼的方法
  })
  // 綁定學校過濾管線
    this.filteredSchools = this.setupFilter(this.schoolControl, this.schoolOptions);
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
    const password = control.get('passowed');
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

  /* 密碼的icon變化 */
   hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
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



  /* 註冊步驟 */

  currentStep = 1;// 用來控制目前註冊走到第幾步（預設是第 1 步）

  // 點擊「下一步：發送驗證信」時觸發的方法
  onNextStep(): void {
    // 這裡可以寫你們原本的前端驗證或呼叫後端 API
    this.currentStep = 2;   // 驗證成功後，將步驟切換到第 2 步
  }

  // 點擊「驗證完成，請重新登入」
  goToLogin(): void {
    this.currentStep = 1;  // 1. 先把註冊進度悄悄重置回第 1 步，這樣下次點註冊時才不會畫面卡在第 2 步
    this.isRegister = false;   // 2. 切換你原本用來控製登入/註冊的 if-else 變數（把它設為 false 觸發登入畫面）
  }

  // 點擊「重新發送驗證信」
  resendEmail(): void {
    alert('驗證信已重新發送，請檢查您的學校信箱！');
    // 這裡未來可以放呼叫後端重發信件的 API
  }

}
