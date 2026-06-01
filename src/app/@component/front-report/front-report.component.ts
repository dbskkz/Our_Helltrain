import { Component, Inject, Optional } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import {
  LucideAngularModule,
  SendHorizontal,
  X,
  UploadIcon,
  Trash2,
} from 'lucide-angular';
import Swal from 'sweetalert2';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';
import { ReportDialogData } from '../../@Services/report.service';

@Component({
  selector: 'app-front-report',
  imports: [ReactiveFormsModule, LucideAngularModule, MatDialogModule],
  templateUrl: './front-report.component.html',
  styleUrl: './front-report.component.scss',
})
export class FrontReportComponent {
  constructor(
    // Optional 讓路由直接開啟時不會因為沒有 data 而報錯
    @Optional() @Inject(MAT_DIALOG_DATA) public dialogData: ReportDialogData,
    @Optional() private dialogRef: MatDialogRef<FrontReportComponent>,
  ) { }

  // Declare icon
  readonly SendHorizontal = SendHorizontal;
  readonly X = X;
  readonly UploadIcon = UploadIcon;
  readonly Trash2 = Trash2;

  reportForm!: FormGroup;
  errorMessage: string | null = null;

  // 圖片預覽（最多三張）
  imagePreviews: string[] = [];
  imageFiles: File[] = [];
  readonly MAX_IMAGES = 3;

  // 判斷是否從 Dialog 開啟（有注入 data 就是 Dialog 模式）
  get isDialogMode(): boolean {
    return !!this.dialogData;
  }

  // tabs
  currentTab = '檢舉商品'; // 預設選中
  tabsColumns: string[] = ['檢舉商品', '檢舉用戶'];

  changeTab(tabName: string) {
    this.currentTab = tabName;
  }

  // 檢舉原因
  reportColumns: string[] = [
    '面交未依約定時間到指定地點',
    '惡意刷評價（假好評/惡意差評）',
    '惡意取消訂單',
    '詐騙（釣魚連結、假客服）',
    '騷擾/威脅其他用戶',
    '盜用他人帳號',
    '其他',
  ];

  ngOnInit() {
    // 如果是 Dialog 模式，根據 type 決定預設 tab
    if (this.dialogData) {
      this.currentTab =
        this.dialogData.type === 'product' ? '檢舉商品' : '檢舉用戶';
    }

    this.reportForm = new FormGroup({
      accusedName: new FormControl(
        this.dialogData?.targetName || '', Validators.required,
      ), // 被檢舉者名稱
      accusedId: new FormControl(
        this.dialogData?.targetId || '', Validators.required,
      ), // 被檢舉者ID
      violationType: new FormControl('', Validators.required), // 檢舉類型
      description: new FormControl('', [
        Validators.required, Validators.minLength(10),
      ]), // 檢舉原因描述
      imageFile: new FormControl(null, [Validators.required]), // 圖片檔案欄位（預設為 null）
      productId: new FormControl(
        this.dialogData?.productId || ''     // 商品 ID（選填）
      ),
    });

    // 選「其他」時描述字數增加到 20 字
    this.reportForm.get('violationType')?.valueChanges.subscribe((selectedType) => {
      const descControl = this.reportForm.get('description');
      descControl?.setValidators([
        Validators.required,
        Validators.minLength(selectedType === '其他' ? 20 : 10),
      ])
      descControl?.updateValueAndValidity(); // 叫 Angular 重新驗證該欄位
    });
  }

  // 圖片上傳
  onFileSelected(event: Event) {
    this.errorMessage = null; // 清空先前的錯誤
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (!fileList || fileList.length === 0) return;

    const file = fileList[0];

    // 張數上限
    if (this.imageFiles.length >= this.MAX_IMAGES) {
      this.errorMessage = `最多只能上傳 ${this.MAX_IMAGES} 張圖片！`;
      return;
    }

    // 格式檢查
    if (!file.type.startsWith('image/')) {
      this.errorMessage = '請上傳正確的圖片格式（PNG, JPG, JPEG）！';
      return;
    }

    // 大小檢查（2MB）
    if (file.size > 2 * 1024 * 1024) {
      this.errorMessage = '檔案大小不能超過 2MB！';
      return;
    }

    // 存入陣列
    this.imageFiles.push(file);

    // 產生預覽
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreviews.push(reader.result as string);
    };
    reader.readAsDataURL(file);

    // 清空 input，讓同一張圖可以重複選
    element.value = '';
  }

  // 刪除指定圖片
  removeImage(index: number) {
    this.imagePreviews.splice(index, 1);
    this.imageFiles.splice(index, 1);
    this.errorMessage = null;
  }

  // 確認送出
  confirmSend() {
    if (this.reportForm.invalid || this.imageFiles.length === 0) {
      this.reportForm.markAllAsTouched();
      if (this.imageFiles.length === 0) {
        this.errorMessage = '請上傳至少一張圖片！';
      }
      return;
    }

    Swal.fire({
      title: '確認送出檢舉？',
      text: '確認後將無法撤回！',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '確認送出',
      cancelButtonText: '再想想',
    }).then((result) => {
      if (result.isConfirmed) {
        this.onSubmit();
      }
    });
  }

  // 取消
  cancel() {
    Swal.fire({
      title: '確定要取消嗎？',
      text: '填寫的內容將會清空',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: '確定取消',
      cancelButtonText: '繼續填寫',
    }).then((result) => {
      if (result.isConfirmed) {
        this.closeDialog();
      }
    });
  }

  // 送出表單
  onSubmit() {
    // 用 FormData 打包，後端用 MultipartFile 接
    const formData = new FormData();
    formData.append('accusedId', this.reportForm.get('accusedId')?.value);
    formData.append('description', this.reportForm.get('description')?.value);
    formData.append('violationType', this.reportForm.get('violationType')?.value);
    formData.append('type', this.currentTab === '檢舉商品' ? 'product' : 'user');

    // 商品 ID（商品檢舉才有）
    const productId = this.reportForm.get('productId')?.value;
    if (productId) formData.append('product_id', productId);

    // 多張圖片
    this.imageFiles.forEach((file) => {
      formData.append('images', file);  // 後端用 List<MultipartFile> images 接
    });
    console.log('FormData 已打包，準備發送 API');
    // 之後接 API：this.apiService.submitReport(formData).subscribe(...)

    Swal.fire({
      title: '檢舉已送出！',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false,
    }).then(() => {
      this.closeDialog();
    });
  }

  closeDialog() {
    if (this.isDialogMode) {
      this.dialogRef.close();
    } else {
      this.reportForm.reset();
      this.imagePreviews = [];
      this.imageFiles = [];
      this.errorMessage = null;
    }
  }
}
