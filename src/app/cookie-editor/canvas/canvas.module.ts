import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {CanvasComponent} from './canvas.component';
import {MouseStateCollectorDirective} from './mouse-state-collector.directive';
import {SharedModule} from '../../shared/shared.module';
import {CardModule} from 'primeng/card';

@NgModule({
  declarations: [CanvasComponent, MouseStateCollectorDirective],
  imports: [
    CommonModule,
    SharedModule,
    CardModule
  ],
  exports: [CanvasComponent]
})
export class CanvasModule {
}
