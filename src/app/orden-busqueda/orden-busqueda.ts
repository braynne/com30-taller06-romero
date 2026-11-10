import { Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map, of, switchMap, tap } from 'rxjs';
import type { EstadoOrden, Orden } from '../models/orden';
import { OrdenService } from '../services/orden.service';

type FiltroEstado = EstadoOrden | 'Todos';

@Component({
  selector: 'app-orden-busqueda',
  imports: [ReactiveFormsModule],
  styleUrl: './orden-busqueda.css',
  templateUrl: './orden-busqueda.html',
})
export class OrdenBusqueda {
  private readonly service = inject(OrdenService);
  private readonly fb = inject(FormBuilder).nonNullable;

  protected readonly busqueda = this.fb.control('');
  protected readonly filtro = signal<FiltroEstado>('Todos');
  protected readonly historial = signal<string[]>([]);
  protected readonly buscando = signal(false);
  protected readonly llamadas = this.service.llamadas;
  protected readonly estados: FiltroEstado[] = ['Todos', 'Pendiente', 'En proceso', 'Finalizada'];

  private readonly terminos$ = this.busqueda.valueChanges.pipe(
    map((texto) => texto.trim()),
    debounceTime(300),
    distinctUntilChanged(),
  );

  private readonly resultado$ = this.terminos$.pipe(
    switchMap((texto) => {
      if (texto.length < 2) {
        this.buscando.set(false);
        return of([] as Orden[]);
      }

      this.buscando.set(true);
      return this.service.buscar(texto).pipe(tap(() => this.buscando.set(false)));
    }),
  );

  protected readonly registros = toSignal(this.resultado$, {
    initialValue: [] as Orden[],
  });

  protected readonly visibles = computed(() => {
    const estado = this.filtro();
    const lista = this.registros();
    return estado === 'Todos' ? lista : lista.filter((orden) => orden.estado === estado);
  });

  protected readonly total = computed(() => this.registros().length);
  protected readonly mostradas = computed(() => this.visibles().length);

  protected readonly conteoEstados = computed<Record<EstadoOrden, number>>(() => {
    const lista = this.registros();
    return {
      Pendiente: lista.filter((orden) => orden.estado === 'Pendiente').length,
      'En proceso': lista.filter((orden) => orden.estado === 'En proceso').length,
      Finalizada: lista.filter((orden) => orden.estado === 'Finalizada').length,
    };
  });

  constructor() {
    this.terminos$.pipe(takeUntilDestroyed()).subscribe((texto) => {
      if (texto.length >= 2) {
        this.historial.update((lista) => [texto, ...lista].slice(0, 5));
      }
    });
  }

  protected cambiarFiltro(evento: Event): void {
    const estado = (evento.target as HTMLSelectElement).value as FiltroEstado;
    this.filtro.set(estado);
  }
}
