import {Point} from './point';
import {CanvasEntity} from './canvas-entity';

export class Line extends CanvasEntity<Line> {

  constructor(public start: Point, public end: Point) {
    super();
  }

  deepCopy(): Line {
    return new Line(this.start.deepCopy(), this.end.deepCopy());
  }
}


