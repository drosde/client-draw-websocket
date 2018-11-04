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

  constructor(
    private chatservice:ChatService, private drawservice:DrawSocketService,
    private drawHelper:DrawHelperService, private playerserv:PlayerSocketService
  ) { }

  ngOnInit() {
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
    this.playerserv.getInitialUsers().subscribe(data => {
      // this.usersRoom = [...new Set([...data ,...this.usersRoom])];
      this.usersRoom = data;
    });

    this.playerserv.drawerUpdates().subscribe(data => {
      console.log('drawer updates', data);
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
}
