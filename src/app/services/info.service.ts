import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { Info } from '../models/common';

@Injectable({
  providedIn: 'root'
})
export class InfoService {
  constructor(private http: HttpClient) { }

  private info: Info | null = null;

  getInfo(): Observable<Info> {
    if (this.info) {
      return of(this.info);
    }
    // fetch info, cache, and return it
    return this.fetchInfo();
  }

  private fetchInfo(): Observable<Info> {
    return this.http.get<Info>('http://localhost:8080/info')
      .pipe(
        tap(info => this.info = info)
      );
  }

  colorIndexToIntRGB(colorIndex: number, palette: string[]): number {
    return parseInt(palette[colorIndex], 16);
  }

  colorIndexToIntBGR(colorIndex: number, palette: string[]): number {
    const color = palette[colorIndex];
    const r = parseInt(color[4] + color[5], 16);
    const g = parseInt(color[2] + color[3], 16);
    const b = parseInt(color[0] + color[1], 16);
    return (r << 16) + (g << 8) + b;
  }
}
