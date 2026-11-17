# COM30 Talleres 06, 07 y 08 · Órdenes de mantenimiento

Aplicación Angular para registrar, buscar y gestionar **órdenes de mantenimiento
de equipos** (escenario E4). El formulario reactivo captura los datos y una
lista dinámica de tareas; el servicio guarda los registros en memoria; el Taller
07 agrega una **búsqueda reactiva** sobre una semilla de 12 órdenes, y el Taller
08 organiza todo en **rutas y navegación** con detalle, filtro en la URL, alta,
vista diferida y 404.

**Autor:** Braynne Alexander Romero Balza · COM30 · 2026-III

## Escenario

E4 · Orden de mantenimiento. Una orden registra código del equipo, nombre del
equipo, tipo de mantenimiento (Preventivo, Correctivo o Calibración), técnico,
fechas de inicio y fin, prioridad, descripción y una lista de tareas con horas
estimadas. Los estados son **Pendiente**, **En proceso** y **Finalizada**.

## Cómo ejecutar

Requisitos: Node.js y Angular CLI (el proyecto se generó con Angular 22).

```bash
npm install
npm start
```

Abrir <http://localhost:4200>. Para comprobar la compilación de producción:

```bash
npx ng build
```

El resultado queda en `dist/com30-taller06/`.

## Estructura

```text
src/app/
├── models/orden.ts              interfaces Orden, Tarea y tipos del escenario
├── validators/validadores.ts    sinSoloEspacios, rangoFechas y minimoTareas
├── services/orden.service.ts    signal privada, asReadonly, computed, buscar() y agregar()
├── app.routes.ts                mapa de rutas con títulos y comodín
├── orden-form/                  formulario reactivo, FormArray y alta con navigate()
├── orden-busqueda/              búsqueda reactiva, filtros e historial
├── orden-lista/                 listado, filtro por URL, cambio de estado y @defer
├── orden-detalle/               detalle con input() del parámetro :id
├── estadisticas/                vista diferida con loadComponent
├── no-encontrado/               vista 404 con la dirección pedida
├── resumen/                     panel diferido con los totales
├── app.ts                       menú con routerLink y router-outlet
├── app.config.ts                provideRouter con withComponentInputBinding
└── app.html
```

Se usan componentes standalone y no se emplean `NgModule`, `*ngIf`,
`HttpClient` ni guards. Los datos viven en memoria, en el servicio.

## Requisitos del taller aplicados

- **R2 · Servicio con estado en signals.** Signal privada `_ordenes`, versión
  pública con `asReadonly()`, `computed` de total, pendientes y horas estimadas,
  y métodos `agregar`, `cambiarEstado` y `eliminar` que usan `update()` con un
  arreglo nuevo (sin `push` ni `splice`).
- **R3 · Formulario reactivo.** `FormBuilder` `nonNullable` con 8 controles y
  validadores integrados `required`, `minLength`, `pattern`, `min` y `max`.
  Al guardar se entrega `getRawValue()` al servicio y se hace `reset()`.
- **R4 · Validadores propios.** `sinSoloEspacios()` sobre el técnico y las
  tareas; `rangoFechas` como validador de grupo entre `fechaInicio` y
  `fechaFin`.
- **R5 · `FormArray` de tareas.** Agregar y quitar filas, dos controles
  validados por fila y `minimoTareas(1)` como validador del arreglo.
- **R6 · Mensajes de error.** Se muestran solo con `touched || dirty`, con un
  texto distinto por tipo de error; el error de grupo se lee desde el
  formulario y el envío queda bloqueado con `form.invalid` (además de
  `markAllAsTouched()` como respaldo en `guardar()`).
- **R7 · Listado y resumen.** `@for` con `track`, bloque `@empty`, cambio de
  estado por registro y panel de resumen cargado con `@defer (on interaction)`.

## Taller 07 · Búsqueda reactiva

