import { Component, inject } from '@angular/core';
import { OrdenService } from '../services/orden.service';

@Component({
  selector: 'app-resumen',
  styleUrl: './resumen.css',
  templateUrl: './resumen.html',
})
export class Resumen {
  private readonly service = inject(OrdenService);

  protected readonly total = this.service.total;
  protected readonly pendientes = this.service.pendientes;
  protected readonly horasEstimadas = this.service.horasEstimadas;
}
