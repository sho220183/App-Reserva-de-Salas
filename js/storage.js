const SALAS_KEY = 'reservaSalas_salas';
const RESERVAS_KEY = 'reservaSalas_reservas';
const EQUIPAMIENTO_KEY = 'reservaSalas_equipamiento';

export const generarId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

export const obtenerSalas = () => JSON.parse(localStorage.getItem(SALAS_KEY)) || [];

export const guardarSalas = (salas) => localStorage.setItem(SALAS_KEY, JSON.stringify(salas));

export const obtenerReservas = () => JSON.parse(localStorage.getItem(RESERVAS_KEY)) || [];

export const guardarReservas = (reservas) => localStorage.setItem(RESERVAS_KEY, JSON.stringify(reservas));

export const obtenerEquipamiento = () => JSON.parse(localStorage.getItem(EQUIPAMIENTO_KEY)) || [];

export const guardarEquipamiento = (equipamiento) => localStorage.setItem(EQUIPAMIENTO_KEY, JSON.stringify(equipamiento));

export const inicializarDatos = () => {
    if (obtenerEquipamiento().length === 0) {
        guardarEquipamiento(['Proyector', 'Pizarra', 'Videoconferencia', 'Televisor', 'Aire acondicionado', 'Wifi']);
    }

    if (obtenerSalas().length === 0) {
        guardarSalas([
            { id: generarId(), nombre: 'Sala Norte', capacidad: 6, equipamiento: ['Proyector', 'Wifi'] },
            { id: generarId(), nombre: 'Sala Sur', capacidad: 10, equipamiento: ['Proyector', 'Videoconferencia', 'Televisor', 'Wifi'] },
            { id: generarId(), nombre: 'Sala Este', capacidad: 4, equipamiento: ['Pizarra', 'Wifi'] },
        ]);
    }
};
