import {Drawer} from './drawer';
import {DrawingCanvasState} from '../state/drawing-canvas-state';
import {Line} from '../geo/line';
import {CanvasConstants} from '../../shared/canvas-constants';

export class LineDrawer implements Drawer<Line> {

  constructor(public color: string, public alpha = 1) {

  }

  draw(ctx: CanvasRenderingContext2D, state: DrawingCanvasState, entity: Line) {
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.lineWidth = CanvasConstants.lineWidth;
    ctx.moveTo(entity.start.x, entity.start.y);
    ctx.lineTo(entity.end.x, entity.end.y);
    ctx.stroke();

  }

}
