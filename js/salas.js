import { obtenerSalas, guardarSalas, obtenerReservas, guardarReservas, obtenerEquipamiento, generarId } from './storage.js';
import { validarTexto, validarCapacidad } from './validaciones.js';

let salaEnEdicionId = null;

export const renderizarCheckboxesEquipamientoSala = (seleccionados = []) => {
    const contenedor = document.getElementById('equipamientoSalaOpciones');
    const catalogo = obtenerEquipamiento();

    contenedor.innerHTML = '';

    if (catalogo.length === 0) {
        contenedor.innerHTML = '<p class="ayuda">Todavía no hay equipamiento cargado. Agregalo en "Tipos de Equipamiento".</p>';
        return;
    }

    catalogo.forEach((item) => {
        const label = document.createElement('label');
        const marcado = seleccionados.includes(item) ? 'checked' : '';
        label.innerHTML = `<input type="checkbox" name="equipamientoSala" value="${item}" ${marcado}> ${item}`;
        contenedor.appendChild(label);
    });
};

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
            <td>
                <div class="acciones-tabla">
                    <button type="button" class="btn-secundario" data-id="${sala.id}" data-accion="editar">Editar</button>
                    <button type="button" class="btn-eliminar" data-id="${sala.id}" data-accion="eliminar">Eliminar</button>
                </div>
            </td>
        `;
        tbody.appendChild(fila);
    });

    tbody.querySelectorAll('[data-accion="editar"]').forEach((boton) => {
        boton.addEventListener('click', () => iniciarEdicionSala(boton.dataset.id));
    });

    tbody.querySelectorAll('[data-accion="eliminar"]').forEach((boton) => {
        boton.addEventListener('click', () => eliminarSala(boton.dataset.id));
    });
};

export const guardarSala = (evento) => {
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

    if (salaEnEdicionId) {
        const indice = salas.findIndex((sala) => sala.id === salaEnEdicionId);
        if (indice !== -1) {
            salas[indice] = {
                ...salas[indice],
                nombre: nombre.trim(),
                capacidad: Number(capacidad),
                equipamiento,
            };
        }
    } else {
        salas.push({
            id: generarId(),
            nombre: nombre.trim(),
            capacidad: Number(capacidad),
            equipamiento,
        });
    }

    guardarSalas(salas);
    cancelarEdicionSala();
    window.dispatchEvent(new CustomEvent('salasActualizadas'));
};

export const iniciarEdicionSala = (id) => {
    const sala = obtenerSalas().find((s) => s.id === id);
    if (!sala) {
        return;
    }

    salaEnEdicionId = id;
    document.getElementById('nombreSala').value = sala.nombre;
    document.getElementById('capacidadSala').value = sala.capacidad;
    renderizarCheckboxesEquipamientoSala(sala.equipamiento);

    document.getElementById('tituloFormularioSala').textContent = 'Editar Sala';
    document.getElementById('botonGuardarSala').textContent = 'Guardar Cambios';
    document.getElementById('botonCancelarEdicionSala').classList.remove('oculto');

    document.getElementById('formularioSala').scrollIntoView({ behavior: 'smooth', block: 'start' });
};

export const cancelarEdicionSala = () => {
    salaEnEdicionId = null;
    document.getElementById('formularioSala').reset();
    renderizarCheckboxesEquipamientoSala();

    document.getElementById('tituloFormularioSala').textContent = 'Agregar Sala';
    document.getElementById('botonGuardarSala').textContent = 'Agregar Sala';
    document.getElementById('botonCancelarEdicionSala').classList.add('oculto');
};

export const eliminarSala = (id) => {
    if (!confirm('¿Eliminar esta sala? También se eliminarán las reservas asociadas.')) {
        return;
    }

    const salas = obtenerSalas().filter((sala) => sala.id !== id);
    guardarSalas(salas);

    const reservas = obtenerReservas().filter((reserva) => reserva.salaId !== id);
    guardarReservas(reservas);

    if (salaEnEdicionId === id) {
        cancelarEdicionSala();
    }

    window.dispatchEvent(new CustomEvent('salasActualizadas'));
};
