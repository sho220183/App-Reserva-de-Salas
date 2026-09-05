import { obtenerSalas, guardarSalas, obtenerReservas, guardarReservas, generarId } from './storage.js';
import { validarTexto, validarCapacidad } from './validaciones.js';

export const renderizarSalas = () => {
    const salas = obtenerSalas();
    const tbody = document.getElementById('listadoSalas');
    const tabla = document.getElementById('tablaSalas');
    const mensajeVacio = document.getElementById('mensajeVacioSalas');

    tbody.innerHTML = '';

    if (salas.length === 0) {
        tabla.classList.add('oculto');
        mensajeVacio.classList.remove('oculto');
        return;
    }

    tabla.classList.remove('oculto');
    mensajeVacio.classList.add('oculto');

    salas.forEach((sala, index) => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${index + 1}</td>
            <td>${sala.nombre}</td>
            <td>${sala.capacidad}</td>
            <td>${sala.equipamiento.length ? sala.equipamiento.join(', ') : '—'}</td>
            <td><button type="button" class="btn-eliminar" data-id="${sala.id}">Eliminar</button></td>
        `;
        tbody.appendChild(fila);
    });

    tbody.querySelectorAll('.btn-eliminar').forEach((boton) => {
        boton.addEventListener('click', () => eliminarSala(boton.dataset.id));
    });
};

export const agregarSala = (evento) => {
    evento.preventDefault();

    const nombre = document.getElementById('nombreSala').value;
    const capacidad = document.getElementById('capacidadSala').value;
    const equipamiento = Array.from(document.querySelectorAll('input[name="equipamientoSala"]:checked')).map((cb) => cb.value);

    const errorNombre = validarTexto(nombre, 3, 'El nombre de la sala');
    if (errorNombre !== true) {
        alert(errorNombre);
        return;
    }

    const errorCapacidad = validarCapacidad(capacidad);
    if (errorCapacidad !== true) {
        alert(errorCapacidad);
        return;
    }

    const salas = obtenerSalas();
    salas.push({
        id: generarId(),
        nombre: nombre.trim(),
        capacidad: Number(capacidad),
        equipamiento,
    });
    guardarSalas(salas);

    evento.target.reset();
    renderizarSalas();
    window.dispatchEvent(new CustomEvent('salasActualizadas'));
};

export const eliminarSala = (id) => {
    if (!confirm('¿Eliminar esta sala? También se eliminarán las reservas asociadas.')) {
        return;
    }

    const salas = obtenerSalas().filter((sala) => sala.id !== id);
    guardarSalas(salas);

    const reservas = obtenerReservas().filter((reserva) => reserva.salaId !== id);
    guardarReservas(reservas);

    renderizarSalas();
    window.dispatchEvent(new CustomEvent('salasActualizadas'));
};
