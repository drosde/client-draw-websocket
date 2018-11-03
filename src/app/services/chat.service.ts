import { Injectable } from '@angular/core';
import { WebSocketService } from './web-socket.service';
import { Observable } from 'rxjs/Rx';
import { ChatComment } from '../models/chatcomment';

@Injectable()
export class ChatService {
  
  messages: Array<ChatComment>;
  username:string;
  
  // Our constructor calls our wsService connect method
  constructor(private wsService: WebSocketService) {
    // wsService.socket.on('connected', () => {

    // })
  }

  sendComm(msg) {
    msg.room = this.wsService.room;
    this.wsService.socket.emit('chat-message', msg);
  }

  getComms(): Observable<any>{
    let observable = new Observable(observer => {
      this.wsService.socket.on('chat-message', (data:ChatComment) => observer.next(data))
      
      // unsubscribe
      return () => {
        if(this.wsService.socket.hasListeners('chat-message')){
          this.wsService.socket.removeEventListener('chat-message');
        }
      }
    });

    return observable;
  }
}