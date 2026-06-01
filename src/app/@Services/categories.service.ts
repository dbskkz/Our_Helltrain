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

}
