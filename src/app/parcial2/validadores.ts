import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Parámetros del último dígito d = 4 de la cédula 1043666564:
 * m = 2 + 4 mod 5 = 6; tope = 6 × (4 + 4 mod 3) = 30;
 * desde = 5, hasta = 6; palabra = «turno».
 */
export const M = 6;
export const TOPE = 30;
export const DESDE = 5;
export const HASTA = 6;
export const PALABRA = 'turno';

/** Exige un múltiplo de `base`. Cero se deja al validador de rango. */
export function multiplo(base: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valor = Number(control.value);
    if (control.value === null || control.value === '' || valor <= 0) {
      return null;
    }
    return valor % base === 0 ? null : { multiplo: true };
  };
}

/** Rango propio: devuelve `min` o `max`, nunca ambos a la vez. */
export function rango(min: number, max: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value === null || control.value === '') {
      return null;
    }
    const valor = Number(control.value);
    if (valor < min) {
      return { min: true };
    }
    if (valor > max) {
      return { max: true };
    }
    return null;
  };
}

/** Validador de grupo: `hasta` debe ser estrictamente mayor que `desde`. */
export function hastaMayor(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const desde = group.get('desde')?.value;
    const hasta = group.get('hasta')?.value;
    if (desde === null || hasta === null || desde === '' || hasta === '') {
      return null;
    }
    return Number(hasta) > Number(desde) ? null : { hastaMayor: true };
  };
}
