import { Injectable } from '@angular/core';
import { DrawSocketService } from './draw-socket.service';

@Injectable({
  providedIn: 'root'
})
export class DrawHelperService {

    private canvasElement:HTMLCanvasElement;
    private canvasCtx:CanvasRenderingContext2D;

    // helpers
    private holdingClick = false;
    private lastPoint:{x:number, y:number, c?:boolean};
    private continuePrevious = false;
    private historialPoints = {
        lines: [],
        dot: [] 
    };
    public isDavinci:boolean = false;
    private intervalData: any;

    /**
     * Draw and send data
     * @param canvasElement Canvas HTML element
     */
    constructor(private drawSocket:DrawSocketService) { }

    setUp(canvasElement:HTMLCanvasElement){       
        this.canvasElement = canvasElement;
        this.canvasCtx = canvasElement.getContext("2d");
        this.canvasCtx.fillStyle = "#fff";
        this.canvasCtx.strokeStyle = "#fff";
        this.canvasCtx.lineWidth = 3;

        this.setEventsListenersDraw();

        this.drawSocket.subscribeDraw().subscribe(data => {
            this.drawData(data.points);
        });

        this.sendData();
    }

    private drawData(data){
        console.log(data);
        
        var desl = this.decompressData(data.lines);
        var desd = this.decompressData(data.dot);

        if(desl.length > 0) data.lines = JSON.parse(desl);
        if(desd.length > 0) data.dot = JSON.parse(desd);

        this.canvasCtx.beginPath();

        data.lines.forEach(line => {
            if(typeof(line.c) !== 'undefined' && line.c == false) {
                this.canvasCtx.moveTo(line.x, line.y);
            }

            this.canvasCtx.lineTo(line.x, line.y);
            this.canvasCtx.stroke();   
        });
        
        data.dot.forEach(dot => {
            this.canvasCtx.fillRect(dot.x,dot.y,3,3);
        }); 
    }

    // 
    /**
     * Send data periodically
     * Error: User information is sent with missing parts 
     * due to the wait cycle of shipment vs. adding new paths while drawing
     */
    private sendData(){
        // if(!this.isDavinci) {
        //     if(this.intervalData){
        //         clearInterval(this.intervalData);
        //     }
        //     return false;
        // }

        this.intervalData = setInterval(() => {
            if(!this.isDavinci) {
                // if(this.intervalData){
                //     clearInterval(this.intervalData);
                // }
                return false;
            }
            
            if(this.historialPoints.dot.length > 0 || this.historialPoints.lines.length > 0){
                let { lines, dot }  = this.historialPoints;
                let startLine = lines.length;
                let startDot = dot.length;
                console.log({startLine, startDot});

                // compress lines
                var data = this.historialPoints;
                if(data.lines.length > 0) data.lines = this.compressData(JSON.stringify(data.lines));
                if(data.dot.length > 0) data.dot = this.compressData(JSON.stringify(data.dot));

                if(this.drawSocket.sendDrawedData(data)){
                    console.log({lineslngAfter: this.historialPoints.lines.length, lngdotAfter: this.historialPoints.dot.length})
                    this.historialPoints.lines = lines.slice(startLine, this.historialPoints.lines.length);
                    this.historialPoints.dot = dot.slice(startDot, this.historialPoints.dot.length);
                    console.log({lineslngAfter: this.historialPoints.lines.length, lngdotAfter: this.historialPoints.dot.length})
                }
            }
        }, 900);
    }

    private setEventsListenersDraw(){    
        // if(!this.isDavinci){
        //     this.historialPoints.lines = [];
        //     this.historialPoints.dot = [];
        //     return;
        // }

        // single click
        this.canvasElement.addEventListener('click', ((ev) => {
            // console.log(this.isDavinci);            
            if(this.isDavinci){ 
                this.historialPoints.dot.push({x: ev.layerX, y:ev.layerY});
                this.canvasCtx.fillRect(ev.layerX,ev.layerY,3,3);
            }
            // console.log(this.isDavinci);
        }));

        // starts draw-drag
        this.canvasElement.addEventListener('mousedown', (() => {
            setTimeout(() => {
                if(!this.isDavinci){ return false; }
                
                this.holdingClick = true;
                this.canvasCtx.beginPath();
            }, 50);
        }), false);

        // ends draw-drag
        this.canvasElement.addEventListener('mouseup', (() => {
            if(!this.isDavinci){ return false; }
            
            this.holdingClick = false;
            this.continuePrevious = false;
        }), false);

        // draw a continuous line while drags
        this.canvasElement.addEventListener('mousemove', ((ev) => {
            if(!this.isDavinci){ return false; }
            
            if(this.holdingClick){      
                if(this.continuePrevious){
                    // si contiuamos el anterior debemos poner el puntero en el punto anterior
                    // para formar una linea continua
                    this.canvasCtx.moveTo(this.lastPoint.x, this.lastPoint.y);
                }else{
                    // si no continuamos el puntero va en el punto que indicó el jugador
                    this.canvasCtx.moveTo(ev.layerX, ev.layerY);
                }

                // save last position
                this.lastPoint = {x: ev.layerX, y: ev.layerY};
                if(!this.continuePrevious) this.lastPoint.c = false;
                this.historialPoints.lines.push(this.lastPoint); 

                this.canvasCtx.lineTo(ev.layerX, ev.layerY);
                this.canvasCtx.stroke();
                this.continuePrevious = true;
            }        
        }), false);
    }

    private compressData(datastring){
        var fnd = datastring.match(/({!?.*})/g); // get all string that start with { and end with }
        // replace all {},", "x": and "y": from string
        var r = fnd[0].replace(/{|}/g, '').replace(/"/g, '').replace(/([a-z]:)/g, '');
        // replace all , that has true or false before and then add the found value.
        r = r.replace(/(true|false),/g, '$1;');

        return r;
    }

    private decompressData(datastring){
        if(!datastring || datastring.length <= 0) return "";

        var lineasString = datastring.split(','); 
        var glued = "";

        // simple glue, add the element and then the puntuation, 
        // depending if is odd and the next word isn't "false"
        lineasString.forEach((e, i) => {
            glued += e;	
            var ind = i+1 > lineasString.length -1 ? lineasString.length -1 : i+1;
            if(i % 2 != 0 && lineasString[ind].match('false') == null){
                glued += ";";    
            }else{ 
                glued += ",";        
            }
        });

        let convert = glued.replace(/(?<=[0-9]),(?!.[a-z])/g, ',"y":')
        .replace(/((?<=;)|^(?=[0-9]))(?!$)/g, '"x":').replace(/;(?!$)/g, '},{')
        .replace(/(false|true)/g, '"c":$1').replace(/;($)/, '}');

        return "[{" + convert + "]";
    }
}
