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
    panelState[panel] = !panelState[panel];
  }

  closeAll(panelState: Record<string, boolean>): void {

    Object.keys(panelState).forEach(key => {

      panelState[key] = false;

    });

  }
}
