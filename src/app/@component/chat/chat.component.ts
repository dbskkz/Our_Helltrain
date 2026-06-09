import { UserService } from './../../@Services/user.service';
import { Component } from '@angular/core';
import { SocketService } from '../../@Services/socket.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  imports: [FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent {
  constructor(private socketService: SocketService,
    private userService: UserService,
  ) { }

  enter: string = '';
  userName: string = '怎麼會抓不到名字啊';
  message: any[] = [];

  ngOnInit(): void {

    this.userName = this.userService.currentUser()?.userName || '所以我說userService的名字呢？';
    this.socketService.getMessage().subscribe({
      next: (data: any) => {
        this.message.push(data);
      },
      error: (err) => console.error('Socket 接收失敗:', err)
    });
  }

  sendMsg() {
    if (!this.enter.trim()) return; // 防呆：沒打字就不送出

    // 發送訊息給後端（注意：Socket 發送通常是直接 emit，不需要 .subscribe）
    this.socketService.sendMessage(this.userName, this.enter);
    this.enter = '';
  }



}
