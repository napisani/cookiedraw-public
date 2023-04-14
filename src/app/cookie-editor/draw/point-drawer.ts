import {Point} from '../geo/point';
import {Drawer} from './drawer';
import {DrawingCanvasState} from '../state/drawing-canvas-state';
import {CanvasConstants} from '../../shared/canvas-constants';

export class PointDrawer implements Drawer<Point> {

  constructor(public color: string) {
  }

  draw(ctx: CanvasRenderingContext2D, state: DrawingCanvasState, entity: Point) {
    ctx.globalAlpha = 1;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(entity.x, entity.y, CanvasConstants.pointSize, 0, 2 * Math.PI);
    ctx.fill();
  }

}
