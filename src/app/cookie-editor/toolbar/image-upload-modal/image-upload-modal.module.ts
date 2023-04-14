import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ImageUploadModalComponent} from './image-upload-modal.component';
import {FileInputComponent} from './file-input.component';
import {DialogModule} from 'primeng/dialog';
import {ButtonModule} from 'primeng/button';

@NgModule({
  declarations: [ImageUploadModalComponent, FileInputComponent],
  imports: [
    CommonModule,
    DialogModule,
    ButtonModule
  ],
  exports: [ImageUploadModalComponent]
})
export class ImageUploadModalModule {
}
