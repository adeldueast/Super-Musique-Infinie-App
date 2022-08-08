import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Concert } from 'src/app/models/concert';

const API_KEY = '2b32475766802ac01eefda45e9e42ea0';
const URL =
  'https://rest.bandsintown.com/artists/beyonce/events?app_id=2b32475766802ac01eefda45e9e42ea0';
@Injectable({
  providedIn: 'root',
})
export class BandsInTownService {
  constructor(private http: HttpClient) {}

  getArtistConcerts(artist_name: string): Observable<Concert[]> {
    return this.http
      .get<any>(
        `https://rest.bandsintown.com/artists/${artist_name}/events?app_id=${API_KEY}`
      )
      .pipe(
        map((res) => {
          var listeConcert: Concert[] = [];
          res.forEach((concert: any) => {
            var venue = concert.venue;
            var center: google.maps.LatLngLiteral = {
              lat: parseFloat(venue.latitude),
              lng: parseFloat(venue.longitude),
            };
            var newConcert = new Concert(
              venue.country,
              venue.location,
              venue.name,
              center
            );
            // console.log({ newConcert });
            listeConcert.push(newConcert);
          });

          return listeConcert;
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
