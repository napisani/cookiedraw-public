import {AbstractControl, FormGroup, ValidationErrors, ValidatorFn} from '@angular/forms';
const defaultError = 'Invalid input.';
const delimiter = '||';


export interface ValidationsRegistry {
    [key: string]: {
        validatorGenerators?: (arg: any) => ValidatorFn[],
        validators: ValidatorFn[]
        formErrorMap: FormErrorMap
    };
}


export interface ValidationMessagePair {
    validation: string;
    message: string;
}

export type FormErrorMapSeverity = 'WARN' | 'ERROR';

export interface FormErrorMessagesStrategy {
    strategyName: string;
}


export class FormValidationErrorCustom implements FormErrorMessagesStrategy {
    strategyName = 'CUSTOM_MESSAGES';

    constructor(public customMessages: string[] = []) {

    }

    addCustomMessage(msg: string) {
        if (!this.customMessages) {
            this.customMessages = [];
        }
        this.customMessages.push(msg);
    }
}


export class FormErrorMap {
    public static WARNING_KEY = 'validationWarning';


    private msgsByValidation: { [key: string]: string } = {};
    private msgsByFieldAndValidation: { [key: string]: string } = {};

    private fieldNameToNestedFormErrorMap: { [key: string]: FormErrorMap } = {};

    private constructor() {

    }

    public static newInstance(): FormErrorMap {
        return new FormErrorMap();
    }

    public static getRequiredErrorMessage(displayName: string): ValidationMessagePair {
        return {validation: 'required', message: `${displayName} is required.`};
    }

    public static getLatin1OnlyErrorMessage(displayName: string): ValidationMessagePair {
        return {
            validation: 'containsNonLatin1Characters',
            message: `${displayName} does not contain only latin1 characters.`
        };
    }

    public static getMaxLengthErrorMessage(displayName: string, length: number): ValidationMessagePair {
        return {validation: 'maxlength', message: `${displayName} exceeds the maximum length of ${length}.`};
    }

    public static getMinLengthErrorMessage(displayName: string, length: number): ValidationMessagePair {
        return {
            validation: 'minlength',
            message: `${displayName} has a length that is lower than the minimum length of ${length}.`
        };
    }

    public static getMinErrorMessage(displayName: string, size: number): ValidationMessagePair {
        return {validation: 'min', message: `${displayName} is lower than ${size}.`};
    }

    public static getMaxErrorMessage(displayName: string, size: number): ValidationMessagePair {
        return {validation: 'max', message: `${displayName} is greater than ${size}.`};
    }

    public static getPatternErrorMessage(displayName: string, expectedFormat: string): ValidationMessagePair {
        return {validation: 'pattern', message: `${displayName} does not match the expected format: ${expectedFormat}.`};
    }

    get messagesByValidation(): { [key: string]: string } {
        return this.msgsByValidation;
    }

    get messagesByFieldAndValidation(): { [key: string]: string } {
        return this.msgsByFieldAndValidation;
    }

    addNestedFormErrorMap(fieldName: string, m: FormErrorMap): FormErrorMap {
        this.fieldNameToNestedFormErrorMap[fieldName] = m;

        return this;
    }

    private getNestedFormErrorMap(fieldName: string): FormErrorMap {
        return this.fieldNameToNestedFormErrorMap[fieldName] || FormErrorMap.newInstance();
    }


    // get only the high-level for errors from formGroup.errors
    getHighLevelFormErrors(formGroup: FormGroup,
                           prefixGenerator: (fg: FormGroup, controlName: string, outerControlName: string) => string = () => '',
                           severities: FormErrorMapSeverity[] = ['ERROR'],
                           outerControlName: string = null) {
        const prefix = prefixGenerator(formGroup, null, outerControlName) || '';

        const returnErrors = [];

        for (const severity of severities) {
            let errorKeyBag = {};
            if (severity === 'ERROR') {
                errorKeyBag = formGroup.errors || {};
            } else if (severity === 'WARN') {
                errorKeyBag = formGroup[FormErrorMap.WARNING_KEY] || {};
            }

            const errors = Object.keys(errorKeyBag);
            for (const errKey of errors) {
                const englishErrorMessages = this.getErrorMessages(errorKeyBag, null, errKey);
                for (const englishErrorMessage of englishErrorMessages) {
                    if (englishErrorMessage) {
                        returnErrors.push(prefix + englishErrorMessage);
                    }
                }
            }
        }
        return returnErrors;
    }


