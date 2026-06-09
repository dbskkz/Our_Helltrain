import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket!: Socket;

  constructor() {
    this.connectSocket();
  }
  private connectSocket() {
    if (!this.socket) {
      this.socket = io('http://localhost:9092', {
        transports: ['websocket'],
        forceNew: true, // 強制每次都建立乾淨的 websocket 通道
      });

    }
  }

  // 發送訊息給後端
  sendMessage(user: string, msg: string) {
    this.socket.emit('chatevent', { userName: user, message: msg });
  }

  // 監聽後端廣播回來的訊息
  getMessage(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('chatevent', (data: any) => {
        observer.next(data);
      });
    });
  }

}
