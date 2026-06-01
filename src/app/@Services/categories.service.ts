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
    { icon: Book, label: '教科書', value: 'books' },
    { icon: Box, label: '專業器材', value: 'equipment' },
    { icon: Handbag, label: '生活用品', value: 'daily' },
    { icon: Smartphone, label: '3C電子', value: 'electronics' },
    { icon: Armchair, label: '家具家電', value: 'furniture' },
    { icon: NotebookText, label: '筆記考古', value: 'notes' },
    { icon: Shirt, label: '服飾配件', value: 'fashion' },
    { icon: BicepsFlexed, label: '戶外運動', value: 'sports' },
    { icon: GraduationCap, label: '畢業季', value: 'graduation' },
  ];

  conditions = [
    { label: '全新', value: 'brandNew' },
    { label: '近全新', value: 'likeNew' },
    { label: '輕度使用', value: 'lightlyUsed' },
    { label: '中度使用', value: 'moderatelyUsed' },
    { label: '重度使用', value: 'heavilyUsed' }
  ];

}
