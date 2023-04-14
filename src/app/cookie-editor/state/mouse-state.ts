import {Point} from '../geo/point';
import {DeepCopyable} from '../../shared/deep-copyable';

export enum MouseEventType {
  DOWN, UP, MOVE, RIGHT_DOWN, RIGHT_UP
}

export class MouseState implements DeepCopyable<MouseState> {
  clickedDown = false;
  rightClickedDown = false;
  initialClickPosition: Point;
  position: Point;
  dragging = false;
  lastEventType: MouseEventType;

  constructor() {
  }

  deepCopy(): MouseState {
    const s = new MouseState();
    s.clickedDown = this.clickedDown;
    s.dragging = this.dragging;
    s.lastEventType = this.lastEventType;
    if (this.initialClickPosition) {
      s.initialClickPosition = this.initialClickPosition.deepCopy();
    }
    if (this.position) {
      s.position = this.position.deepCopy();
    }
    return s;
  }
}
