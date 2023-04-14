import {CollisionDetector} from './collision-detector';
import {Point} from '../../../geo/point';

export class PointCollisionDetector implements CollisionDetector<Point> {
  private static instance: PointCollisionDetector;

  private constructor() {
  }

  public static getInstance(): PointCollisionDetector {
    if (!PointCollisionDetector.instance) {
      this.instance = new PointCollisionDetector();
    }
    return this.instance;
  }


  collidesWithPoint(obj: Point, pt: Point, snapRadius: number): boolean {
    return this.isPointInCircle(pt, obj, snapRadius);
  }

  isPointInCircle(pt: Point, circleCenter: Point, r: number): boolean {
    const distPoints = (pt.x - circleCenter.x) * (pt.x - circleCenter.x) + (pt.y - circleCenter.y) * (pt.y - circleCenter.y);
    r *= r;
    if (distPoints < r) {
      return true;
    }
    return false;
  }

}
