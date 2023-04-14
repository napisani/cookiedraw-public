import {Component, Input, OnChanges, OnDestroy, SimpleChanges} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {FormErrorMap} from '../form-error-map';

@Component({
  selector: 'app-form-field-error',
  templateUrl: './form-field-error.component.html',
  styleUrls: ['./form-field-error.component.scss'],
})
export class FormFieldErrorComponent implements OnChanges, OnDestroy {

  @Input() parentForm: FormGroup;
  @Input() fieldName: string;
  @Input() formErrorMap: FormErrorMap;
  @Input() includeCleanFields = false;
  @Input() includeValidFields = false;
  sub = null;

  errMsgs = [];


  constructor() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }

    if (this.parentForm && this.fieldName && this.formErrorMap) {
      this.populateMessages();
      this.parentForm.valueChanges.subscribe(() => {
        this.populateMessages();
      });

    }
  }

  private populateMessages() {
    this.errMsgs = this.formErrorMap.getErrorMessagesForControl(
      this.fieldName,
      this.parentForm,
      this.includeCleanFields,
      this.includeValidFields);
  }


  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}

