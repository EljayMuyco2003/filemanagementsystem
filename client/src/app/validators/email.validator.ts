import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Custom validator that only accepts @gmail.com and @portal.com emails
 */
export function gmailValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null; // Don't validate empty values (use Validators.required for that)
    }

    const email = control.value.toLowerCase();
    const allowedPattern = /^[a-zA-Z0-9._%+-]+@(gmail\.com|portal\.com)$/;

    if (!allowedPattern.test(email)) {
      return { gmail: true };
    }

    return null;
  };
}
