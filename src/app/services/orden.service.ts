import { computed, Injectable, signal } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import type { EstadoOrden, NuevaOrden, Orden } from '../models/orden';

/** Semilla del Taller 07: 12 órdenes con tres estados. */
const SEMILLA: Orden[] = [
  {
    id: 1,
    codigoEquipo: 'EQ-1001',
    equipo: 'Compresor de aire',
    tipo: 'Preventivo',
    tecnico: 'Ana Pérez',
    fechaInicio: '2026-10-01',
    fechaFin: '2026-10-02',
    prioridad: 'Media',
    descripcion: 'Cambio de aceite y revisión general',
    tareas: [{ descripcion: 'Cambio de aceite', horasEstimadas: 2 }],
    estado: 'Pendiente',
  },
  {
    id: 2,
    codigoEquipo: 'EQ-1002',
    equipo: 'Bomba hidráulica',
    tipo: 'Correctivo',
    tecnico: 'Luis Gómez',
    fechaInicio: '2026-10-03',
    fechaFin: '2026-10-04',
    prioridad: 'Alta',
    descripcion: 'Reemplazo de sellos y prueba de presión',
    tareas: [{ descripcion: 'Reemplazo de sellos', horasEstimadas: 3 }],
    estado: 'En proceso',
  },
  {
    id: 3,
    codigoEquipo: 'EQ-1003',
    equipo: 'Motor eléctrico',
    tipo: 'Preventivo',
    tecnico: 'Ana Pérez',
    fechaInicio: '2026-10-05',
    fechaFin: '2026-10-06',
    prioridad: 'Media',
    descripcion: 'Revisión de bobinado y aislamiento',
    tareas: [{ descripcion: 'Medición de aislamiento', horasEstimadas: 2 }],
    estado: 'Finalizada',
  },
  {
    id: 4,
    codigoEquipo: 'EQ-1004',
    equipo: 'Compresor de tornillo',
    tipo: 'Preventivo',
    tecnico: 'Marta Ruiz',
    fechaInicio: '2026-10-07',
    fechaFin: '2026-10-08',
    prioridad: 'Baja',
    descripcion: 'Ajuste de válvulas y limpieza',
    tareas: [{ descripcion: 'Ajuste de válvulas', horasEstimadas: 4 }],
    estado: 'Pendiente',
  },
  {
    id: 5,
    codigoEquipo: 'EQ-1005',
    equipo: 'Bomba centrífuga',
    tipo: 'Correctivo',
    tecnico: 'Luis Gómez',
    fechaInicio: '2026-10-09',
    fechaFin: '2026-10-10',
    prioridad: 'Alta',
    descripcion: 'Balanceo del impulsor',
    tareas: [{ descripcion: 'Balanceo', horasEstimadas: 3 }],
    estado: 'Finalizada',
  },
  {
    id: 6,
    codigoEquipo: 'EQ-1006',
    equipo: 'Motor diésel',
    tipo: 'Preventivo',
    tecnico: 'Pedro Ríos',
    fechaInicio: '2026-10-11',
    fechaFin: '2026-10-12',
    prioridad: 'Media',
    descripcion: 'Cambio de filtros y calibración',
    tareas: [{ descripcion: 'Cambio de filtros', horasEstimadas: 2 }],
    estado: 'En proceso',
  },
  {
    id: 7,
    codigoEquipo: 'EQ-1007',
    equipo: 'Calibrador de presión',
    tipo: 'Calibración',
    tecnico: 'Ana Pérez',
    fechaInicio: '2026-10-13',
    fechaFin: '2026-10-14',
    prioridad: 'Alta',
    descripcion: 'Calibración de manómetro',
    tareas: [{ descripcion: 'Calibrar manómetro', horasEstimadas: 1 }],
    estado: 'Pendiente',
  },
  {
    id: 8,
    codigoEquipo: 'EQ-1008',
    equipo: 'Ventilador industrial',
    tipo: 'Preventivo',
    tecnico: 'Marta Ruiz',
    fechaInicio: '2026-10-15',
    fechaFin: '2026-10-16',
    prioridad: 'Baja',
    descripcion: 'Limpieza de aspas y rodamientos',
    tareas: [{ descripcion: 'Limpieza', horasEstimadas: 2 }],
    estado: 'Finalizada',
  },
  {
    id: 9,
    codigoEquipo: 'EQ-1009',
    equipo: 'Compresor portátil',
    tipo: 'Correctivo',
    tecnico: 'Pedro Ríos',
    fechaInicio: '2026-10-17',
    fechaFin: '2026-10-18',
    prioridad: 'Media',
    descripcion: 'Revisión de mangueras y acople',
    tareas: [{ descripcion: 'Revisión de acople', horasEstimadas: 1 }],
    estado: 'En proceso',
  },
  {
    id: 10,
    codigoEquipo: 'EQ-1010',
    equipo: 'Bomba de vacío',
    tipo: 'Preventivo',
    tecnico: 'Ana Pérez',
    fechaInicio: '2026-10-19',
    fechaFin: '2026-10-20',
    prioridad: 'Baja',
    descripcion: 'Cambio de aceite de vacío',
    tareas: [{ descripcion: 'Cambio de aceite', horasEstimadas: 2 }],
    estado: 'Pendiente',
  },
  {
    id: 11,
    codigoEquipo: 'EQ-1011',
    equipo: 'Motor trifásico',
    tipo: 'Correctivo',
    tecnico: 'Luis Gómez',
    fechaInicio: '2026-10-21',
    fechaFin: '2026-10-22',
    prioridad: 'Alta',
    descripcion: 'Revisión de conexiones trifásicas',
    tareas: [{ descripcion: 'Revisión eléctrica', horasEstimadas: 3 }],
    estado: 'Finalizada',
  },
  {
    id: 12,
    codigoEquipo: 'EQ-1012',
    equipo: 'Calibrador de temperatura',
    tipo: 'Calibración',
    tecnico: 'Marta Ruiz',
    fechaInicio: '2026-10-23',
    fechaFin: '2026-10-24',
    prioridad: 'Baja',
    descripcion: 'Calibración de termocupla',
    tareas: [{ descripcion: 'Calibrar termocupla', horasEstimadas: 1 }],
    estado: 'Pendiente',
  },
];

/** Quita tildes y mayúsculas para comparar el texto de búsqueda. */
function normalizar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

@Injectable({ providedIn: 'root' })
export class OrdenService {
  private readonly _ordenes = signal<Orden[]>(SEMILLA);
  private readonly _llamadas = signal(0);
  private siguienteId = SEMILLA.length + 1;

  readonly ordenes = this._ordenes.asReadonly();
  readonly llamadas = this._llamadas.asReadonly();

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

  /**
   * Busca en los campos de texto «equipo» y «tecnico», sin tildes ni
   * mayúsculas. El retardo simula una consulta remota:
   * max(150, 1500 - 300 * longitud del texto) ms.
   */
  buscar(texto: string): Observable<Orden[]> {
    this._llamadas.update((total) => total + 1);

    const termino = normalizar(texto.trim());
    const resultados =
      termino.length < 2
        ? []
        : this._ordenes().filter(
            (orden) =>
              normalizar(orden.equipo).includes(termino) ||
              normalizar(orden.tecnico).includes(termino),
          );

    const retardo = Math.max(150, 1500 - 300 * termino.length);
    return of(resultados).pipe(delay(retardo));
  }

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
