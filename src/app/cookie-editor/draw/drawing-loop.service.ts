import {Injectable, NgZone} from '@angular/core';
import {AnimationFrameService} from '../../shared/animation-frame.service';

@Injectable({
  providedIn: 'root'
})
export class DrawingLoopService {

  constructor(private animationFrameService: AnimationFrameService,
              private ngZone: NgZone) {
  }


  public drawLoop(renderCanvas: () => void) {
    this.animationFrameService.requestAnimationFrame(this.drawLoop.bind(this, renderCanvas));
    renderCanvas();
  }
}
