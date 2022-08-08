import { MyArtistsService } from './../../services/artists/MyArtists.service';
import { Artist } from '../../models/artist';
import { Component, Input, OnInit } from '@angular/core';
import { SpotifyService } from 'src/app/services/spotify/Spotify.service';

@Component({
  selector: 'app-artist-card',
  templateUrl: './artist-card.component.html',
  styleUrls: ['./artist-card.component.css'],
})
export class ArtistCardComponent implements OnInit {
  @Input() artist?: Artist;
  constructor(public myArtists: MyArtistsService) {}

  ngOnInit() {}

  fetchAlbum() {}

  convertTo(number?: number) {
    return number?.toLocaleString();
  }
}
