# COM30 Taller 06 · Órdenes de mantenimiento

Proyecto Angular standalone para el Taller 06 de COM30 (escenario E4 · Orden de mantenimiento).

## Estado

Estructura base creada: modelo de datos, carpetas de validadores y servicio, y los componentes `orden-form`, `orden-lista` y `resumen`. La lógica del formulario, los validadores, el servicio y el listado están pendientes.

## Ejecutar

```bash
npm install
ng serve
```

Abrir http://localhost:4200. Para comprobar la compilación:

```bash
npx ng build
```

## Estructura

```text
src/app/
├── models/orden.ts
├── validators/validadores.ts
├── services/orden.service.ts
├── orden-form/
├── orden-lista/
├── resumen/
├── app.ts
└── app.html
```

## Escenario

Una orden de mantenimiento registra código y nombre del equipo, tipo, técnico, fechas de inicio y fin, prioridad, descripción y una lista de tareas con horas estimadas. Los estados son Pendiente, En proceso y Finalizada.
