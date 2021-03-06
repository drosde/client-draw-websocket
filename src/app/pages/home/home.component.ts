import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { WebSocketService } from 'src/app/services/web-socket.service';
import { Router } from '@angular/router';
import { Message } from 'primeng/components/common/message';
import { ChatService } from 'src/app/services/chat.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  showLoading:boolean = false;
  username:string;
  usernameError:{error: boolean, msgs?: Message[]} = {error:false, msgs: []};
  
  constructor(
    private api:ApiService, private wssocket:WebSocketService,
    private router:Router, private chatservice:ChatService
  ) { }

  ngOnInit() {

    this.username = "player_" + Math.random().toString(36).substring(2);
  }

  play(){    
    this.usernameError.msgs = [];

    if(this.username && (this.username.length < 20 && this.username.length > 2)){
      this.usernameError.error = false;
      this.showLoading = true;
      this.chatservice.username = this.username;

      this.api.getRoom().subscribe((room:any) => {
        console.log("Sala:", room.availableRoom);
        this.wssocket.room = room.availableRoom;

        let payload = {username: this.username, room: room.availableRoom};
        this.wssocket.socket.emit('join-room', payload);
        
        this.showLoading = false;
        this.router.navigate(['/play']);
      }, 
      error => {
        this.showLoading = false;

        this.showError("No se pudo conectar con el servidor. Itente refrescando la página.");
      });
    }else{
      // Message Error
      let msg = (
        this.username ? 
          (this.username.length > 20 ? 'El nombre de usuario no puede tener mas de 20 caracteres' : '') +
          (this.username.length <= 2 ? 'El nombre de usuario tiene que tener mas de 2 caracteres' : '') 
          : 'Debes completar el campo "username"');

      this.showError(msg);
    }
  }

  showError(msg){    
    this.usernameError.error = true;
    this.usernameError.msgs.push({severity:'error', summary:'Error:', detail: msg});
  }
}
