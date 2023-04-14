import {CanvasEntity} from './canvas-entity';
import {Point} from './point';
import {Collidable} from '../canvas/feedback/collidable';
import {CollisionDetector} from '../canvas/feedback/detectors/collision-detector';
import {RectangleCollisionDetector} from '../canvas/feedback/detectors/rectangle-collision-detector';

export type RectanglePointType = 'TOP_LEFT' | 'TOP_RIGHT' | 'BOTTOM_RIGHT' | 'BOTTOM_LEFT';

const types: RectanglePointType[] = ['TOP_LEFT', 'TOP_RIGHT', 'BOTTOM_RIGHT', 'BOTTOM_LEFT'];

export class Rectangle extends CanvasEntity<Rectangle> implements Collidable {

  static getPointTypeByCornerIndex(idx: number): RectanglePointType {
    return types[idx];
  }

  constructor(public topLeft: Point, public topRight: Point, public bottomRight: Point, public bottomLeft: Point) {
    super();
  }

  deepCopy(): Rectangle {
    return new Rectangle(
      this.topLeft.deepCopy(),
      this.topRight.deepCopy(),
      this.bottomRight.deepCopy(),
      this.bottomLeft.deepCopy()
    );
  }

  get corners(): Point[] {
    return [this.topLeft, this.topRight, this.bottomRight, this.bottomLeft];
  }


  getCollisionDetector(): CollisionDetector<Rectangle> {
    return RectangleCollisionDetector.getInstance();
  }
}


