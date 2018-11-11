import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { WebSocketService } from './web-socket.service';
import { ChatService } from './chat.service';

@Injectable({
  providedIn: 'root'
})
export class DrawSocketService {

  constructor(private wssocket:WebSocketService, private chatSv:ChatService) { }

  subscribeDraw(): Observable<any>{
    let observable = new Observable(observer => {
      this.wssocket.socket.on('drawed-data', (data) => {
        observer.next(data);
      })

      // unsubscribe
      return () => {
        if(this.wssocket.socket.hasListeners('drawed-data')){
          this.wssocket.socket.removeEventListener('drawed-data');
        }
      }
    });

    return observable;
  }

  sendDrawedData(data, playerId){
    let payload = {
      id: playerId,
      points: data,
      room: this.wssocket.room
    }

    return this.wssocket.socket.emit('drawed-data', payload)
  }
}
