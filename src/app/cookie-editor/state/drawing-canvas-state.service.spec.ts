import { TestBed } from '@angular/core/testing';

import { DrawingCanvasStateService } from './drawing-canvas-state.service';

describe('DrawingCanvasStateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DrawingCanvasStateService = TestBed.get(DrawingCanvasStateService);
    expect(service).toBeTruthy();
  });
});
