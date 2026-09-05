import { inicializarDatos } from './storage.js';
import { renderizarSalas, guardarSala, cancelarEdicionSala, renderizarCheckboxesEquipamientoSala } from './salas.js';
import { renderizarReservas, agregarReserva, poblarSelectSalas, actualizarEquipamientoDisponible } from './reservas.js';
import { renderizarCatalogoEquipamiento, agregarEquipamiento } from './equipamiento.js';
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

    document.getElementById('formularioSala').addEventListener('submit', guardarSala);
    document.getElementById('botonCancelarEdicionSala').addEventListener('click', cancelarEdicionSala);
    document.getElementById('formularioEquipamiento').addEventListener('submit', agregarEquipamiento);
    document.getElementById('formularioReserva').addEventListener('submit', agregarReserva);
    document.getElementById('selectSala').addEventListener('change', actualizarEquipamientoDisponible);

    window.addEventListener('salasActualizadas', () => {
        renderizarSalas();
        poblarSelectSalas();
        renderizarReservas();
    });

    window.addEventListener('equipamientoActualizado', () => {
        const seleccionados = Array.from(document.querySelectorAll('input[name="equipamientoSala"]:checked')).map((cb) => cb.value);
        renderizarCheckboxesEquipamientoSala(seleccionados);
    });

    renderizarCatalogoEquipamiento();
    renderizarCheckboxesEquipamientoSala();
    renderizarSalas();
    poblarSelectSalas();
    renderizarReservas();
});
