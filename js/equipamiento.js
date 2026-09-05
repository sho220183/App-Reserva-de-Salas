import { obtenerEquipamiento, guardarEquipamiento, obtenerSalas, guardarSalas } from './storage.js';
import { validarTexto } from './validaciones.js';

export const renderizarCatalogoEquipamiento = () => {
    const equipamiento = obtenerEquipamiento();
    const contenedor = document.getElementById('listadoEquipamiento');
    const mensajeVacio = document.getElementById('mensajeVacioEquipamiento');

    contenedor.innerHTML = '';

    if (equipamiento.length === 0) {
        mensajeVacio.classList.remove('oculto');
        return;
    }

    mensajeVacio.classList.add('oculto');

    equipamiento.forEach((item) => {
        const chip = document.createElement('span');
        chip.className = 'chip';
        chip.innerHTML = `${item} <button type="button" class="chip-eliminar" data-item="${item}" aria-label="Eliminar ${item}">×</button>`;
        contenedor.appendChild(chip);
    });

    contenedor.querySelectorAll('.chip-eliminar').forEach((boton) => {
        boton.addEventListener('click', () => eliminarEquipamiento(boton.dataset.item));
    });
};

export const agregarEquipamiento = (evento) => {
    evento.preventDefault();

    const input = document.getElementById('nombreEquipamiento');
    const nombre = input.value.trim();

    const errorNombre = validarTexto(nombre, 2, 'El nombre del equipamiento');
    if (errorNombre !== true) {
        alert(errorNombre);
        return;
    }

    const equipamiento = obtenerEquipamiento();
    if (equipamiento.some((item) => item.toLowerCase() === nombre.toLowerCase())) {
        alert('Ese equipamiento ya existe en el catálogo.');
        return;
    }

    equipamiento.push(nombre);
    guardarEquipamiento(equipamiento);

    evento.target.reset();
    renderizarCatalogoEquipamiento();
    window.dispatchEvent(new CustomEvent('equipamientoActualizado'));
};

export const eliminarEquipamiento = (nombre) => {
    if (!confirm(`¿Eliminar "${nombre}" del catálogo? También se quitará de todas las salas que lo tengan.`)) {
        return;
    }

    const equipamiento = obtenerEquipamiento().filter((item) => item !== nombre);
    guardarEquipamiento(equipamiento);

    const salas = obtenerSalas().map((sala) => ({
        ...sala,
        equipamiento: sala.equipamiento.filter((item) => item !== nombre),
    }));
    guardarSalas(salas);

    renderizarCatalogoEquipamiento();
    window.dispatchEvent(new CustomEvent('equipamientoActualizado'));
    window.dispatchEvent(new CustomEvent('salasActualizadas'));
};
