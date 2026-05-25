import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';

interface RegionMap {
  [region: string]: { [school: string]: string[] }
}

@Injectable({
  providedIn: 'root'
})
export class SchoolDataService {

  private http = inject(HttpClient);

  // 核心私有水庫：存放整張原始地圖
  private regionMap = signal<RegionMap>({});

  // 🌍 管線一：全台「縣市」名單 (如：["臺北市", "新北市"...])
  allRegions = computed(() => Object.keys(this.regionMap()));

  // 🏫 管線二：全台「純學校」不重複總名單
  allFlattenedSchools = computed(() => {
    const schoolSet = new Set<string>();
    const data = this.regionMap();
    for (const region in data) {
      for (const school in data[region]) {
        schoolSet.add(school);
      }
    }
    return Array.from(schoolSet).sort();
  });

  // 🧪 管線三：全台「純科系」不重複總名單
  allFlattenedDepartments = computed(() => {
    const deptSet = new Set<string>();
    const data = this.regionMap();
    for (const region in data) {
      for (const school in data[region]) {
        for (const dept of data[region][school]) {
          deptSet.add(dept);
        }
      }
    }
    return Array.from(deptSet).sort();
  });

  constructor() {
    // 🎯 初始化時自動載入，路徑直球對決，不需要加 public/
    this.http.get<RegionMap>('schools-with-departments.json').subscribe({
      next: (data) => {
        this.regionMap.set(data),
        console.log('【雷達回報】成功載入 JSON！所有的縣市 Key 為：', Object.keys(data));
      },
      error: (err) => console.error('共享資料庫載入失敗：', err)
    });
  }

  // 🛠️ 互動連動方法：輸入縣市，吐出該縣市的大學
  getSchoolsByRegion(region: string | null): string[] {
    if (!region || !this.regionMap()[region]) return [];
    return Object.keys(this.regionMap()[region]);
  }

  // 🛠️ 互動連動方法：輸入縣市與學校，吐出底下的科系
  getDepartmentsBySchool(region: string | null, school: string | null): string[] {
    if (!region || !school || !this.regionMap()[region]?.[school]) return [];
    return this.regionMap()[region][school];
  }
}
