import {Injectable} from '@angular/core';
import {CollisionHandler} from './collision-handler';
import {CanvasMode, DrawingCanvasState} from '../../../state/drawing-canvas-state';
import {MouseState} from '../../../state/mouse-state';
import {MouseService} from '../mouse.service';
import {DrawingCanvasStateService} from '../../../state/drawing-canvas-state.service';
import {Point} from '../../../geo/point';
import {CanvasModifyCommand} from '../../../state/cmds/drawing-canvas-commands';
import {Rectangle, RectanglePointType} from '../../../geo/rectangle';
import {CanvasConstants} from '../../../../shared/canvas-constants';

@Injectable({
  providedIn: 'root'
})
export class AddImageCollisionService implements CollisionHandler {

  private selectedPt: RectanglePointType;
  private imgSelected: boolean;

  constructor(private mouseService: MouseService,
              private canvasStateService: DrawingCanvasStateService) {
  }


  shouldHandleCollisions(state: DrawingCanvasState): boolean {
    return !!(this.inAddImageMode(state) || this.imgSelected || this.selectedPt);
  }

  private inAddImageMode(state: DrawingCanvasState): boolean {
    return !!(state && state.mode === CanvasMode.ADD_IMAGE && state.backgroundImage);
  }

  handleCollisions(state: DrawingCanvasState, oldMouseState: MouseState, newMouseState: MouseState) {
    if (this.mouseService.mouseClicked(oldMouseState, newMouseState)) {
      const ptIdx = state.backgroundImage.corners.findIndex((pt: Point) => {
        return pt.getCollisionDetector().collidesWithPoint(pt, newMouseState.position, CanvasConstants.pointSize);
      });

      this.selectedPt = Rectangle.getPointTypeByCornerIndex(ptIdx);
      if (!this.selectedPt) {
        const colDetector = state.backgroundImage.getCollisionDetector();
        this.imgSelected = colDetector.collidesWithPoint(state.backgroundImage.rectangle, newMouseState.position, 0);

      }
    } else if (this.mouseService.mouseDragged(oldMouseState, newMouseState)) {
      if (this.selectedPt) {
        this.resizeImage(state, this.selectedPt, newMouseState.position, oldMouseState.position);
      } else if (this.imgSelected) {
        this.moveImage(state, newMouseState.position, oldMouseState.position);
      }
    } else if (this.imgSelected) {
      this.commitMovement(state);
      this.imgSelected = false;
    } else if (this.selectedPt) {
      this.commitResize(state);
      this.selectedPt = null;
    }
  }

  private resizeImage(state: DrawingCanvasState, ptType: RectanglePointType, newPt: Point, oldPt: Point) {
    const moveState = state.deepCopy();
    const img = moveState.backgroundImage;
    const movement = newPt.subtract(oldPt);
    if (ptType === 'TOP_LEFT') {
      img.offsetX += movement.x;
      img.offsetY += movement.y;
      img.width -= movement.x;
      img.height = img.width / img.aspetRatio;
    } else if (ptType === 'TOP_RIGHT') {
      img.offsetY += movement.y;
      img.width += movement.x;
      img.height = img.width / img.aspetRatio;
    } else if (ptType === 'BOTTOM_RIGHT') {
      img.width += movement.x;
      img.height = img.width / img.aspetRatio;
    } else if (ptType === 'BOTTOM_LEFT') {
      img.offsetX += movement.x;
      img.width -= movement.x;
      img.height = img.width / img.aspetRatio;
    }
    const cmd = new CanvasModifyCommand();
    cmd.cmdName = 'RESIZE_IMAGE';
    cmd.transient = true;
    cmd.currentState = moveState;
    this.canvasStateService.doCommand(cmd);
  }


  private commitResize(state: DrawingCanvasState) {
    const moveState = state.deepCopy();
    const cmd = new CanvasModifyCommand();
    cmd.cmdName = 'COMMIT_RESIZE';
    cmd.currentState = moveState;
    this.canvasStateService.doCommand(cmd);
  }


  private commitMovement(state: DrawingCanvasState) {
    const moveState = state.deepCopy();
    const cmd = new CanvasModifyCommand();
    cmd.cmdName = 'COMMIT_IMAGE_MOVE';
    cmd.currentState = moveState;
    this.canvasStateService.doCommand(cmd);
  }


  private moveImage(state: DrawingCanvasState, newPt: Point, oldPt: Point) {
    const moveState = state.deepCopy();
    const movement = newPt.subtract(oldPt);
    moveState.backgroundImage.offsetX += movement.x;
    moveState.backgroundImage.offsetY += movement.y;
    const cmd = new CanvasModifyCommand();
    cmd.cmdName = 'MOVE_IMAGE';
    cmd.transient = true;
    cmd.currentState = moveState;
    this.canvasStateService.doCommand(cmd);
  }

}
