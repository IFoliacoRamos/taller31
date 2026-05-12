const canvas = document.getElementById("canvas");

const ctx = canvas.getContext("2d");

// Tamaño del canvas
const anchoCanvas = canvas.width;
const altoCanvas = canvas.height;

// Configuración inicial
ctx.lineWidth = 2;

ctx.font = "18px Arial";

// Bits de región
const INSIDE = 0;
const LEFT = 1;
const RIGHT = 2;
const BOTTOM = 4;
const TOP = 8;

// Variables del viewport
let xmin = 150;
let ymin = 150;
let xmax = 450;
let ymax = 350;

// Índice de escena
let escenaActual = 0;

// Lista inicial de escenas
const escenas = [

    {
        titulo: "Caso 1 - Línea completamente dentro",

        x1: 200,
        y1: 200,

        x2: 400,
        y2: 300
    },

    {
        titulo: "Caso 2 - Línea completamente fuera",

        x1: 20,
        y1: 50,

        x2: 80,
        y2: 100
    },

    {
        titulo: "Caso 3 - Entra por la izquierda",

        x1: 50,
        y1: 250,

        x2: 250,
        y2: 250
    },

    {
        titulo: "Caso 4 - Toca solo una esquina",

        x1: 450,
        y1: 150,

        x2: 600,
        y2: 0
    },

    {
        titulo: "Caso 5 - Cruza completamente",

        x1: 50,
        y1: 100,

        x2: 600,
        y2: 400
    }

];


// Limpiar canvas
function limpiarCanvas() {

    ctx.clearRect(
        0,
        0,
        anchoCanvas,
        altoCanvas
    );
}

// Dibujar fondo guía
function dibujarFondo() {

    ctx.fillStyle = "#ffffff";

    ctx.fillRect(
        0,
        0,
        anchoCanvas,
        altoCanvas
    );
}

// Dibujar cuadrícula
function dibujarCuadricula() {

    ctx.strokeStyle = "#e0e0e0";

    ctx.lineWidth = 1;

    for (let x = 0; x <= anchoCanvas; x += 50) {

        ctx.beginPath();

        ctx.moveTo(x, 0);

        ctx.lineTo(x, altoCanvas);

        ctx.stroke();
    }

    for (let y = 0; y <= altoCanvas; y += 50) {

        ctx.beginPath();

        ctx.moveTo(0, y);

        ctx.lineTo(anchoCanvas, y);

        ctx.stroke();
    }
}

// Dibujar ejes
function dibujarEjes() {

    ctx.strokeStyle = "#999";

    ctx.beginPath();

    ctx.moveTo(anchoCanvas / 2, 0);

    ctx.lineTo(anchoCanvas / 2, altoCanvas);

    ctx.stroke();

    ctx.beginPath();

    ctx.moveTo(0, altoCanvas / 2);

    ctx.lineTo(anchoCanvas, altoCanvas / 2);

    ctx.stroke();
}

function dibujarViewport() {

    // Área interna
    ctx.fillStyle = "rgba(0, 0, 255, 0.08)";

    ctx.fillRect(
        xmin,
        ymin,
        xmax - xmin,
        ymax - ymin
    );

    // Borde
    ctx.strokeStyle = "blue";

    ctx.lineWidth = 3;

    ctx.strokeRect(
        xmin,
        ymin,
        xmax - xmin,
        ymax - ymin
    );
}

// Dibujar línea genérica
function dibujarLinea(x1, y1, x2, y2, color) {

    ctx.beginPath();

    ctx.moveTo(x1, y1);

    ctx.lineTo(x2, y2);

    ctx.strokeStyle = color;

    ctx.lineWidth = 3;

    ctx.stroke();
}

// Dibujar puntos extremos
function dibujarPuntos(x1, y1, x2, y2) {

    ctx.fillStyle = "black";

    ctx.beginPath();

    ctx.arc(x1, y1, 5, 0, Math.PI * 2);

    ctx.fill();

    ctx.beginPath();

    ctx.arc(x2, y2, 5, 0, Math.PI * 2);

    ctx.fill();
}

// Dibujar coordenadas
function dibujarCoordenadas(x1, y1, x2, y2) {

    ctx.fillStyle = "black";

    ctx.font = "14px Arial";

    ctx.fillText(
        `(${x1}, ${y1})`,
        x1 + 10,
        y1 - 10
    );

    ctx.fillText(
        `(${x2}, ${y2})`,
        x2 + 10,
        y2 - 10
    );
}

// Mostrar códigos de región
function mostrarCodigosRegion(x1, y1, x2, y2) {

    let codigo1 = obtenerCodigo(x1, y1);

    let codigo2 = obtenerCodigo(x2, y2);

    ctx.fillStyle = "darkred";

    ctx.font = "14px Arial";

    ctx.fillText(
        `Código P1: ${codigo1.toString(2)}`,
        20,
        30
    );

    ctx.fillText(
        `Código P2: ${codigo2.toString(2)}`,
        20,
        50
    );
}

