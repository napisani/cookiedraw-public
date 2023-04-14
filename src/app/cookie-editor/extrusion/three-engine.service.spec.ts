import { TestBed } from '@angular/core/testing';

import { ThreeEngineService } from './three-engine.service';

describe('ThreeEngineService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ThreeEngineService = TestBed.get(ThreeEngineService);
    expect(service).toBeTruthy();
  });
});
