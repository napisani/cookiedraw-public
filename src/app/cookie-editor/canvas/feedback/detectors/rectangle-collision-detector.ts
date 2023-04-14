import {CollisionDetector} from './collision-detector';
import {Point} from '../../../geo/point';
import {Rectangle} from '../../../geo/rectangle';

export class RectangleCollisionDetector implements CollisionDetector<Rectangle> {
  private static instance: RectangleCollisionDetector;

  private constructor() {
  }

  public static getInstance(): RectangleCollisionDetector {
    if (!RectangleCollisionDetector.instance) {
      this.instance = new RectangleCollisionDetector();
    }
    return this.instance;
  }


  collidesWithPoint(obj: Rectangle, pt: Point, snapRadius: number): boolean {
    return this.isPointInRect(pt, obj);
  }

  isPointInRect(pt: Point, rect: Rectangle): boolean {
    const pts = rect.corners.sort((pt1, pt2) => {
      const distanceFromOrigin1 = this.getDistanceFromOrigin(pt1);
      const distanceFromOrigin2 = this.getDistanceFromOrigin(pt2);
      // sort by distance from origin, lowest first
      return distanceFromOrigin1 - distanceFromOrigin2;
    });
    const topLeft = pts[0];
    const bottomRight = pts[3];
    if (pt.x <= bottomRight.x && pt.x >= topLeft.x && pt.y >= topLeft.y && pt.y <= bottomRight.y) {
      return true;
    }
    return false;
  }

  private getDistanceFromOrigin(point: Point) {
    const x = point.x;
    const y = point.y;
    // return (x * x) + (y * y);
    return (x) + (y);

  }


}
