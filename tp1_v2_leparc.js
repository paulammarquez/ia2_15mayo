let formas = [];
let tamano = 15;
let margen = 2;
let numFilas, numColumnas;
let miImagen;
let matrizColores = [];
let imagenCargada = false;
let fondoColor;
let esquinaSeleccionada = -1;

function preload() {
  // Cargar la imagen
  miImagen = loadImage("assets/gradient1.jpg", () => {
    imagenCargada = true;
  });
}

function setup() {
  createCanvas(600, 600);

  // Verificar que la imagen se haya cargado antes de continuar
  if (!imagenCargada) {
    return;
  }

  // Calcular el número de filas y columnas
  numFilas = floor((height - margen) / (tamano + margen));
  numColumnas = floor((width - margen) / (tamano + margen));

  // Crear matriz de colores
  miImagen.loadPixels();
  for (let y = 0; y < miImagen.height; y++) {
    let fila = [];
    for (let x = 0; x < miImagen.width; x++) {
      let indice = (x + y * miImagen.width) * 4;
      let r = miImagen.pixels[indice];
      let g = miImagen.pixels[indice + 1];
      let b = miImagen.pixels[indice + 2];
      let a = miImagen.pixels[indice + 3];
      fila.push(color(r, g, b, a));
    }
    matrizColores.push(fila);
  }

  // Crear formas
  for (let fila = 0; fila < numFilas; fila++) {
    for (let columna = 0; columna < numColumnas; columna++) {
      let forma = {
        x: columna * (tamano + margen) + margen,
        y: fila * (tamano + margen) + margen,
        tamano: tamano,
        tipoAnterior: random(["cuadrado", "circulo"]),
        tipoActual: "",
        color: null
      };
      formas.push(forma);
    }
  }

  // Asignar colores y tipos a las formas
  for (let i = 0; i < formas.length; i++) {
    let forma = formas[i];
    let x = floor(map(forma.x + forma.tamano / 2, 0, width, 0, miImagen.width));
    let y = floor(map(forma.y + forma.tamano / 2, 0, height, 0, miImagen.height));
    forma.color = matrizColores[y][x];
    if (forma.tipoAnterior === "cuadrado") {
      forma.tipoActual = "circulo";
    } else {
      forma.tipoActual = "cuadrado";
    }
  }
}

function draw() {
  // Actualizar colores de las esquinas al pasar el mouse por encima
  if (mouseX >= 0 && mouseX < width && mouseY >= 0 && mouseY < height) {
    let x = floor(map(mouseX, 0, width, 0, miImagen.width));
    let y = floor(map(mouseY, 0, height, 0, miImagen.height));
    let colorMouse = matrizColores[y][x];
    let zona = tamano * 3;
    for (let i = 0; i < formas.length; i++) {
      let forma = formas[i];
      let distanciaX = abs(forma.x - mouseX);
      let distanciaY = abs(forma.y - mouseY);
      if (distanciaX < zona && distanciaY < zona) {
        forma.color = colorMouse;
      }
    }
  }
  
  // Dibujar formas
  noStroke();
  for (let i = 0; i < formas.length; i++) {
    let forma = formas[i];
    fill(forma.color);
    if (forma.tipoActual === "cuadrado") {
      rect(forma.x, forma.y, forma.tamano, forma.tamano);
    } else {
      ellipse(forma.x + forma.tamano / 2, forma.y + forma.tamano / 2, forma.tamano, forma.tamano);
    }
  }
}