// Obtener código binario de región
function obtenerCodigo(x, y) {

    let codigo = INSIDE;

    // Izquierda
    if (x < xmin) {

        codigo |= LEFT;
    }

    // Derecha
    else if (x > xmax) {

        codigo |= RIGHT;
    }

    // Arriba
    if (y < ymin) {

        codigo |= TOP;
    }

    // Abajo
    else if (y > ymax) {

        codigo |= BOTTOM;
    }

    return codigo;
}

// Algoritmo Cohen-Sutherland
function cohenSutherland(x1, y1, x2, y2) {

    let codigo1 = obtenerCodigo(x1, y1);

    let codigo2 = obtenerCodigo(x2, y2);

    let aceptada = false;

    while (true) {

        // Línea completamente dentro
        if ((codigo1 | codigo2) === 0) {

            aceptada = true;

            break;
        }

        // Línea completamente fuera
        else if ((codigo1 & codigo2) !== 0) {

            break;
        }

        // Línea parcialmente visible
        else {

            let codigoFuera;

            let x;
            let y;

            if (codigo1 !== 0) {

                codigoFuera = codigo1;
            }
            else {

                codigoFuera = codigo2;
            }

            // Arriba
            if (codigoFuera & TOP) {

                x = x1 + (x2 - x1) *
                    (ymin - y1) /
                    (y2 - y1);

                y = ymin;
            }

            // Abajo
            else if (codigoFuera & BOTTOM) {

                x = x1 + (x2 - x1) *
                    (ymax - y1) /
                    (y2 - y1);

                y = ymax;
            }

            // Derecha
            else if (codigoFuera & RIGHT) {

                y = y1 + (y2 - y1) *
                    (xmax - x1) /
                    (x2 - x1);

                x = xmax;
            }

            // Izquierda
            else if (codigoFuera & LEFT) {

                y = y1 + (y2 - y1) *
                    (xmin - x1) /
                    (x2 - x1);

                x = xmin;
            }

            // Reemplazar punto exterior
            if (codigoFuera === codigo1) {

                x1 = x;
                y1 = y;

                codigo1 = obtenerCodigo(x1, y1);
            }
            else {

                x2 = x;
                y2 = y;

                codigo2 = obtenerCodigo(x2, y2);
            }
        }
    }

    return {

        aceptada,

        x1,
        y1,

        x2,
        y2
    };
}

// Dibujar escena actual
function dibujarEscena() {

    limpiarCanvas();

    dibujarFondo();

    dibujarCuadricula();

    dibujarEjes();

    dibujarViewport();

    dibujarTexto();

    let escena = escenas[escenaActual];

    // Dibujar línea original
    dibujarLinea(
    escena.x1,
    escena.y1,
    escena.x2,
    escena.y2,
    "gray"
);

// Aplicar algoritmo
    let resultado = cohenSutherland(

    escena.x1,
    escena.y1,

    escena.x2,
    escena.y2
);

// Dibujar línea recortada
    if (resultado.aceptada) {

    dibujarLinea(

        resultado.x1,
        resultado.y1,

        resultado.x2,
        resultado.y2,

        "red"
    );
}

    dibujarPuntos(
        escena.x1,
        escena.y1,
        escena.x2,
        escena.y2
    );

    dibujarCoordenadas(
        escena.x1,
        escena.y1,
        escena.x2,
        escena.y2
    );

    mostrarCodigosRegion(

    escena.x1,
    escena.y1,

    escena.x2,
    escena.y2
);

    document.getElementById("casoTitulo").innerText =

    escena.titulo +

    "  |  Escena " +

    (escenaActual + 1) +

    " de " +

    escenas.length;
}

function dibujarTexto() {

    ctx.fillStyle = "black";

    ctx.font = "16px Arial";

    ctx.fillText(
        "Ventana de recorte",
        xmin,
        ymin - 15
    );

    ctx.fillText(
        `xmin: ${xmin}`,
        xmin,
        ymax + 25
    );

    ctx.fillText(
        `ymin: ${ymin}`,
        xmin,
        ymax + 45
    );

    ctx.fillText(
        `xmax: ${xmax}`,
        xmax - 90,
        ymax + 25
    );

    ctx.fillText(
        `ymax: ${ymax}`,
        xmax - 90,
        ymax + 45
    );
}

// Inicializar canvas
function inicializarCanvas() {

    limpiarCanvas();

    dibujarFondo();

    dibujarCuadricula();

    dibujarEjes();

    dibujarViewport();

    dibujarTexto();
}

// Ejecutar inicio
dibujarEscena();

// Escena siguiente
function siguienteEscena() {

    escenaActual++;

    if (escenaActual >= escenas.length) {

        escenaActual = 0;
    }

    dibujarEscena();
}

// Escena anterior
function anteriorEscena() {

    escenaActual--;

    if (escenaActual < 0) {

        escenaActual = escenas.length - 1;
    }

    dibujarEscena();
}

// Actualizar ventana de recorte
function actualizarVentana() {

    xmin = parseInt(
        document.getElementById("xmin").value
    );

    ymin = parseInt(
        document.getElementById("ymin").value
    );

    xmax = parseInt(
        document.getElementById("xmax").value
    );

    ymax = parseInt(
        document.getElementById("ymax").value
    );

    dibujarEscena();
}