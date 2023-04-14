import {DeepCopyable} from '../../shared/deep-copyable';

export abstract class CanvasEntity<T extends CanvasEntity<T>> implements DeepCopyable<T> {

  abstract deepCopy(): T;
}


