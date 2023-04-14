import {Component, Input, OnInit} from '@angular/core';
import {CanvasMode, DrawingCanvasState} from '../state/drawing-canvas-state';
import {DrawingCanvasStateService} from '../state/drawing-canvas-state.service';
import {ActionType} from './action-type';
import {ImageService} from '../state/image.service';
import {ToolbarService} from './toolbar.service';
import {ConfirmationService} from 'primeng/api';
import {TutorialModalService} from './tutorial-modal/tutorial-modal.service';
import {CookieCutterService} from '../../shared/cookie-cutter/cookie-cutter.service';
import {CookieCutter, CookieCutterMetadata} from '../../shared/cookie-cutter/cookie-cutter';
import {LoadingService} from '../../shared/loading/loading.service';
import {LoggerService} from '../../shared/log/logger.service';
import {CanvasSessionSettingsService} from './canvas-session-settings.service';

const LOADING_KEY = 'CANVAS_RENDERING';

@Component({
  selector: 'app-toolbar',
  templateUrl: './canvas-toolbar.component.html',
  styleUrls: ['./canvas-toolbar.component.scss']
})
export class CanvasToolbarComponent implements OnInit {

  @Input()
  continueAdd = false;

  cutterMetadata: CookieCutterMetadata = null;
  openAddToLibraryDialog = false;
  public actionType = ActionType;
  public canvasMode = CanvasMode;
  public openImageDialog = false;
  public openTutorialDialog = true;
  private showedTutorialAlready = false;
  canvasState: DrawingCanvasState;
  canvasAlpha = 100;

  constructor(private canvasStateService: DrawingCanvasStateService,
              private imgService: ImageService,
              private toolbarService: ToolbarService,
              private confirmationService: ConfirmationService,
              private cookieCutterService: CookieCutterService,
              private loadingService: LoadingService,
              private tutorialModalService: TutorialModalService,
              private canvasSessionSettingsService: CanvasSessionSettingsService,
              private logSevice: LoggerService) {
    this.logSevice = this.logSevice.getSpecificLogger('CanvasToolbarComponent');
    this.showedTutorialAlready = this.tutorialModalService.showedTutorialAlready;
    this.openTutorialDialog = !this.tutorialModalService.showedTutorialAlready;
  }

  ngOnInit() {
    this.logSevice.trace('inside ngOnInit', this.continueAdd);
    this.loadingService.startLoading(LOADING_KEY);
    this.registerCanvasStateSubscription();
    const cutter: CookieCutter = this.cookieCutterService.getCurrentCookieCutter();
    if (cutter && cutter.canvasState) {
      this.cutterMetadata = CookieCutterMetadata.instanceFromCookieCutter(cutter);
      this.canvasStateService.init(cutter.canvasState);
    } else {
      this.canvasStateService.init(new DrawingCanvasState());
      this.cutterMetadata = {
        description: '',
        name: '',
        tags: []

      } as CookieCutterMetadata;
    }
    if (this.continueAdd) {
      this.openAddToLibraryDialog = true;
    }
  }


  private registerCanvasStateSubscription() {
    this.canvasStateService.getCurrentState().subscribe((newState: DrawingCanvasState) => {
      if (!this.canvasState && newState) {
        this.loadingService.endLoading(LOADING_KEY);
      }
      this.canvasState = newState;
    });
  }

  isEnabled(bt: ActionType): boolean {
    return this.toolbarService.isEnabled(this.canvasState, bt);
  }

  handleCanvasAlphaChange(event) {
    const alpha = event.value / 100.0;
    if (!isNaN(alpha)) {
      this.canvasSessionSettingsService.changeImageAlpha(alpha);
    }
  }


  handleUndo() {
    this.toolbarService.handleUndo(this.canvasState);
  }

  handleRedo() {
    this.toolbarService.handleRedo(this.canvasState);

  }

  handleClear() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to start over?',
      accept: () => {
        this.toolbarService.handleClear(this.canvasState);
      }
    });
  }


  handleImageUpload(f: File) {
    this.toolbarService.handleImageUpload(this.canvasState, f);

  }


  handleSwitchToAddLineMode() {
    if (this.canvasState.mode === CanvasMode.QUAD_ADJUST) {
      this.confirmationService.confirm({
        message: 'Are you sure you want to switch to Line mode? You will lose any curves you have drawn so far.',
        accept: () => {
          this.toolbarService.handleSwitchToAddLineMode(this.canvasState);
        }
      });
    } else {
      this.toolbarService.handleSwitchToAddLineMode(this.canvasState);
    }

  }

  handleSwitchToAdjustQuadMode() {
    this.toolbarService.handleSwitchToAdjustQuadMode(this.canvasState);
  }

  handleSwitchToAddImageMode() {
    if (this.canvasState.mode === CanvasMode.QUAD_ADJUST) {
      this.confirmationService.confirm({
        message: 'Are you sure you want to switch to Image mode? You will lose any curves you have drawn so far.',
        accept: () => {
          this.toolbarService.handleSwitchToAddImageMode(this.canvasState);
          this.openImageDialog = true;
        }
      });
    } else {
      this.toolbarService.handleSwitchToAddImageMode(this.canvasState);
      this.openImageDialog = true;
    }


  }

  handleTutorialOpenChange(open: boolean) {
    this.openTutorialDialog = open;
    if (!this.openTutorialDialog && !this.showedTutorialAlready) {
      this.showedTutorialAlready = true;
      this.handleSwitchToAddImageMode();
    }
  }


}
