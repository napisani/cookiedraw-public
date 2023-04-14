import {CanvasEntity} from '../geo/canvas-entity';
import {DrawingCanvasState} from '../state/drawing-canvas-state';

export interface Drawer<T extends CanvasEntity<T>> {
  draw(ctx: CanvasRenderingContext2D, state: DrawingCanvasState, entity: T);

}
