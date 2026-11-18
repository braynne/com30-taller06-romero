import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DESDE, HASTA, M, TOPE, hastaMayor, multiplo, rango } from './validadores';
import { Parcial2Busqueda } from './busqueda';

@Component({
  selector: 'app-parcial2',
  imports: [ReactiveFormsModule, Parcial2Busqueda],
  styleUrl: './parcial2.css',
  templateUrl: './parcial2.html',
})
export class Parcial2 {
  private readonly fb = inject(FormBuilder).nonNullable;
  private readonly router = inject(Router);

  protected readonly m = M;
  protected readonly tope = TOPE;
  protected readonly desde = DESDE;
  protected readonly hasta = HASTA;

  protected readonly form = this.fb.group(
    {
      codigo: ['', [Validators.required, Validators.pattern(/^[A-Z]{2}\d{3}$/)]],
      cantidad: [M, [Validators.required, rango(1, TOPE), multiplo(M)]],
      desde: [DESDE, Validators.required],
      hasta: [HASTA, Validators.required],
    },
    { validators: [hastaMayor()] },
  );

  protected guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { codigo, cantidad } = this.form.getRawValue();
    void this.router.navigate(['/parcial2/detalle', codigo], {
      queryParams: { cantidad },
    });
  }
}
