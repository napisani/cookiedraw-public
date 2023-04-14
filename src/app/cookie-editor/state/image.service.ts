import {Injectable} from '@angular/core';
import {CanvasImage} from '../geo/canvas-image';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor() {
  }

  readImage(file: File, callback: (img: HTMLImageElement) => void) {
    const reader = new FileReader();
    reader.onload = (event: Event) => {
      console.log('in reader onload');
      const img = new Image();
      img.onload = () => {
        console.log('in img onload');
        callback(img);
      };
      if (typeof reader.result === 'string') {
        img.src = reader.result;
      }

    };
    reader.readAsDataURL(file);
  }


  resizeToFit(img: CanvasImage, width: number, height: number) {
    if (img.width <= width && img.height <= height) {
      return;
    }
    if (width / img.aspetRatio <= height) {
      img.width = width;
      img.height = width / img.aspetRatio;
      return;
    }

    img.height = height;
    img.width = height * img.aspetRatio;
  }
}
