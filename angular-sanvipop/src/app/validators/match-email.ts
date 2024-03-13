import { AbstractControl, ValidationErrors } from "@angular/forms";

export function matchEmail(
    c: AbstractControl
  ): ValidationErrors | null {
    const email = c.get('email')!.value;
    const email2 = c.get('emailConfirm')!.value;
    return email === email2 ? null : { match: true };
  }