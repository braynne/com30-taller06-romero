import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map, scan, startWith } from 'rxjs';
import { OrdenService } from '../services/orden.service';
import { PALABRA } from './validadores';

function normalizar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

@Component({
  selector: 'app-parcial2-busqueda',
  imports: [ReactiveFormsModule],
  styleUrl: './busqueda.css',
  templateUrl: './busqueda.html',
})
export class Parcial2Busqueda {
  private readonly fb = inject(FormBuilder).nonNullable;
  private readonly service = inject(OrdenService);

  protected readonly palabra = PALABRA;
  protected readonly busqueda = this.fb.control('');

  /** trim → debounce 300 ms → distinctUntilChanged → contador de emisiones. */
  private readonly estadoBusqueda = toSignal(
    this.busqueda.valueChanges.pipe(
      map((texto) => texto.trim()),
      debounceTime(300),
      distinctUntilChanged(),
      scan((estado, valor) => ({ valor, emisiones: estado.emisiones + 1 }), {
        valor: '',
        emisiones: 0,
      }),
      startWith({ valor: '', emisiones: 0 }),
    ),
    { initialValue: { valor: '', emisiones: 0 } },
  );

  protected readonly busquedaControl = this.busqueda;
  protected readonly ultimoValor = computed(() => this.estadoBusqueda().valor);
  protected readonly emisiones = computed(() => this.estadoBusqueda().emisiones);

  /** El listado del proyecto se filtra con el último valor emitido. */
  protected readonly visibles = computed(() => {
    const termino = normalizar(this.ultimoValor());
    const lista = this.service.ordenes();
    if (termino.length === 0) {
      return lista;
    }
    return lista.filter((orden) =>
      [orden.codigoEquipo, orden.equipo, orden.tecnico].some((campo) =>
        normalizar(campo).includes(termino),
      ),
    );
  });
}
