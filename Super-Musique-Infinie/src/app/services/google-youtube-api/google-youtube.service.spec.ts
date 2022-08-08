/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { GoogleYoutubeService } from './google-youtube.service';

describe('Service: GoogleYoutube', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GoogleYoutubeService]
    });
  });

  it('should ...', inject([GoogleYoutubeService], (service: GoogleYoutubeService) => {
    expect(service).toBeTruthy();
  }));
});
