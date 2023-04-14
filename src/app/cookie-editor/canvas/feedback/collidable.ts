import {CollisionDetector} from './detectors/collision-detector';

export interface Collidable {
  getCollisionDetector(): CollisionDetector<Collidable>;
}
