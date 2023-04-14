import { TestBed } from '@angular/core/testing';

import { AnimationFrameService } from './animation-frame.service';

describe('AnimationFrameService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AnimationFrameService = TestBed.get(AnimationFrameService);
    expect(service).toBeTruthy();
  });
});
