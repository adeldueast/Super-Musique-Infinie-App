import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
const YOUTUBE_URL = 'https://www.youtube.com/embed/';
@Pipe({
  name: 'trust',
})
export class TrustPipe implements PipeTransform {
  constructor(public sanitizer: DomSanitizer) {}
  transform(value: any, args?: any): any {
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `${YOUTUBE_URL}${value}`
    );
  }
}
