import { Chanson } from 'src/app/models/chanson';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SpotifyService } from 'src/app/services/spotify/Spotify.service';

@Component({
  selector: 'app-chansons',
  templateUrl: './chansons.component.html',
  styleUrls: ['./chansons.component.css'],
})
export class ChansonsComponent implements OnInit, OnDestroy {
  previousIndexAudio: number = -1;
  previousIndexYoutube: number = -1;
  audio: any;
  albumId?: string;
  tracks: Chanson[] = [];
  constructor(
    public spotify: SpotifyService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.audio = new Audio();
  }

  ngOnInit() {
    //not really a clean way to keep auth state but wthever........
    if (!this.spotify.token) this.router.navigate(['']);

    //retrieve params from url
    const albumIdParams = this.route.snapshot.paramMap.get('albumId');
    if (albumIdParams) this.albumId = albumIdParams;
    //on get les tracks de l'album en parametre
    this.getTracks();

    //on add une event listener pour update le state du button play/pause automatiquement
    this.audio.addEventListener('ended', (err: any) => {
      this.updateTrackState();
    });
  }

  ngOnDestroy(): void {
    // on detache le listener..
    this.audio.removeEventListener('ended', (err: any) => {
      this.updateTrackState();
    });

    if (this.audio) {
      //fully destroy, crush, dismantle  eradicate  our audio object
      this.audio.pause();
      this.audio.src = '';
      this.audio.currentTime = 0;
      this.audio = null;
    }
    ///  console.log(this.audio);
    console.log('DESTROYED 👿');
  }

  updateTrackState() {
    this.audio.currentTime = 0;
    this.tracks[this.previousIndexAudio].isAudioPlaying = false;
  }

  async getTracks() {
    await this.spotify
      .getTracks(this.albumId)
      .toPromise()
      .then((res) => {
        //update nos tracks avec celles fetch
        this.tracks = res;
      })
      .catch((err) => console.log(err));
  }

  // on vx une seule instance de audio, sinon RIP nos oreilles, donc on emit vers le component parent,qui,
  //lui soccupera de play/pause la meme,single instance de audio
  // https://stackoverflow.com/a/69120463
  async toggleAudioPreview(event: any) {
    // Checking if same track is clicked or new
    if (this.previousIndexAudio >= 0 && this.previousIndexAudio != event.index) {
      //  If new track is clicked then pausing previous track and playing new track
      this.tracks[this.previousIndexAudio].isAudioPlaying = false;
      this.audio.pause();
      this.audio.src = event.preview_url;
      this.audio.load();
      await this.audio
        .play()
        .then()
        .catch((err: any) => console.log(err));
    } else {
      // If we click on the same track OR if its the first time we select a track
      var isplaying = this.tracks[event.index].isAudioPlaying;
      if (isplaying === true) {
        //is playing == TRUE
        this.audio.pause();
      } else {
        //is playing == FALSE
        //if first time..
        if (this.previousIndexAudio == -1) {
          //first time clicking on it
          this.audio.src = event.preview_url;
          this.audio.load();
          await this.audio
            .play()
            .then()
            .catch((err: any) => console.log(err));
        } else {
          //if  NOT first time..
          await this.audio
            .play()
            .then()
            .catch((err: any) => console.log(err));
        }
      }
    }
    //We always update index
    this.previousIndexAudio = event.index;
    this.tracks[event.index].isAudioPlaying = !this.tracks[event.index].isAudioPlaying;
  }

  async toggleYoutube(event: any) {

    if (this.previousIndexYoutube >= 0 && this.previousIndexYoutube != event.index) {
      //If new track is clicked then pausing previous track and playing new track
      this.tracks[this.previousIndexYoutube].isYoutubePlaying = false;
    }
    //We always update index
    this.previousIndexYoutube = event.index;
    this.tracks[event.index].isYoutubePlaying = !this.tracks[event.index].isYoutubePlaying;
  }
}
