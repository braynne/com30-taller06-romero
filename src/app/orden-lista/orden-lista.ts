import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { EstadoOrden } from '../models/orden';
import { OrdenBusqueda } from '../orden-busqueda/orden-busqueda';
import { Resumen } from '../resumen/resumen';
import { OrdenService } from '../services/orden.service';

@Component({
  selector: 'app-orden-lista',
  imports: [OrdenBusqueda, Resumen, RouterLink],
  styleUrl: './orden-lista.css',
  templateUrl: './orden-lista.html',
})
export class OrdenLista {
  private readonly service = inject(OrdenService);

  /** Parámetro de consulta `?estado=…`, enlazado con withComponentInputBinding. */
  protected readonly estado = input<string>('');

  protected readonly estados: EstadoOrden[] = ['Pendiente', 'En proceso', 'Finalizada'];

  protected readonly filtros: { texto: string; valor: string }[] = [
    { texto: 'Todos', valor: '' },
    { texto: 'Pendiente', valor: 'Pendiente' },
    { texto: 'En proceso', valor: 'En proceso' },
    { texto: 'Finalizada', valor: 'Finalizada' },
  ];

  protected readonly ordenes = this.service.ordenes;
  protected readonly total = this.service.total;
  protected readonly pendientes = this.service.pendientes;

  protected readonly visibles = computed(() => {
    const estado = this.estado();
    const lista = this.ordenes();
    return estado ? lista.filter((orden) => orden.estado === estado) : lista;
  });

  protected cambiarEstado(id: number, evento: Event): void {
    const estado = (evento.target as HTMLSelectElement).value as EstadoOrden;
    this.service.cambiarEstado(id, estado);
  }

  protected eliminar(id: number): void {
    this.service.eliminar(id);
  }
}
