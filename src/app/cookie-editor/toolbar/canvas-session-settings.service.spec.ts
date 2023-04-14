import { TestBed } from '@angular/core/testing';

import { CanvasSessionSettingsService } from './canvas-session-settings.service';

describe('CanvasSessionSettingsService', () => {
  let service: CanvasSessionSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CanvasSessionSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
