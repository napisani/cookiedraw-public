import {Injectable} from '@angular/core';
import {ActionType} from './action-type';
import {CanvasMode, DrawingCanvasState} from '../state/drawing-canvas-state';
import {DrawingCanvasStateService} from '../state/drawing-canvas-state.service';
import {CanvasImage} from '../geo/canvas-image';
import {CanvasModifyCommand} from '../state/cmds/drawing-canvas-commands';
import {ImageService} from '../state/image.service';
import {CookieCutterService} from '../../shared/cookie-cutter/cookie-cutter.service';
import {LoggerService} from '../../shared/log/logger.service';

@Injectable({
    providedIn: 'root'
})
export class ToolbarService {

    constructor(private canvasStateService: DrawingCanvasStateService,
                private imgService: ImageService,
                private cutterService: CookieCutterService,
                private loggerService: LoggerService) {
        this.loggerService = loggerService.getSpecificLogger('ToolbarService');
    }


    isEnabled(state: DrawingCanvasState, bt: ActionType): boolean {
        if (!state) {
            return false;
        }
        switch (bt) {
            case ActionType.UNDO:
                return this.canvasStateService.canUndo();
            case ActionType.REDO:
                return this.canvasStateService.canRedo();
            case ActionType.IMG_UPLOAD:
            case ActionType.ADD_LINE_MODE_TOGGLE:
            case ActionType.ADD_IMAGE_MODE_TOGGLE:
            case ActionType.CLEAR_CANVAS:
                return true;
            case ActionType.ADD_TO_LIBRARY:
            case ActionType.QUAD_ADJUST_MODE_TOGGLE:
                return state.quads && state.quads.length > 0;
            case ActionType.ALPHA_ADJUST:
                return state.backgroundImage != null && state.backgroundImage.img != null;

        }
        return false;
    }


    handleClear(state: DrawingCanvasState) {
        if (this.isEnabled(state, ActionType.CLEAR_CANVAS)) {
            const newState = new DrawingCanvasState();
            const cmd = new CanvasModifyCommand();
            cmd.cmdName = 'CLEAR_CANVAS';
            cmd.currentState = newState;
            this.canvasStateService.doCommand(cmd);
            this.cutterService.clearCurrentCookieCutter();
        }
    }

    handleUndo(state: DrawingCanvasState) {
        if (this.isEnabled(state, ActionType.UNDO)) {
            this.canvasStateService.undo();
        }
    }

    handleRedo(state: DrawingCanvasState) {
        if (this.isEnabled(state, ActionType.REDO)) {
            this.canvasStateService.redo();
        }
    }

    handleFreehand(state: DrawingCanvasState) {
        if (this.isEnabled(state, ActionType.IMG_UPLOAD)) {
            const newState = state.deepCopy();
            newState.backgroundImage = null;
            newState.mode = CanvasMode.ADD_LINES;
            const cmd = new CanvasModifyCommand();
            cmd.cmdName = 'FREEHAND_NO_IMG';
            cmd.currentState = newState;
            this.canvasStateService.doCommand(cmd);
        }
    }

    handleImageUpload(state: DrawingCanvasState, f: File) {
        if (this.isEnabled(state, ActionType.IMG_UPLOAD)) {
            console.log(f);
            this.imgService.readImage(f, (img: HTMLImageElement) => {
                const newState = state.deepCopy();
                newState.backgroundImage = new CanvasImage();
                newState.backgroundImage.img = img;
                this.imgService.resizeToFit(newState.backgroundImage, 640, 480);
                const cmd = new CanvasModifyCommand();
                cmd.cmdName = 'ADDED_IMAGE';
                cmd.currentState = newState;
                this.canvasStateService.doCommand(cmd);
            });
        }
    }


    handleSwitchToAddLineMode(state: DrawingCanvasState) {
        if (this.isEnabled(state, ActionType.ADD_LINE_MODE_TOGGLE)) {
            this.switchMode(state, CanvasMode.ADD_LINES);
        }
    }

    private switchMode(state: DrawingCanvasState, newMode: CanvasMode) {
        const newState = state.deepCopy();
        if (state.mode === CanvasMode.QUAD_ADJUST && newMode !== CanvasMode.QUAD_ADJUST) {
            const points = [];
            for (const quad of state.quads) {
                points.push(...quad.getOnlyEndPoints());
                points.splice(-1, 1);
            }
            newState.setQuads([]);
            newState.points = points;
        }
        newState.mode = newMode;
        const cmd = new CanvasModifyCommand();
        cmd.cmdName = 'SWITCH_MODE';
        cmd.currentState = newState;
        this.canvasStateService.doCommand(cmd);
    }


    handleSwitchToAdjustQuadMode(state: DrawingCanvasState) {
        if (this.isEnabled(state, ActionType.QUAD_ADJUST_MODE_TOGGLE)) {
            this.switchMode(state, CanvasMode.QUAD_ADJUST);
        }
    }

    handleSwitchToAddImageMode(state: DrawingCanvasState) {
        if (this.isEnabled(state, ActionType.ADD_IMAGE_MODE_TOGGLE)) {
            this.switchMode(state, CanvasMode.ADD_IMAGE);
        }
    }


}
