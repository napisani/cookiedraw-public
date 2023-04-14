import { TestBed } from '@angular/core/testing';

import { MouseService } from './mouse.service';

describe('MouseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MouseService = TestBed.get(MouseService);
    expect(service).toBeTruthy();
  });
});
