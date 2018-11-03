import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Observable';
import * as Rx from 'rxjs/Rx';
import { environment } from '../../environments/environment';

@Injectable()
export class WebSocketService {

  // Our socket connection
  public socket:SocketIOClient.Socket;

  constructor() { }

  connect(): Promise<boolean>{
    return new Promise<boolean>((resolve, reject) => {      
      this.socket = io(environment.ws_url);

      this.socket.on('connect', () => {
        resolve(true);
      });
    })
  }

  // connect(): Observable<any>{
  //   this.socket = io(environment.ws_url);

  //   let observable = new Observable(observer => {
  //     this.socket.on('connect', () => {
  //       console.log('conecta3');
  //       observer.next(this.socket.connected);
  //     });
  //     // unsubscribe
  //     return () => {
  //       if(this.socket.hasListeners('connect')){
  //         this.socket.removeEventListener('connect');
  //       }
  //     }
  //   });

  //   return observable;
  // }

  // connect(): Rx.Subject<MessageEvent> {
  //   // If you aren't familiar with environment variables then
  //   // you can hard code `environment.ws_url` as `http://localhost:5000`
  //   this.socket = io(environment.ws_url);

  //   // We define our observable which will observe any incoming messages
  //   // from our socket.io server.
  //   let observable = new Observable(observer => {
  //       // this.socket.on('drawed-data', (data) => {
  //       //   console.log("Received message from Websocket Server")
  //       //   observer.next(data);
  //       // })
  //       return () => {
  //         this.socket.disconnect();
  //       }
  //   });
    
  //   // We define our Observer which will listen to messages
  //   // from our other components and send messages back to our
  //   // socket server whenever the `next()` method is called.
  //   let observer = {
  //       next: (data: Object) => {
  //           this.socket.emit('drawed-data', JSON.stringify(data));
  //       },
  //   };

  //   // we return our Rx.Subject which is a combination
  //   // of both an observer and observable.
  //   return Rx.Subject.create(observer, observable);
  // }

  // getMessages(): Rx.Subject<MessageEvent>{
  //   let observable = new Observable(observer => {
  //     this.socket.on('drawed-data', (data) => {
  //       console.log("Received message from Websocket Server")
  //       observer.next(data);
  //     })
  //     return () => {
  //       this.socket.disconnect();
  //     }
  //   });

  //   let observer = {
  //     next: (data: Object) => {
  //         this.socket.emit('drawed-data', JSON.stringify(data));
  //     },
  //   };
    
  //   return Rx.Subject.create(observer, observable);
  // }
}