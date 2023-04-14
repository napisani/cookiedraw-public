import {DrawingCanvasState} from '../../../state/drawing-canvas-state';
import {MouseState} from '../../../state/mouse-state';

export interface CollisionHandler {
  shouldHandleCollisions(state: DrawingCanvasState): boolean;

  handleCollisions(state: DrawingCanvasState, oldMouseState: MouseState, newMouseState: MouseState);
}
