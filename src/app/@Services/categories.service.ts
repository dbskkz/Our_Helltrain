import { Injectable } from '@angular/core';

import {
  Book,
  Box,
  Smartphone,
  Handbag,
  Armchair,
  GraduationCap,
  NotebookText,
  Shirt,
  BicepsFlexed
} from 'lucide-angular';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor() { }

  categories = [
    { icon: Book, label: '教科書', value: 'books', selected: false },
    { icon: Box, label: '專業器材', value: 'equipment', selected: false },
    { icon: Handbag, label: '生活用品', value: 'daily', selected: false },
    { icon: Smartphone, label: '3C電子', value: 'electronics', selected: false },
    { icon: Armchair, label: '家具家電', value: 'furniture', selected: false },
    { icon: NotebookText, label: '筆記考古', value: 'notes', selected: false },
    { icon: Shirt, label: '服飾配件', value: 'fashion', selected: false },
    { icon: BicepsFlexed, label: '戶外運動', value: 'sports', selected: false },
    { icon: GraduationCap, label: '畢業季', value: 'graduation', selected: false },
  ];

  conditions = [
    { label: '全新',   value: 'brandNew',       selected: false },
    { label: '近全新', value: 'likeNew',         selected: false },
    { label: '輕度使用', value: 'lightlyUsed',   selected: false },
    { label: '中度使用', value: 'moderatelyUsed', selected: false },
    { label: '重度使用', value: 'heavilyUsed',   selected: false },
  ];

  cities = [
    { id: 1,  name: '基隆市', selected: false },
    { id: 2,  name: '台北市', selected: false },
    { id: 3,  name: '新北市', selected: false },
    { id: 4,  name: '桃園縣', selected: false },
    { id: 5,  name: '新竹市', selected: false },
    { id: 6,  name: '新竹縣', selected: false },
    { id: 7,  name: '苗栗縣', selected: false },
    { id: 8,  name: '台中市', selected: false },
    { id: 9,  name: '彰化縣', selected: false },
    { id: 10, name: '南投縣', selected: false },
    { id: 11, name: '雲林縣', selected: false },
    { id: 12, name: '嘉義市', selected: false },
    { id: 13, name: '嘉義縣', selected: false },
    { id: 14, name: '台南市', selected: false },
    { id: 15, name: '高雄市', selected: false },
    { id: 16, name: '屏東縣', selected: false },
    { id: 17, name: '台東縣', selected: false },
    { id: 18, name: '花蓮縣', selected: false },
    { id: 19, name: '宜蘭縣', selected: false },
    { id: 20, name: '澎湖縣', selected: false },
    { id: 21, name: '金門縣', selected: false },
    { id: 22, name: '連江縣', selected: false }
  ];

}
