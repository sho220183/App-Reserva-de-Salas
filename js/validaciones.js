export const validarTexto = (valor, minLength = 3, nombreCampo = 'El campo') => {
    if (!valor || valor.trim() === '') {
        return `${nombreCampo} no puede estar vacío.`;
    }

    if (valor.trim().length < minLength) {
        return `${nombreCampo} debe tener al menos ${minLength} caracteres.`;
    }

    return true;
};

export const validarCapacidad = (capacidad) => {
    if (capacidad === '' || capacidad === null) {
        return 'La capacidad no puede estar vacía.';
    }

    const valor = Number(capacidad);

    if (!Number.isInteger(valor) || valor < 1) {
        return 'La capacidad debe ser un número entero mayor a 0.';
    }

    if (valor > 200) {
        return 'La capacidad debe ser un número razonable (máximo 200).';
    }

    return true;
};

export const validarFecha = (fecha) => {
    if (!fecha) {
        return 'Debés seleccionar una fecha.';
    }

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const fechaSeleccionada = new Date(`${fecha}T00:00:00`);

    if (fechaSeleccionada < hoy) {
        return 'La fecha no puede ser anterior a hoy.';
    }

    return true;
};

export const validarHorario = (horaInicio, horaFin) => {
    if (!horaInicio || !horaFin) {
        return 'Debés indicar la hora de inicio y de fin.';
    }

    if (horaInicio >= horaFin) {
        return 'La hora de fin debe ser posterior a la hora de inicio.';
    }

    return true;
};

export const validarCantidadPersonas = (cantidad, capacidadSala) => {
    if (cantidad === '' || cantidad === null) {
        return 'La cantidad de personas no puede estar vacía.';
    }

    const valor = Number(cantidad);

    if (!Number.isInteger(valor) || valor < 1) {
        return 'La cantidad de personas debe ser un número entero mayor a 0.';
    }

    if (valor > capacidadSala) {
        return `La sala tiene una capacidad máxima de ${capacidadSala} personas.`;
    }

    return true;
};
