import { TestBed } from '@angular/core/testing';

import { AddLineCollisionService } from './add-line-collision.service';

describe('AddLineCollisionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AddLineCollisionService = TestBed.get(AddLineCollisionService);
    expect(service).toBeTruthy();
  });
});
