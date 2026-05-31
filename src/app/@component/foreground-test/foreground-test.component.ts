import { Component } from '@angular/core';
import { EduApiGovService } from '../../@Services/edu-api-gov.service';
import { GPSLocationService } from '../../@Services/gps-location.service';

@Component({
  selector: 'app-foreground-test',
  imports: [],
  templateUrl: './foreground-test.component.html',
  styleUrl: './foreground-test.component.scss'
})
export class ForegroundTestComponent {

  constructor(
    private eduApi : EduApiGovService,
    private gpsApi : GPSLocationService
  ){

  }
  ngOnInit(): void {
    // this.eduApi.getData().subscribe(data => {

    //   console.log(Object.keys(data[0]));

    // });

    // 實驗結論 : 政府網站沒有開 CORS ， 故無法使用 。


    this.getCurrentPosition();
    // 實驗結論 : chrome 和 MicroSoftEdge 可以正常使用

    // this.gpsExp();
  }

  // ========================================================================
  //  用 navigator geolocation API 取得經緯度
  // ========================================================================

  // getCurrentPosition(){
  //   // if ("geolocation" in navigator) {
  //   //   console.log(
  //   //     "/* geolocation is available */"
  //   //   );

  //   // } else {
  //   //   console.log(
  //   //     "/* geolocation IS NOT available */"
  //   //   );
  //   // }


  //   if ("geolocation" in navigator) {
  //     navigator.geolocation.getCurrentPosition((position) => {
  //       this.doSomething(position.coords.latitude, position.coords.longitude);
  //     });

  //     const watchID = navigator.geolocation.watchPosition((position) => {
  //       this.doSomething(position.coords.latitude, position.coords.longitude);
  //     });
  //   }

  // }

  // doSomething(lat:number, lon:number){
  //   console.log(lat, lon);
  // }

  // ========================================================================
  //  嘗試接 GoogleMap 提供的 API 取得縣市名稱
  // ========================================================================

  // gpsApi experiment
  // gpsExp(){
  //   this.gpsApi.getData().subscribe((res:any)=>{
  //     console.log(res);
  //   })
  // }


  // ========================================================================
  //  利用開源資料透過經緯度計算縣市名稱
  // ========================================================================


  cityName: string = '尚未定位';
  lat: number = 0;
  lng: number = 0;


  getCurrentPosition() {
    if (!('geolocation' in navigator)) {
      this.cityName = '裝置不支援定位';
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.doSomething(this.lat, this.lng);
      },
      (error) => {
        console.error('定位失敗', error);
        this.cityName = '定位失敗';
      }
    );
  }

  doSomething(lat: number, lng: number) {
    this.gpsApi.getCityName(lat, lng).subscribe(city => {
      this.cityName = city;
      console.log('所在縣市：', city);
    });
  }

}

