import { Artist } from './../../models/artist';
import { MyArtistsService } from './../../services/artists/MyArtists.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SpotifyService } from 'src/app/services/spotify/Spotify.service';
import { Album } from 'src/app/models/album';
import { BandsInTownService } from './../../services/BandsInTown/bandsInTown.service';

@Component({
  selector: 'app-albums',
  templateUrl: './albums.component.html',
  styleUrls: ['./albums.component.css'],
})
export class AlbumsComponent implements OnInit, OnDestroy {
  artist?: Artist;
  albums?: Album[] = [];
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private MyArtists: MyArtistsService,
    private spotify: SpotifyService
  ) {}
  ngOnDestroy(): void {
    console.log('DESTROYED 👿');
  }

  ngOnInit() {
    //not really a clean way to keep auth state but wthever........
    if (!this.spotify.token) this.router.navigate(['']);

    //retrieve params from url
    const artistNameParams = this.route.snapshot.paramMap.get('artistName');

    //check if arist params exist
    this.artist = this.MyArtists.artists.value.find(
      (a) => a.name === artistNameParams
    );

    //if not , redirect to 404 page
    if (!this.artist) {
      //on navigate back to home, puis on fetch le new artist
      this.router.navigate(['404']);
      return; // if we dont return, the next lines are executed
    }

    this.getAlbums();
  }

  async getAlbums() {
    await this.spotify
      .getAlbums(this.artist?.uid)
      .toPromise()
      .then((albums) => {
        this.albums = albums;
      })
      .catch((err) => console.log(err));
  }
}
