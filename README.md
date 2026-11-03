# COM30 Taller 06 · Órdenes de mantenimiento

Aplicación Angular de una sola pantalla para registrar y gestionar **órdenes de
mantenimiento de equipos** (escenario E4). El formulario reactivo captura los
datos y una lista dinámica de tareas; el servicio guarda los registros en
memoria y el listado permite cambiar el estado o eliminar una orden.

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
├── services/orden.service.ts    signal privada, asReadonly, computed y update()
├── orden-form/                  formulario reactivo y FormArray de tareas
├── orden-lista/                 listado, cambio de estado y @defer
├── resumen/                     panel diferido con los totales
├── app.ts                       compone formulario y listado
└── app.html
```

Se usan componentes standalone y no se emplean `NgModule`, `*ngIf`, rutas ni
`HttpClient`. Los datos viven en memoria, en el servicio.

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

## Casos de prueba

Los diez casos del informe se ejecutaron en el navegador; todos cumplen el
resultado esperado. Los casos límite son la igualdad de fechas (válida), el día
anterior (inválida), el técnico con solo espacios (rechazado por el validador
propio) y la lista de tareas con cero filas (rechazada por `minimoTareas`).
