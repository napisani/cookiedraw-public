import { TestBed } from '@angular/core/testing';

import { QuadAdjustCollisionService } from './quad-adjust-collision.service';

describe('QuadAdjustCollisionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: QuadAdjustCollisionService = TestBed.get(QuadAdjustCollisionService);
    expect(service).toBeTruthy();
  });
});
