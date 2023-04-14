import {Injectable} from '@angular/core';
import {CollisionHandler} from './collision-handler';
import {CanvasMode, DrawingCanvasState} from '../../../state/drawing-canvas-state';
import {MouseState} from '../../../state/mouse-state';
import {Point} from '../../../geo/point';
import {MouseService} from '../mouse.service';
import {CanvasModifyCommand} from '../../../state/cmds/drawing-canvas-commands';
import {QuadCurve} from '../../../geo/quad-curve';
import {DrawingCanvasStateService} from '../../../state/drawing-canvas-state.service';
import {CanvasConstants} from '../../../../shared/canvas-constants';

@Injectable({
  providedIn: 'root'
})
export class AddLineCollisionService implements CollisionHandler {


  constructor(private mouseService: MouseService,
              private canvasStateService: DrawingCanvasStateService) {
  }

  handleCollisions(state: DrawingCanvasState, oldMouseState: MouseState, newMouseState: MouseState) {
    const leftClicked = this.mouseService.mouseClicked(oldMouseState, newMouseState);
    const rightClicked = this.mouseService.mouseRightClicked(oldMouseState, newMouseState);

    if (leftClicked || rightClicked) {
      const collidingPointIndex = state.points.findIndex((pt: Point) => {
        return pt.getCollisionDetector().collidesWithPoint(pt, newMouseState.position, CanvasConstants.pointSize);
      });
      if (collidingPointIndex > -1) {
        if (rightClicked) {
          this.removePoints(state, collidingPointIndex);
        } else {
          this.completePolygon(state, collidingPointIndex);
        }
      } else if (leftClicked) {
        this.addPoint(state, newMouseState.initialClickPosition);
      }
    }
  }

  shouldHandleCollisions(state: DrawingCanvasState): boolean {
    return this.inAddLineMode(state);
  }


  private inAddLineMode(state: DrawingCanvasState): boolean {
    return !!(state && state.mode === CanvasMode.ADD_LINES && state.points);
  }

  private completePolygon(state: DrawingCanvasState, collidingPointIndex: number) {
    const statePolygon = state.deepCopy();
    const slicedPoints = statePolygon.points.slice(collidingPointIndex);
    if (slicedPoints.length > 2) {
      const cmd = new CanvasModifyCommand();
      console.log('slicing at idx ', slicedPoints);
      slicedPoints.push(slicedPoints[0].deepCopy());
      const curvePoints = [];
      const quads = [];
      slicedPoints.forEach((pt: Point) => {
        curvePoints.push(pt.deepCopy());
        if (curvePoints.length === 2) {
          quads.push(QuadCurve.instanceFromArray(curvePoints));
          curvePoints.shift();
        }
      });
      statePolygon.setQuads(quads);
      statePolygon.mode = CanvasMode.QUAD_ADJUST;
      cmd.currentState = statePolygon;
      cmd.cmdName = 'COMPLETE_POLYGON';
      this.canvasStateService.doCommand(cmd);
    }

  }

  private addPoint(state: DrawingCanvasState, pt: Point) {
    const c = state.deepCopy();
    c.points.push(pt);
    const cmd = new CanvasModifyCommand();
    cmd.cmdName = 'ADD_POINT';
    cmd.currentState = c;
    this.canvasStateService.doCommand(cmd);
  }


  private removePoints(state: DrawingCanvasState, collidingPointIndex: number) {
    const c = state.deepCopy();
    const slicedPoints = c.points.slice(0, collidingPointIndex);
    c.points = slicedPoints;
    const cmd = new CanvasModifyCommand();
    cmd.cmdName = 'REMOVE_POINTS';
    cmd.currentState = c;
    this.canvasStateService.doCommand(cmd);
  }
}
