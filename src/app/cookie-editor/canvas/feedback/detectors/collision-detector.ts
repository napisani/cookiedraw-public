import {Point} from '../../../geo/point';
import {Collidable} from '../collidable';

export interface CollisionDetector<T extends Collidable> {
  collidesWithPoint(obj: T, pt: Point, snapRadius: number): boolean;
}
