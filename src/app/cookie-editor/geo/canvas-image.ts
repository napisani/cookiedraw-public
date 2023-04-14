import {CanvasEntity} from './canvas-entity';
import {Point} from './point';
import {Collidable} from '../canvas/feedback/collidable';
import {CollisionDetector} from '../canvas/feedback/detectors/collision-detector';
import {RectangleCollisionDetector} from '../canvas/feedback/detectors/rectangle-collision-detector';
import {Rectangle} from './rectangle';

export class CanvasImage extends CanvasEntity<CanvasImage> implements Collidable {
  private _img: HTMLImageElement;
  offsetX = 0;
  offsetY = 0;
  height = 0;
  width = 0;
  private _aspectRatio = 0;

  static deserialize(rawData: any): CanvasImage {
    if (rawData) {
      return Object.assign(new CanvasImage(), rawData);
    }
    return null;
  }

  constructor() {
    super();
  }

  get img(): HTMLImageElement {
    return this._img;
  }

  set img(i: HTMLImageElement) {
    this._img = i;
    this.offsetY = 0;
    this.offsetX = 0;
    this.height = i.height;
    this.width = i.width;
    this._aspectRatio = i.width / i.height;

  }

  get aspetRatio(): number {
    return this._aspectRatio;
  }

  get corners(): Point[] {
    const topLeft = new Point(this.offsetX, this.offsetY);
    const topRight = new Point(this.offsetX + this.width, this.offsetY);
    const bottomRight = new Point(this.offsetX + this.width, this.offsetY + this.height);
    const bottomLeft = new Point(this.offsetX, this.offsetY + this.height);
    return [topLeft, topRight, bottomRight, bottomLeft];
  }

  get rectangle(): Rectangle {
    const [pt1, pt2, pt3, pt4] = this.corners;
    return new Rectangle(pt1, pt2, pt3, pt4);
  }


  deepCopy(): CanvasImage {
    const newImg = new CanvasImage();
    newImg.img = this.img; // TODO not a deep copy, should be -- find a good way to do this and come back to it
    newImg.height = this.height;
    newImg.width = this.width;
    newImg.offsetX = this.offsetX;
    newImg.offsetY = this.offsetY;
    return newImg;
  }

  getCollisionDetector(): CollisionDetector<Rectangle> {
    return RectangleCollisionDetector.getInstance();
  }


}