    // gets ALL of the messages from the form including high-level formGroup.errors plus all of the formGroup.controls[x].errors.
    // If a control within the form contains another form, this method call will recurse to traverse the entire form structure.
    getAllErrorMessagesForFormGroup(formGroup: FormGroup,
                                    includeCleanFields = false,
                                    includeValidFields = false,
                                    prefixGenerator: (fg: FormGroup, controlName: string, outerControlName: string) => string = () => '',
                                    severities: FormErrorMapSeverity[] = ['ERROR'],
                                    outerControlName: string = null) {
        const returnErrors = [];
        returnErrors.push(...this.getHighLevelFormErrors(formGroup, prefixGenerator, severities, outerControlName));
        if (formGroup.controls) {
            for (const controlName of Object.keys(formGroup.controls)) {
                returnErrors.push(
                    ...this.getErrorMessagesForControl(controlName,
                        formGroup,
                        includeCleanFields,
                        includeValidFields,
                        prefixGenerator,
                        severities,
                        outerControlName)
                );
            }
        }
        return returnErrors;
    }

    // gets the messages from a single control - formGroup.controls[x].errors.
    // If the passed control is a formGroup, this method call will recurse to traverse the entire form structure.

    getErrorMessagesForControl(controlName: string,
                               formGroup: FormGroup,
                               includeCleanFields = false,
                               includeValidFields = false,
                               prefixGenerator: (fg: FormGroup, controlName: string, outerControlName: string) => string = () => '',
                               severities: FormErrorMapSeverity[] = ['ERROR'],
                               outerControlName: string = null): string[] {
        const control: AbstractControl = formGroup.get(controlName);

        if (control instanceof FormGroup) {
            return this.getNestedFormErrorMap(controlName).getAllErrorMessagesForFormGroup(control as FormGroup,
                includeCleanFields,
                includeValidFields,
                prefixGenerator,
                severities,
                controlName);
        }
        const prefix = prefixGenerator(formGroup, controlName, outerControlName) || '';
        const showError = control && (control.invalid || includeValidFields) && (control.dirty || includeCleanFields);
        const returnErrors = [];
        if (showError) {
            for (const severity of severities) {
                let errorKeyBag = {};
                if (severity === 'ERROR') {
                    errorKeyBag = control.errors || {};
                } else if (severity === 'WARN') {
                    errorKeyBag = control[FormErrorMap.WARNING_KEY] || {};
                }
                const errors = Object.keys(errorKeyBag);
                for (const errKey of errors) {
                    const englishErrorMessages = this.getErrorMessages(errorKeyBag, controlName, errKey);
                    for (const englishErrorMessage of englishErrorMessages) {
                        if (englishErrorMessage) {
                            returnErrors.push(prefix + englishErrorMessage);
                        }
                    }
                }
            }
        }
        return returnErrors;
    }


    addAll(errMap: FormErrorMap): FormErrorMap {
        this.msgsByValidation = Object.assign(this.msgsByValidation, errMap.messagesByValidation);
        this.msgsByFieldAndValidation = Object.assign(this.msgsByFieldAndValidation, errMap.messagesByFieldAndValidation);
        return this;
    }

    getErrorMessages(errorKeyBag: ValidationErrors, field: string, validationKey: string): string[] {
        if (errorKeyBag[validationKey] != null) {
            if (errorKeyBag[validationKey].strategyName === 'CUSTOM_MESSAGES' && errorKeyBag[validationKey].customMessages) {
                return errorKeyBag[validationKey].customMessages;
            } else if (errorKeyBag[validationKey] === true || errorKeyBag[validationKey] !== false) {
                let err = this.msgsByFieldAndValidation[`${field}${delimiter}${validationKey}`];
                if (err) {
                    return [err];
                }
                err = this.msgsByValidation[validationKey];
                if (err) {
                    return [err];
                }
                return [defaultError];
            }
        }

        return [];
    }

    addGenericValidationErrorMessage(pair: ValidationMessagePair): FormErrorMap {
        this.msgsByValidation[pair.validation] = pair.message;
        return this;
    }

    addSpecificErrorMessage(field: string, pair: ValidationMessagePair): FormErrorMap {
        this.msgsByFieldAndValidation[`${field}${delimiter}${pair.validation}`] = pair.message;
        return this;
    }


}
