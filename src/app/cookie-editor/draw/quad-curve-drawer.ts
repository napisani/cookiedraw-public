import {Drawer} from './drawer';
import {DrawingCanvasState} from '../state/drawing-canvas-state';
import {QuadCurve} from '../geo/quad-curve';

export class QuadCurveDrawer implements Drawer<QuadCurve> {

  constructor(public color: string, public alpha = 1, public lineWidth = 5) {

  }

  draw(ctx: CanvasRenderingContext2D, state: DrawingCanvasState, entity: QuadCurve) {
    ctx.globalAlpha = this.alpha;
    ctx.lineWidth = this.lineWidth;
    ctx.beginPath();
    ctx.moveTo(entity.start.x, entity.start.y);
    ctx.quadraticCurveTo(entity.middle.x, entity.middle.y, entity.end.x, entity.end.y);
    ctx.stroke();
  }

}
