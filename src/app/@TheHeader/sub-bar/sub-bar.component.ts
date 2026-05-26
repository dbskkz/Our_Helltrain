import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-sub-bar',
  imports: [],
  templateUrl: './sub-bar.component.html',
  styleUrl: './sub-bar.component.scss'
})
export class SubBarComponent {
  @Output() outputClose = new EventEmitter<any>() // @Output()裝飾器 表示這是一個要輸出的事件

  isClose = false;

  closeBar()
  {
    this.outputClose.emit(this.isClose = true);
  }
}
