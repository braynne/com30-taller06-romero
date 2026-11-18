import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { M, TOPE } from './validadores';

@Component({
  selector: 'app-parcial2-detalle',
  imports: [RouterLink],
  styleUrl: './detalle.css',
  templateUrl: './detalle.html',
})
export class Parcial2Detalle {
  /** Parámetro de `/parcial2/detalle/:codigo`. */
  protected readonly codigo = input.required<string>();

  /** Query param `?cantidad=`: los query params llegan como texto. */
  protected readonly cantidad = input(0, { transform: Number });

  protected readonly m = M;
  protected readonly tope = TOPE;

  protected readonly valido = computed(() => /^[A-Z]{2}\d{3}$/.test(this.codigo()));

  protected readonly bloques = computed(() => this.cantidad() / M);
  protected readonly margen = computed(() => TOPE - this.cantidad());
}
