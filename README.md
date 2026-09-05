# App Reserva de Salas

Aplicación web para la reserva de salas de reuniones de oficina. Permite administrar salas (nombre, capacidad y equipamiento disponible) y registrar reservas, validando datos y evitando solapamientos de horario en una misma sala.

## Funcionalidades

- **Gestión de salas:** alta y baja de salas, con capacidad y equipamiento configurable (proyector, pizarra, videoconferencia, televisor, aire acondicionado, wifi).
- **Reservas:** formulario para reservar una sala indicando fecha, horario, solicitante, cantidad de personas y equipamiento a utilizar.
- **Validaciones:** nombre/capacidad de sala, fecha no pasada, horario válido, cantidad de personas dentro de la capacidad de la sala.
- **Prevención de solapamientos:** no permite crear una reserva si la sala ya está ocupada en ese rango horario.
- **Persistencia:** los datos se guardan en `localStorage`, no requiere backend.

## Tecnologías

HTML, CSS y JavaScript (ES Modules), sin frameworks ni dependencias externas.

## Cómo ejecutar

Al usar módulos de JavaScript (`type="module"`), el proyecto debe servirse por HTTP (no abrirse directamente como archivo `file://`). Por ejemplo, con la extensión **Live Server** de VS Code, o:

```bash
npx serve .
```

Luego abrir `index.html` en el navegador.

## Estructura

```
├── index.html
├── css/
│   └── estilos.css
└── js/
    ├── script.js         # Punto de entrada, wiring de eventos
    ├── storage.js         # Persistencia en localStorage
    ├── validaciones.js    # Validaciones de formularios
    ├── salas.js            # Alta/baja de salas
    └── reservas.js         # Alta/baja de reservas y detección de conflictos
```
