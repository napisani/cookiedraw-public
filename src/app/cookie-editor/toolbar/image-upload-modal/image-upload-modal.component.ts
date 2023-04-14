import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ToolbarService} from '../toolbar.service';
import {DrawingCanvasState} from '../../state/drawing-canvas-state';

@Component({
  selector: 'app-image-upload-modal',
  templateUrl: './image-upload-modal.component.html',
  styleUrls: ['./image-upload-modal.component.scss']
})
export class ImageUploadModalComponent implements OnInit {

  @Input() open = false;
  @Input() canvasState: DrawingCanvasState;
  @Output() openChange = new EventEmitter<boolean>();

  constructor(private toolbarService: ToolbarService) {
  }

  ngOnInit(): void {
  }

  handleImageUpload(f: File) {
    this.toolbarService.handleImageUpload(this.canvasState, f);
    this.handleOpenChange(false);
  }

  handleFreehand() {
    this.toolbarService.handleFreehand(this.canvasState);
    this.handleOpenChange(false);
  }



  handleOpenChange(o: boolean) {
    this.open = o;
    this.openChange.emit(o);
  }

}
