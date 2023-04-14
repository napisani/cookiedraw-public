import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {DrawingLoopService} from '../draw/drawing-loop.service';
import {CollisionService} from './feedback/collision.service';
import {MouseEventType, MouseState} from '../state/mouse-state';
import {CanvasMode, DrawingCanvasState} from '../state/drawing-canvas-state';
import {Point} from '../geo/point';
import {PointDrawer} from '../draw/point-drawer';
import {DrawingCanvasStateService} from '../state/drawing-canvas-state.service';
import {LineDrawer} from '../draw/line-drawer';
import {Line} from '../geo/line';
import {QuadCurveDrawer} from '../draw/quad-curve-drawer';
import {QuadCurve} from '../geo/quad-curve';
import {CanvasImageDrawer} from '../draw/canvas-image-drawer';
import {CanvasConstants} from '../../shared/canvas-constants';
import {CanvasSessionSettingsService} from '../toolbar/canvas-session-settings.service';
import {CanvasSessionSettings} from '../toolbar/canvas-session-settings';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit, AfterViewInit {
  @ViewChild('cookieCanvas') canvas: ElementRef;


  windowHeight = CanvasConstants.canvasHeight;
  windowWidth = CanvasConstants.canvasWidth;

  ctx: CanvasRenderingContext2D;

  mouseState: MouseState;
  canvasState: DrawingCanvasState;
  drawn: boolean;
  sessionSettings = new CanvasSessionSettings();

  constructor(
    private drawService: DrawingLoopService,
    private canvasStateService: DrawingCanvasStateService,
    private canvasSessionSettingsService: CanvasSessionSettingsService,
    private colService: CollisionService) {
  }

  ngOnInit() {
    this.mouseState = new MouseState();
    this.canvasState = new DrawingCanvasState();
    this.drawn = false;
    // this.canvasStateService.init(this.canvasState.deepCopy());
    this.registerCanvasStateSubscription();
    this.registerCanvasSessionSettingsSubscription();
  }

  private registerCanvasSessionSettingsSubscription() {
    this.canvasSessionSettingsService.getSettingsAsObservable().subscribe(settings => {
      this.sessionSettings = settings;
      this.drawn = false;

    });
  }

  private registerCanvasStateSubscription() {
    this.canvasStateService.getCurrentState().subscribe((newState: DrawingCanvasState) => {
      this.canvasState = newState;
      this.drawn = false;
    });
  }


  ngAfterViewInit(): void {
    this.ctx = (this.canvas.nativeElement as HTMLCanvasElement).getContext('2d');
    this.drawService.drawLoop(() => {
      this.render();
    });
  }

  handleMouseStateChange(newMouseState: MouseState) {
    this.colService.handleCollisions(this.mouseState, newMouseState);
    if (newMouseState.lastEventType === MouseEventType.MOVE) {
      this.drawn = false;
    }
    this.mouseState = newMouseState;
  }

  private shouldDraw(): boolean {
    return !this.drawn && !!this.canvasState;
  }

  private render() {
    if (this.shouldDraw()) {
      const ctx = this.ctx;
      const imgDrawer = new CanvasImageDrawer(this.sessionSettings.imageAlpha);
      ctx.clearRect(0, 0, this.windowWidth, this.windowHeight);

      if (this.canvasState.backgroundImage && this.canvasState.backgroundImage.img) {
        imgDrawer.draw(ctx, this.canvasState, this.canvasState.backgroundImage);
      }
      if (this.canvasState.mode === CanvasMode.ADD_IMAGE) {
        if (this.canvasState.backgroundImage && this.canvasState.backgroundImage.img) {
          imgDrawer.drawControls(
            CanvasConstants.lineColor,
            CanvasConstants.pointColor1,
            ctx,
            this.canvasState,
            this.canvasState.backgroundImage);
        }
      }
      if (this.canvasState.mode === CanvasMode.ADD_LINES || this.canvasState.mode === CanvasMode.ADD_IMAGE) {
        const lineDrawer = new LineDrawer(CanvasConstants.lineColor);
        const pd = new PointDrawer(CanvasConstants.pointColor1);

        let lastPt: Point;
        this.canvasState.points.forEach((pt: Point) => {
          if (lastPt) {
            const line = new Line(lastPt, pt);
            lineDrawer.draw(ctx, this.canvasState, line);
          }
          lastPt = pt;
        });
        if (lastPt && this.mouseState.position && this.canvasState.mode === CanvasMode.ADD_LINES) {
          const line = new Line(lastPt, this.mouseState.position);
          lineDrawer.draw(ctx, this.canvasState, line);
        }
        this.canvasState.points.forEach((pt: Point) => {
          pd.draw(ctx, this.canvasState, pt);
        });

        this.drawn = true;
      } else if (this.canvasState.mode === CanvasMode.QUAD_ADJUST) {
        const quadDrawer = new QuadCurveDrawer(CanvasConstants.lineColor);
        const edgeDraw = new PointDrawer(CanvasConstants.pointColor1);
        const midDraw = new PointDrawer(CanvasConstants.pointColor2);

        this.canvasState.quads.forEach((quad: QuadCurve) => {
          quadDrawer.draw(ctx, this.canvasState, quad);
          midDraw.draw(ctx, this.canvasState, quad.middle);
          edgeDraw.draw(ctx, this.canvasState, quad.start);
          edgeDraw.draw(ctx, this.canvasState, quad.end);
        });
        this.drawn = true;
      }
    }
  }
}

