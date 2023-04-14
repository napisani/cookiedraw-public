import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AnimationFrameService {

  constructor() {
  }

  requestAnimationFrame(callback: () => void) {
    const win: any = window;

    const func = win.requestAnimationFrame ||
      win.webkitRequestAnimationFrame ||
      win.mozRequestAnimationFrame ||
      win.oRequestAnimationFrame ||
      win.msRequestAnimaitonFrame ||
      ((clbk: () => void) => {
          window.setTimeout(clbk, 1000 / 60);
        }
      );
    return func(callback);
  }
}