La semilla vive en `OrdenService`: 12 órdenes con estados Pendiente, En proceso
y Finalizada. La búsqueda mira los campos **equipo** y **técnico**, recorta el
texto con `trim()`, lo pasa a minúsculas y le quita las tildes. Con menos de 2
caracteres no se consulta el servicio.

- **Servicio.** `buscar(texto): Observable<Orden[]>` incrementa la signal
  privada `_llamadas`, filtra la semilla y responde con
  `of(resultados).pipe(delay(retardo))`, donde
  `retardo = max(150, 1500 − 300 × longitud)`. `llamadas` se expone con
  `asReadonly()`.
- **Tubería.** `valueChanges` → `map(trim)` → `debounceTime(300)` →
  `distinctUntilChanged()` → `switchMap(...)`; bajo 2 caracteres devuelve
  `of([])` sin llamar al servicio.
- **Resultado.** `toSignal` con valor inicial `[]`; `computed` de total,
  conteo por estado y visibles según el filtro.
- **Filtros.** Signal de estado y `computed`; cambiar el filtro no genera
  consultas nuevas.
- **Historial.** Las 5 últimas consultas, la más reciente primero, con
  `subscribe` y `takeUntilDestroyed()`.
- **Mensajes.** Mínimo 2 caracteres, «Buscando…» y «Sin coincidencias» dentro
  del bloque `@empty`. Todos los `@for` usan `track`.

## Casos de prueba del Taller 06

Los diez casos del informe se ejecutaron en el navegador; todos cumplen el
resultado esperado. Los casos límite son la igualdad de fechas (válida), el día
anterior (inválida), el técnico con solo espacios (rechazado por el validador
propio) y la lista de tareas con cero filas (rechazada por `minimoTareas`).

## Casos de prueba del Taller 07

Los nueve casos también se ejecutaron en el navegador. El conteo de llamadas
del servicio coincide con la tabla B del informe: C1 a C9 terminan en 1, 2, 3,
3, 3, 4, 5, 6 y 8 consultas, y el caso C9 termina con la respuesta de «motor
diésel», no con la de «mo».

## Taller 08 · Rutas y navegación

`app.config.ts` usa `provideRouter(routes, withComponentInputBinding())`. El
menú usa `routerLink` y `routerLinkActive` (Inicio con `exact: true`) y hay un
solo `<router-outlet />`. Ningún enlace interno usa `href`.

### Tabla de rutas

| Ruta             | Vista                    | Parámetro o carga                |
| ---------------- | ------------------------ | -------------------------------- |
| `/`              | Redirección a `/ordenes` | `pathMatch: 'full'`              |
| `/ordenes`       | `OrdenLista`             | `?estado=` → `input<string>('')` |
| `/ordenes/nueva` | `OrdenForm`              | —                                |
| `/ordenes/:id`   | `OrdenDetalle`           | `input.required<string>()`       |
| `/estadisticas`  | `Estadisticas`           | `loadComponent`                  |
| `**`             | `NoEncontrado`           | comodín al final                 |

Cada ruta tiene `title`. El detalle busca con un `computed` sobre la signal del
servicio y muestra «No existe la orden …» cuando el id no aparece. El filtro
del listado viaja en la URL, sobrevive a F5 y muestra `@empty` si no hay
registros. Tras guardar el alta, `router.navigate(['/ordenes', id])` abre el
detalle del registro nuevo. La vista `estadisticas` se descarga como un chunk
independiente solo la primera vez que se abre.

### Casos de prueba del Taller 08

Los nueve casos se ejecutaron en el navegador: `/` redirige a `/ordenes` con 12
registros; el filtro «Pendiente» deja 5 y sobrevive a F5; `?estado=Cancelada`
muestra `@empty`; `/ordenes/1` muestra la orden R01 con el menú activo;
`/ordenes/99` muestra el mensaje dentro del detalle; `/reportes` cae en la 404;
el alta `EQ-1013` navega a `/ordenes/13` y deja 13 registros y 6 pendientes; y
`/estadisticas` descarga un `chunk-….js` nuevo solo en el primer ingreso.
