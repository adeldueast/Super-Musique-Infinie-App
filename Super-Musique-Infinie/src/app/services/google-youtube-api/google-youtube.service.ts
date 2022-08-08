import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map, retry, catchError } from 'rxjs/operators';
const GOOGLE_YOUTUBE_API_KEY = 'AIzaSyDfBUFII6sRECfoLIbRHsQJOdmlfsDRdmA';
const YOUTUBE_URL = 'https://www.youtube.com/embed/';
@Injectable({
  providedIn: 'root',
})
export class GoogleYoutubeService {


  constructor(public http: HttpClient) {}

  getYoutubeVideo(artist_name:string,track_name:string): Observable<string> {
    return this.http.get<any>( `https://www.googleapis.com/youtube/v3/search?part=id&maxResults=1&key=${GOOGLE_YOUTUBE_API_KEY}&q=${
      track_name + artist_name
    }`).pipe(
      map((res) => {
        var videoId = res.items[0].id.videoId;
        return videoId;
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

}
