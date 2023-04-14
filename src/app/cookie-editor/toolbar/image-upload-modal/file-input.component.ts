import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-file-input',
  templateUrl: './file-input.component.html',
  styleUrls: ['./file-input.component.scss']
})
export class FileInputComponent implements OnInit {
  selectedFile: File;

  @Input()
  buttonText = '';

  @Input()
  enabled = true;

  @Output()
  upload = new EventEmitter<File>();

  constructor() {
  }

  ngOnInit() {
  }


  onFileChanged(event) {
    this.selectedFile = event.target.files[0];

    this.upload.emit(this.selectedFile);
  }
}
