/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { BandsInTownService } from './bandsInTown.service';

describe('Service: BandsInTown', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BandsInTownService]
    });
  });

  it('should ...', inject([BandsInTownService], (service: BandsInTownService) => {
    expect(service).toBeTruthy();
  }));
});
