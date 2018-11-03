import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ChatComment } from '../../models/chatcomment';
import { ChatService } from '../../services/chat.service';
import { DrawSocketService } from '../../services/draw-socket.service';
import { DrawHelperService } from '../../services/draw-helper.service';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss']
})

export class PlayComponent implements OnInit {
  @ViewChild('chatScroll') private chatScroll: ElementRef;

  chatComments: Array<ChatComment>;
  comment:string;
  chatElem:HTMLElement;

  constructor(
    private chatservice:ChatService, private drawservice:DrawSocketService,
    private drawHelper:DrawHelperService
    ) { }

  ngOnInit() {
    this.chatElem = document.querySelector('.chat');
    this.chatComments = [];
    
    this.chatservice.getComms().subscribe(comm => {
      console.log("Comentario recibido", comm);
      this.chatComments.push(comm);

      // this.chatElem.scrollTop = this.chatElem.scrollHeight * 200 - this.chatElem.clientHeight;
    });

    let canvas = document.getElementById('main-canvas') as HTMLCanvasElement;
    this.drawHelper.setUp(canvas);
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
