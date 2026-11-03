import { computed, Injectable, signal } from '@angular/core';
import type { EstadoOrden, NuevaOrden, Orden } from '../models/orden';

@Injectable({ providedIn: 'root' })
export class OrdenService {
  private readonly _ordenes = signal<Orden[]>([]);
  private siguienteId = 1;

  readonly ordenes = this._ordenes.asReadonly();

  readonly total = computed(() => this._ordenes().length);

  readonly pendientes = computed(
    () => this._ordenes().filter((orden) => orden.estado === 'Pendiente').length,
  );

  readonly horasEstimadas = computed(() =>
    this._ordenes().reduce(
      (total, orden) =>
        total + orden.tareas.reduce((suma, tarea) => suma + tarea.horasEstimadas, 0),
      0,
    ),
  );

  agregar(datos: NuevaOrden): void {
    const orden: Orden = {
      ...datos,
      id: this.siguienteId++,
      estado: 'Pendiente',
    };
    this._ordenes.update((lista) => [...lista, orden]);
  }

  cambiarEstado(id: number, estado: EstadoOrden): void {
    this._ordenes.update((lista) =>
      lista.map((orden) => (orden.id === id ? { ...orden, estado } : orden)),
    );
  }

  eliminar(id: number): void {
    this._ordenes.update((lista) => lista.filter((orden) => orden.id !== id));
  }
}
