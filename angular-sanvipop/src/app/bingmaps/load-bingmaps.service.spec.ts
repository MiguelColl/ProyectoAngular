import { TestBed } from '@angular/core/testing';

import { LoadBingmapsService } from './load-bingmaps.service';

describe('LoadBingmapsService', () => {
  let service: LoadBingmapsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadBingmapsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
