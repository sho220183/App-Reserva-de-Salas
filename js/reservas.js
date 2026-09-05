import { obtenerSalas, obtenerReservas, guardarReservas, generarId } from './storage.js';
import { validarTexto, validarFecha, validarHorario, validarCantidadPersonas } from './validaciones.js';

const formatearFecha = (fecha) => {
    const [anio, mes, dia] = fecha.split('-');
    return `${dia}/${mes}/${anio}`;
};

const hayConflicto = (salaId, fecha, horaInicio, horaFin) => {
    const reservas = obtenerReservas();
    return reservas.some((reserva) =>
        reserva.salaId === salaId &&
        reserva.fecha === fecha &&
        horaInicio < reserva.horaFin &&
        reserva.horaInicio < horaFin
    );
};

export const poblarSelectSalas = () => {
    const select = document.getElementById('selectSala');
    const salas = obtenerSalas();
    const valorPrevio = select.value;

    select.innerHTML = '<option value="">Seleccioná una sala</option>';
    salas.forEach((sala) => {
        const opcion = document.createElement('option');
        opcion.value = sala.id;
        opcion.textContent = `${sala.nombre} (Capacidad: ${sala.capacidad})`;
        select.appendChild(opcion);
    });

    if (salas.some((sala) => sala.id === valorPrevio)) {
        select.value = valorPrevio;
    }

    actualizarEquipamientoDisponible();
};

export const actualizarEquipamientoDisponible = () => {
    const select = document.getElementById('selectSala');
    const contenedor = document.getElementById('equipamientoReservaOpciones');
    const sala = obtenerSalas().find((s) => s.id === select.value);

    contenedor.innerHTML = '';

    if (!sala) {
        contenedor.innerHTML = '<p class="ayuda">Seleccioná primero una sala.</p>';
        return;
    }

    if (sala.equipamiento.length === 0) {
        contenedor.innerHTML = '<p class="ayuda">Esta sala no tiene equipamiento disponible.</p>';
        return;
    }

    sala.equipamiento.forEach((item) => {
        const label = document.createElement('label');
        label.innerHTML = `<input type="checkbox" name="equipamientoReserva" value="${item}"> ${item}`;
        contenedor.appendChild(label);
    });
};

export const renderizarReservas = () => {
    const reservas = obtenerReservas();
    const salas = obtenerSalas();
    const tbody = document.getElementById('listadoReservas');
    const tabla = document.getElementById('tablaReservas');
    const mensajeVacio = document.getElementById('mensajeVacioReservas');

    tbody.innerHTML = '';

    if (reservas.length === 0) {
        tabla.classList.add('oculto');
        mensajeVacio.classList.remove('oculto');
        return;
    }

    tabla.classList.remove('oculto');
    mensajeVacio.classList.add('oculto');

    const reservasOrdenadas = [...reservas].sort((a, b) =>
        (a.fecha + a.horaInicio).localeCompare(b.fecha + b.horaInicio)
    );

    reservasOrdenadas.forEach((reserva, index) => {
        const sala = salas.find((s) => s.id === reserva.salaId);
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${index + 1}</td>
            <td>${sala ? sala.nombre : 'Sala eliminada'}</td>
            <td>${formatearFecha(reserva.fecha)}</td>
            <td>${reserva.horaInicio} - ${reserva.horaFin}</td>
            <td>${reserva.solicitante}</td>
            <td>${reserva.cantidadPersonas}</td>
            <td>${reserva.equipamiento.length ? reserva.equipamiento.join(', ') : '—'}</td>
            <td><button type="button" class="btn-eliminar" data-id="${reserva.id}">Cancelar</button></td>
        `;
        tbody.appendChild(fila);
    });

    tbody.querySelectorAll('.btn-eliminar').forEach((boton) => {
        boton.addEventListener('click', () => eliminarReserva(boton.dataset.id));
    });
};

export const agregarReserva = (evento) => {
    evento.preventDefault();

    const salaId = document.getElementById('selectSala').value;
    const fecha = document.getElementById('fechaReserva').value;
    const horaInicio = document.getElementById('horaInicioReserva').value;
    const horaFin = document.getElementById('horaFinReserva').value;
    const solicitante = document.getElementById('solicitanteReserva').value;
    const cantidadPersonas = document.getElementById('cantidadPersonas').value;
    const motivo = document.getElementById('motivoReserva').value;
    const equipamiento = Array.from(document.querySelectorAll('input[name="equipamientoReserva"]:checked')).map((cb) => cb.value);

    const sala = obtenerSalas().find((s) => s.id === salaId);
    if (!sala) {
        alert('Debés seleccionar una sala válida.');
        return;
    }

    const errorSolicitante = validarTexto(solicitante, 3, 'El nombre del solicitante');
    if (errorSolicitante !== true) {
        alert(errorSolicitante);
        return;
    }

    const errorFecha = validarFecha(fecha);
    if (errorFecha !== true) {
        alert(errorFecha);
        return;
    }

    const errorHorario = validarHorario(horaInicio, horaFin);
    if (errorHorario !== true) {
        alert(errorHorario);
        return;
    }

    const errorCantidad = validarCantidadPersonas(cantidadPersonas, sala.capacidad);
    if (errorCantidad !== true) {
        alert(errorCantidad);
        return;
    }

    const errorMotivo = validarTexto(motivo, 3, 'El motivo de la reunión');
    if (errorMotivo !== true) {
        alert(errorMotivo);
        return;
    }

    if (hayConflicto(salaId, fecha, horaInicio, horaFin)) {
        alert('La sala ya está reservada en ese horario. Elegí otro horario o sala.');
        return;
    }

    const reservas = obtenerReservas();
    reservas.push({
        id: generarId(),
        salaId,
        solicitante: solicitante.trim(),
        fecha,
        horaInicio,
        horaFin,
        cantidadPersonas: Number(cantidadPersonas),
        motivo: motivo.trim(),
        equipamiento,
    });
    guardarReservas(reservas);

    evento.target.reset();
    actualizarEquipamientoDisponible();
    renderizarReservas();
};

export const eliminarReserva = (id) => {
    if (!confirm('¿Cancelar esta reserva?')) {
        return;
    }

    const reservas = obtenerReservas().filter((reserva) => reserva.id !== id);
    guardarReservas(reservas);
    renderizarReservas();
};
