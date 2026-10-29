export type TipoMantenimiento = 'Preventivo' | 'Correctivo' | 'Calibración';
export type Prioridad = 'Baja' | 'Media' | 'Alta';
export type EstadoOrden = 'Pendiente' | 'En proceso' | 'Finalizada';

export interface Tarea {
  descripcion: string;
  horasEstimadas: number;
}

export interface Orden {
  id: number;
  codigoEquipo: string;
  equipo: string;
  tipo: TipoMantenimiento;
  tecnico: string;
  fechaInicio: string;
  fechaFin: string;
  prioridad: Prioridad;
  descripcion: string;
  tareas: Tarea[];
  estado: EstadoOrden;
}

// Datos que entrega el formulario; el servicio agrega id y estado.
export type NuevaOrden = Omit<Orden, 'id' | 'estado'>;
