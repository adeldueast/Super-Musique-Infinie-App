import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Artist } from 'src/app/models/artist';
import { User } from 'src/app/models/user';
import { MyArtistsService } from 'src/app/services/artists/MyArtists.service';
import { SpotifyService } from 'src/app/services/spotify/Spotify.service';

@Component({
  selector: 'app-list-artists',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class Home implements OnInit {
  subscription?: Subscription;
  artists?: Artist[];
  constructor(
    public spotify: SpotifyService,
    private myArtists: MyArtistsService
  ) {}

  ngOnInit(): void {
    this.subscription = this.myArtists.artists.subscribe((value) => {
      this.artists = value;
    });
  }
  ngOnDestroy(): void {
    //unsub, pour prevenir memory leak ~
    this.subscription?.unsubscribe();
    console.log('DESTROYED 👿');
  }
}
