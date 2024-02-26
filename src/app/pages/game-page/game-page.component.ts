import { Component } from '@angular/core';
import { BoardComponent } from '../../components/board/board.component';

@Component({
  selector: 'app-game-page',
  standalone: true,
  imports: [
    BoardComponent,
  ],
  templateUrl: './game-page.component.html',
  styleUrl: './game-page.component.scss'
})
export class GamePageComponent {

}
