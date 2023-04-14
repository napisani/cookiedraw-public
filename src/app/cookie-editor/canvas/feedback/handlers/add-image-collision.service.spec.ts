import { TestBed } from '@angular/core/testing';

import { AddImageCollisionService } from './add-image-collision.service';

describe('AddImageCollisionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AddImageCollisionService = TestBed.get(AddImageCollisionService);
    expect(service).toBeTruthy();
  });
});
