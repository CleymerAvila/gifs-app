import { Component, inject, signal } from '@angular/core';
import { GifService } from '../../services/gifs.services';
import { Gif } from '../../interfaces/gif.interfaces';
import { GifList } from '../../components/gif-list/gif-list';

@Component({
  selector: 'app-search-page',
  imports: [GifList],
  templateUrl: './search-page.html',
})
export default class SearchPage {
  gifService = inject(GifService)
  searchedGifs = signal<Gif[]>([]);

  onSearch(query:string){
    this.gifService.searchGifs(query)
    .subscribe( (resp) => {
      this.searchedGifs.set(resp)
    });
  }
}
