import { Component } from '@angular/core';
import { WebSocketService } from './services/web-socket.service';
import { PlayerSocketService } from './services/player-socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'clientSockets';

  constructor(private wsocket:WebSocketService, private playerserv:PlayerSocketService){
    wsocket.connect().then(
      id => { 
        console.log("Connected to ws server");
        // this.socket.on('user-id', data => console.log(`Received ID: ${data} - ClientID ${this.socket.id}`));
        // console.log('ID: ', id)
        this.playerserv.playerId = id;
      },
      rejected => console.log("rejected")
    )
  }
}
