import { UserService } from './../../@Services/user.service';
import { Component } from '@angular/core';
import { SocketService } from '../../@Services/socket.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DestroyRef, inject } from '@angular/core';

@Component({
  selector: 'app-chat',
  imports: [FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent {
  constructor(private socketService: SocketService,
    private userService: UserService,
    private router: Router,
  ) { }
  private destroyRef = inject(DestroyRef);

  enter: string = '';
  userName: string = '我恨非同步。';
  message: any[] = [];

  ngOnInit(): void {
    this.userName = this.userService.currentUser()?.userName || '所以我說userService的名字呢？';
    if (this.userName === '所以我說userService的名字呢？') {
      setTimeout(() => {
        this.userName = this.userService.currentUser()?.userName || '匿名訪客(F5補償)';
      }, 500); // 0.5 秒足夠讓本地後端 API 跑完了
    }

    this.socketService.getMessage().pipe(
      takeUntilDestroyed(this.destroyRef) // 元件死掉時自動退訂。
    ).subscribe({
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

  goToHome() {
    this.router.navigate(['/home']);
    window.scrollTo({ top: 0, behavior: 'auto' });
  }

}
