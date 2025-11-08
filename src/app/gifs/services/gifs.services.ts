import { GifMapper } from './../mappers/gif.mapper';
import { Gif } from './../interfaces/gif.interfaces';
import { HttpClient } from "@angular/common/http";
import { computed, effect, inject, Injectable, signal } from "@angular/core";
import { environment } from "@environments/environment";
import type { GiphyResponse } from "../interfaces/giphy.interfaces";
import { map, Observable, tap} from 'rxjs';

const loadFromLocalStorage = () => {
  const gifsFromLocalStorage = localStorage.getItem('gifs') ?? '{}'
  const gifs = JSON.parse(gifsFromLocalStorage);
  console.log(gifs);
  return gifs;
}

@Injectable({ providedIn : 'root'})
export class GifService {
  private http = inject(  HttpClient);

  trendingGifs = signal<Gif[]>([]);

  searchHistory = signal<Record<string, Gif[]>>(loadFromLocalStorage());
  searchHistoryKeys = computed(() => Object.keys(this.searchHistory()))


  constructor(){
    this.loadTrendingGifs();
    console.log('service created wonderfully!!')
  }

  saveGifsToLocalStorage = effect(() => {
    const historyString = JSON.stringify(this.searchHistory());
    localStorage.setItem('gifs', historyString);
  })

  loadTrendingGifs(){
    this.http.get<GiphyResponse>(`${environment.GIPHY_URL}/trending`, {
      params: {
        api_key: environment.GIPHY_API_KEY,
        limit: 50,
      }
    })
    .subscribe( ( resp ) => {
      const gifs = GifMapper.mapGiphyItemsToGifArray(resp.data);
      this.trendingGifs.set(gifs);
      // console.log( {gifs} )
    } )
  }

  searchGifs(query: string): Observable<Gif[]>{
    return this.http.
      get<GiphyResponse>(`${environment.GIPHY_URL}/search`, {
      params: {
        api_key : environment.GIPHY_API_KEY,
        q: query,
        limit: 50,
      }
    })
    .pipe(
      map(( { data } ) => data),
      map((items) => GifMapper.mapGiphyItemsToGifArray(items)),
      // HISTORIAL
      tap( items => {
        this.searchHistory.update( (history) => ({
          ...history,
           [query.toLocaleLowerCase()] : items,
        }))
      })
    );
    // .subscribe((resp) => {
    //   const searchedGifs = GifMapper.mapGiphyItemsToGifArray(resp.data);
    //   console.log( { searched : searchedGifs})
    // })
  }

  getHistoryGifs(query : string): Gif[]{
    console.log(this.searchHistory());
    return this.searchHistory()[query] ?? [];
  }
}
