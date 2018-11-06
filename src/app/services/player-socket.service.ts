import { Injectable } from '@angular/core';
import { WebSocketService } from './web-socket.service';
import { Observable } from 'rxjs/Observable';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class PlayerSocketService {

  player:User;
  playerId: string;
  
  constructor(private wssocket:WebSocketService) { }

  /**
   * RETURN EVERY NEW USER THAT CONNECTS TO THIS ROOM
   */
  newUserConnected(): Observable<any>{
    let observable = new Observable(observer => {
      this.wssocket.socket.on('user-connected-room', (data) => {
        observer.next(data);
      })

      // unsubscribe
      return () => {
        if(this.wssocket.socket.hasListeners('user-connected-room')){
          this.wssocket.socket.removeEventListener('user-connected-room');
        }
      }
    });

    return observable;
  }

  /**
   * RETURN INITIAL INFO. WHEN YOU JOIN A ROOM
   */
  getRoomInfo(): Observable<any>{
    let observable = new Observable(observer => {
      this.wssocket.socket.on('room-info', (data) => {
        observer.next(data);
      })

      // unsubscribe
      return () => {
        if(this.wssocket.socket.hasListeners('room-info')){
          this.wssocket.socket.removeEventListener('room-info');
        }
      }
    });

    return observable;
  }

  /**
   * RETURN GAME POINTS UPDATES
   */
  pointsUpdates(): Observable<any>{
    let observable = new Observable(observer => {
      this.wssocket.socket.on('game-points-update', (data) => {
        observer.next(data);
      })

      // unsubscribe
      return () => {
        if(this.wssocket.socket.hasListeners('game-points-update')){
          this.wssocket.socket.removeEventListener('game-points-update');
        }
      }
    });

    return observable;
  }

  /**
   * RETURN GAME DAVINCI UPDATES
   */
  newDavinciUpdate(): Observable<any>{
    let observable = new Observable(observer => {
      this.wssocket.socket.on('game-davinci-update', (data) => {
        observer.next(data);
      })

      // unsubscribe
      return () => {
        if(this.wssocket.socket.hasListeners('game-davinci-update')){
          this.wssocket.socket.removeEventListener('game-davinci-update');
        }
      }
    });

    return observable;
  }

  /**
   * RETURN GAME WORDHINTS UPDATES
   */
  wordHintsUpdates(): Observable<any>{
    let observable = new Observable(observer => {
      this.wssocket.socket.on('game-word-update', (data) => {
        observer.next(data);
      })

      // unsubscribe
      return () => {
        if(this.wssocket.socket.hasListeners('game-word-update')){
          this.wssocket.socket.removeEventListener('game-word-update');
        }
      }
    });

    return observable;
  }

  sendSomething(data){
    let payload = {
      points: data,
    }

    return this.wssocket.socket.emit('drawed-data', payload)
  }
}
