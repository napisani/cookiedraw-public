import {Injectable} from '@angular/core';
import {MouseEventType, MouseState} from '../../state/mouse-state';


@Injectable({
  providedIn: 'root'
})
export class MouseService {

  constructor() {
  }

  mouseClicked(oldState: MouseState, newState: MouseState): boolean {
    return !!(!oldState.clickedDown && newState.clickedDown && newState.initialClickPosition);
  }

  mouseRightClicked(oldState: MouseState, newState: MouseState): boolean {
    return !!(!oldState.rightClickedDown && newState.rightClickedDown && newState.initialClickPosition);
  }


  mouseDragged(oldState: MouseState, newState: MouseState): boolean {
    return newState.clickedDown && oldState.clickedDown && newState.lastEventType === MouseEventType.MOVE;
  }


}
