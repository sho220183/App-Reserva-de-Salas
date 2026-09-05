import { inicializarDatos } from './storage.js';
import { renderizarSalas, agregarSala } from './salas.js';
import { renderizarReservas, agregarReserva, poblarSelectSalas, actualizarEquipamientoDisponible } from './reservas.js';
import { inicializarTema, alternarTema } from './tema.js';

document.addEventListener('DOMContentLoaded', () => {
    inicializarDatos();
    inicializarTema();
    document.getElementById('botonTema').addEventListener('click', alternarTema);

    const botonesTab = document.querySelectorAll('.tab-btn');
    botonesTab.forEach((boton) => {
        boton.addEventListener('click', () => {
            botonesTab.forEach((b) => b.classList.remove('activo'));
            boton.classList.add('activo');

            document.querySelectorAll('.tab-panel').forEach((panel) => panel.classList.add('oculto'));
            document.getElementById(`tab-${boton.dataset.tab}`).classList.remove('oculto');
        });
    });

    const inputFecha = document.getElementById('fechaReserva');
    inputFecha.min = new Date().toISOString().split('T')[0];

    document.getElementById('formularioSala').addEventListener('submit', agregarSala);
    document.getElementById('formularioReserva').addEventListener('submit', agregarReserva);
    document.getElementById('selectSala').addEventListener('change', actualizarEquipamientoDisponible);

    window.addEventListener('salasActualizadas', () => {
        poblarSelectSalas();
        renderizarReservas();
    });

    renderizarSalas();
    poblarSelectSalas();
    renderizarReservas();
});
