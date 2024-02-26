import { EventEmitter, Injectable, OnInit } from '@angular/core';
import { Packet, ServerPixel } from '../models/socket';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  constructor() { }

  private socket: WebSocket | null = null;

  pixelPlace = new Subject<ServerPixel>();

  connect() {
    this.socket = new WebSocket('ws://localhost:8080/ws');
    this.socket.onopen = (event) => this.onOpen(event);
    this.socket.onmessage = (event: MessageEvent) => this.onMessage(event);
    this.socket.onerror = (event: Event) => this.onError(event);
    this.socket.onclose = (event: CloseEvent) => this.onClose(event);
  }

  private onOpen(event: Event) {
    console.log('handleOpen');
  }

  private onMessage(event: MessageEvent) {
    console.log('handleMessage', event.data);
    const data = JSON.parse(event.data) as Packet;
    switch (data.type) {
      case 'pixel':
        console.log(this.pixelPlace)
        this.pixelPlace.next(data.data);
        break;
    }
  }

  private onError(event: Event) {
    console.log('handleError', event);
  }

  private onClose(event: CloseEvent) {
    console.log('handleClose', event);
  }
}
