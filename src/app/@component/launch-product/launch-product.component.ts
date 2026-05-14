import { Component } from '@angular/core';

@Component({
  selector: 'app-launch-product',
  imports: [],
  templateUrl: './launch-product.component.html',
  styleUrl: './launch-product.component.scss'
})
export class LaunchProductComponent {

    //activeStep的部分 暫存
    activeStep = 1; // 預設第一步是 active

  setStep(step: number): void {
    this.activeStep = step;
  }

}
