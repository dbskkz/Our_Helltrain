import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';


interface RegionMap {
  [region: string]: { [school: string]: string[] }
}

//定義一個單純以「學校」為 Key 的對照表規格
interface SchoolToDeptMap {
  [school: string]: string[];
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

  // 將三級地圖打平成「學校 ➔ 科系陣列」的快取字典
  // 只要大水庫 regionMap() 一更新，這條管線就會在萬分之一秒內自動算好全台灣每間學校的科系！
  private schoolToDeptMap = computed<SchoolToDeptMap>(() => {
    const map: SchoolToDeptMap = {};
    const data = this.regionMap();

    for (const region in data) {
      for (const school in data[region]) {
        // 如果有不同的地區出現了同名的學校（例如都有某某高中/大學），就把科系合併進去
        if (!map[school]) {
          map[school] = [];
        }
        // 抓出科系塞入
        for (const dept of data[region][school]) {
          if (!map[school].includes(dept)) {
            map[school].push(dept);
          }
        }
      }
    }
    return map;
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

  // 🛠️ 互動連動方法：輸入[縣市]與[學校]，吐出底下的科系
  getDepartmentsBySchool(region: string | null, school: string | null): string[] {
    if (!region || !school || !this.regionMap()[region]?.[school]) return [];
    return this.regionMap()[region][school];
  }


  //完全不用管區域，只要給[學校]名字，吐出該校所有科系！
  getDepartmentsBySchoolOnly(school: string | null): string[] {
    if (!school) return [];

    // 直接去我們剛剛用 computed 算好的「學校 ➔ 科系」字典裡拿資料
    const depts = this.schoolToDeptMap()[school];
    return depts ? depts.sort() : [];
  }
}
