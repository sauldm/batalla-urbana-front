# Batalla Urbana — Frontend

Frontend del juego web multijugador en tiempo real **Batalla Urbana**.
La aplicación se conecta al backend mediante WebSockets para recibir eventos de partida y enviar acciones del jugador.

---

## Tecnologías

- JavaScript
- React
- Tailwind CSS
- WebSockets

---

## Demo online

- Aplicación web: http://93.93.112.225

---

## Funcionalidades

- Interfaz para salas y partidas multijugador
- Ejecución de acciones y habilidades
- Actualización de la interfaz en tiempo real
- Bloqueo de acciones cuando no es el turno del jugador

---

## Arquitectura del frontend

La aplicación está organizada por responsabilidades para facilitar el mantenimiento y la evolución.

- Componentes reutilizables de interfaz
- Gestión de estado de la partida
- Servicios de comunicación con el backend
- Separación entre lógica de presentación y lógica de red

---

## Ejecutar en local

### Requisitos

- Node.js
- npm

### Pasos

```bash
git clone https://github.com/sauldm/batalla-urbana-front
cd batalla-urbana-front
npm install
npm run dev
```
Disponible en: http://localhost:5173

---

## WebSockets

- Conexión al backend mediante WebSockets
- Recepción de eventos de partida en tiempo real
- Envío de acciones del jugador al servidor
- Sincronización del estado de la partida entre clientes
- Actualización de la interfaz en función de los eventos recibidos

---

## Roadmap

- Mejoras de experiencia de usuario (UX)
- Manejo de estados de conexión y reconexión
- Feedback visual más detallado de eventos de partida
- Optimización del estado global de la aplicación

---

## Objetivo del frontend

Este frontend se ha desarrollado como parte de un portfolio profesional con el objetivo de demostrar:

- Desarrollo de interfaces web con React
- Gestión de estado en aplicaciones en tiempo real
- Integración con un backend mediante WebSockets
- Creación de interfaces claras para juegos multijugador
