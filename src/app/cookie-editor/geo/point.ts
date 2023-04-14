import {CanvasEntity} from './canvas-entity';
import {Collidable} from '../canvas/feedback/collidable';
import {CollisionDetector} from '../canvas/feedback/detectors/collision-detector';
import {PointCollisionDetector} from '../canvas/feedback/detectors/point-collision-detector';
import {SavedPoint} from '../../shared/cookie-cutter/cookie-cutter.interface';

export class Point extends CanvasEntity<Point> implements Collidable, SavedPoint {

  public static instanceFromSavedPoint(savedPoint): Point {
    if (savedPoint) {
      return new Point(savedPoint.x, savedPoint.y);
    }
    return null;
  }

  public static deserialize(rawObject): Point {
    if (rawObject) {
      return Object.assign(new Point(-1, -1), rawObject) as Point;
    }
    return null;
  }

  public static areEqual(pt1: Point, pt2: Point): boolean {
    if (!pt1 && !pt2) {
      return true;
    } else if (!pt1 || !pt2) {
      return false;
    }
    return JSON.stringify(pt1) === JSON.stringify(pt2);
  }

  public static pointBetweenPoints(pt1: Point, pt2: Point): Point {
    return new Point((pt1.x + pt2.x) / 2.0, (pt1.y + pt2.y) / 2.0);
  }

  public static distanceBetween(pt1: Point, pt2: Point): number {
    const a = pt1.x - pt2.x;
    const b = pt1.y - pt2.y;
    return Math.sqrt(a * a + b * b);
  }

  constructor(public x: number, public y: number) {
    super();
  }

  subtract(pt2: Point): Point {
    return new Point(this.x - pt2.x, this.y - pt2.y);
  }

  deepCopy(): Point {
    return new Point(this.x, this.y);
  }

  getCollisionDetector(): CollisionDetector<Point> {
    return PointCollisionDetector.getInstance();
  }


}
