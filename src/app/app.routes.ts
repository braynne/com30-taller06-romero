import { Routes } from '@angular/router';
import { NoEncontrado } from './no-encontrado/no-encontrado';
import { OrdenDetalle } from './orden-detalle/orden-detalle';
import { OrdenForm } from './orden-form/orden-form';
import { OrdenLista } from './orden-lista/orden-lista';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'ordenes' },
  { path: 'ordenes', title: 'Órdenes · Listado', component: OrdenLista },
  { path: 'ordenes/nueva', title: 'Órdenes · Alta', component: OrdenForm },
  { path: 'ordenes/:id', title: 'Órdenes · Detalle', component: OrdenDetalle },
  {
    path: 'estadisticas',
    title: 'Órdenes · Estadísticas',
    loadComponent: () => import('./estadisticas/estadisticas').then((m) => m.Estadisticas),
  },
  { path: '**', title: 'Página no encontrada', component: NoEncontrado },
];
