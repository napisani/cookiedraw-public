import { TestBed } from '@angular/core/testing';

import { CookieCutterService } from './cookie-cutter.service';

describe('CookieCutterService', () => {
  let service: CookieCutterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CookieCutterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
