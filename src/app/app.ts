import { Component } from '@angular/core';
import { OrdenBusqueda } from './orden-busqueda/orden-busqueda';
import { OrdenForm } from './orden-form/orden-form';
import { OrdenLista } from './orden-lista/orden-lista';

@Component({
  selector: 'app-root',
  imports: [OrdenForm, OrdenBusqueda, OrdenLista],
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {}
