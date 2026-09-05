const TEMA_KEY = 'reservaSalas_tema';

export const obtenerTema = () => localStorage.getItem(TEMA_KEY) || 'claro';

export const guardarTema = (tema) => localStorage.setItem(TEMA_KEY, tema);

export const aplicarTema = (tema) => {
    document.documentElement.setAttribute('data-tema', tema);

    const boton = document.getElementById('botonTema');
    if (boton) {
        boton.textContent = tema === 'oscuro' ? '☀️ Modo claro' : '🌙 Modo oscuro';
    }
};

export const inicializarTema = () => {
    aplicarTema(obtenerTema());
};

export const alternarTema = () => {
    const nuevoTema = obtenerTema() === 'oscuro' ? 'claro' : 'oscuro';
    guardarTema(nuevoTema);
    aplicarTema(nuevoTema);
};
