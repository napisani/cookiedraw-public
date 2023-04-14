import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ThreeEngineService} from './three-engine.service';
import {CanvasConstants} from '../../shared/canvas-constants';
import {DrawingCanvasState} from '../state/drawing-canvas-state';
import {DrawingCanvasStateService} from '../state/drawing-canvas-state.service';
import {LoggerService} from '../../shared/log/logger.service';
import {CookieCutter} from '../../shared/cookie-cutter/cookie-cutter';

@Component({
  selector: 'app-extrusion-preview',
  templateUrl: './extrusion-preview.component.html',
  styleUrls: ['./extrusion-preview.component.scss'],
})
export class ExtrusionPreviewComponent implements OnInit {

  @Input() cookieCutter: CookieCutter;
  @Output()
  download = new EventEmitter<void>();

  @Output()
  addedToCart = new EventEmitter<void>();

  windowHeight = CanvasConstants.previewHeight;
  windowWidth = CanvasConstants.previewWidth;
  spinPreview = false;
  private canvasInit = false;

  @ViewChild('rendererCanvas', {static: true})
  public rendererCanvas: ElementRef<HTMLCanvasElement>;

  constructor(public engServ: ThreeEngineService,
              private canvasStateService: DrawingCanvasStateService,
              private log: LoggerService) {
    this.log = log.getSpecificLogger('ExtrusionPreviewComponent');
  }

  ngOnInit() {

    this.registerCanvasStateSubscription();
  }

  private registerCanvasStateSubscription() {
    this.canvasStateService.getCurrentState().subscribe((newState: DrawingCanvasState) => {
      if (!this.canvasInit && newState) {
        this.canvasInit = true;
        this.afterCanvasInit();
      }
    });
  }

  private afterCanvasInit() {
    this.engServ.createScene(this.rendererCanvas);
    this.engServ.animate();
    // this.spinPreview = this.engServ.getSpin();
    this.log.trace('spin ' + this.spinPreview);
  }


  public isRendering() {
    return this.engServ.pendingRenderUpdates;
  }

  public getHeader(): string {
    return `3D Preview${this.isRendering() ? ' (Render pending)' : ''}`;
  }

  // handleSpinChange(event: boolean) {
  //   console.log(event);
  //   this.engServ.setSpin(event);
  // }
}
