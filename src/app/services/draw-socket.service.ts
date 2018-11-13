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

  subClearCanvas(): Observable<any>{
    let observable = new Observable(observer => {
      this.wssocket.socket.on('game-clear-canvas', (data) => {
        observer.next(data);
      })

      // unsubscribe
      return () => {
        if(this.wssocket.socket.hasListeners('game-clear-canvas')){
          this.wssocket.socket.removeEventListener('game-clear-canvas');
        }
      }
    });

    return observable;
  }

  subChangeColor(): Observable<any>{
    let observable = new Observable(observer => {
      this.wssocket.socket.on('game-change-color', (data) => {
        observer.next(data);
      })

      // unsubscribe
      return () => {
        if(this.wssocket.socket.hasListeners('game-change-color')){
          this.wssocket.socket.removeEventListener('game-change-color');
        }
      }
    });

    return observable;
  }

  sendChangeColor(color, playerId){
    let payload = {
      id: playerId,
      color,
      room: this.wssocket.room
    }

    return this.wssocket.socket.emit('game-change-color', payload)
  }

  sendDrawedData(data, playerId){
    let payload = {
      id: playerId,
      points: data,
      room: this.wssocket.room
    }

    return this.wssocket.socket.emit('drawed-data', payload)
  }
  
  sendClearCanvas(playerId){
    let payload = {
      id: playerId,
      room: this.wssocket.room
    }

    return this.wssocket.socket.emit('game-clear-canvas', payload)
  }
}
