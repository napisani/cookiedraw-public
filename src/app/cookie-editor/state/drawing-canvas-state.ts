import {Point} from '../geo/point';
import {DeepCopyable} from '../../shared/deep-copyable';
import {QuadCurve} from '../geo/quad-curve';
import {CanvasImage} from '../geo/canvas-image';
import {SavedCanvasState} from '../../shared/cookie-cutter/cookie-cutter.interface';
import {PostDeserializePatchable} from '../../shared/serialize';

export enum CanvasMode {
  ADD_LINES,
  QUAD_ADJUST,
  ADD_IMAGE
}

export class DrawingCanvasState implements DeepCopyable<DrawingCanvasState>,
  SavedCanvasState,
  PostDeserializePatchable {
  mode: CanvasMode;
  points: Point[];
  backgroundImage: CanvasImage;
  quads: QuadCurve[];

  static instanceFromSavedCanvasState(sc: SavedCanvasState): DrawingCanvasState {
    const state = new DrawingCanvasState();
    state.mode = CanvasMode.ADD_IMAGE;

    if (sc) {
      if (sc.quads && sc.quads.length > 0) {
        state.setQuads(sc.quads.map(savedQuad => QuadCurve.instanceFromSavedQuad(savedQuad)));
        state.mode = CanvasMode.QUAD_ADJUST;
      } else if (sc.points && sc.points.length > 0) {
        state.points = sc.points.map(sp => Point.instanceFromSavedPoint(sp));
        state.mode = CanvasMode.ADD_LINES;
      }
      return state;
    }
    // drawingCanvas.quads
    return null;
  }

  static deserialize(rawObject): DrawingCanvasState {
    if (rawObject) {
      const state = Object.assign(new DrawingCanvasState(), rawObject) as DrawingCanvasState;
      state.mode = CanvasMode.ADD_IMAGE;
      if (rawObject.quads && rawObject.quads.length !== 0) {
        state.points = [];
        state.setQuads(rawObject.quads.map((q: any) => QuadCurve.deserialize(q)));
        state.mode = CanvasMode.QUAD_ADJUST;
      } else if (rawObject.points && rawObject.points.length !== 0) {
        state.points = rawObject.points.map(p => Point.deserialize(p));
        state.mode = CanvasMode.ADD_LINES;
      }
      state.backgroundImage = CanvasImage.deserialize(rawObject.backgroundImage);
      return state;
    }
    return null;
  }

  constructor() {
    this.points = [];
    this.quads = [];
    this.mode = CanvasMode.ADD_IMAGE;
  }


  setQuads(newQuads: QuadCurve[]) {
    this.quads = newQuads;
    this.points = [];
    newQuads.forEach((quad) => {
      this.points.push(...quad.points.map(pt => pt.deepCopy()));
    });
  }

  deepCopy(): DrawingCanvasState {
    const s = new DrawingCanvasState();
    s.points = [...this.points.map(p => p.deepCopy())];
    s.mode = this.mode;
    s.quads = [...this.quads.map(q => q.deepCopy())];
    if (this.backgroundImage) {
      s.backgroundImage = this.backgroundImage.deepCopy();
    }
    return s;
  }

  runPostDeserializePatch() {
    // console.log('runPostDeserializePatch - running for state');
    // this.mode = CanvasMode.ADD_IMAGE;
    // this.points = [];
    // if (!this._quads) {
    //   this._quads = [];
    // } else {
    //   this.quads = this._quads;
    // }

  }

}
