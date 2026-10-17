import { Directive, Input } from "@angular/core";
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from "@angular/forms";

@Directive({
  selector: "input[appMaxLength]",
  standalone: true,
  providers: [{ provide: NG_VALIDATORS, useExisting: MaxLengthDirective, multi: true }],
})
export class MaxLengthDirective implements Validator {
  @Input() appMaxLength: string | number = 0;

  validate(control: AbstractControl): ValidationErrors | null {
    const maxLength = Number(this.appMaxLength);
    const value = control.value;
    if (typeof value !== "string" || !Number.isFinite(maxLength) || maxLength < 1 || value.length <= maxLength) {
      return null;
    }

    return {
      appMaxLength: {
        requiredLength: maxLength,
        actualLength: value.length,
      },
    };
  }
}
