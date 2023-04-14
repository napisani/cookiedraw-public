import {Injectable} from '@angular/core';
import {CollisionHandler} from './collision-handler';
import {CanvasMode, DrawingCanvasState} from '../../../state/drawing-canvas-state';
import {MouseState} from '../../../state/mouse-state';
import {Point} from '../../../geo/point';
import {MouseService} from '../mouse.service';
import {DrawingCanvasStateService} from '../../../state/drawing-canvas-state.service';
import {QuadCurve} from '../../../geo/quad-curve';
import {CanvasModifyCommand} from '../../../state/cmds/drawing-canvas-commands';
import {CanvasConstants} from '../../../../shared/canvas-constants';

@Injectable({
  providedIn: 'root'
})
export class QuadAdjustCollisionService implements CollisionHandler {
  private selectedPt: Point;


  constructor(private mouseService: MouseService,
              private canvasStateService: DrawingCanvasStateService) {
  }

  handleCollisions(state: DrawingCanvasState, oldMouseState: MouseState, newMouseState: MouseState) {
    const leftClicked = this.mouseService.mouseClicked(oldMouseState, newMouseState);
    const rightClicked = this.mouseService.mouseRightClicked(oldMouseState, newMouseState);

    if (leftClicked || rightClicked) {
      const clickedPt = state.points.find((pt: Point) => {
        return pt.getCollisionDetector().collidesWithPoint(pt, newMouseState.position, CanvasConstants.pointSize);
      });
      if (leftClicked) {
        this.selectedPt = clickedPt;
      } else {
        const quadIdx = state.quads.findIndex((q) => Point.areEqual(q.middle, clickedPt));
        if (quadIdx > -1) {
          this.splitQuadInTwo(quadIdx, clickedPt, state);
        } else if (state.quads.length > 3) {
          const quadIdxStart = state.quads.findIndex((q) => Point.areEqual(q.start, clickedPt));
          const quadIdxEnd = state.quads.findIndex((q) => Point.areEqual(q.end, clickedPt));
          if (quadIdxEnd > -1 && quadIdxStart > -1) {
            this.bridgeQuad(quadIdxStart, quadIdxEnd, clickedPt, state);
          }
        }
      }
    } else if (this.mouseService.mouseDragged(oldMouseState, newMouseState) && this.selectedPt) {
      this.selectedPt = this.movePoint(state, this.selectedPt, newMouseState.position);
    } else if (this.selectedPt) {
      this.commitPointMove(state);
      this.selectedPt = null;
    }
  }

  shouldHandleCollisions(state: DrawingCanvasState): boolean {
    return !!(this.inQuadAdjustMode(state) || this.selectedPt);
  }

  private inQuadAdjustMode(state: DrawingCanvasState): boolean {
    return !!(state && state.mode === CanvasMode.QUAD_ADJUST && state.quads);
  }


  private splitQuadInTwo(quadIdx: number, pt: Point, state: DrawingCanvasState) {
    const s = state.deepCopy();
    const modifiedQuads = s.quads;
    const newQuad = modifiedQuads[quadIdx].deepCopy();
    modifiedQuads[quadIdx].end = pt.deepCopy();
    modifiedQuads[quadIdx].middle = Point.pointBetweenPoints(modifiedQuads[quadIdx].start, pt);
    quadIdx++;
    if (quadIdx === state.quads.length) {
      quadIdx = 0;
    }
    newQuad.start = pt.deepCopy();
    newQuad.middle = Point.pointBetweenPoints(pt, newQuad.end);
    modifiedQuads.splice(quadIdx, 0, newQuad);
    s.setQuads(modifiedQuads);
    const cmd = new CanvasModifyCommand();
    cmd.cmdName = 'SPLIT_QUAD';
    cmd.currentState = s;
    this.canvasStateService.doCommand(cmd);
  }

  private bridgeQuad(quadIdxStart: number, quadIdxEnd: number, pt: Point, state: DrawingCanvasState) {
    // const s = state.deepCopy();
    // const modifiedQuads = s.quads;
    // const newQuad = modifiedQuads[quadIdxStart].deepCopy();
    // newQuad.end = modifiedQuads[quadIdxEnd].end;
    // newQuad.middle = Point.pointBetweenPoints(newQuad.start, newQuad.end);
    // modifiedQuads.splice(quadIdxEnd, 1);
    // s.quads = modifiedQuads;
    // const cmd = new CanvasModifyCommand();
    // cmd.cmdName = 'BRIDGE_QUADS';
    // cmd.currentState = s;
    // this.canvasStateService.doCommand(cmd);
  }

  private commitPointMove(state: DrawingCanvasState) {
    const moveState = state.deepCopy();
    const cmd = new CanvasModifyCommand();
    cmd.cmdName = 'COMMIT_POINT_MOVE';
    cmd.currentState = moveState;
    this.canvasStateService.doCommand(cmd);
  }

  private movePoint(state: DrawingCanvasState, selectedPt: Point, moveToPt: Point): Point {
    const moveState = state.deepCopy();
    const quads = moveState.quads;
    quads.forEach((quad: QuadCurve) => {
      quad.points.forEach((pt: Point) => {
        if (Point.areEqual(pt, selectedPt)) {
          pt.x = moveToPt.x;
          pt.y = moveToPt.y;
        }
      });
    });
    moveState.setQuads(quads);
    const cmd = new CanvasModifyCommand();
    cmd.currentState = moveState;
    cmd.transient = true;
    this.canvasStateService.doCommand(cmd);
    return moveToPt;
  }

}
