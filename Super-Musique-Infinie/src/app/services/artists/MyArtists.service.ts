import { map } from 'rxjs/operators';
import { Artist } from '../../models/artist';
import { Injectable } from '@angular/core';
import { BehaviorSubject, empty } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MyArtistsService {
  public artists: BehaviorSubject<Artist[]> = new BehaviorSubject<Artist[]>([]);
  constructor() {
    this.getArtistsStorage();
  }

  getArtistsStorage(): void {
    let storage_artists = window.localStorage.getItem('my-artists');
    if (storage_artists == null) return;
    if (storage_artists == 'undefined') return;

    let artists = JSON.parse(storage_artists);

    //emits last values to app-component
    this.artists.next(artists);
  }

  addArtistStorage(new_artist: Artist): void {
    var storage_artists = window.localStorage.getItem('my-artists');
    // console.log(storage_artists);

    //key is not set yet, we set it up by adding new array of artist object
    if (storage_artists == null) {
      let newArray = [];
      newArray.push(new_artist);
      localStorage.setItem('my-artists', JSON.stringify(newArray));
      this.artists.next(newArray);
      return;
    }

    var artists;
    //if key is set but list is undefined ,
    if (storage_artists === 'undefined') {
      //init a empty array and add new_artist into it to finally add object to local_storage
      artists = [];
      artists.push(new_artist);
      localStorage.setItem('my-artists', JSON.stringify(artists));
    }
    //if key is set with array of artist value
    else {
      // convert the string to an object , push new_artist and set it back w/ updated value
      artists = JSON.parse(storage_artists) as Artist[];
      let exist: boolean = false;
      artists.forEach((artist) => {
        if (artist.uid === new_artist.uid) {
          exist = true;
        }
      });

      if (exist) {
        alert(`🐵 You already added ${new_artist.name} monkey 🐵`);
        return;
      }
      artists = this.insertAt(artists, 0, new_artist);
      localStorage.setItem('my-artists', JSON.stringify(artists));
    }

    this.artists.next(artists);
  }

  deleteArtistStorage(artist_to_delete?: Artist) {
    var storage_artists = window.localStorage.getItem('my-artists');
    if (storage_artists == null) return;

    var artists = JSON.parse(storage_artists) as Artist[];
    var item_to_remove_index = artists.findIndex((artist) => {
      return artist.uid === artist_to_delete?.uid;
    });

    artists.splice(item_to_remove_index, 1);
    localStorage.setItem('my-artists', JSON.stringify(artists));
    this.artists.next(artists);
  }

  insertAt(arr: any, index: number, newItem: any) {
    return [
      // part of the array before the specified index
      ...arr.slice(0, index),
      // inserted item
      newItem,
      // part of the array after the specified index
      ...arr.slice(index),
    ];
  }
}
