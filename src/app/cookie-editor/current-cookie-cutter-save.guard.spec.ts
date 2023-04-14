import { TestBed } from '@angular/core/testing';

import { CurrentCookieCutterSaveGuard } from './current-cookie-cutter-save.guard';

describe('CurrentCookieCutterSaveGuard', () => {
  let guard: CurrentCookieCutterSaveGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CurrentCookieCutterSaveGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
