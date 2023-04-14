import { TestBed } from '@angular/core/testing';

import { TutorialModalService } from './tutorial-modal.service';

describe('TutorialModalService', () => {
  let service: TutorialModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TutorialModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
