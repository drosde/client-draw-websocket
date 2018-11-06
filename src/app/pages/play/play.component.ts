import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ChatComment } from '../../models/chatcomment';
import { ChatService } from '../../services/chat.service';
import { DrawSocketService } from '../../services/draw-socket.service';
import { DrawHelperService } from '../../services/draw-helper.service';
import { User } from 'src/app/models/user';
import { PlayerSocketService } from 'src/app/services/player-socket.service';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss']
})

export class PlayComponent implements OnInit {
  @ViewChild('chatScroll') private chatScroll: ElementRef;

  chatComments: Array<ChatComment>;
  usersRoom: Array<User>;
  comment: string;
  chatElem: HTMLElement;
  user: User;

  wordHint:string = "H__A";
  playerTurnID: string;

  constructor(
    private chatservice:ChatService, private drawservice:DrawSocketService,
    private drawHelper:DrawHelperService, private playerserv:PlayerSocketService
  ) { }

  ngOnInit() {

    this.user = {
      username: this.chatservice.username,
      drawing: false,
      points: 0,
      id: this.playerserv.playerId
    }

    this.chatElem = document.querySelector('.chat');
    this.chatComments = [];
    this.usersRoom = [];

    this.setupSubscribers();

    let canvas = document.getElementById('main-canvas') as HTMLCanvasElement;
    this.drawHelper.setUp(canvas);
  }

  setupSubscribers(): any {  
    // Chat comments
    this.chatservice.getComms().subscribe(comm => {
      this.chatComments.push(comm);
    });

    // that
    this.playerserv.newUserConnected().subscribe(
      (user:User) => {
          console.log('New user connected!', user);
          this.usersRoom.push(user);
      },
      (err:any) => console.error("Error al obtener nuevos usuarios", err)
    );

    // Get users when we connect to the ws server
    this.playerserv.getRoomInfo().subscribe(data => {
      // this.usersRoom = [...new Set([...data ,...this.usersRoom])];

      console.log('ROOM INFO', data);
      this.usersRoom = data.clients;
      this.playerTurnID = data.playerTurnID;

      // let me = this.usersRoom.find(user => user.id == this.playerserv.playerId);
      
      // // console.log('users:', {data, me, id: this.playerserv.playerId});
      
      // if(me && me.drawing) this.setDrawingStatus(true);
    });

    this.playerserv.newDavinciUpdate().subscribe(playerTurnID => {
      // console.log('davinci updates', {playerTurnID, myid:this.playerserv.playerId});
      this.playerTurnID = playerTurnID;
      this.user.drawing = playerTurnID == this.playerserv.playerId;
      this.setDrawingStatus(this.user.drawing);
    });

    this.playerserv.pointsUpdates().subscribe(data => {
      console.log('points update', data);
    });

    this.playerserv.wordHintsUpdates().subscribe(data => {
      console.log('word hints', data);
    })
  }

  sendComment(msg:string, event?:any) {
    // prevent default event
    if(event) event.preventDefault();

    msg = msg.trim();

    if(msg && msg.length > 0){
      let comm:ChatComment = {
        author: this.chatservice.username,
        content: msg
      }

      this.chatservice.sendComm(comm);

      this.comment = "";
    }
  }

  setDrawingStatus(status:boolean){
    this.drawHelper.isDavinci = status;
    console.log("Drawind status", this.drawHelper.isDavinci);
  }
}
