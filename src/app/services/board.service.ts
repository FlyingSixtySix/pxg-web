import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { InfoService } from './info.service';

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  constructor(private http: HttpClient, private infoService: InfoService) { }

  fetchBoard(): Observable<Uint8Array> {
    return this.http.get('http://localhost:8080/board', { responseType: 'arraybuffer' })
      .pipe(
        map(response => new Uint8Array(response))
      );
  }

  getBoardColors(board: Uint8Array, palette: string[]): Uint32Array {
    const boardView = new DataView(board.buffer, board.byteOffset, board.byteLength);
    const colors = new Uint32Array(boardView.byteLength);
    for (let i = 0; i < boardView.byteLength; i++) {
      colors[i] = 0xFF000000 + this.infoService.colorIndexToIntBGR(boardView.getUint8(i), palette);
    }
    return colors;
  }
}
