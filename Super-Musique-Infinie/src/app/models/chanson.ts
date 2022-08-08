import { Artist } from './artist';

export class Chanson {
  public isAudioPlaying: boolean;
  public isYoutubePlaying: boolean;
  constructor(
    public name: string,
    public featured_artists: Artist[],
    public preview_url?: string
  ) {
    this.isAudioPlaying = false;
    this.isYoutubePlaying =false;
  }
}
