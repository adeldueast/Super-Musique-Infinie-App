import { Component, OnInit } from '@angular/core';
import { Concert } from './../../../models/concert';
import { BandsInTownService } from './../../../services/BandsInTown/bandsInTown.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SpotifyService } from 'src/app/services/spotify/Spotify.service';
import { MyArtistsService } from 'src/app/services/artists/MyArtists.service';

@Component({
  selector: 'app-concerts',
  templateUrl: './concerts.component.html',
  styleUrls: ['./concerts.component.css'],
})
export class ConcertsComponent implements OnInit {
  concerts?: Concert[];

  constructor(
    private BandsInTownService: BandsInTownService,
    private route: ActivatedRoute,
    private router: Router,
    private spotify: SpotifyService,
    private MyArtists: MyArtistsService
  ) {}

  ngOnInit() {
    //not really a clean way to keep auth state but wthever........
    if (!this.spotify.token) this.router.navigate(['']);

    const artistNameParams = this.route.snapshot.paramMap.get('artistName');

    //check if arist params exist
    var artist = this.MyArtists.artists.value.find(
      (a: any) => a.name === artistNameParams
    );

    //if not , redirect to 404 page
    if (!artist) {
      //on navigate back to home, puis on fetch le new artist
      this.router.navigate(['404']);
      return; // if we dont return, the next lines are executed
    }

    this.getConcerts(artist.name);
  }

  async getConcerts(artistNameParams: string): Promise<void> {
    await this.BandsInTownService.getArtistConcerts(artistNameParams)
      .toPromise()
      .then((res) => {
        this.concerts = res;
      })
      .catch((err) => {
        console.log(err);
        this.concerts = [];
      });
  }
}
