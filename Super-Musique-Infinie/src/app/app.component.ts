import { SpotifyService } from './services/spotify/Spotify.service';
import { Component, OnInit } from '@angular/core';
import { User } from './models/user';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(
    public spotify: SpotifyService,
    private translate: TranslateService
  ) {}

  user?: User;

  ngOnInit(): void {
    this.getUserInfo();
    this.translate.setDefaultLang('fr');
    this.translate.use('fr');
  }

  async getUserInfo(): Promise<void> {
    await this.spotify
      .getUserInfo()
      ?.toPromise()
      .then((userRes) => (this.user = userRes))
      .catch((err) => console.log(err));
  }
}
