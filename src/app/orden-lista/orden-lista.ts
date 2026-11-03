import { Component, inject } from '@angular/core';
import type { EstadoOrden } from '../models/orden';
import { OrdenService } from '../services/orden.service';
import { Resumen } from '../resumen/resumen';

@Component({
  selector: 'app-orden-lista',
  imports: [Resumen],
  styleUrl: './orden-lista.css',
  templateUrl: './orden-lista.html',
})
export class OrdenLista {
  private readonly service = inject(OrdenService);

  protected readonly ordenes = this.service.ordenes;
  protected readonly total = this.service.total;
  protected readonly pendientes = this.service.pendientes;
  protected readonly estados: EstadoOrden[] = ['Pendiente', 'En proceso', 'Finalizada'];

  protected cambiarEstado(id: number, evento: Event): void {
    const estado = (evento.target as HTMLSelectElement).value as EstadoOrden;
    this.service.cambiarEstado(id, estado);
  }

  protected eliminar(id: number): void {
    this.service.eliminar(id);
  }
}
