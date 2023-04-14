import {Drawer} from './drawer';
import {DrawingCanvasState} from '../state/drawing-canvas-state';
import {Rectangle} from '../geo/rectangle';
import {LineDrawer} from './line-drawer';
import {Line} from '../geo/line';

export class RectangleDrawer implements Drawer<Rectangle> {

  constructor(public color: string) {
  }

  draw(ctx: CanvasRenderingContext2D, state: DrawingCanvasState, entity: Rectangle) {
    ctx.globalAlpha = 1;
    const lineDrawer = new LineDrawer(this.color);
    lineDrawer.draw(ctx, state, new Line(entity.topLeft, entity.topRight));
    lineDrawer.draw(ctx, state, new Line(entity.topRight, entity.bottomRight));
    lineDrawer.draw(ctx, state, new Line(entity.bottomRight, entity.bottomLeft));
    lineDrawer.draw(ctx, state, new Line(entity.bottomLeft, entity.topLeft));
  }

}
