import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop'
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { GifService } from '../../services/gifs.services';
import { GifList } from '../../components/gif-list/gif-list';

@Component({
  selector: 'app-history-page',
  imports: [GifList],
  templateUrl: './history-page.html',
})
export default class HistoryPage {

  gifService = inject(GifService)


  query = toSignal(
    inject(ActivatedRoute).params.pipe(map((params) => params['query']))
  );

  gifsByKey = computed( () => {
    console.log(this.gifService.getHistoryGifs(this.query()))
    return this.gifService.getHistoryGifs(this.query())
  }); 
}
