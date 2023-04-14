import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {DrawingCanvasState} from '../../state/drawing-canvas-state';
import {ToolbarService} from '../toolbar.service';
import {TutorialStep} from './tutorial-step';
import {TutorialModalService} from './tutorial-modal.service';

@Component({
  selector: 'app-tutorial-modal',
  templateUrl: './tutorial-modal.component.html',
  styleUrls: ['./tutorial-modal.component.scss']
})
export class TutorialModalComponent implements OnInit, OnChanges {

  @Input() open = false;
  @Input() canvasState: DrawingCanvasState;
  @Output() openChange = new EventEmitter<boolean>();
  tutorialSteps: TutorialStep[] = [
    {
      seq: 0,
      instruction: 'Click the right arrow for tips on how to use Cookie Draw. Otherwise, click \"Start Drawing!\" to get started.',
      title: 'Welcome to Cookie Draw!'
    },
    {
      seq: 1,
      instruction: 'First, select whether you would like to trace an image or freehand the drawing.',
      title: 'Image vs. Freehand'
    }, {
      seq: 2,
      instruction: 'Next, click and drag the image to position the image to be traced. Click on the corners and drag to resize the image.',
      title: 'Position & Size',
    },
    {
      seq: 3,
      instruction: 'Left click to drop nodes around the image\'s perimeter.' +
        ' Right click an existing node to remove it. Complete the outline by left clicking on the first node.',
      title: 'Draw lines',
    }, {
      seq: 4,
      instruction: 'Click and drag the orange nodes to create curves where desired. ' +
        'Right click an orange node to split the current line into two separate lines',
      title: 'Curve',
    },
    {
      seq: 5,
      instruction: 'Click "Update 3D Model" to update the preview show in the right hand box. ' +
        'Click "Export 3D Model" to download a .STL file.',
      title: 'Update & Export',
    }];

  constructor(private toolbarService: ToolbarService,
              private tutorialModalService: TutorialModalService) {
  }

  ngOnInit(): void {
  }

  handleOpenChange(o: boolean) {
    this.open = o;
    this.openChange.emit(o);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.open) {
      this.tutorialModalService.markShown();
    }

  }

}
