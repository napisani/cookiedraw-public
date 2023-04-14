import {AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {CanvasConstants} from '../../shared/canvas-constants';
import {DrawingLoopService} from '../draw/drawing-loop.service';
import {PointDrawer} from '../draw/point-drawer';
import {QuadCurveDrawer} from '../draw/quad-curve-drawer';
import {QuadCurve} from '../geo/quad-curve';
import {SavedCanvasState} from '../../shared/cookie-cutter/cookie-cutter.interface';
import {DrawingCanvasState} from '../state/drawing-canvas-state';

@Component({
  selector: 'app-preview-canvas',
  templateUrl: './preview-canvas.component.html',
  styleUrls: ['./preview-canvas.component.scss']
})
export class PreviewCanvasComponent implements OnInit, OnChanges, AfterViewInit {
  @ViewChild('cookiePreviewCanvas') canvas: ElementRef;

  @Input()
  savedState: SavedCanvasState;
  @Input()
  width = CanvasConstants.canvasWidth;
  height = CanvasConstants.canvasHeight;
  windowHeight = CanvasConstants.canvasHeight;
  windowWidth = CanvasConstants.canvasWidth;
  canvasState: DrawingCanvasState;
  ctx: CanvasRenderingContext2D;
  scale = 1;
  drawn: boolean;

  constructor(
    private drawService: DrawingLoopService) {
  }

  ngOnInit() {
    this.drawn = false;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.hasOwnProperty('savedState')) {
      this.canvasState = DrawingCanvasState.instanceFromSavedCanvasState(this.savedState);
    }
    this.drawn = false;
    this.scale = this.width / this.windowWidth;

  }


  ngAfterViewInit(): void {
    this.ctx = (this.canvas.nativeElement as HTMLCanvasElement).getContext('2d');
    this.drawService.drawLoop(() => {
      this.render();
    });
  }


  private shouldDraw(): boolean {
    return !this.drawn && !!this.canvasState;
  }

  private render() {
    if (this.shouldDraw()) {
      const ctx = this.ctx;
      ctx.clearRect(0, 0, this.windowWidth, this.windowHeight);

      const quadDrawer = new QuadCurveDrawer(CanvasConstants.lineColor);
      const edgeDraw = new PointDrawer(CanvasConstants.pointColor1);
      const midDraw = new PointDrawer(CanvasConstants.pointColor2);
      ctx.scale(this.scale, this.scale);
      this.canvasState.quads.forEach((quad: QuadCurve) => {

        quadDrawer.draw(ctx, this.canvasState, quad);
        // midDraw.draw(ctx, this.canvasState, quad.middle);
        // edgeDraw.draw(ctx, this.canvasState, quad.start);
        // edgeDraw.draw(ctx, this.canvasState, quad.end);
      });


      this.drawn = true;
    }
  }
}

