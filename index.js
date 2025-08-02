const blockSize = 20;
const tetrisHeight = 20;
const tetrisWidth = 10;
const color0 = '#19191C'
const numeroFramesparaY = 50;

const blockSizeSig = 20;
const canvasSigWidth = 5;
const canvasSigHeight = 5;

const root = document.documentElement
const colorPadre = getComputedStyle(root).getPropertyValue('--fondo-padre');

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
    [0,1,0],
    [1,1,1],
    [0,1,0]
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
    x : 4, y : 1
  },

  pieza : piezas[parseInt(Math.random() * piezas.length)],
  color: colores[parseInt(Math.random() * colores.length)]
};

const piezaSig = {
  pieza : piezas[Math.floor(Math.random()*piezas.length)],
  color : colores[Math.floor(Math.random()*colores.length)]
}

function reiniciarBoard() {
  const board = [];
  for (let i = 0; i < tetrisHeight; i++) {
    board[i] = Array(tetrisWidth).fill(0)
  }
  return board;
}

let board = reiniciarBoard();


const btnLeft = document.getElementById('left');
const btnTop = document.getElementById('top');
const btnRigth = document.getElementById('right');
const btnBotton = document.getElementById('boton');
const nombreJugador= document.getElementById('jugador');
const scoreSpan = document.getElementById('score');

const canvasTetris = document.getElementById('tetris')
const canvasPiezaSig = document.getElementById('piezaSig');

canvasTetris.height = blockSize * tetrisHeight;
canvasTetris.width = blockSize * tetrisWidth;

canvasPiezaSig.width = blockSizeSig * canvasSigWidth;
canvasPiezaSig.height = blockSizeSig * canvasSigHeight;





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
  const piezaOriginal = piezaJugador.pieza;
  piezaJugador.pieza = rotacion(piezaJugador.pieza);
  if (colision()) {
    if (piezaJugador.posicion.x > (tetrisWidth/2)) {
      piezaJugador.posicion.x = tetrisWidth;
      do{
        piezaJugador.posicion.x --
      } while (colision())
    } else {
      piezaJugador.posicion.x = 0;
      do{
        piezaJugador.posicion.x ++
      } while (colision())
    }
    
  }
});

btnRigth.addEventListener('click', () => {
  piezaJugador.posicion.x++;
  if (colision()) {
    piezaJugador.posicion.x--;
  }
});

btnBotton.addEventListener('click', () => {
  piezaJugador.posicion.y++;
})

const ctx = canvasTetris.getContext('2d');
const ctxPiezaSig = canvasPiezaSig.getContext('2d');

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
  piezaJugador.pieza.forEach((array, y) => {
    array.forEach((value, x) => {
      if (value == 1 && board[y+piezaJugador.posicion.y]?.[x+piezaJugador.posicion.x] != 0) {
        boleanCent = true;
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

const dibujarSig = (x,y,color) => {
  ctxPiezaSig.fillStyle = color;
  ctxPiezaSig.fillRect(x*blockSizeSig,y*blockSizeSig,blockSize,blockSize);
  ctxPiezaSig.fill()
}

const dibujarPiezaSig = (pieza) => {
  ctxPiezaSig.fillStyle = colorPadre;
  ctxPiezaSig.fillRect(0,0,canvasPiezaSig.width,canvasPiezaSig.height)
  ctxPiezaSig.fill()
  pieza.forEach((arr,y) => {
    arr.forEach((value, x) => {
      if (value !== 0){
        dibujarSig((canvasSigWidth/2- pieza[0].length/2)+x,(canvasSigHeight/2-pieza.length/2)+y, piezaSig.color)
      } 
    })
  })
}

const actualizacion = () => {
  dibujarBoard()
  movimientoY()
  if(colision()) {
    piezaJugador.posicion.y --;
    solidificacion()
    piezaJugador.posicion.y = 0;
    piezaJugador.posicion.x = 4;
    piezaJugador.pieza = piezaSig.pieza;
    piezaJugador.color = piezaSig.color;
    piezaSig.pieza = piezas[Math.floor(Math.random()*piezas.length)];
    piezaSig.color = colores[Math.floor(Math.random()*colores.length)]
    if (colision()) {
      alert('game over')
      board = reiniciarBoard()
      piezaJugador.score = 0;
      scoreSpan.textContent = '0';
    }
  }
  dibujarJugador()
  dibujarPiezaSig(piezaSig.pieza)
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