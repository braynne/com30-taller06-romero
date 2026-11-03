import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import type { Prioridad, TipoMantenimiento } from '../models/orden';
import { OrdenService } from '../services/orden.service';
import { minimoTareas, rangoFechas, sinSoloEspacios } from '../validators/validadores';

@Component({
  selector: 'app-orden-form',
  imports: [ReactiveFormsModule],
  styleUrl: './orden-form.css',
  templateUrl: './orden-form.html',
})
export class OrdenForm {
  private readonly fb = inject(FormBuilder).nonNullable;
  private readonly ordenes = inject(OrdenService);

  protected readonly tipos: TipoMantenimiento[] = ['Preventivo', 'Correctivo', 'Calibración'];

  protected readonly prioridades: Prioridad[] = ['Baja', 'Media', 'Alta'];

  protected readonly form = this.fb.group(
    {
      codigoEquipo: ['', [Validators.required, Validators.pattern(/^EQ-\d{4}$/)]],
      equipo: ['', [Validators.required, Validators.minLength(3)]],
      tipo: ['Preventivo' as TipoMantenimiento, Validators.required],
      tecnico: ['', [Validators.required, Validators.minLength(5), sinSoloEspacios()]],
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required],
      prioridad: ['Media' as Prioridad, Validators.required],
      descripcion: ['', [Validators.required, Validators.minLength(15)]],
      tareas: this.fb.array([this.nuevaTarea()], [minimoTareas(1)]),
    },
    { validators: [rangoFechas] },
  );

  protected get tareas() {
    return this.form.controls.tareas;
  }

  protected agregarTarea(): void {
    this.tareas.push(this.nuevaTarea());
  }

  protected quitarTarea(i: number): void {
    this.tareas.removeAt(i);
    this.tareas.markAsTouched(); // muestra el mínimo si se queda sin filas
  }

  protected guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.ordenes.agregar(this.form.getRawValue());

    this.form.reset();
    this.tareas.clear();
    this.tareas.push(this.nuevaTarea());
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }

  private nuevaTarea() {
    return this.fb.group({
      descripcion: ['', [Validators.required, Validators.minLength(5), sinSoloEspacios()]],
      horasEstimadas: [1, [Validators.required, Validators.min(1), Validators.max(40)]],
    });
  }
}
