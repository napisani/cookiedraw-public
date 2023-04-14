import {Directive, ElementRef, EventEmitter, HostListener, Input, Output} from '@angular/core';
import {MouseEventType, MouseState} from '../state/mouse-state';
import {Point} from '../geo/point';
import {LoggerService} from '../../shared/log/logger.service';
import {ConfirmationService} from 'primeng/api';

@Directive({
  selector: '[appMouseStateCollector]'
})
export class MouseStateCollectorDirective {

  @Input() mouseState: MouseState;
  @Output() mouseStateChange = new EventEmitter<MouseState>();

  constructor(private canvas: ElementRef,
              private confirmService: ConfirmationService,
              private log: LoggerService) {
    this.log = log.getSpecificLogger('MouseStateCollectorDirective');
  }

  private getMousePos(mouseEvent): Point {
    const rect = this.canvas.nativeElement.getBoundingClientRect();
    return new Point(
      mouseEvent.clientX - rect.left,
      mouseEvent.clientY - rect.top
    );
  }

  private change(s: MouseState) {
    this.mouseStateChange.emit(s);
  }


  @HostListener('touchstart', ['$event'])
  handleTouchStart(event: TouchEvent) {
    event.preventDefault();
    // this.log.trace('down', event);
    const s = this.mouseState.deepCopy();
    s.clickedDown = true;
    s.lastEventType = MouseEventType.DOWN;
    this.log.trace('touch event', event);
    s.initialClickPosition = this.getMousePos(event.touches[event.touches.length - 1]);
    s.position = s.initialClickPosition;
    this.log.trace(s);
    this.change(s);
  }

  @HostListener('touchmove', ['$event'])
  handleTouchMove(event: TouchEvent) {
    event.preventDefault();
    this.log.trace('touch move', event);
    const s = this.mouseState.deepCopy();
    s.position = this.getMousePos(event.touches[event.touches.length - 1]);
    s.lastEventType = MouseEventType.MOVE;
    this.log.trace(s);
    this.change(s);
  }


  @HostListener('touchend', ['$event'])
  handleTouchUp(event: TouchEvent) {
    event.preventDefault();
    this.log.trace('touchend', event);
    const s = this.mouseState.deepCopy();
    s.lastEventType = MouseEventType.UP;
    s.clickedDown = false;
    s.dragging = false;
    s.rightClickedDown = false;
    this.log.trace(s);
    this.change(s);
  }


  @HostListener('mousedown', ['$event'])
  handleMouseDown(event: MouseEvent) {
    // this.log.trace('down', event);
    const s = this.mouseState.deepCopy();
    if (event.button === 2) {
      s.rightClickedDown = true;
      s.lastEventType = MouseEventType.RIGHT_DOWN;
    } else {
      s.clickedDown = true;
      s.lastEventType = MouseEventType.DOWN;
    }
    s.initialClickPosition = this.getMousePos(event);
    this.log.trace(s);
    this.change(s);
  }


  @HostListener('mouseup', ['$event'])
  handleMouseUp(event: MouseEvent) {
    // this.log.trace('up', event);
    const s = this.mouseState.deepCopy();
    if (s.rightClickedDown) {
      s.lastEventType = MouseEventType.RIGHT_UP;
    } else {
      s.lastEventType = MouseEventType.UP;
    }
    s.clickedDown = false;
    s.dragging = false;
    s.rightClickedDown = false;
    this.log.trace(s);
    this.change(s);
  }


  @HostListener('mousemove', ['$event'])
  handleMouseMove(event: MouseEvent) {
    // this.log.trace('move', event);
    const s = this.mouseState.deepCopy();
    s.position = this.getMousePos(event);
    s.lastEventType = MouseEventType.MOVE;
    this.log.trace(s);
    this.change(s);
  }

}
