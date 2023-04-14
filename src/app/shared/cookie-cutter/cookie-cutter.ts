import {SavedCookieCutter, SavedCookieCutterTag} from './cookie-cutter.interface';
import {DrawingCanvasState} from '../../cookie-editor/state/drawing-canvas-state';
import {DeepCopyable} from '../deep-copyable';

export class CookieCutterMetadata {
  cutterId: number;
  name: string;
  description: string;
  approved: boolean;
  rating: number;
  downloadCount: number;
  createdAt: number;
  updatedAt: number;
  tags: CookieCutterTag[];

  static instanceFromCookieCutter(cc: CookieCutter) {
    const m = new CookieCutterMetadata();
    if (cc) {
      m.cutterId = cc.cutterId;
      m.name = cc.name;
      m.description = cc.description;
      if (cc.tags) {
        m.tags = cc.tags.map(t => t.deepCopy());
      }
    }
    return m;
  }
}


export class CookieCutter implements SavedCookieCutter, CookieCutterMetadata, DeepCopyable<CookieCutter> {
  approved: boolean;
  reviewed: boolean;

  canvasState: DrawingCanvasState;
  cutterId: number;
  description: string;
  name: string;
  createdAt: number;
  downloadCount: number;
  rating: number;
  updatedAt: number;
  tags: CookieCutterTag[];

  static instanceFromSavedCookieCutter(savedCutter: SavedCookieCutter): CookieCutter {
    let c = new CookieCutter();
    if (savedCutter) {
      c = Object.assign(c, savedCutter);
      if (savedCutter.canvasState) {
        c.canvasState = DrawingCanvasState.instanceFromSavedCanvasState(savedCutter.canvasState);
      }
      if (savedCutter.tags) {
        c.tags = savedCutter.tags.map(t => CookieCutterTag.instanceFromSavedCookieCutterTag(t));
      }
    }
    return c;
  }

  static deserialize(rawObject): CookieCutter {
    if (rawObject) {
      const cutter = Object.assign(new CookieCutter(), rawObject) as CookieCutter;
      cutter.canvasState = DrawingCanvasState.deserialize(cutter.canvasState);
      return cutter;
    }
    return null;
  }

  deepCopy(): CookieCutter {
    const cc = new CookieCutter();
    cc.approved = this.approved;
    if (this.canvasState) {
      cc.canvasState = this.canvasState.deepCopy();
    }
    cc.cutterId = this.cutterId;
    cc.description = this.description;
    cc.name = this.name;
    if (this.tags) {
      cc.tags = this.tags.map(t => t.deepCopy());
    }

    return cc;
  }


}


export class CookieCutterTag implements SavedCookieCutterTag, DeepCopyable<CookieCutterTag> {
  tag: string;
  cookieCutters: CookieCutter[];

  static instanceFromSavedCookieCutterTag(t: SavedCookieCutterTag): CookieCutterTag {
    const newT = new CookieCutterTag();
    if (t) {
      newT.tag = t.tag;
      if (t.cookieCutters) {
        newT.cookieCutters = t.cookieCutters.map(cc => CookieCutter.instanceFromSavedCookieCutter(cc));
      }
    }
    return newT;
  }

  deepCopy(): CookieCutterTag {
    const t = new CookieCutterTag();
    t.tag = this.tag;
    if (this.cookieCutters) {
      t.cookieCutters = this.cookieCutters.map(cc => cc.deepCopy());
    }
    return t;
  }

}
