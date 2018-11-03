import { Component, OnInit } from '@angular/core';
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

  chatComments: Array<ChatComment>;
  comment:string;
  
  constructor(
    private chatservice:ChatService, private drawservice:DrawSocketService,
    private drawHelper:DrawHelperService
    ) { }

  ngOnInit() {
    this.chatComments = [
      {author: "carlitox", content: "hola"},
      {author: "cax", content: "hello"}
    ];
    
    this.chatservice.getComms().subscribe(comm => {
      console.log("Comentario recibido", comm);
      this.chatComments.push(comm);
    });

    let canvas = document.getElementById('main-canvas') as HTMLCanvasElement;
    this.drawHelper.setUp(canvas);
  }

  sendComment(msg:string) {
    if(this.comment && this.comment.length > 0){
      let comm:ChatComment = {
        author: this.chatservice.username,
        content: msg
      }

      this.chatservice.sendComm(comm);

      this.comment = "";
    }
  }
}
