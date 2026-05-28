import { Injectable } from '@angular/core';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  // 後端 Spring Boot 的網址
  private apiUrl = 'http://localhost:8080/user';

  constructor(private htp: HttpService) { }


}
