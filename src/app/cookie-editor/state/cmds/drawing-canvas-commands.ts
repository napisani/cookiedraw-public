import {IStateManipulationCommand} from '../../../shared/state-retention.service';
import {DrawingCanvasState} from '../drawing-canvas-state';

export class CanvasModifyCommand implements IStateManipulationCommand<DrawingCanvasState> {
  cmdName: string;
  currentState: DrawingCanvasState;
  redoCallback: () => void;
  transient: boolean;
  undoCallback: () => void;


  deepCopy(): IStateManipulationCommand<DrawingCanvasState> {
    const c = new CanvasModifyCommand();
    c.currentState = this.currentState;
    c.redoCallback = this.redoCallback;
    c.undoCallback = this.redoCallback;
    c.transient = this.transient;
    c.cmdName = this.cmdName;
    return c;
  }

}
