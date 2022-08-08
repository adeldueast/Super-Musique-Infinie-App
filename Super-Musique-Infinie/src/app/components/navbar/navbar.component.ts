import { SpotifyService } from '../../services/spotify/Spotify.service';
import { Component, OnInit } from '@angular/core';
import { LOGIN_URL } from '../../services/spotify/Spotify.service';
import { Artist } from './../../models/artist';
import { MyArtistsService } from 'src/app/services/artists/MyArtists.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  _LOGIN_URL = LOGIN_URL;
  isDark?: boolean;
  artistName?: string;
  currentLang: string = 'en';

  constructor(
    private translate: TranslateService,
    public spotify: SpotifyService,
    public myArtist: MyArtistsService,
    private router: Router
  ) {}
  ngOnInit() {
    if (
      localStorage.getItem('color-theme') === 'dark' ||
      (!('color-theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      this.isDark = true;
    } else {
      this.isDark = false;
    }
  }

  useLanguage() {
    if (this.translate.currentLang === 'fr') {
      this.translate.use('en');
      this.currentLang = 'fr';
    } else {
      this.translate.use('fr');
      this.currentLang = 'en';
    }
  }
  // https://indepth.dev/posts/1287/rxjs-heads-up-topromise-is-being-deprecated
  async searchArtist(): Promise<void> {
    if (!this.artistName) return;
    await this.spotify
      .getArtistInfo(this.artistName)
      .toPromise()
      .then((artistResponse) => {
        if (artistResponse == null) {
          //console.log('artiste not found : ', artistResponse, '😂');
          alert(
            `🤡 ${this.artistName?.toUpperCase()} doesn't exist you clown 🤡`
          );
        } else {
          //console.log('artiste : ', artistResponse, '😂');
          //add new artiste to local database(local storage)
          this.myArtist.addArtistStorage(artistResponse);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  addArtistLocalStorage(newArtist: Artist): void {
    const mySavedArtists = window.localStorage.getItem('artists');
  }

  Logout() {
    this.spotify.endSession();
    //not rly clean but wthever
    this.router.navigate(['']);
  }
  toggleDarkMode(): void {
    this.isDark = !this.isDark;
    // if set via local storage previously
    if (localStorage.getItem('color-theme')) {
      if (localStorage.getItem('color-theme') === 'light') {
        document.documentElement.classList.add('dark');
        localStorage.setItem('color-theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('color-theme', 'light');
      }

      //if NOT set via local storage previously
    } else {
      if (document.documentElement.classList.contains('dark')) {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('color-theme', 'light');
      } else {
        document.documentElement.classList.add('dark');
        localStorage.setItem('color-theme', 'dark');
      }
    }
  }

  onSubmit(): void {
    this.searchArtist();
  }
}
