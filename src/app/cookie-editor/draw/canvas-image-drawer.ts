import {Drawer} from './drawer';
import {DrawingCanvasState} from '../state/drawing-canvas-state';
import {CanvasImage} from '../geo/canvas-image';
import {PointDrawer} from './point-drawer';
import {Rectangle} from '../geo/rectangle';
import {RectangleDrawer} from './rectangle-drawer';

export class CanvasImageDrawer implements Drawer<CanvasImage> {

  constructor(public imageAlpha = 1) {
  }

  draw(ctx: CanvasRenderingContext2D, state: DrawingCanvasState, entity: CanvasImage) {
    ctx.globalAlpha = this.imageAlpha;
    const img = entity;
    ctx.drawImage(img.img, img.offsetX, img.offsetY, img.width, img.height);
    ctx.globalAlpha = 1;
  }

  drawControls(lineColor: string, pointColor: string, ctx: CanvasRenderingContext2D, state: DrawingCanvasState, entity: CanvasImage) {
    ctx.globalAlpha = 1;
    const img = entity;
    const [pt1, pt2, pt3, pt4] = img.corners;
    const rect = new Rectangle(pt1, pt2, pt3, pt4);
    const rectDrawer = new RectangleDrawer(lineColor);
    rectDrawer.draw(ctx, state, rect);
    const ptDrawer = new PointDrawer(pointColor);
    ptDrawer.draw(ctx, state, pt1);
    ptDrawer.draw(ctx, state, pt2);
    ptDrawer.draw(ctx, state, pt3);
    ptDrawer.draw(ctx, state, pt4);


  }

}
