import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PreviewCanvasComponent} from './preview-canvas.component';


@NgModule({
  declarations: [PreviewCanvasComponent],
  imports: [
    CommonModule
  ],
  exports: [PreviewCanvasComponent]
})
export class PreviewCanvasModule {
}
