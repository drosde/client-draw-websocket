import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { environment } from '../../environments/environment';

@Injectable()
export class WebSocketService {

  public socket:SocketIOClient.Socket;
  public room:string;

  constructor() { }

  connect(): Promise<string>{
    return new Promise<string>((resolve, reject) => {      
      this.socket = io(environment.ws_url);

      this.socket.on('connect', () => {
        // 
        resolve(this.socket.id);
      });
    })
  }
}