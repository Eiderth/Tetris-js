const btnLeft = document.getElementById('left');
const btnTop = document.getElementById('top');
const btnRigth = document.getElementById('right');
const btnBoton = document.getElementById('boton');
const nombreJugador= document.getElementById('jugador');
const scoreSpan = document.getElementById('score');

const rotacion = (matriz) => {
  const filas = matriz.length;
  const columnas = matriz[0].length;
  let matrizTraspuesta = []
  for (let i = 0; i < columnas; i++) {
    matrizTraspuesta[i] = []
    for (let j = 0; j < filas; j++) {
      matrizTraspuesta[i][j] = piezaJugador.pieza[j][i];
    }
  }
  for (let i = 0; i < matrizTraspuesta.length; i++) {
    matrizTraspuesta[i].reverse()
  }
  return matrizTraspuesta;
}

btnLeft.addEventListener('click', () => {
  piezaJugador.posicion.x--
  if(colision()){
    piezaJugador.posicion.x++; 
  }
});

btnTop.addEventListener('click', () => {
  let posicion = piezaJugador.pieza;
  piezaJugador.pieza = rotacion(piezaJugador.pieza)
  if (colision()) {
    piezaJugador.pieza = posicion;  
  }
});

btnRigth.addEventListener('click', () => {
  piezaJugador.posicion.x++;
  if (colision()) {
    piezaJugador.posicion.x--;
  }
});

btnBoton.addEventListener('click', () => {
  piezaJugador.posicion.y++;
})

const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d');

const blockSize = 20;
const tetrisHeight = 20;
const tetrisWidth = 10;
const color0 = '#19191C'
const numeroFramesparaY = 50;
canvas.height = blockSize * tetrisHeight;
canvas.width = blockSize * tetrisWidth;

function reiniciarBoard() {
  const board = [];
  for (let i = 0; i < tetrisHeight; i++) {
    board[i] = Array(tetrisWidth).fill(0)
  }
  return board;
}

let board = reiniciarBoard()
const piezas = [
  [
    [1,1],
    [1,1]
  ],
  [
    [0,1,0],
    [1,1,1]
  ],
  [
    [1,1,1]
  ],
  [
    [0,1],
    [0,1],
    [0,1],
    [1,1]
  ],
  [
    [1,0],
    [1,0],
    [1,0],
    [1,1]
  ],
  [
    [1,0,0],
    [1,1,0],
    [1,1,1]
  ]
];

const colores = [ 
  'red', 'green', 'yellow', 'blueviolet', 'orange', 'blueviolet'
];

const piezaJugador = {
  nombre : null,
  score: 0,
  posicion : {
    x : 4, y : 10
  },
  pieza : piezas[parseInt(Math.random() * piezas.length)],
  color: colores[parseInt(Math.random() * colores.length)]
};

const dibujar = (x,y, value) => {
  if (value == 0) {
    ctx.fillStyle = color0
  } else if (value == 1) {
    ctx.fillStyle = piezaJugador.color
  } else {
    ctx.fillStyle = 'blue'
  }
  
  ctx.fillRect(x * blockSize,y *blockSize, blockSize, blockSize);
  ctx.fill();
}

const dibujarBoard = () => {
  board.forEach((arr, y) => {
    arr.forEach((val,x) => {
      dibujar(x,y,val);
    })
  })
}

const dibujarJugador = () => {
  piezaJugador.pieza.forEach((arr,y) => {
    arr.forEach((value, x) => {
      dibujar(x+piezaJugador.posicion.x,y+piezaJugador.posicion.y, value);
    })
  })
}

let contadorDeFrames = 0
const movimientoY = () => {
  contadorDeFrames++;
  if(contadorDeFrames >= numeroFramesparaY){
    piezaJugador.posicion.y ++;
    contadorDeFrames = 0;
  }
}

const colision = () => {
  let boleanCent = false
  piezaJugador.pieza.forEach((arr, y) => {
    arr.forEach((value, x) => {
      if(board[y+piezaJugador.posicion.y]?.[x+piezaJugador.posicion.x] != 0 && value == 1){
        boleanCent = true
      }
    })
  })
  return boleanCent;
}

const solidificacion = () => {
  piezaJugador.pieza.forEach((arr,y) => {
    arr.forEach((value, x) => {
      if (value == 1) {
        board[y+piezaJugador.posicion.y][x+piezaJugador.posicion.x] = 2;
      }
    })
  })
}

const removeFila = () => {
 for (let i = 0; i < board.length; i++) {
    if(board[i].every(element => element != 0)){
      piezaJugador.score += 100;
      scoreSpan.textContent = `${piezaJugador.score}`;
      board.splice(i, 1);
      board.unshift(Array(tetrisWidth).fill(0))
    }
  }
}
const actualizacion = () => {
  dibujarBoard()
  movimientoY()
  if(colision()) {
    piezaJugador.posicion.y --;
    solidificacion()
    piezaJugador.posicion.y = 0;
    piezaJugador.posicion.x = 4;
    piezaJugador.pieza = piezas[parseInt(Math.random() * piezas.length)]
    piezaJugador.color = colores[parseInt(Math.random() * colores.length)]
    if (colision()) {
      alert('game over')
      board = reiniciarBoard()
      piezaJugador.score = 0;
      scoreSpan.textContent = '0';
    }
  }
  dibujarJugador()
  removeFila()
  requestAnimationFrame(actualizacion);
}

async function pedirDato() {
  do {
    piezaJugador.nombre = await prompt("indique su nombre: ");
  } while (!piezaJugador.nombre);
  
  piezaJugador.nombre = piezaJugador.nombre.toUpperCase()
  nombreJugador.textContent = `${piezaJugador.nombre}`
  actualizacion()
}
pedirDato()

//No tocar, fue hecho con IA
//Insonnio y Ansiedad 