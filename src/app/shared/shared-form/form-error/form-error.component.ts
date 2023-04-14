import {Component, Input, OnChanges, OnDestroy, SimpleChanges} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {FormErrorMap} from '../form-error-map';

@Component({
  selector: 'app-form-error',
  templateUrl: './form-error.component.html',
  styleUrls: ['./form-error.component.scss'],
})
export class FormErrorComponent implements OnChanges, OnDestroy {

  @Input() parentForm: FormGroup;
  @Input() formErrorMap: FormErrorMap;

  sub = null;

  errMsgs = [];


  constructor() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }

    if (this.parentForm && this.formErrorMap) {
      this.populateMessages();
      this.parentForm.valueChanges.subscribe(() => {
        this.populateMessages();
      });

    }
  }

  private populateMessages() {
    this.errMsgs = this.formErrorMap.getHighLevelFormErrors(
      this.parentForm);
  }


  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}

