import { Observable, throwError } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { User } from '../../models/user';
import { Artist } from '../../models/artist';
import { Album } from './../../models/album';
import { Chanson } from 'src/app/models/chanson';

const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize?';
const CLIENT_ID = 'cdb8801100174eb89ecb4cf3aa808ba2';
const REDIRECT_URI = 'http://localhost:4200';
const RESPONSE_TYPE = 'token';
const scope = 'user-read-private%20user-read-email';
const params: any = {
  client_id: CLIENT_ID,
  response_type: RESPONSE_TYPE,
  redirect_uri: REDIRECT_URI,
  scope: scope,
  show_dialog: true,
};
const queryString = Object.keys(params)
  .map((key) => key + '=' + params[key])
  .join('&');
const LOGIN_URL = AUTH_ENDPOINT + queryString;

@Injectable({
  providedIn: 'root',
})
export class SpotifyService {
  public token: string | null = null;

  constructor(private http: HttpClient) {
    this.token = this.getWithExpiry('spotify_token');
    if (this.token === null) {
      if (window.location.hash) {
        this.token = this.setWithExpiry(
          'spotify_token',
          this.getTokenFromUrl()
        );
      }
    }
    console.log('🟢 SPOTIFY SERVICE CONSTRUCTOR 🟢');
  }

  getUserInfo(): Observable<User> | null {
    if (!this.token) {
      return null;
    }

    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + this.token,
      }),
    };
    return this.http
      .get<any>('https://api.spotify.com/v1/me', httpOptions)
      .pipe(
        map((x) => {
          // console.log('mapping X ', x);
          var user = new User(x.display_name, x.images[0].url);
          //console.log('to User ', user);
          return user;
        }),
        catchError(this.handleError)
      );
  }

  getArtistInfo(artistName: string): Observable<Artist | null> {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + this.token,
      }),
    };

    return this.http
      .get<any>(
        `https://api.spotify.com/v1/search?type=artist&limit=1&q=${artistName}`,
        httpOptions
      )
      .pipe(
        map((res) => {
          var items = res.artists.items;

          if (!(items.length > 0)) return null;

          var artist_uid = res.artists.items[0].id;
          var artist_name = res.artists.items[0].name;
          var artist_image = res.artists.items[0].images[0].url;
          var artist_followers = res.artists.items[0].followers.total;
          var artist_genres = res.artists.items[0].genres;
          var artist_popularity = res.artists.items[0].popularity;
          var artist = new Artist(
            artist_uid,
            artist_name,
            artist_image,
            artist_followers,
            artist_popularity,
            artist_genres
          );

          return artist;
        }),
        retry(),
        catchError(this.handleError)
      );
  }

  getAlbums(artist_id?: string): Observable<Album[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + this.token,
      }),
    };

    return this.http
      .get<any>(
        `https://api.spotify.com/v1/artists/${artist_id}/albums?`,
        httpOptions
      )
      .pipe(
        map((res) => {
          var albums: Album[] = [];
          var albumsResponse = res.items;
          albumsResponse.forEach((element: any) => {
            var uid = element.id;
            var name = element.name;
            var image = element.images[0].url;
            var totalTracks = element.total_tracks;
            albums.push(new Album(uid, name, image, totalTracks));
          });

          // console.log(albums);
          return albums;
        }),
        catchError(this.handleError)
      );
  }

  getArtistInfoById(artist_id?: string): Observable<Artist> {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + this.token,
      }),
    };
    return this.http
      .get<any>(`https://api.spotify.com/v1/artists/${artist_id}`, httpOptions)
      .pipe(
        map((res) => {
          // console.log(res)
          var artist_uid = res.id;
          var artist_name = res.name;
          var artist_image;
          if (!(res.images.length === 0)) {
            artist_image = res.images[0].url;
          }

          var artist_followers = res.followers.total;
          var artist_genres = res.genres;
          var artist_popularity = res.popularity;

          var artist = new Artist(
            artist_uid,
            artist_name,
            artist_image,
            artist_followers,
            artist_popularity,
            artist_genres
          );

          return artist;
        }),
        catchError(this.handleError)
      );
  }
  getTracks(album_id?: string): Observable<Chanson[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + this.token,
      }),
    };
    return this.http
      .get<any>(
        `https://api.spotify.com/v1/albums/${album_id}/tracks`,
        httpOptions
      )
      .pipe(
        map((res) => {
          var items = res.items;
          var tracks: Chanson[] = [];
          items.forEach((t: any) => {
            //console.log(t);
            var name = t.name;
            var featured_artists = t.artists;
            var preview_url = t.preview_url;
            var _featured_artists: Artist[] = [];
            featured_artists.forEach(async (artist: any) => {
              await this.getArtistInfoById(artist.id)
                .toPromise()
                .then((res) => {
                  _featured_artists.push(res);
                })
                .catch((err) => console.log(err));
            });

            tracks.push(new Chanson(name, _featured_artists, preview_url));
          });

          return tracks;
        }),
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error(
        'An error of status 0  occurred (client-side or network error):',
        error.error
      );
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Spotify API returned code ${error.status},
          message was: ${error.message} ,body was: `,
        error.error
      );
    }

    // Return an observable with a user-facing error message.
    return throwError('Something bad happened, please try again later.');
  }

  getTokenFromUrl() {
    return window.location.hash.substring(1).split('&')[0].split('=')[1];
  }

  setWithExpiry(key: string, value: string) {
    const now = new Date();
    now.setTime(now.getTime() + 1 * 3600 * 1000);

    // `item` is an object which contains the original value
    // as well as the time when it's supposed to expire
    const item = {
      value: value,
      expiry: now.getTime(),
    };

    localStorage.setItem(key, JSON.stringify(item));
    location.hash = '';
    return item.value;
  }

  getWithExpiry(key: string) {
    const itemStr = localStorage.getItem(key);
    // if the item doesn't exist, return null
    if (!itemStr) {
      return null;
    }
    const item = JSON.parse(itemStr);
    const now = new Date();
    // compare the expiry time of the item with the current time
    if (now.getTime() > item.expiry) {
      alert(
        '🟢🟢 TOKEN HAS EXPIRED,  LOGIN IN TO GET A NEW SPOTIFY TOKEN 🟢🟢'
      );
      // If the item is expired, delete the item from storage
      // and return null
      localStorage.removeItem(key);
      return null;
    }

    return item.value;
  }

  endSession() {
    localStorage.removeItem('spotify_token');
    this.token = '';
  }
}

export { LOGIN_URL };
