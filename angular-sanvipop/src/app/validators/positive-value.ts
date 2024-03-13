import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

export function positiveValueValidator(): ValidatorFn {
    return (c: AbstractControl): ValidationErrors | null => {
        if (+c.value <= 0) {
            return { positiveValue: true };
        }
        return null;
    };
}