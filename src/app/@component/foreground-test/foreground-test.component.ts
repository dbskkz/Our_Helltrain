import { Component } from '@angular/core';
import { EduApiGovService } from '../../@Services/edu-api-gov.service';

@Component({
  selector: 'app-foreground-test',
  imports: [],
  templateUrl: './foreground-test.component.html',
  styleUrl: './foreground-test.component.scss'
})
export class ForegroundTestComponent {

  constructor(
    private eduApi : EduApiGovService
  ){

  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.eduApi.getData().subscribe(data => {

      console.log(Object.keys(data[0]));

    });

    // 實驗結論 : 政府網站沒有開 CORS ， 故無法使用 。
  }
}
