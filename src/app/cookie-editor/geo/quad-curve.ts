import {Point} from './point';
import {CanvasEntity} from './canvas-entity';
import {SavedQuadCurve} from '../../shared/cookie-cutter/cookie-cutter.interface';

// Quadratic Bézier curve
export class QuadCurve extends CanvasEntity<QuadCurve> implements SavedQuadCurve {

  static instanceFromSavedQuad(savedQuad: SavedQuadCurve): QuadCurve {
    if (savedQuad) {
      return new QuadCurve(
        Point.instanceFromSavedPoint(savedQuad.start),
        Point.instanceFromSavedPoint(savedQuad.middle),
        Point.instanceFromSavedPoint(savedQuad.end),
      );
    }
    return null;
  }

  static instanceFromArray(pts: Point[]): QuadCurve {
    if (!pts || pts.length < 2) {
      throw Error('not enough points to make a quad line');
    }
    if (pts.length === 2) {
      return new QuadCurve(pts[0], Point.pointBetweenPoints(pts[0], pts[1]), pts[1]);
    }
    return new QuadCurve(pts[0], pts[1], pts[2]);
  }

  static deserialize(rawObject): QuadCurve {
    if (rawObject) {
      const quad = Object.assign(new QuadCurve(null, null, null), rawObject) as QuadCurve;
      quad.start = Point.deserialize(quad.start);
      quad.middle = Point.deserialize(quad.middle);
      quad.end = Point.deserialize(quad.end);
      return quad;
    }
    return null;
  }


  constructor(public start: Point, public middle, public end: Point) {
    super();
  }

  get points(): Point[] {
    return [this.start, this.middle, this.end];
  }

  getOnlyEndPoints(): Point[] {
    return [this.start, this.end];
  }


  deepCopy(): QuadCurve {
    return new QuadCurve(
      this.start.deepCopy(),
      this.middle.deepCopy(),
      this.end.deepCopy()
    );
  }
}
