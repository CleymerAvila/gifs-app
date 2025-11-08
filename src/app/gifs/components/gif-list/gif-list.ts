import { Component, computed, input, signal } from '@angular/core';
import { GifListItem } from "./gif-list-item/gif-list-item";
import { Gif } from '../../interfaces/gif.interfaces';

@Component({
  selector: 'gif-list',
  imports: [GifListItem],
  templateUrl: './gif-list.html',
})
export class GifList {
  gifs = input.required<Gif[]>();

  
}
