const canvas = document.getElementById("canvas");

const ctx = canvas.getContext("2d");

// Tamaño del canvas
const anchoCanvas = canvas.width;
const altoCanvas = canvas.height;

// Configuración inicial
ctx.lineWidth = 2;

ctx.font = "18px Arial";

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
        titulo: "Caso 2 - Línea diagonal",

        x1: 100,
        y1: 100,

        x2: 600,
        y2: 400
    },

    {
        titulo: "Caso 3 - Línea horizontal",

        x1: 50,
        y1: 250,

        x2: 650,
        y2: 250
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

// Dibujar viewport
function dibujarViewport() {

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

// Dibujar escena actual
function dibujarEscena() {

    limpiarCanvas();

    dibujarFondo();

    dibujarCuadricula();

    dibujarEjes();

    dibujarViewport();

    dibujarTexto();

    let escena = escenas[escenaActual];

    dibujarLinea(
        escena.x1,
        escena.y1,
        escena.x2,
        escena.y2,
        "gray"
    );

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

    document.getElementById("casoTitulo").innerText =
    escena.titulo;
}

// Dibujar texto informativo
function dibujarTexto() {

    ctx.fillStyle = "black";

    ctx.fillText(
        "Viewport de recorte",
        xmin,
        ymin - 10
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