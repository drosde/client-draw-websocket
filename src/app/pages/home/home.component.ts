import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { WebSocketService } from 'src/app/services/web-socket.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private api:ApiService, private wssocket:WebSocketService) { }

  ngOnInit() {
    this.api.getRoom().subscribe((room:any) => {
      console.log("Sala:", room.availableRoom);
      this.wssocket.room = room.availableRoom;
      this.wssocket.socket.emit('join-room', room.availableRoom)
    }, e => console.error("Error al obtener una sala", e))
  }

}
