import { NgFor, NgIf} from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LaunchProductFormService } from '../../@Services/launch-product-form.service';

// interface SubCatMap { [key: string]: string[]; }
// interface SchoolMap { [key: string]: string[]; }
// interface DeptMap { [key: string]: string[]; }

const API_MODEL = 'claude-sonnet-4-20250514';

//常數
// const SUB_CATS: SubCatMap = {
//   '書籍': ['教科書', '講義', '小說', '雜誌', '其他'],
//   '科系用品': ['繪圖工具', '實驗器材', '文具', '其他'],
//   '生活用品': ['廚具', '清潔', '收納', '其他'],
//   '3C電子': ['手機', '筆電', '平板', '耳機', '相機', '其他'],
//   '家具家電': ['桌椅', '燈具', '冰箱', '洗衣機', '其他'],
//   '其他': ['其他'],
// };


// const SCHOOL_DATA: SchoolMap = {
//   '北部地區': ['台灣大學', '政治大學', '台北科技大學'],
//   '中部地區': ['中興大學', '逢甲大學', '東海大學'],
//   '南部地區': ['成功大學', '中山大學', '高雄科技大學']
// };

// const DEPT_DATA: DeptMap = {
//   '台灣大學': ['資訊工程學系', '工商管理學系', '外國語文學系'],
//   '政治大學': ['新聞學系', '法律學系', '風險管理學系'],
//   '成功大學': ['機械工程學系', '建築學系', '系統及船舶機電工程學系'],
// };

@Component({
  selector: 'app-launch-product-info',
  imports: [NgFor, NgIf, FormsModule],
  templateUrl: './launch-product-info.component.html',
  styleUrl: './launch-product-info.component.scss'
})
export class LaunchProductInfoComponent{

  // 從 Service 取得共用 state
  get state() { return this.formService.state; }

  // 屬性：下拉選單選取項陣列
  catOptions = ['教科書', '專業器材', '生活用品', '3C電子', '家具家電', '筆記考古', '服飾配件', '戶外運動', '畢業季'];
  // catOptions = Object.keys(SUB_CATS);
  regionOptions = ['01 基隆市','02 台北市','03 新北市','04 桃園縣','05 新竹市','06 新竹縣','07 苗栗縣',
                   '08 台中市','09 彰化縣','10 南投縣','11 雲林縣','12 嘉義市','13 嘉義縣','14 台南市',
                   '15 高雄市','16 屏東縣','17 台東縣','18 花蓮縣','19 宜蘭縣','20 澎湖縣','21 金門縣','22 連江縣'];
  // schoolOptions: string[] = [];
  // deptOptions: string[] = [];
  // subCats: string[] = [];

  // 年級清單
  gradeList: string[] = ['不拘','大一', '大二', '大三', '大四', '碩士', '博士'];

  isNextDisabled = true;

  // ── Toast ──
  toastText = '';
  toastVisible = false;
  private toastTimer: any;

  constructor(
    private router: Router,
    private formService: LaunchProductFormService,
  ) {}

  // ngOnInit(): void {
  //   // 還原主分類對應的子分類
  //   if (this.state.region) this.schoolOptions = SCHOOL_DATA[this.state.region] ?? [];
  //   if (this.state.school) this.deptOptions = DEPT_DATA[this.state.school] ?? ['一般科系', '其他學系'];
  //   // if (this.state.catMain) this.subCats = SUB_CATS[this.state.catMain] ?? [];
  //   this.updateNextButton();
  // }

  // ── 核心驗證：加入地區、學校、科系判定 ──
  isStep1Valid(): boolean {
    return (
      this.state.region !== '' &&
      this.state.grades.length > 0 &&
      this.state.catMain !== '' &&
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
    this.updateNextButton();
  }

  // onSchoolChange(event: Event): void {
  //   const value = (event.target as HTMLSelectElement).value;
  //   this.state.school = value;
  //   this.deptOptions = DEPT_DATA[value] ?? ['資訊管理系', '企業管理系', '電機工程系', '其他學系'];

  //   // 重設下游選單
  //   this.state.department = '';
  //   this.updateNextButton();
  // }

  // onDeptChange(event: Event): void {
  //   this.state.department = (event.target as HTMLSelectElement).value;
  //   this.updateNextButton();
  // }

  onLocationInput(event: Event): void {
    this.state.location = (event.target as HTMLInputElement).value;
  }

  // ── Checkbox 複選處理 ──
  onGradeChange(event: Event, grade: string): void {
    const checked = (event.target as HTMLInputElement).checked;

    if (checked) {
      if (grade === '不拘') {
        // 如果選了「不拘」，直接清空其餘選項，只保留不拘
        this.state.grades = ['不拘'];
      } else {
        // 如果選了常規年級，先剔除「不拘」再加入新勾選項
        const filtered = this.state.grades.filter(g => g !== '不拘');
        this.state.grades = [...filtered, grade];
      }
    } else {
      this.state.grades = this.state.grades.filter(g => g !== grade);
    }
    this.updateNextButton();
  }

  // ── 以下維持原先分類與價格邏輯 ──
  onCatMainChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.state.catMain = value;
    // this.subCats = SUB_CATS[value] ?? [];
    // this.state.catSub = '';
    this.updateNextButton();
  }

  // onCatSubChange(event: Event): void {
  //   this.state.catSub = (event.target as HTMLSelectElement).value;
  // }

  onConditionChange(event: Event): void {
    this.state.condition = (event.target as HTMLSelectElement).value;
    this.updateNextButton();
  }

  onPriceInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.state.price = value ? Number(value) : 0;
    this.updateNextButton();
  }


  showToast(msg: string): void {
    this.toastText = msg;
    this.toastVisible = true;
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => { this.toastVisible = false; }, 1500);
  }

  onNextClick(): void {
    if (this.isNextDisabled) return;
    this.router.navigate(['/launch_product_price']);
  }

}
