import {Injectable} from '@angular/core';
import {StateRetentionService} from '../../shared/state-retention.service';
import {DrawingCanvasState} from './drawing-canvas-state';

@Injectable({
  providedIn: 'root'
})
export class DrawingCanvasStateService extends StateRetentionService<DrawingCanvasState> {

  constructor() {
    super();
  }
}
