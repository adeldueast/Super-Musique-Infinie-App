/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MyArtistsService } from './MyArtists.service';

describe('Service: MyArtists', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MyArtistsService]
    });
  });

  it('should ...', inject([MyArtistsService], (service: MyArtistsService) => {
    expect(service).toBeTruthy();
  }));
});
