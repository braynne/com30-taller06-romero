import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { OrdenService } from '../services/orden.service';

@Component({
  selector: 'app-estadisticas',
  imports: [RouterLink],
  styleUrl: './estadisticas.css',
  templateUrl: './estadisticas.html',
})
export class Estadisticas {
  private readonly service = inject(OrdenService);

  protected readonly total = this.service.total;
  protected readonly pendientes = this.service.pendientes;
  protected readonly horasEstimadas = this.service.horasEstimadas;

  protected readonly finalizadas = computed(
    () => this.service.ordenes().filter((orden) => orden.estado === 'Finalizada').length,
  );

  protected readonly enProceso = computed(
    () => this.service.ordenes().filter((orden) => orden.estado === 'En proceso').length,
  );

  protected readonly horasPorOrden = computed(() =>
    this.total() === 0 ? 0 : Math.round((this.horasEstimadas() / this.total()) * 10) / 10,
  );
}
