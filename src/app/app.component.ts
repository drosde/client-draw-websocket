import { Component } from '@angular/core';
import { WebSocketService } from './services/web-socket.service';
import { ChatService } from './services/chat.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'clientSockets';

  constructor(private wsocket:WebSocketService, private chatservice:ChatService){
    wsocket.connect().then(
      data => { 
        console.log("Connected to ws server");
        this.chatservice.username = this.wsocket.socket.id;
      },
      rejected => console.log("rejected")
    )
  }
}
