import {DeepCopyable} from './deep-copyable';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';


export interface IStateManipulationCommand<F extends DeepCopyable<F>> extends DeepCopyable<IStateManipulationCommand<F>> {
  cmdName: string;
  transient: boolean;
  currentState: F;

  // in case you need to preform additional logic upon redo/undo OTHER THAN simply modifying the currentState
  redoCallback?: () => void;
  undoCallback?: () => void;

}

// T represents the object type that this service keeps track of (not the command type)
export class StateRetentionService<T extends DeepCopyable<T>> {

  protected isInit = false;
  private currentState = new BehaviorSubject<T>(null);
  private commands: IStateManipulationCommand<T>[] = [];
  private index = -1;
  protected limit: number;

  public constructor() {
  }

  public init(initState: T, limit = 0) {
    this.isInit = true;
    this.limit = limit;
    this.commands = [];
    this.index = -1;
    this.currentState.next(initState);
  }

  public destroy() {
    this.currentState.next(null);
    this.commands = [];
    this.index = -1;
  }

  public doCommand(command: IStateManipulationCommand<T>) {
    if (command.transient) {
      this.doTransientCommand(command);
    } else {
      this.commands = this.commands.slice(0, this.index + 1);
      command = this.deepCopy(command);
      console.log('doCommand adding command: ', command);
      this.commands.push(command);
      if (this.limit > 0 && this.commands.length > this.limit) {
        this.commands.shift();
      } else {
        this.index++;
      }
      this.currentState.next(command.currentState);
    }
    // return this;

  }

  private doTransientCommand(command: IStateManipulationCommand<T>) {
    command = this.deepCopy(command);
    if (this.index < 0) {
      command.transient = false;
      this.doCommand(command);
    } else {
      this.commands[this.index] = command;
      console.log('doTransientCommand adding command: ', command);
      this.currentState.next(command.currentState);
    }
  }

  public redo(): boolean {
    if (this.canRedo()) {
      this.index++;
      const cmdToRedo = this.commands[this.index];
      if (cmdToRedo.redoCallback) {
        cmdToRedo.redoCallback();
      }
      this.currentState.next(cmdToRedo.currentState);
      return true;
    }
    return false;
  }

  public canRedo(): boolean {
    return this.index < this.commands.length - 1;
  }

  public undo(): boolean {
    if (this.canUndo()) {
      const cmdToUndo = this.commands[this.index];
      if (cmdToUndo.undoCallback) {
        cmdToUndo.undoCallback();
      }
      this.index--;
      this.currentState.next(this.commands[this.index].currentState);
      return true;
    }
    return false;
  }

  public canUndo(): boolean {
    return this.index >= 1;
  }

  public commandStack(): IStateManipulationCommand<T>[] {
    return this.commands.slice(0);
  }

  public getCurrentCommand(): IStateManipulationCommand<T> {
    return this.commands[this.index].deepCopy();
  }

  public isCurrentCommandTransient(): boolean {
    const currentCmd = this.commands[this.index];
    if (!currentCmd || !currentCmd.transient) {
      return false;
    }
    return true;
  }

  public getCurrentState(): Observable<T> {
    return this.currentState.asObservable()
      .pipe(map((x) => x ? x.deepCopy() : x));
  }


  public canUndoAsObservable(): Observable<boolean> {
    return this.getCurrentState().pipe(map(() => {
      return this.canUndo();
    }));
  }

  public canRedoAsObservable(): Observable<boolean> {
    return this.getCurrentState().pipe(map(() => {
      return this.canRedo();
    }));
  }

  protected deepCopy(obj: IStateManipulationCommand<T>): IStateManipulationCommand<T> {
    return obj.deepCopy();
  }
}

