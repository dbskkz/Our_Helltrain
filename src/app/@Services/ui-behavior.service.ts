import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UiBehaviorService {

  constructor() { }

  // 點擊彈出視窗
  togglePanel
  (
    event:Event,
    panelState:Record<string, boolean>,
    panel:string
  )
  {
    event.stopPropagation();

    const isCurrentlyOpen = panelState[panel];

    // 先關掉所有 panel
    // Object.keys(panelState).forEach(key => {
    //   panelState[key] = false;
    // });

    // 再 toggle 目標 panel（如果本來是關的就打開，本來是開的就維持關）
    panelState[panel] = !isCurrentlyOpen;
  }

  // 關閉視窗
  closeAll(panelState: Record<string, boolean>): void {

    Object.keys(panelState).forEach(key => {

      panelState[key] = false;

    });

  }

}
