import type { AbstractControl, FormArray, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Rechaza una cadena formada solo por espacios.
 * Clave de error: soloEspacios.
 */
export function sinSoloEspacios(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null =>
    typeof control.value === 'string' && control.value !== '' && control.value.trim() === ''
      ? { soloEspacios: true }
      : null;
}

/**
 * Exige fechaFin igual o posterior a fechaInicio.
 * Clave de error: rangoFechas.
 */
export const rangoFechas: ValidatorFn = (grupo: AbstractControl): ValidationErrors | null => {
  const inicio = grupo.get('fechaInicio')?.value;
  const fin = grupo.get('fechaFin')?.value;

  if (!inicio || !fin) {
    return null; // no marca error mientras falte un valor
  }

  return fin < inicio ? { rangoFechas: { inicio, fin } } : null;
};

/**
 * Exige al menos n filas en un FormArray.
 * Clave de error: minimoTareas.
 */
export function minimoTareas(n: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null =>
    (control as FormArray).length >= n ? null : { minimoTareas: { requerido: n } };
}
