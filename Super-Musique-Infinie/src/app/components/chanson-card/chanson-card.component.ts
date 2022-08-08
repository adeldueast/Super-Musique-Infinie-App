import { Chanson } from 'src/app/models/chanson';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { GoogleYoutubeService } from './../../services/google-youtube-api/google-youtube.service';

const YOUTUBE_URL = 'https://www.youtube.com/embed/';
@Component({
  selector: 'app-audio-player',
  templateUrl: './chanson-card.component.html',
  styleUrls: ['./chanson-card.component.css'],
})
export class AudioPlayerComponent implements OnInit {
  @Input() track?: Chanson;

  @Input() index?: number;
  @Output() toggleAudioPreview: EventEmitter<{
    index?: number;
    preview_url?: string;
  }> = new EventEmitter();
  @Output() toggleYoutubeEmitter: EventEmitter<{
    index?: number;
  }> = new EventEmitter();

  youtubeVideoId?: string;
  showLoading = false;

  //TODO: maybe make a service to avoid using http inside component.
  constructor(public google_youtube: GoogleYoutubeService) {}

  ngOnInit() {}

  async toggleYoutube() {
    //on emit la valeur de l'index vers le parent qui  va se charger de changer la valeur boolean isYoutubePlaying de la chanson à l'index emitted
    this.toggleYoutubeEmitter.emit({
      index: this.index,
    });

    //si isPlaying === true, on check si il est undefined or not
    //if undefined, on fetch pour la premiere fois
    //if defined, on fais rien, le ui va cacher le iFrame element
    //cela evite des requetes inutiles a chaque fois quon toggle.
    if (this.track?.isYoutubePlaying) {
      if (!this.youtubeVideoId) {
        this.showLoading = true;
        console.log('fetching youtube video id');
        await this.google_youtube
          .getYoutubeVideo(this.track.featured_artists[0].name, this.track.name)
          .toPromise()
          .then((res) => {
            var videoId = res;
            this.youtubeVideoId = videoId;
            console.log(this.youtubeVideoId);
          })
          .catch((err) => console.log(err));
      }
    }
  }

  togglePreviewAudio() {
    this.toggleAudioPreview.emit({
      index: this.index,
      preview_url: this.track?.preview_url,
    });
  }

  onLoad() {
    this.showLoading = false;
  }
}
