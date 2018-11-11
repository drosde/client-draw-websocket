import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ChatComment } from '../../models/chatcomment';
import { ChatService } from '../../services/chat.service';
import { DrawSocketService } from '../../services/draw-socket.service';
import { DrawHelperService } from '../../services/draw-helper.service';
import { User } from 'src/app/models/user';
import { PlayerSocketService } from 'src/app/services/player-socket.service';
import { WebSocketService } from 'src/app/services/web-socket.service';

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

  wordHint:string = "_";
  word2draw:string;
  playerTurnID: string;

  constructor(
    private chatservice:ChatService, private wssocket:WebSocketService,
    private drawHelper:DrawHelperService, private playerserv:PlayerSocketService
  ) { }

  ngOnDestroy(){
    if(this.wssocket.room){
      this.setDrawingStatus(false);

      this.wssocket.socket.emit('leave-room', {room: this.wssocket.room});
      console.log('leaving room');
    } 
  }

  ngOnInit() {

    this.user = {
      username: this.chatservice.username,
      drawing: false,
      score: 0,
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
      if(this.usersRoom){
        let user = this.usersRoom.find(user => user.id == comm.author);  // find user with id
        
        let com:ChatComment = {
          author: user.username || "nn",
          content: comm.content
        };
        this.chatComments.push(com);
      }
    });

    // that
    this.playerserv.newUserConnOrLeave().subscribe(
      (data) => {
          if(data.type == "join"){
            console.log('New user connected!', data.user);
            this.usersRoom.push(data.user);
          }else if(data.type == "leave"){
            this.usersRoom = this.usersRoom.filter(user => user.id != data.id);
          }

          
          console.log('User just ' +data.type  + " the room");
      },
      (err:any) => console.error("Error al obtener nuevos usuarios", err)
    );

    // Get users when we connect to the ws server
    this.playerserv.getRoomInfo().subscribe(data => {
      // this.usersRoom = [...new Set([...data ,...this.usersRoom])];

      console.log('ROOM INFO', data);
      this.usersRoom = data.clients;
      this.playerTurnID = data.playerTurnID;

      this.wordHint = data.wordHint ? data.wordHint : "_".repeat(data.wordLength);
    });

    this.playerserv.newDavinciUpdate().subscribe(playerTurnID => {
      this.playerTurnID = playerTurnID;
      this.user.drawing = playerTurnID == this.playerserv.playerId;
      this.setDrawingStatus(this.user.drawing);
    });

    this.playerserv.scoreUpdate().subscribe(data => {
      let usertoUpdate = this.usersRoom.find(user => user.id == data.user);
      usertoUpdate.score = data.score;
    });

    this.playerserv.wordHintsUpdates().subscribe(
      (data) => {
        switch (data.type) {
          case "hint-update":
            this.wordHint = data.hint;
            break; 
          case 'word-2draw':
            this.wordHint = "_".repeat(data.word.length);
            this.word2draw = data.word;
            break; 
          case 'word-update':
            this.wordHint = "_".repeat(data.wordLength);;
            break;
          default:
            break;
        }
      },
      (err) => console.error(err));
  }

  sendComment(msg:string, event?:any) {
    if(event) event.preventDefault();

    msg = msg.trim();

    if(msg && msg.length > 0){
      let comm:ChatComment = {
        author: this.playerserv.playerId,
        content: msg
      }

      this.chatservice.sendComm(comm);

      this.comment = "";
    }
  }

  setDrawingStatus(status:boolean){
    this.drawHelper.isDavinci = status;
  }
}
