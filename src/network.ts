/**
 * @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
 * @copyright    nka1024
 * @description  Pong
 * @license      nka1024
 */


/// <reference path="../node_modules/@types/socket.io/index.d.ts"/>
/// <reference path="../node_modules/@types/socket.io-client/index.d.ts"/>

import * as io from 'socket.io-client';
import { CONST } from './const/const';
import SocketIOClientWrapper from './wrappers/socket.io-client-wrapper';

export class Network {

  private socket: SocketIOClient.Socket;

  public match_id:number;
  public latency:number = 0;
  private latencyTimer:any;

  constructor() {

  }

  // Public methods

  public connect() {
    if (CONST.DEV) {
      this.socket = io.connect("http://192.168.0.142:8081");
    } else {
      this.socket = io.connect("http://ec2-18-216-219-185.us-east-2.compute.amazonaws.com:8081");
    }
    if (CONST.NET_LOG) {
      this.setupLogging();
    }
    this.setupLatency();
  }

  public disconnect() {
    this.socket.disconnect();
    clearInterval(this.latencyTimer);
    
    delete this.socket;
    delete this.latencyTimer;

  }

  public on(event: string, fn: Function) {
    this.socket.on(event, fn);
  }

  public off(event: string, fn?: Function) {
    this.socket.off(event, fn);
  }


  // Commands
  public sendHello(x: number, y: number) {
    this.send("hello", {x: x, y: y});
  }

  public sendPlayerUpdate(player_side: number, y: number, speed: number) {
    this.send("player_update", {player_side: player_side, y: y, speed: speed});
  }

  public sendBallUpdate(x: number, y:number, speed_x:number, speed_y:number) {
    this.send("ball_update", {pos: {x: x, y: y}, speed: {x: speed_x, y: speed_y}});
  }

  public sendBallOut(side: number) {
    this.send("ball_out", {side: side});
  }

  public sendTest() {
    this.send("test");
  }


  // Private methods

  private send(text: string, data?: any): void {
    if (data && this.match_id) {
      data.match_id = this.match_id;
    }
    
    if (CONST.NET_LOG) {
      console.log('< ' + text + (data == null ? "" : ": " + JSON.stringify(data)));
    }
    this.socket.emit(text, data);
  }

  private setupLogging(): void {
    var onevent = SocketIOClientWrapper.onevent(this.socket);
    SocketIOClientWrapper.setOnevent(this.socket, function (packet) {
      var args = packet.data || [];
      onevent.call(this, packet);    // original call
      packet.data = ["*"].concat(args);
      onevent.call(this, packet);      // additional call to catch-all
    });

    this.socket.on("*", function (event, data:any) {
      console.log("> " + event + (data == null ? "" : ": " + JSON.stringify(data)) );
    });
  }

  private setupLatency():void {
    var startTime;
    this.latencyTimer = setInterval(() => {
      startTime = Date.now();
      this.send("pping");
    }, 2000);
    
    this.socket.on('ppong', () => {
      this.latency = Date.now() - startTime;
    });
  }
}