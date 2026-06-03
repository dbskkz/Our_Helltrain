import { NgFor, NgIf} from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LaunchProductFormService } from '../../@Services/launch-product-form.service';



@Component({
  selector: 'app-launch-product-info',
  imports: [NgFor, NgIf,FormsModule],
  templateUrl: './launch-product-info.component.html',
  styleUrl: './launch-product-info.component.scss'
})
export class LaunchProductInfoComponent implements OnInit{

  // 從 Service 取得共用 state
  get state() { return this.formService.state; }

  // 屬性：下拉選單選取項陣列
  catOptions = ['教科書', '專業器材', '生活用品', '3C電子', '家具家電', '筆記考古', '服飾配件', '戶外運動', '畢業季'];
  regionOptions = ['基隆市','台北市','新北市','桃園縣','新竹市','新竹縣','苗栗縣',
                   '台中市','彰化縣','南投縣','雲林縣','嘉義市','嘉義縣','台南市',
                   '高雄市','屏東縣','台東縣','花蓮縣','宜蘭縣','澎湖縣','金門縣','連江縣'];
  customCatInput = '';

  // 年級清單
  gradeList: string[] = ['大一', '大二', '大三', '大四以上', '碩士', '博士', '不分年級'];

  isNextDisabled = true;

  //點選沒填會亮紅邊
  touched = {
    region: false,
    grades: false,
    catMain: false,
    condition: false,
  };

  // ── Toast ──
  toastText = '';
  toastVisible = false;
  private toastTimer: any;

  constructor(
    private router: Router,
    private formService: LaunchProductFormService,
  ) {}

  ngOnInit(): void {
    //還原主分類對應的子分類
    this.updateNextButton();
  }

  // ── 核心驗證：加入地區判定 ──
  isStep1Valid(): boolean {
    return (
      this.state.region !== '' &&
      this.state.grades.length > 0 &&
      this.state.catMain !== '' &&
       this.state.catMain !== '__custom__' &&  // 避免只選了radio但沒輸入
      this.state.condition !== ''
    );
  }

  updateNextButton(): void {
    this.isNextDisabled = !this.isStep1Valid();
  }

  // ── 三級連動變更事件 ──
  onRegionChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.state.region = value;
    this.touched.region = true;
    this.updateNextButton();
  }

 //額外地區 Checkbox
 onLocationRegionChange(event: Event, region: string): void {
  const checked = (event.target as HTMLInputElement).checked;
  if (checked) {
    this.state.locationRegions = [...this.state.locationRegions , region];
  } else {
    this.state.locationRegions = this.state.locationRegions.filter(r => r !== region);
  }
}

  // ── 年級 Checkbox 複選處理 ──
  onGradeChange(event: Event, grade: string): void {
    const checked = (event.target as HTMLInputElement).checked;

    if (checked) {
      if (grade === '不分年級') {
        // 如果選了「不分年級」，直接清空其餘選項，只保留不分年級
        this.state.grades = ['不分年級'];
      } else {
        // 如果選了常規年級，先剔除「不分年級」再加入新勾選項
        const filtered = this.state.grades.filter(g => g !== '不分年級');
        this.state.grades = [...filtered, grade];
      }
    } else {
      this.state.grades = this.state.grades.filter(g => g !== grade);
    }
    this.touched.grades = true;
    this.updateNextButton();
  }

  //分類
  onCatMainChange(event: Event, cat: string): void {
  this.state.catMain = cat;
  this.customCatInput = '';
  this.touched.catMain = true;
  this.updateNextButton();
}

onAddCatRadioSelect(): void {
  this.state.catMain = '__custom__';
  this.touched.catMain = true;
  this.updateNextButton();
}

isCustomCat(): boolean {
  return this.state.catMain !== '' &&
         this.state.catMain !== '__custom__' &&
         !this.catOptions.includes(this.state.catMain);
}

onCustomCatInput(): void {
  this.state.catMain = this.customCatInput.trim() || '__custom__';
  this.updateNextButton();
}

  onConditionChange(event: Event): void {
    this.state.condition = (event.target as HTMLSelectElement).value;
    this.touched.condition = true;
    this.updateNextButton();
  }

  onPriceInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.state.price = value ? Number(value) : 0;
    this.updateNextButton();
  }

  // 儲存草稿
  onSaveDraft(): void {
  this.formService.saveDraft();
  this.showToast('✓ 草稿已儲存');
}

onNewProduct(): void {
  this.formService.resetState(); // 確保 currentDraftId 被清掉
  this.router.navigate(['/launch_product_info']);
}

  // 下一步
  onNextClick(): void {
    if (this.isNextDisabled) return;
    this.router.navigate(['/launch_product_price']);
  }

  showToast(msg: string): void {
    this.toastText = msg;
    this.toastVisible = true;
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => { this.toastVisible = false; }, 1500);
  }

}
