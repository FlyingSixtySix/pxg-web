import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { combineLatestWith, Observable, Subscription } from 'rxjs';
import { BoardService } from '../../services/board.service';
import { InfoService } from '../../services/info.service';
import { Info } from '../../models/common';
import { SocketService } from '../../services/socket.service';
import { ServerPixel } from '../../models/socket';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild('board') boardRef!: ElementRef<HTMLCanvasElement>;
  ctx: CanvasRenderingContext2D | null = null;

  constructor(
    private boardService: BoardService,
    private infoService: InfoService,
    private socketService: SocketService
  ) { }

  private board: Uint8Array | null = null;
  private boardColors: Uint32Array | null = null;
  private info: Info | null = null;

  private dataSubscription: Subscription | null = null;

  ngOnInit() {
    this.dataSubscription = this.getData().subscribe(([board, info]) => {
      this.board = board;
      this.info = info;
      this.boardColors = this.boardService.getBoardColors(board, info.palette);
      this.drawBoard();
    });

    this.socketService.pixelPlace.subscribe((pixel: ServerPixel) => {
      if (this.board && this.boardColors && this.info) {
        const { x, y, color } = pixel;
        this.drawPixel(x, y, color);
      }
    });
  }

  ngAfterViewInit() {
    this.ctx = this.boardRef.nativeElement.getContext('2d');
    this.drawBoard();
  }

  ngOnDestroy() {
    this.dataSubscription?.unsubscribe();
  }

  drawBoard() {
    if (this.ctx && this.boardColors && this.info) {
      const { width, height } = this.info;
      const imageData = this.ctx.createImageData(width, height);
      imageData.data.set(new Uint8ClampedArray(this.boardColors.buffer));
      this.ctx.putImageData(imageData, 0, 0);
    }
  }

  drawPixel(x: number, y: number, colorIndex: number) {
    if (this.board && this.boardColors && this.info) {
      const index = y * this.info.width + x;
      this.board[index] = colorIndex;
      const color = this.infoService.colorIndexToIntRGB(colorIndex, this.info.palette);
      this.boardColors[index] = color;
      const boardElem = this.boardRef.nativeElement;
      const ctx = boardElem.getContext('2d');
      if (ctx) {
        ctx.fillStyle = `#${color.toString(16).padStart(6, '0')}`;
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }

  getData(): Observable<[Uint8Array, Info]> {
    return this.boardService.fetchBoard()
      .pipe(combineLatestWith(this.infoService.getInfo()));
  }
}
