import {Injectable} from '@angular/core';
import {MouseState} from '../../state/mouse-state';
import {DrawingCanvasState} from '../../state/drawing-canvas-state';
import {DrawingCanvasStateService} from '../../state/drawing-canvas-state.service';
import {MouseService} from './mouse.service';
import {AddLineCollisionService} from './handlers/add-line-collision.service';
import {AddImageCollisionService} from './handlers/add-image-collision.service';
import {QuadAdjustCollisionService} from './handlers/quad-adjust-collision.service';
import {CollisionHandler} from './handlers/collision-handler';


@Injectable({
  providedIn: 'root'
})
export class CollisionService {

  private state: DrawingCanvasState;
  private handlers: CollisionHandler[];

  constructor(private canvasStateService: DrawingCanvasStateService,
              private mouseService: MouseService,
              private addLineCollisionHandler: AddLineCollisionService,
              private addImageCollisionHandler: AddImageCollisionService,
              private quadAdjustCollisionHandler: QuadAdjustCollisionService) {
    this.handlers = [
      this.addLineCollisionHandler,
      this.quadAdjustCollisionHandler,
      this.addImageCollisionHandler
    ];
    this.registerCanvasStateSubscription();
  }

  private registerCanvasStateSubscription() {
    this.canvasStateService.getCurrentState().subscribe((newState: DrawingCanvasState) => {
      this.state = newState;
    });
  }


  handleCollisions(oldMouseState: MouseState, newMouseState: MouseState) {
    const state = this.state;
    this.handlers.forEach((handler: CollisionHandler) => {
      if (handler.shouldHandleCollisions(state)) {
        handler.handleCollisions(state, oldMouseState, newMouseState);
        return;
      }
    });
  }
}
