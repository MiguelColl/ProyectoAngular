import { AbstractControl, ValidationErrors } from '@angular/forms';

export function matchFields(field1: string, field2: string) {
  return (c: AbstractControl): ValidationErrors | null =>
    c.get(field1)!.value === c.get(field2)!.value ? null : { match: true };
}
