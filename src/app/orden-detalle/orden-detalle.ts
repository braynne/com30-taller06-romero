import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { EstadoOrden } from '../models/orden';
import { OrdenService } from '../services/orden.service';

@Component({
  selector: 'app-orden-detalle',
  imports: [RouterLink],
  styleUrl: './orden-detalle.css',
  templateUrl: './orden-detalle.html',
})
export class OrdenDetalle {
  private readonly service = inject(OrdenService);

  /** Llega desde el parámetro de la ruta `/ordenes/:id` con component input binding. */
  protected readonly id = input.required<string>();

  protected readonly orden = computed(() => {
    const id = Number(this.id());
    return this.service.ordenes().find((orden) => orden.id === id);
  });

  protected readonly estados: EstadoOrden[] = ['Pendiente', 'En proceso', 'Finalizada'];

  protected cambiarEstado(estado: EstadoOrden): void {
    const orden = this.orden();
    if (orden) {
      this.service.cambiarEstado(orden.id, estado);
    }
  }
}
