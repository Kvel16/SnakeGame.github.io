// Importamos las librerias
let { append, cons, first, isEmpty, isList, length, rest, map, forEach, deepCopy } = functionalLight;

/* Definiciones Globales
-Dato: "objeto manipulable por el ordenador". Puede ser un entero, un string, lista, constante e incluso otra función.
-Atributo: "son las características individuales que diferencian un objeto de otro y determinan su apariencia, estado u otras cualidades".
Definición: asignación o asociación de atributos a determinados tipos de datos.
-Mundo: estructura de datos que engloba a los demás datos referentes al juego. Para ser actualizado se crea una copia del mismo con los valores cambiados, más no se puede editar como tal.
-Ilustración: cambios visuales en el juego (ya sean como el escenario, fondo, imagenes, texto u otras elementos gráficos) que se manejan desde Javascript por medio de funciones específicas que alojan el resultado en un canvas.
Type (de Gameshow): Decimal que identifica el modo de juego actual. Para más información lea el Readme.md en la línea 20.
-Celda: hace referencia a cada elemento de la cuadrícula que se forma para dibujar el laberinto. Cada una tiene un X e Y que representan su posición.
-Coordenada: conjunto de dos elementos, siendo estos X e Y, que representan la posición de un objeto en un plano cartesiado.
-Elemento: sección de un JSON que tiene ciertos atributos definidos por el usuario y puede cumplir con ciertas características.
*/

/*
Contrato: Dato, Atributo(s) -> Dato (Copia con atributo(s) actualizados)
Propósito: Actualiza los atributos del objeto y retorna una copia profunda.
Prototipo: update(data, attribute){...}
Ejemplos: Siendo Mundo = {} -> update(Mundo, {}) -> Mundo
Siendo Mundo = { x:0 } -> update(Mundo, { x: Mundo.x + 1 }) -> { x: 1 }
*/

function update(data, attribute) {
  return Object.assign({}, data, attribute);
}

let Mundo = {}

/*
Posibles carpetas: sof -> solidObjects fence, so -> solidObjects
foa -> food apple, foc -> food cherry, fol -> food limon, fom -> food mango, fon -> food naranja, fos -> food sandia, 
sb -> SnakeBody,
mi -> menu-interface, 
slg -> slabs grabs,
ii -> instructions-interface.
Contrato: String (Nombre del archivo), String (carpeta acortada) -> Image OR sound OR gif.
Propósito: acortar los llamados a las direcciones de las imágenes, sonidos y gifs
Prototipo: IL(Filename, FolderName){...} (IL refiriéndose a Image Loader)
Ejemplo: IL(perro, so) -> loadImage("images/solidObjects/perro.png")
*/

function IL(Filename, FolderName){
  if(FolderName == "sof"){
    return loadImage("images/solidObjects/fence/"+Filename+".png");
  } else if(FolderName == "so"){
    return loadImage("images/solidObjects/"+Filename+".png");
  } else if(FolderName == "mi"){
    return loadImage("images/menu-interface/"+Filename+".png");
  } else if(FolderName == "foa"){
    return loadImage("images/food/apple/"+Filename+".png");
  } else if(FolderName == "fol"){
    return loadImage("images/food/limon/"+Filename+".png");
  } else if(FolderName == "foc"){
    return loadImage("images/food/cherry/"+Filename+".png");
  } else if(FolderName == "fom"){
    return loadImage("images/food/mango/"+Filename+".png");
  } else if(FolderName == "fon"){
    return loadImage("images/food/naranja/"+Filename+".png");
  } else if(FolderName == "fos"){
    return loadImage("images/food/sandia/"+Filename+".png");
  } else if(FolderName == "fo"){
    return loadImage("images/food/"+Filename+".png");
  }  else if (FolderName == "sow"){
    return loadImage("images/solidObjects/walls/"+Filename+".png");
  } else if (FolderName == "sb"){
    return loadImage("images/SnakeBody/"+Filename+".png");
  } else if (FolderName == "slg"){
    return loadImage("images/slabs/grass/"+Filename+".png");
  } else if (FolderName == "mus"){
    return loadSound("Sounds/"+Filename+".mp3");
  } else if (FolderName == "mig"){
    return loadImage("images/menu-interface/"+Filename+".gif");
  } else if (FolderName == "ci"){
    return loadImage("images/credits-interface/"+Filename+".gif");
  } else if (FolderName == "sbl"){
    return loadImage("images/SnakeBody/Laberinth/"+Filename+".png");
  } else {
    return loadImage("images/instructions-interface/"+Filename+".gif");
}
}

// Alto y ancho del canvas.
  const wc = 1220; 
  const hc = 570; 
// Datos para el manejo del generador de laberintos. Las constantes de una letra tienen nombres sencillos ya que simplemente expresan el largo y el ancho de una celda (ver drawLaberinth(Mundo)) Al ser elementos gráficos no deberían haber problemas con los lets, además teniendo en cuenta que predominan las constantes.
  let cols, rows;
  let current;
  const w = 70;
  let grid = [];
  let stack = [];
  let i = 0;
  let j = 0;

/*
Contrato: Void -> Definicion(es)
Propósito: Realiza unas determinadas asignaciones antes de iniciar el juego.
Prototipo: setup(){...}
Ejemplo: setup() -> frameRate(30)... (seguido de una serie de instrucciones que declaran lo necesario antes de iniciar el juego)
*/

function setup() {
  frameRate(30);
  createCanvas(wc, hc);
  Mundo = { /*||Menús y gameplay||*/ mode: {type:0, option:0}, /*||Serpiente||*/ snakeBody: [{ x: 12, y: 10}, { x: 11, y: 10 }, { x: 10, y: 10 }], snakeSpeed: "slow", dir: { x: 1, y: 0 }, frameMovementSnake: 1, snakeMovePerFrame: false, /*||Escenario||*/ level:{solidObjects: [], food: [], slabs: []},  /*||HUD||*/ lives: 2, currentLevel: "1-1", score: {toShowScore: 0, accumulateScore: 0}, score2: {toShowScore: 0, accumulateScore: 0}, signNumbers: [], branches: []};
  sprSmallRock1 = IL("smallRockSpr1", "so");
  sprBrickWall1 = IL("brickWallSpr1", "sow");
  sprApple1 = IL("appleSpr1", "foa");
  sprApple2 = IL("appleSpr2", "foa");
  sprApple3 = IL("appleSpr3", "foa");
  sprCherry1 = IL("cherrySpr1", "foc");
  sprCherry2 = IL("cherrySpr2", "foc");
  sprCherry3 = IL("cherrySpr3", "foc");
  sprLimon1 = IL("limonSpr1", "fol");
  sprLimon2 = IL("limonSpr2", "fol");
  sprLimon3 = IL("limonSpr3", "fol");
  sprMango1 = IL("mangoSpr1", "fom");
  sprMango2 = IL("mangoSpr2", "fom");
  sprMango3 = IL("mangoSpr3", "fom");
  sprNaranja1 = IL("naranjaSpr1", "fon");
  sprNaranja2 = IL("naranjaSpr2", "fon");
  sprNaranja3 = IL("naranjaSpr3", "fon");
  sprSandia1 = IL("sandiaSpr1", "fos");
  sprSandia2 = IL("sandiaSpr2", "fos");
  sprSandia3 = IL("sandiaSpr3", "fos");
  sprVertFence1 = IL("vertFenceSpr1", "sof");
  sprHorFence1 = IL("horFenceSpr1", "sof");
  tecladir = IL("tecladir", "mi");
  sprTopperRightCornerFence1 = IL("topperRightCornerFenceSpr1", "sof");
  sprTopperLeftCornerFence1 = IL("topperLeftCornerFenceSpr1", "sof");
  sprLowerRightCornerFence1 = IL("lowerRightCornerFenceSpr1", "sof");
  sprLowerLeftCornerFence1 = IL("lowerLeftCornerFenceSpr1", "sof");
  botonJugar = IL("boton_jugar-2", "mi");
  botonInstrucciones = IL("boton_instrucciones", "mi");
  botonJugarSel = IL("boton_jugar-2selected", "mi");
  botonInstruccionesSel = IL("boton_instrucciones-selected", "mi");
  botonCreditos = IL("boton_creditos", "mi");
  botonCreditosSel = IL("boton_creditos-sel", "mi");
  fondolaberinto = IL("fondo22", "slg");
  sprHud1 = IL("sprHud1", "mi");
  ramalabTop = IL("rama", "so");  
  ramalabRight = IL("ramaver", "so");
  ramalabBottom = IL("rama", "so");  
  ramalabLeft = IL("ramaver", "so");
  raton = IL("raton", "fo");
  banner1 = IL("recogefruta", "mi");
  banner2 = IL("rata", "mi");
  banner3 = IL("ratad", "mi");
  suelo = IL("Suelo", "mi");
  snakeHeadUp = IL("SnakeHeadUp", "sb");
  snakeHeadRight = IL("SnakeHeadRight", "sb");
  snakeHeadDown = IL("SnakeHeadDown", "sb");
  snakeHeadLeft = IL("SnakeHeadLeft", "sb");
  snakeMediumUp = IL("SnakeMediumUp", "sb");
  snakeMediumRight = IL("SnakeMediumRight", "sb");
  snakeMediumDown = IL("SnakeMediumDown", "sb");
  snakeMediumLeft = IL("SnakeMediumLeft", "sb");
  snakeTailUp = IL("SnakeTailUp", "sb");
  snakeTailRight = IL("SnakeTailRight", "sb");
  snakeTailDown = IL("SnakeTailDown", "sb");
  snakeTailLeft = IL("SnakeTailLeft", "sb");
  turnHead_LeftToDown = IL("TurnHead_LeftToDown", "sb");
  turnHead_LeftToUp = IL("TurnHead_LeftToUp", "sb");
  turnHead_RightToDown = IL("TurnHead_RightToDown", "sb");
  turnHead_RightToUp = IL("TurnHead_RightToUp", "sb");
  turnBody_LeftToDown = IL("TurnBody_LeftToDown", "sb");
  turnBody_LeftToUp = IL("TurnBody_LeftToUp", "sb");
  turnBody_RightToDown = IL("TurnBody_RightToDown", "sb");
  turnBody_RightToUp = IL("TurnBody_RightToUp", "sb");
  bSprite = IL("Bspr1", "sbl");
  iSprite = IL("Ispr1", "sbl");
  tSprite = IL("Tspr1", "sbl");
  pick_up = IL("pick_up", "mus");  
  tss = IL("tss", "mus");
  fail_sound = IL("fail_sound", "mus"); 
  fondo = IL("Fondo", "mus");
  labent = IL("grass", "mus");  
  golpe = IL("crashmaze", "mus");
  fondolab = IL("laberinth", "mus");
  pasolab = IL("pasolab", "mus");
  gameover = IL("gameover", "mus")
  movemenu = IL("abajomenu", "mus");
  backmenu = IL("atrasmenu", "mus");
  entermenu = IL("selectmenu", "mus");
  menumusic = IL("menumusic", "mus");
  rata = IL("rata", "mus");
  gamend = IL("gamend", "mus");
  menu_fondo = IL("menuwallpaper", "mig");
  bg1 = IL("fondo_instrucciones_final", "ii");
  chocando = IL("chocando", "ii");
  comiendo = IL("comiendo", "ii");
  flechas = IL("flechas", "ii");
  gameoverf = IL("fondo_game_over", "ii");
  volver2 = IL("volver2", "mi");
  creditos = IL("fondo_creditos_final", "ci");
  pressrob = IL("presionarobjeto", "mi");
  pressrcu = IL("presionarcuerpo", "mi");
  pressen = IL("presionaent", "mi");
  //Cantidad de columnas y filas del laberinto
  cols = floor(wc / w);
  rows = floor(hc / w);

  /*
  Contrato: number, number, number, number -> Cell(i, j) (Llamado a otra funcion)
  Propósito: Llama a la función cell con determinados datos mientras i y j sean menores que cols y rows respectivamente.
  Prototipo: cuadricula(i, j, cols, rows){...}
  Ejemplo: cuadricula(0, 0, 10, 10) -> var cell = new Cell(1, 0) ...
  */

  function cuadricula(i, j, cols, rows){
    if(i < cols){
      var cell = new Cell(i, j);      
      grid.push(cell);      
      return cuadricula(i+1, j, cols, rows);     
    } else if(i == cols && j < rows){
      return cuadricula(i-cols, j+1, cols, rows);
    }
  }  
cuadricula(i, j, cols, rows);
current = grid[2];
} 

/*
Contrato: number, number -> number
Propósito: Función que genera un número aleatorio entre dos límites. La función toma el valor de la siguiente forma [min, max), es decir, la función nunca podrá tomar el valor máximo, pero sí podría tomar el mínimo.
Prototipo: NAleatorio(min, max){...}
Ejemplo: NAleatorio(1, 3) -> 2
*/

function NAleatorio(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

/*
Contrato: Mundo -> Ilustracion
Propósito: Función que dibuja el diseño del juego cuando se está en la pantalla de victoria.
Prototipo: drawVictoryScreen(Mundo){...}
Ejemplo: drawVictoryScreen(Mundo) -> (Ilustración)
*/

function drawVictoryScreen(Mundo){
  background(0, 0, 0);
  fill(240, 240, 240)
  textSize(20);
  textStyle(BOLD);
  text("¡Felicitaciones! Has ganado el juego.", 400, 200);
  text("Su puntaje es: " + (Mundo.score.toShowScore + Mundo.score.accumulateScore), 400, 300);
  textSize(16);
  textStyle(BOLD);
  text("Presiona la tecla enter para continuar", 400, 400);
}

/*
Contrato: Mundo -> Ilustracion
Propósito: Función que dibuja el diseño del juego cuando se está en la pantalla de perdida.
Prototipo: drawLostScreen(Mundo){...}
Ejemplo: drawLostScreen(Mundo) -> (Ilustración)
*/
function drawLostScreen(Mundo){
  background(gameoverf);
  fill(0, 0, 0);
  textSize(40);
  image(volver2, 10, 10);
  if((Mundo.score.toShowScore + Mundo.score.accumulateScore)< 10){
    text((Mundo.score.toShowScore + Mundo.score.accumulateScore), wc/2 - 20, 505);
  }
  if((Mundo.score.toShowScore + Mundo.score.accumulateScore)> 10 && Mundo.score.toShowScore + Mundo.score.accumulateScore <= 99){
    text((Mundo.score.toShowScore + Mundo.score.accumulateScore), wc/2 - 30, 505);
  }
  if((Mundo.score.toShowScore + Mundo.score.accumulateScore)>= 100 && Mundo.score.toShowScore + Mundo.score.accumulateScore < 999){
    text((Mundo.score.toShowScore + Mundo.score.accumulateScore), wc/2 - 40, 505);
  }
  if((Mundo.score.toShowScore + Mundo.score.accumulateScore)>= 1000 && Mundo.score.toShowScore + Mundo.score.accumulateScore < 9999){
    text((Mundo.score.toShowScore + Mundo.score.accumulateScore), wc/2 - 50, 505);
  } 
}

/*
Contrato: Mundo -> Ilustracion
Propósito: Función que recibe un dato de tipo numérico (decimal) del mundo (Mundo.mode.type), el cual indica el "modo de juego" que será dibujado. (De la misma manera, con esta función se podrian ilustrar otros elementos para el canvas, pero se hace por medio de otras funciones para hacerlo un poco más "limpio").
Prototipo: drawGame(Mundo){...}
Ejemplo: drawGame(Mundo.mode.type == 0) -> drawLoadingScreenMode(Mundo)
*/

function drawGame(Mundo){
  if (Mundo.mode.type == 0){
    drawLoadingScreenMode(Mundo);
  } else if (Mundo.mode.type == 2){
    drawGameMode(Mundo);
  } else if (Mundo.mode.type == 1){
    drawMenuMode(Mundo);
  } else if (Mundo.mode.type == 3){
    drawLaberinth(Mundo);
  } else if (Mundo.mode.type == 4){
    drawInstructionsMode(Mundo);
  } else if (Mundo.mode.type == -1){
    drawCredits(Mundo);
  } else if (Mundo.mode.type == 5){
    drawVictoryScreen(Mundo);
  } else {
    drawLostScreen(Mundo);
  }
}

/*
Contrato: Mundo -> Ilustracion(es)
Propósito: Administrar qué se dibujará en el menú de instrucciones
Prototipo: drawInstructionsMode(Mundo)
Ejemplo: drawInstructionsMode(Mundo) -> background(240, 240, 240) ... (seguido de una serie de instrucciones que permiten desarrollar elementos gráficos)
*/

function drawInstructionsMode(Mundo){
  background(bg1);
  image(chocando, 965.1, 75);
  image(comiendo, 542.1, 75);
  image(flechas, 138.8, 75);
  image(volver2, 10, 10);
}

function snakeDrawerLab(Mundo, element){
  if (first(Mundo.snakeBody).x == element.x && first(Mundo.snakeBody).y == element.y){
    image(tSprite, (element.x * 55)-515, (element.y * 55)-543);
  } else if (first(rest(Mundo.snakeBody)).x == element.x && first(rest(Mundo.snakeBody)).y == element.y){
    image(iSprite, (element.x * 55)-515, (element.y * 55)-543);
  } else {
    image(bSprite, (element.x * 55)-515, (element.y * 55)-543);
  }
}

/*
Contrato: Mundo -> Ilustración(es) (Siendo más específicos, grafica lo referente al modo de laberinto)
Propósito: Dibuja un laberinto aleatorio a partir de una cuadrícula de celdas, así como el resto de elementos de su mundo (serpiente, obstáculos y demás)
Prototipo: drawLaberinth(Mundo){...}
Ejemplo: drawLaberinth(Mundo) -> grid[0].visited = true; ... (seguido de una serie de instrucciones que permiten desarrollar el laberinto)
*/

function drawLaberinth(Mundo){
  grid[0].visited = true;
  grid[1].visited = true;
  grid[2].visited = true;
  background(51);
 
  /*
  Contrato: number -> Ilustraciones
  Propósito: Muestra gráficamente cada celda de la cuadrícula.
  Prototipo: dibujar(i){...}
  Ejemplo: dibujar(1) -> grid[1].show()
  */

  function dibujar(i){
    if(i < grid.length){
      grid[i].show();
      return dibujar(i+1);
    }
  } 
  
  dibujar(i);
  current.visited = true;
  current.highlight();
  let next = current.checkNeighbors();
  if (next) {
    next.visited = true;
    stack.push(current);
    removeWalls(current, next);
    current = next;
  } else if (stack.length > 0) {
    current = stack.pop();
  }
  forEach(Mundo.snakeBody, element => {
    snakeDrawerLab(Mundo, element);
  });
  image(raton, 1120, 485, 70, 70);
  image(banner2, wc - 30, 0);
  image(banner3, 0, hc - 8, 1220, 8);
}


/*
Contrato: number, number -> number
Propósito: función que recibe el "x e y" de una celda el número de columnas y el número de filas, hace una serie de comprobaciones con estos datos, en caso de que se cumpla alguna devuelve -1 y en caso de que no se cumpla ninguna, suma i con j y ese valor lo multiplica por el número de columnas.
Prototipo: index(i, j){...}
Ejemplos: index(2, 2) -> 40
index(0, 2) -> -1
*/

function index(i, j) {
  if (i < 0 || j < 0 || i > cols - 1 || j > rows - 1) {
    return -1;
  }
  return i + j * cols;
}

/*
Contrato: celda, celda -> Ilustración (celda sin determinados muros)
Propósito: Elimina los muros entre dos celdas en caso de ser necesario.
Prototipo: removeWalls(a, b){...}
Ejemplo: removeWalls(grid[0], grid[1]) -> a.walls[1] = true ... (seguido de otras instrucciones que eliminan ciertos muros en determinados casos)
*/

function removeWalls(a, b) {
  let x = a.i - b.i;
  if (x === 1) {
    a.walls[3] = false;
    b.walls[1] = false;
  } else if (x === -1) {
    a.walls[1] = false;
    b.walls[3] = false;
  }
  let y = a.j - b.j;
  if (y === 1) {
    a.walls[0] = false;
    b.walls[2] = false;
  } else if (y === -1) {
    a.walls[2] = false;
    b.walls[0] = false;
  }
}

/*
  Contrato: number, number -> Ilustracion(es) (en resumen dibuja el laberinto junto con la función drawLaberinth)
  Propósito: Hace la cuadrícula a partir de un ciclo de i, j en el setup(), le asigna a cada elemento de la cuadrícula unas paredes en top, right, bottom, left, y les otorga un atributo de visita que inicia con falso. Por medio de unas comprobaciones de estos atributos y ayuda de otras funciones, logra generar y dibujar laberintos aleatorios en un canvas.
  Prototipo: Cell(i, j){...}
  Ejemplo: Cell(0, 0) -> this.i = 0; ... (seguido de otra serie de declaraciones, comparaciones y funciones que permiten elaborar el laberinto)
*/

function Cell(i, j) {
  this.i = i;
  this.j = j;
  this.walls = [true, true, true, true];
  this.visited = false;

  if(this.i == 0 && this.j == 0){
    this.walls = [true, false, true, true];
  }

  if(this.i == 1 && this.j == 0){
    this.walls = [true, false, true, false];
  }

  if(this.i == 2 && this.j == 0){
    this.walls = [true, true, true, false];
  }
  
  /*
  Definicion "neighbor": casillas que rodean a una determinada casilla en la cuadrícula. Se usan para que por medio de comprobaciones de si están visitadas o no, así generar otras reacciones.
  Contrato: number, number -> neighbors
  Propósito: Determina los vecinos que tiene una casilla en sus 4 direcciones, top, right, bottom, left, si tiene los lista y si no los tiene retorna indefinido.
  Prototipo: function(){...}
  Ejemplo: function() -> let neighbors = []; ... (y otra serie de declaraciones y comprobaciones que determinan si la casila tiene vecinos existentes, los lista, y si no los tiene retorna indefinido.)
  */

  this.checkNeighbors = function() {
    let neighbors = [];
    let top = grid[index(i, j - 1)];
    let right = grid[index(i + 1, j)];
    let bottom = grid[index(i, j + 1)];
    let left = grid[index(i - 1, j)];
    // Verifica si el vecino existe y si no está visitado, si es el caso lo añade la la lista.
    if (top && !top.visited) {
      neighbors.push(top);
    }
    if (right && !right.visited) {
      neighbors.push(right);
    }
    if (bottom && !bottom.visited) {
      neighbors.push(bottom);
    }
    if (left && !left.visited) {
      neighbors.push(left);
    }
    // Si la cantidad de vecinos es mayor a 0, selecciona uno de elos aleatoriamente. Esto "garantiza" el hecho de que sean laberintos aleatorios.
    if (neighbors.length > 0) {
      let r = floor(random(0, neighbors.length));
      return neighbors[r];
    } else {
      return undefined;
    }
  }
  
  /*
  Contrato: number, number -> Ilustracion(es)
  Propósito: Destacar la casilla de la cuadrícula que está seleccionada en un momento determinado.
  Prototipo: function(){...}
  Ejemplo: function() -> let x = this.i * w; ... (seguido otras declaraciones y pequeños ajustes de elementos gráficos para el destaque).
  */

  this.highlight = function() {
    let x = this.i * w;
    let y = this.j * w;
    noFill();
    noStroke();
    rect(x, y, w, w);
  }

  /*
  Contrato: number, number -> Ilustracion(es)
  Propósito: Colorear las casillas que la cuadrícula que cumplan con la condición de estar visitadas y dibuja sus muros correspondientes.
  Prototipo: function(){...}
  Ejemplo: function() -> let x = this.i * w; ... (seguido de otras declaraciones y ajustes gráficos de la susodicha casilla)
  */

  //Brinda un tamaño a las celdas en cuestiones de X e Y
  this.show = function() {
    let x = this.i * w;
    let y = this.j * w;
    noStroke();   
  //Si la casilla es visitada dibuja una imagen, en este caso es pasto.
    if (this.visited) {
      noStroke();
      image(fondolaberinto, x, y, 70, 70);
      noFill();
      rect(0, 0, 68, 68);
    }
  //Si la pared no es borrada, es dibujada con una línea de dimensiones específicas y se le asigna una imagen, en este caso, una rama. [0], [1], [2], [3] para Arriba, derecha, abajo e izquierda respectivamente.
    if (this.walls[0]) {
      image(ramalabTop, x, y-15, 70, 20);
      line(x, y, x + w, y); 
      }
    if (this.walls[1]) {
      image(ramalabRight, (x + w) - 18, y, 20, 70);
      line(x + w, y, x + w, y + w);
    }
    if (this.walls[2]) {
      image(ramalabBottom, x + w, y + w -15, 70, 20);
      line(x + w, y + w, x, y + w);
    }
    if (this.walls[3]) {
      image(ramalabLeft, x - 18, y + w, 20, 70);
      line(x, y + w, x, y);
    }
    }    
  }

/*
Contrato: Type -> Ilustracion
Propósito: En esta función colocamos lo que se necesite dibujar durante el gameplay (o ejecución del juego), dependiendo del estado del juego. Por ejemplo, mostrar el mensaje cuando el jugador pierde.
Prototipo: gameShow(type){...}
Ejemplo: gameShow(0,01) ->  text("*Chocaste con un objeto", 350, 150);
*/

function gameShow(type){
  if (type == 0){
    fill(0, 0, 0); //No hará nada en este caso
  } else if (type == 0.01 || type == 0.02){
    if (type == 0.01 && Mundo.lives > 0){
      image(pressrob, 350, 50);
    } else if (type == 0.02){
      image(pressrcu, 350, 50);
    } else {
      image(pressen, 320, 25);
    }
  } else if (type == 0.51){
    fill(0, 0, 0);
    textSize(14);
    textStyle(BOLD);
    image(tecladir, 310, 50);
  } else {
    fill(0, 0, 0);
    textSize(14);
    textStyle(BOLD);
    text("¡Ganaste! Presiona la tecla enter para ir al siguiente nivel.", 310, 100);
  }
}

/*
Contrato: String (type), Number (frame) -> Image
Propósito: Esta función asigna una imagen a un tipo de dato en específico. Estos datos se diferencian únicamente de forma gráfica (y por su nombre, naturalmente), ya que todos hacen parte de la familia de objetos Sólidos (ver siguiente función). 
Prototipo: solidObjectsDrawerAux(type, frame){...}
Ejemplo: solidObjectsDrawerAux("horFence1") ->  sprHorFence1 -> loadImage("images/solidObjects/fence/HorFence1.jpg")
*/

function solidObjectsDrawerAux(type, frame){
  if (type == "vertFence1"){
    return (sprVertFence1);
  } else if (type == "horFence1"){
    return (sprHorFence1);
  } else if (type == "topperRightCornerFence1"){
    return (sprTopperRightCornerFence1)
  } else if (type == "topperLeftCornerFence1"){
    return (sprTopperLeftCornerFence1);
  } else if (type == "lowerLeftCornerFence1"){
    return (sprLowerLeftCornerFence1);
  } else if (type == "lowerRightCornerFence1"){
    return (sprLowerRightCornerFence1);
  } else {
    return (sprBrickWall1);
  }
}

/*
Contrato: Mundo -> Image (Llamando a una función auxiliar)
Propósito: Esta función crea los objetos sólidos (objetos además de su propio cuerpo con los cuales la serpiente puede colisionar y herirse). Se les asigna un tamaño y una especie de "disponibilidad" para tener una imagen. Esta se asigna en su función auxiliar (ver función anterior).
Prototipo: solidObjectsDrawer(Mundo){...}
Ejemplo: solidObjectsDrawer(Mundo) -> image(solidObjectsDrawerAux(element.type, element.frame), element.x*30, element.y*30) (Retorna lo mismo por cada objeto sólido en el mundo.level)
*/

function solidObjectsDrawer(Mundo){
  forEach(Mundo.level.solidObjects, element => {
    image(solidObjectsDrawerAux(element.type, element.frame), element.x*30, element.y*30)
   });
}

/*
Contrato: String (type), Number (frame) -> Image 
Propósito: De la misma manera que el graficador de objetos sólidos, esta función recibe un string que determina el tipo de fruta a dibujar y el frame (o rango de frames) en el que debe hacerlo. Este "dibujo" hace referencia a la atribución de una imagen al dato representado por el string.
Prototipo: foodDrawerAux(type, frame){...}
Ejemplo: foodDrawerAux("apple", 25) -> loadImage("images/food/apple/appleSpr3.png")
*/

function foodDrawerAux(type, frame){
  if (type == "apple"){
    if (frame >= 0 && frame < 10){
      return (sprApple1);
    } else if (frame >= 10 && frame < 20){
      return (sprApple2);
    } else if (frame >= 20){
      return (sprApple3);
    }
  } else if (type == "cherry"){
    if (frame >= 0 && frame < 10){
      return (sprCherry1);
    } else if (frame >= 10 && frame < 20){
      return (sprCherry2);
    } else if (frame >= 20){
      return (sprCherry3);
    }
  } else if (type == "fresa"){
    if (frame >= 0 && frame < 10){
      return (sprFresa1);
    } else if (frame >= 10 && frame < 20){
      return (sprFresa2);
    } else if (frame >= 20){
      return (sprFresa3);
    }
  } else if (type == "limon"){
    if (frame >= 0 && frame < 10){
      return (sprLimon1);
    } else if (frame >= 10 && frame < 20){
      return (sprLimon2);
    } else if (frame >= 20){
      return (sprLimon3);
    }
  } else if (type == "mango"){
    if (frame >= 0 && frame < 10){
      return (sprMango1);
    } else if (frame >= 10 && frame < 20){
      return (sprMango2);
    } else if (frame >= 20){
      return (sprMango3);
    }
  } else if (type == "naranja"){
    if (frame >= 0 && frame < 10){
      return (sprNaranja1);
    } else if (frame >= 10 && frame < 20){
      return (sprNaranja2);
    } else if (frame >= 20){
      return (sprNaranja3);
    }
  } else if (type == "sandia"){
    if (frame >= 0 && frame < 10){
      return (sprSandia1);
    } else if (frame >= 10 && frame < 20){
      return (sprSandia2);
    } else if (frame >= 20){
      return (sprSandia3);
    }
  } 
}

/*
Contrato: Mundo (Game mode) -> Image (Llamando a una función auxiliar)
Propósito: Esta función crea los alimentos (objetos además de su propio cuerpo y los objetos sólidos, pero en este caso, con estos crecerá y ganará puntos). Se les asigna un tamaño y una especie de "disponibilidad" para tener una imagen. Esta se asigna en su función auxiliar (ver función anterior). En resumidas palabras, la función determina el comportamiento del graficador de alimentos.
Prototipo: foodDrawer(Mundo){...}
Ejemplo: foodDrawer(Mundo) -> image(foodDrawerAux(element.type, element.frame), element.x*30, element.y*30) (Retorna lo mismo por cada objeto sólido en el mundo.level en caso de que Mundo.mode.option sea 0, 0.01 o 0.02)
*/

function foodDrawer(Mundo){
  if (Mundo.mode.option == 0 || Mundo.mode.option == 0.01 || Mundo.mode.option == 0.02){
    if (isEmpty(Mundo.level.food) == false){
  forEach(first(Mundo.level.food), element => {
    image(foodDrawerAux(element.type, element.frame), element.x*30, element.y*30)
   });
   } else {
     fill(0, 0, 0);
   }
  } else {
    fill(0, 0, 0);
  }
}

/*
Contrato: Elemento compuesto de un String (type) y un frame (number) -> Ilustracion
Propósito: Esta función controla como se dibujan y desaparecen los números al comer en el juego, devolviendo su posición y un objeto de texto.
Prototipo: signNumbersDrawerAux(element){...}
Ejemplo: signNumbersDrawerAux("default" && element.frame <= 8) -> ltext("+" + element.txt, element.x, element.y);
*/

function signNumbersDrawerAux(element){
   textSize(12);
   textStyle(BOLD);
  if (element.type == "default"){
    if (element.frame <= 8){
      fill(0, 0, 0, 255);
      text("+" + element.txt, element.x, element.y);
    } else if (element.frame > 8 && element.frame <= 10){
      fill(0, 0, 0, 150);
      text("+" + element.txt, element.x, element.y);
    } else if (element.frame > 10 && element.frame <= 13){
      fill(0, 0, 0, 50);
      text("+" + element.txt, element.x, element.y);
    } else {
      fill(0, 0, 0, 0);
      text("+" + element.txt, element.x, element.y);
    }
  } else {
    if (element.frame <= 8){
      fill(243, 19, 19, 255);
      text("+" + element.txt, element.x, element.y);
    } else if (element.frame > 8 && element.frame <= 10){
      fill(243, 19, 19, 150);
      text("+" + element.txt, element.x, element.y);
    } else if (element.frame > 10 && element.frame <= 13){
      fill(243, 19, 19, 50);
      text("+" + element.txt, element.x, element.y);
    } else {
      fill(243, 19, 19, 0);
      text("+" + element.txt, element.x, element.y);
    }
  }
}

/*
Contrato: Mundo -> Ilustracion (llamando a su función auxiliar)
Propósito: Esta función hace un llamado de cada elemento de Mundo.signNumers a la funcion signNumbersDrawerAux, desde donde se controla la manera de graficar estos elementos.
Prototipo: signNumbersDrawer(Mundo){...}
Ejemplo: signNumbersDrawerAux(Mundo) -> signNumbersDrawerAux(element) de cada elemento de Mundo.signNumbers.
*/

function signNumbersDrawer(Mundo){
  forEach(Mundo.signNumbers, element => {
    signNumbersDrawerAux(element);
   });
}

/*
Contrato: String (type) -> Image
Propósito: Esta función recibe un string que determina el tipo de slab a partir de su función original (ver siguiente función) y le asigna un sprite o imagen.
Prototipo: slabsDrawerAux(type){...}
Ejemplo: slabsDrawerAux("grass1") -> loadImage("images/slabs/grass/slabTex1.png")
*/

function slabsDrawerAux(type){
    return (texGrass1);
}

/*
Contrato: Mundo -> Image (llamando a su función auxiliar)
Propósito: Esta función crea un elemento correspondiente a cada losa (objetos decorativos con los que la serpiente no colisiona de forma alguna) de Mundo.level y le asigna una disponibilidad para la atribución de una imagen, la cual es correspondida en su función auxiliar dependiendo del tipo del elemento.
Prototipo: slabsDrawer(Mundo){...}
Ejemplo: slabsDrawer(Mundo) -> image(slabsDrawerAux(element.type), element.x*30, element.y*30)
*/

function slabsDrawer(Mundo){
  forEach(Mundo.level.slabs, element => {
    image(slabsDrawerAux(element.type), element.x*30, element.y*30);
   });
}


/*
Contrato: list -> JSON
Propósito: Esta función retorna el último elemento de la lista asignada como parámetro. En este caso es utilizada para retornar el JSON respectivo a la última unidad del cuerpo de la serpiente, cuando este último es asignado como parámetro de la función.
Prototipo: snakeTail(body)
Ejemplo: nakeTail([{x:10, y:3}, {x:11, y:3}, {x:12, y:3}]) -> {x:12, y:3}
*/

function snakeTail(body){
  if (isEmpty(rest(body)) == true){
  return (first(body));
  } else {
    return (snakeTail(rest(body)));
  }
}


/*
Contrato: number -> Ilustracion(es)
Propósito: Esta función se encarga de dibujar el cuerpo de la serpiente sin contar la cabeza y la cola
Prototipo: snakeBodyDrawer(position)
Ejemplo: snakeBodyDrawer(4) -> (image)
*/

function snakeBodyDrawer(position){
  if (((elementInPosition(Mundo.snakeBody, position)).x == (elementInPosition(Mundo.snakeBody, position - 1)).x && (elementInPosition(Mundo.snakeBody, position)).y - 1 == (elementInPosition(Mundo.snakeBody, position - 1)).y) && ((elementInPosition(Mundo.snakeBody, position)).x == (elementInPosition(Mundo.snakeBody, position + 1)).x && (elementInPosition(Mundo.snakeBody, position)).y + 1 == (elementInPosition(Mundo.snakeBody, position + 1)).y)){
    image(snakeMediumUp, (elementInPosition(Mundo.snakeBody, position)).x*30, (elementInPosition(Mundo.snakeBody, position)).y*30);
  } else if (((elementInPosition(Mundo.snakeBody, position)).x == (elementInPosition(Mundo.snakeBody, position - 1)).x && (elementInPosition(Mundo.snakeBody, position)).y + 1 == (elementInPosition(Mundo.snakeBody, position - 1)).y) && ((elementInPosition(Mundo.snakeBody, position)).x == (elementInPosition(Mundo.snakeBody, position + 1)).x && (elementInPosition(Mundo.snakeBody, position)).y - 1 == (elementInPosition(Mundo.snakeBody, position + 1)).y)){
    image(snakeMediumDown, (elementInPosition(Mundo.snakeBody, position)).x*30, (elementInPosition(Mundo.snakeBody, position)).y*30);
  } else if (((elementInPosition(Mundo.snakeBody, position)).x - 1 == (elementInPosition(Mundo.snakeBody, position - 1)).x && (elementInPosition(Mundo.snakeBody, position)).y == (elementInPosition(Mundo.snakeBody, position - 1)).y) && ((elementInPosition(Mundo.snakeBody, position)).x + 1 == (elementInPosition(Mundo.snakeBody, position + 1)).x && (elementInPosition(Mundo.snakeBody, position)).y == (elementInPosition(Mundo.snakeBody, position + 1)).y)){
  image(snakeMediumLeft, (elementInPosition(Mundo.snakeBody, position)).x*30, (elementInPosition(Mundo.snakeBody, position)).y*30);
  } else if ((((elementInPosition(Mundo.snakeBody, position)).x + 1 == (elementInPosition(Mundo.snakeBody, position - 1)).x && (elementInPosition(Mundo.snakeBody, position)).y == (elementInPosition(Mundo.snakeBody, position - 1)).y) && ((elementInPosition(Mundo.snakeBody, position)).x - 1 == (elementInPosition(Mundo.snakeBody, position + 1)).x && (elementInPosition(Mundo.snakeBody, position)).y == (elementInPosition(Mundo.snakeBody, position + 1)).y))){
    image(snakeMediumRight, (elementInPosition(Mundo.snakeBody, position)).x*30, (elementInPosition(Mundo.snakeBody, position)).y*30);
  }
  else if ((((elementInPosition(Mundo.snakeBody, position)).x == (elementInPosition(Mundo.snakeBody, position - 1)).x && (elementInPosition(Mundo.snakeBody, position)).y + 1 == (elementInPosition(Mundo.snakeBody, position - 1)).y) && ((elementInPosition(Mundo.snakeBody, position)).x + 1 == (elementInPosition(Mundo.snakeBody, position + 1)).x && (elementInPosition(Mundo.snakeBody, position)).y == (elementInPosition(Mundo.snakeBody, position + 1)).y)) || (((elementInPosition(Mundo.snakeBody, position)).x + 1 == (elementInPosition(Mundo.snakeBody, position - 1)).x && (elementInPosition(Mundo.snakeBody, position)).y == (elementInPosition(Mundo.snakeBody, position - 1)).y) && ((elementInPosition(Mundo.snakeBody, position)).x == (elementInPosition(Mundo.snakeBody, position + 1)).x && (elementInPosition(Mundo.snakeBody, position)).y + 1 == (elementInPosition(Mundo.snakeBody, position + 1)).y))){
    image(turnHead_LeftToDown ,(elementInPosition(Mundo.snakeBody, position)).x*30, (elementInPosition(Mundo.snakeBody, position)).y*30);
  } else if ((((elementInPosition(Mundo.snakeBody, position)).x == (elementInPosition(Mundo.snakeBody, position - 1)).x && (elementInPosition(Mundo.snakeBody, position)).y - 1 == (elementInPosition(Mundo.snakeBody, position - 1)).y) && ((elementInPosition(Mundo.snakeBody, position)).x + 1 == (elementInPosition(Mundo.snakeBody, position + 1)).x && (elementInPosition(Mundo.snakeBody, position)).y == (elementInPosition(Mundo.snakeBody, position + 1)).y)) || (((elementInPosition(Mundo.snakeBody, position)).x + 1 == (elementInPosition(Mundo.snakeBody, position - 1)).x && (elementInPosition(Mundo.snakeBody, position)).y == (elementInPosition(Mundo.snakeBody, position - 1)).y) && ((elementInPosition(Mundo.snakeBody, position)).x == (elementInPosition(Mundo.snakeBody, position + 1)).x && (elementInPosition(Mundo.snakeBody, position)).y - 1 == (elementInPosition(Mundo.snakeBody, position + 1)).y))){
    image(turnHead_LeftToUp, (elementInPosition(Mundo.snakeBody, position)).x*30, (elementInPosition(Mundo.snakeBody, position)).y*30);
  } else if ((((elementInPosition(Mundo.snakeBody, position)).x == (elementInPosition(Mundo.snakeBody, position - 1)).x && (elementInPosition(Mundo.snakeBody, position)).y + 1 == (elementInPosition(Mundo.snakeBody, position - 1)).y) && ((elementInPosition(Mundo.snakeBody, position)).x - 1 == (elementInPosition(Mundo.snakeBody, position + 1)).x && (elementInPosition(Mundo.snakeBody, position)).y == (elementInPosition(Mundo.snakeBody, position + 1)).y)) || (((elementInPosition(Mundo.snakeBody, position)).x - 1 == (elementInPosition(Mundo.snakeBody, position - 1)).x && (elementInPosition(Mundo.snakeBody, position)).y == (elementInPosition(Mundo.snakeBody, position - 1)).y) && ((elementInPosition(Mundo.snakeBody, position)).x == (elementInPosition(Mundo.snakeBody, position + 1)).x && (elementInPosition(Mundo.snakeBody, position)).y + 1 == (elementInPosition(Mundo.snakeBody, position + 1)).y))){
    image(turnHead_RightToDown, (elementInPosition(Mundo.snakeBody, position)).x*30, (elementInPosition(Mundo.snakeBody, position)).y*30);
  } else {
    image(turnHead_RightToUp, (elementInPosition(Mundo.snakeBody, position)).x*30, (elementInPosition(Mundo.snakeBody, position)).y*30);
  }
}

/*
Contrato: number -> Ilustracion(es)
Propósito: Esta función se encarga de dibujar la cola de la serpiente
Prototipo: snakeTailDrawer(position)
Ejemplo: snakeTailDrawer(2) -> (image)
*/

function snakeTailDrawer(position){
  if (((elementInPosition(Mundo.snakeBody, position)).x  == (elementInPosition(Mundo.snakeBody, position - 1)).x) && ((elementInPosition(Mundo.snakeBody, position)).y - 1  == (elementInPosition(Mundo.snakeBody, position - 1)).y)){
    image(snakeTailUp, (elementInPosition(Mundo.snakeBody, position)).x*30, (elementInPosition(Mundo.snakeBody, position)).y*30);
  } else if (((elementInPosition(Mundo.snakeBody, position)).x  == (elementInPosition(Mundo.snakeBody, position - 1)).x) && ((elementInPosition(Mundo.snakeBody, position)).y + 1  == (elementInPosition(Mundo.snakeBody, position - 1)).y)){
    image(snakeTailDown, (elementInPosition(Mundo.snakeBody, position)).x*30, (elementInPosition(Mundo.snakeBody, position)).y*30);
  } else if (((elementInPosition(Mundo.snakeBody, position)).x + 1  == (elementInPosition(Mundo.snakeBody, position - 1)).x) && ((elementInPosition(Mundo.snakeBody, position)).y  == (elementInPosition(Mundo.snakeBody, position - 1)).y)){
    image(snakeTailRight, (elementInPosition(Mundo.snakeBody, position)).x*30, (elementInPosition(Mundo.snakeBody, position)).y*30);
  } else {
    image(snakeTailLeft, (elementInPosition(Mundo.snakeBody, position)).x*30, (elementInPosition(Mundo.snakeBody, position)).y*30);
  }
}


/*
Definición: element -> {x:number, y:number}
Contrato: Mundo, element -> Ilustracion(es)
Propósito: Esta función se encarga de dibujar el cuerpo de la serpiente
Prototipo: snakeDrawer(Mundo, element)
Ejemplo: snakeDrawer(Mundo, {x:13, y:14}) -> (image)
*/

function snakeDrawer(Mundo, element){
  if ((first(Mundo.snakeBody)).x == element.x && (first(Mundo.snakeBody)).y == element.y){
    if (element.x == (first(rest(Mundo.snakeBody))).x && element.y + 1 == (first(rest(Mundo.snakeBody))).y){
      if (Mundo.mode.option == 0.01 || Mundo.mode.option == 0.02){
        image(snakeHeadUp, element.x*30, element.y*30);
      } else {
        image(snakeHeadUp, element.x*30, element.y*30);
      }
    } else if (element.x == (first(rest(Mundo.snakeBody))).x && element.y - 1 == (first(rest(Mundo.snakeBody))).y){
      if (Mundo.mode.option == 0.01 || Mundo.mode.option == 0.02){
        image(snakeHeadDown, element.x*30, element.y*30);
      } else {
        image(snakeHeadDown, element.x*30, element.y*30);
      }
    } else if (element.x - 1 == (first(rest(Mundo.snakeBody))).x && element.y == (first(rest(Mundo.snakeBody))).y){
      if (Mundo.mode.option == 0.01 || Mundo.mode.option == 0.02){
        image(snakeHeadRight, element.x*30, element.y*30);
      } else {
        image(snakeHeadRight, element.x*30, element.y*30);
      }
    } else if (element.x + 1 == (first(rest(Mundo.snakeBody))).x && element.y == (first(rest(Mundo.snakeBody))).y){
      if (Mundo.mode.option == 0.01 || Mundo.mode.option == 0.02){
        image(snakeHeadLeft, element.x*30, element.y*30);
      } else {
        image(snakeHeadLeft, element.x*30, element.y*30);
      }
    }
  } else if (element.x == (snakeTail(Mundo.snakeBody)).x && element.y == (snakeTail(Mundo.snakeBody)).y){
    snakeTailDrawer(coorElementPosition(element.x, element.y, Mundo.snakeBody));
  } else {
    snakeBodyDrawer(coorElementPosition(element.x, element.y, Mundo.snakeBody));
  }
}


/*
Contrato: Mundo -> Ilustracion(es)
Propósito: Esta función crea una serie de ilustraciones (texto, imágenes, formas y demás) plenamente relevantes para el modo de juego, ya sean las baldosas, los objetos sólidos, indicadores y la propia serpiente, ya sea haciéndolos por si mismos o llamando a las funciones creadas anteriormente.
Prototipo: drawGameMode(Mundo){...}
Ejemplo: drawGameMode(Mundo) -> background(49, 124, 51) ...
*/
function drawGameMode(Mundo){
  background(suelo); 
   slabsDrawer(Mundo);
   image(sprHud1, 0, 0);
   image(banner1, wc - 20, 0, 20, 570);
   foodDrawer(Mundo);
   fill(240, 240, 240);
   noStroke();
     forEach(Mundo.snakeBody, element => {
    snakeDrawer(Mundo, element);
  });
   fill(0);
   textSize(14);
   textStyle(BOLD);
   text(Mundo.currentLevel, 62, 73);
   text(Mundo.lives, 71, 182);
   if((lengthOfList(Mundo.snakeBody)) < 9){
   text(lengthOfList(Mundo.snakeBody), 71, 292);
   } else {
     text(lengthOfList(Mundo.snakeBody), 67, 292);     
   }
   if((Mundo.score.toShowScore) < 9){
   text(Mundo.score.toShowScore, 71, 402);
   } else if((Mundo.score.toShowScore) > 9 && (Mundo.score.toShowScore) < 99){
     text(Mundo.score.toShowScore, 67, 402);
   } else {
     text(Mundo.score.toShowScore, 61, 402);
   }
   solidObjectsDrawer(Mundo);
   signNumbersDrawer(Mundo);
   gameShow(Mundo.mode.option);
}

/*
Contrato: Mundo -> Ilustración (Pantalla de carga)
Propósito: Esta función dibuja una pantalla de carga en el canvas en la cual un texto muestra un porcentaje avanzando hacia 100, haciendo parecer que en realidad estuviese cargando el contenido, pero aún así necesario para que las imagenes y demás contenido visual sea cargado correctamente.
Prototipo: drawLoadingScreenMode(Mundo){...}
Ejemplo: drawLoadingScreenMode(Mundo) ->  background(240, 240, 240)...
*/

function drawLoadingScreenMode(Mundo){
  background(240, 240, 240);  
  fill(0, 0, 0);
  textSize(14);
  textStyle(BOLD);
  text("Cargando...", wc/2 - 56, 220);
  fill(15, 200, 50);
  textSize(14);
  textStyle(BOLD);
  text(Math.trunc(Mundo.mode.option) + "%", wc/2 - 30, 250);
}

/*
Contrato: Mundo -> Ilustración (Menú)
Propósito: Esta función dibuja una pantalla que va justo antes de la de carga del juego, siendo esta el menú (o al menos, donde se ilustra todo lo relacionado a este), donde de acuerdo a la opción que escoja el usuario (o el propio hecho de que no escoja nada) es lo que permitirá el cambio del Mundo.mode.option y así saber que modo de juego dibujar siguiente a la elección del mismo.
Prototipo: drawMenuMode(Mundo){...}
Ejemplo: drawMenuMode(Mundo) ->  background(240, 240, 240)...
*/

function drawMenuMode(Mundo){   
  background(menu_fondo);  
  if (Mundo.mode.option == 1){
    fill(15, 200, 50);
    image(botonJugarSel, wc/2 - 60, 330);
    image(botonInstrucciones, wc/2 - 115, 400);
    image(botonCreditos, wc/2 - 68, 470);
  } else if (Mundo.mode.option == 1.1){
    image(botonJugar, wc/2 - 60, 330);
    image(botonInstruccionesSel, wc/2 - 115, 400);
    image(botonCreditos, wc/2 - 68, 470);
  } else {
    image(botonJugar, wc/2 - 60, 330);
    image(botonInstrucciones, wc/2 - 115, 400);
    image(botonCreditosSel, wc/2 - 68, 470);
      }   
}

/*
Contrato: Mundo -> Ilustración (créditos)
Propósito: Esta función dibuja una pantalla que muestra los créditos correspondientes al juego (quiénes trabajaron en él, asignatura y carrera)
Prototipo: drawCredits(Mundo){...}
Ejemplo: drawCredits(Mundo) ->  background(240, 240, 240)...
*/

function drawCredits(Mundo){    
    background(creditos);
    image(volver2, 10, 10);    
}

/*
Contrato: List -> Number
Propósito: Esta función retorna el número de elementos que hay en una lista. En caso de estar vacía, es 0.
Prototipo: lengthOfList(list){...}
Ejemplo: lengthOfList([2,3,4,5]) ->  4
*/

function lengthOfList(list){
  if (isEmpty(list) == true){
    return (0);
  } else {
    return (1 + lengthOfList(rest(list)));
  }
}

/*
Contrato: List, number -> Dato (Number OR Boolean OR String OR list OR Json etc)
Propósito: Esta función retorna el elemento que se encuentra en la posición X (dicho X asignado como parámetro de la función) de una lista.
Prototipo: elementInPosition(list, number){...}
Ejemplo: elementInPosition([2,3,4,5], 4) ->  5
*/

function elementInPosition(list, number){
  if (isEmpty(list) == true){
    return ([]);
  } else if (number == 1){
    return (first(list));
  } else {
    return (elementInPosition(rest(list), number - 1));
  }
}

/*
Contrato: List, number -> List
Propósito: Esta función retorna la lista asignada como parámetro pero, sin el elemento en la posición X (dicho X asignado como parámetro de la función) de la misma.
Prototipo: removeElementInPosition(list, number){...}
Ejemplo: removeElementInPosition([2,3,4,5], 4) ->  [2, 3, 4]
*/

function removeElementInPosition(list, number){
  if (isEmpty(list) == true){
    return ([]);
  } else if (number == 1){
    return (removeElementInPosition(rest(list), number - 1));
  } else {
    return (cons(first(list), removeElementInPosition(rest(list), number - 1)));
  }
}

/*
Contrato: List, number -> List 
Propósito: Esta función recibe una lista y un número aleatorio de la misma (ambos procesados desde la función general), toma el elemento en el x = número y lo pone en una nueva lista, así mismo como llama su funcion general con la lista, no sin antes eliminar el x = numero de la misma. Con cada llamado desde su función general va construyendo una lista nueva.
Prototipo: ramdomOrderAux(list, number)
Ejemplo: ramdomOrderAux([2,3,4,5], 4) -> cons(5, randomOrder([2,3,4]));
*/

function randomOrderAux(list, number){
  return (cons(elementInPosition(list, number), randomOrder(removeElementInPosition(list, number))));
}

/*
  Contrato: list -> list
  Propósito: Función que genera una lista a partir de la asignada como parámetro, donde sus elementos están en un orden aleatorio. Esto lo logra por medio del llamado a su función auxiliar que a su vez se conecta con otras dos funciones en determinados instantes.
  Prototipo: ramdomOrder(list){...}
  Ejemplo: ramdomOrder([2,3,4]) -> [3,4,2] (esto despues de haber llamado a su funcion auxiliar unas determinadas veces, claro)
*/

function randomOrder(list){
  if (isEmpty(list) == true){
    return ([]);
  } else {
    return (randomOrderAux(list, NAleatorio(1, lengthOfList(list) + 1)));
  }
}

/*
Contrato: Mundo, 6 coordenadas, list -> List
Propósito: Función que retorna una lista con todos los posibles espacios libres que se encuentran dentro de un área, usando su función auxiliar para primero comprobar si hay un espacio libre entre estas. Donde coorx1 y coory1, son las coordenas del espacio inicial (la esquina superior izquierda), y coorx2 y coory2 son las coordenadas del espacio final (la esquina inferior derecha). Los parámetros coorx3 y coory3 toman los valores de coorx1 y coory1 respectivamente.
Prototipo: placeFreeList(Mundo, coorx1, coory1, coorx2, coory2, coorx3, coory3, listSnake){...}
Ejemplo: placeFreeList(Mundo, 0, 0, 100, 100, 0, 0, listSnake) ->  cons({x:coorx3, y:coory3}, placeFreeList(Mundo, coorx1, coory1, coorx2, coory2, coorx3 + 1, coory3, listSnake)) (No sin antes hacer una serie de comprobaciones y llamados)
*/

function placeFreeList(Mundo, coorx1, coory1, coorx2, coory2, coorx3, coory3, listSnake){
  if ((coorx2 == coorx3) && (coory2 == coory3)){
    if (placeFree(coorx3, coory3, coorx3, coory3, listSnake) == true){
      return (cons({x: coorx3, y:coory3}, []));
    } else {
      return ([]);
    }
  } else if (coorx2 == coorx3){
    if (placeFree(coorx3, coory3, coorx3, coory3, listSnake) == true){
      return (cons({x:coorx3, y:coory3}, placeFreeList(Mundo, coorx1, coory1, coorx2, coory2, coorx1, coory3 + 1, listSnake)));
    } else {
      return (placeFreeList(Mundo, coorx1, coory1, coorx2, coory2, coorx1, coory3 + 1, listSnake));
    }
  } else {
    if (placeFree(coorx3, coory3, coorx3, coory3, listSnake) == true){
      return (cons({x:coorx3, y:coory3}, placeFreeList(Mundo, coorx1, coory1, coorx2, coory2, coorx3 + 1, coory3, listSnake)))
    } else {
      return (placeFreeList(Mundo, coorx1, coory1, coorx2, coory2, coorx3 + 1, coory3, listSnake));
    }
  }
}

/*
Contrato: Mundo -> List
Propósito: Esta función crea una lista con las coordenadas alrededor de la serpiente. Puede usarse para evitar que aparezcan obstáculos que los jugadores no alcancen a esquivar.
Prototipo: safetyZoneSnake(Mundo){...}
Ejemplo: safetyZoneSnake(Mundo) ->  (Suponiendo que snake esté en x: 10 y: 10) -> [{ x: 10, y: 9 }, { x: 10, y: 8 }, { x: 11, y: 10 }, { x: 12, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }, { x: 9, y: 10 }, { x: 8, y: 10 }]
*/

function safetyZoneSnake(Mundo){
  return ([{x:(first(Mundo.snakeBody)).x, y:(first(Mundo.snakeBody)).y - 1}, {x:(first(Mundo.snakeBody)).x, y:(first(Mundo.snakeBody)).y - 2}, {x:(first(Mundo.snakeBody)).x + 1, y:(first(Mundo.snakeBody)).y}, {x:(first(Mundo.snakeBody)).x + 2, y:(first(Mundo.snakeBody)).y}, {x:(first(Mundo.snakeBody)).x, y:(first(Mundo.snakeBody)).y + 1}, {x:(first(Mundo.snakeBody)).x, y:(first(Mundo.snakeBody)).y + 2}, {x:(first(Mundo.snakeBody)).x - 1, y:(first(Mundo.snakeBody)).y}, {x:(first(Mundo.snakeBody)).x - 2, y:(first(Mundo.snakeBody)).y}]);
}

/*
Contrato: 6 coordenadas -> Boolean
Propósito: función que determina si hay un espacio libre dentro de un área determinada, con una serie larga de comprobaciones, devolviendo true o false dependiendo del caso. El verdadero uso de esta función se denota en placeFreeList.
Prototipo: placeFreeAux(coorx1, coory1, coorx2, coory2, coorx3, coory3, listSnake){...}
Ejemplo: placeFreeAux(0, 0, 10, 10, 0, 0, listSnake) ->  true (no sin antes hacer una serie de comprobaciones y llamados)
*/ 

function placeFreeAux(coorx1, coory1, coorx2, coory2, coorx3, coory3, listSnake){
  if ((coorx2 == coorx3) && (coory2 == coory3)){
    if (coorListExplorer(coorx3, coory3, Mundo.level.solidObjects) == false && coorListExplorer(coorx3, coory3, Mundo.snakeBody) == false && coorListExplorer(coorx3, coory3, safetyZoneSnake(Mundo)) == false){
      return (true);
    } else {
      return (false);
    }
  } else if (coorx2 == coorx3){
    if (coorListExplorer(coorx3, coory3, Mundo.level.solidObjects) == false && coorListExplorer(coorx3, coory3, Mundo.snakeBody) == false && coorListExplorer(coorx3, coory3, safetyZoneSnake(Mundo)) == false){
      return (true);
    } else {
      return (placeFreeAux(coorx1, coory1, coorx2, coory2, coorx1, coory3 + 1, listSnake));
    }
  } else {
    if (coorListExplorer(coorx3, coory3, Mundo.level.solidObjects) == false && coorListExplorer(coorx3, coory3, Mundo.snakeBody) == false && coorListExplorer(coorx3, coory3, safetyZoneSnake(Mundo)) == false){
      return (true);
    } else {
      return (placeFreeAux(coorx1, coory1, coorx2, coory2, coorx3 + 1, coory3, listSnake));
    }
  }
}

/*
Contrato: 6 coordenadas -> Boolean
Propósito: función que determina si hay un espacio libre dentro de un área determinada, resumiendo todo lo que hace su función auxiliar placeFreeAux.
Prototipo: placeFree(coorx1, coory1, coorx2, coory2, coorx3, coory3, listSnake){...}
Ejemplo: placeFreeA(0, 0, 10, 10, 0, 0, listSnake) ->   placeFreeAux(0, 0, 10, 10, 0, 0, listSnake) -> true or false.
*/ 

function placeFree(coorx1, coory1, coorx2, coory2, listSnake){
  if (placeFreeAux(coorx1, coory1, coorx2, coory2, coorx1, coory1, listSnake) == true){
    return (true);
  } else {
    return (false);
  }
}

/*
Contrato: type, coordeanada, list, list -> list
Propósito: función que genera una lista de coordenadas aleatorias dependiendo de la lista de tipos de comida que recibe.
Prototipo: placeFoodSecondAux(typeOfFood, coor, list1, list2){...}
Ejemplo: placeFoodSecondAux(apple, { x:1 y:1 }, [{ x:1, y:1 }, { x:2, y:2 }], [[{ x:2, y:2 }, { x:3, y:3 }]) -> placeFoodAux([{ x:1, y:1 }, { x:2, y:2 }], [[{ x:2, y:2 }, { x:3, y:3 }])
*/ 

function placeFoodSecondAux(typeOfFood, coor, list1, list2){
  if (coorListExplorer(coor.x, coor.y, list2) == true || coorListExplorer(coor.x, coor.y, Mundo.snakeBody) == true || coorListExplorer(coor.x, coor.y, Mundo.level.solidObjects) == true){
    return (placeFoodAux(list1, list2));
  } else {
    return (cons({x:coor.x, y: coor.y, type: typeOfFood, frame:1}, placeFoodAux(rest(list1), cons({x:coor.x, y: coor.y, type:typeOfFood, frame:1}, list2))));
  }
}


/*
Contrato: list, list -> list (con el llamado a su otra función)
Propósito: función que genera una lista de coordenadas aleatorias dependiendo de la lista de tipos de comida que recibe (es decir, que convierte sus elementos en objetos con coordenadas aleatorias)
Prototipo: placeFooddAux(list1, list2){...}
Ejemplo: placeFoodAux([{ x:1, y:1 }, { x:2, y:2 }], [[{ x:2, y:2 }, { x:3, y:3 }]) -> placeFoodSecondAux({ x:1, y:1 }, { x:2, y:3 })
*/ 

function placeFoodAux(list1, list2){
  if (isEmpty(list1) == true){
    return ([]);
  } else {
    return (placeFoodSecondAux(first(list1), {x: NAleatorio( (levelsdesignAux("1-1", Mundo)).lim.x.lim1, (levelsdesignAux("1-1", Mundo)).lim.x.lim2), y:NAleatorio((levelsdesignAux("1-1", Mundo)).lim.y.lim1, (levelsdesignAux("1-1", Mundo)).lim.y.lim2), Mundo}, list1, list2));
  }
}


/*
Contrato: list -> list (a partir de un doble llamado a otras funciones)
Propósito: función que genera los objetos de comida. Se debe realizar en el momento en que se establece para que pueda cargar correctamente.
Prototipo: placeFood(list){...}
Ejemplo: placeFood([{ x:1, y:1 }]) -> placeFoodAux([{ x:1, y:1 }], [{ x:0, y:0}])
*/ 

function placeFood(list){
  if (Mundo.frameMovementSnake == 2){
    return (placeFoodAux(list, [{x:0, y:0}]));
  } else {
    return (first(Mundo.level.food));
  }
}

/*
Contrato: list, list -> list
Propósito: función que concatena dos listas.
Prototipo: joinLists(list1, list2){...}
Ejemplo: joinLists([2,3], [3,4]) -> [2,3,3,4]
*/ 

function joinLists(list1, list2){
  if (isEmpty(list2) == true){
    return (list1);
  } else {
    return (joinLists(append(list1, first(list2)), rest(list2)));
  }
}

/*
Contrato: String -> JSON
Propósito: En esta función establecemos datos relacionados con cada nivel que no son colocados en el objeto level(Mundo.level)
Prototipo: levelsdesignAux(levelcode){...}
Ejemplo: levelsdesignAux("1-1") -> {snakeBody: [{x:10, y:6}, {x:9, y:6}, {x:8, y:6}], lim:{x:{lim1: 6, lim2: 38}, y:{lim1:1, lim2:18}}}
*/ 

function levelsdesignAux(levelCode, Mundo){
  if (levelCode == "1-1"){
      return ({snakeBody: [{x:10, y:6}, {x:9, y:6}, {x:8, y:6}], lim:{x:{lim1: 7, lim2: 37}, y:{lim1:2, lim2:17}}, snakeSpeed:"slow"});
    } else if (levelCode == "1-2"){
     return ({snakeBody: [{x:11, y:3}, {x:10, y:3}, {x:9, y:3}], lim:{x:{lim1: 7, lim2: 37}, y:{lim1:2, lim2:17}}, snakeSpeed:"slow"});
    } else if (levelCode == "1-3"){
      return ({snakeBody: [{x:11, y:3}, {x:10, y:3}, {x:9, y:3}], lim:{x:{lim1: 7, lim2: 37}, y:{lim1:2, lim2:17}}, snakeSpeed:"slow"});
    } else if (levelCode == "1-4"){
      return ({snakeBody: [{x:11, y:3}, {x:10, y:3}, {x:9, y:3}], lim:{x:{lim1: 7, lim2: 37}, y:{lim1:2, lim2:17}}, snakeSpeed:"slow"});
    } else {
      return ({snakeBody: [{x:11, y:3}, {x:10, y:3}, {x:9, y:3}], lim:{x:{lim1: 7, lim2: 37}, y:{lim1:2, lim2:17}},snakeSpeed: "slow"})
    }
  }

/*
Contrato: String -> JSON
Propósito: En esta función establecemos datos relacionados con cada nivel.
Prototipo: levelsdesign(levelcode){...}
Ejemplo: levelsdesign("1-1") -> JSON
*/ 

function levelsdesign(levelCode){
if (levelCode == "1-1"){
  return ({solidObjects: [
  { x: 5, y: 0, type: 'lowerLeftCornerFence1', frame: 1 },
  { x: 6, y: 0, type: 'horFence1', frame: 1 },
  { x: 7, y: 0, type: 'horFence1', frame: 1 },
  { x: 8, y: 0, type: 'horFence1', frame: 1 },
  { x: 9, y: 0, type: 'horFence1', frame: 1 },
  { x: 10, y: 0, type: 'horFence1', frame: 1 },
  { x: 11, y: 0, type: 'horFence1', frame: 1 },
  { x: 12, y: 0, type: 'horFence1', frame: 1 },
  { x: 13, y: 0, type: 'horFence1', frame: 1 },
  { x: 14, y: 0, type: 'horFence1', frame: 1 },
  { x: 15, y: 0, type: 'horFence1', frame: 1 },
  { x: 16, y: 0, type: 'horFence1', frame: 1 },
  { x: 17, y: 0, type: 'horFence1', frame: 1 },
  { x: 18, y: 0, type: 'horFence1', frame: 1 },
  { x: 19, y: 0, type: 'horFence1', frame: 1 },
  { x: 20, y: 0, type: 'horFence1', frame: 1 },
  { x: 21, y: 0, type: 'horFence1', frame: 1 },
  { x: 22, y: 0, type: 'horFence1', frame: 1 },
  { x: 23, y: 0, type: 'horFence1', frame: 1 },
  { x: 24, y: 0, type: 'horFence1', frame: 1 },
  { x: 25, y: 0, type: 'horFence1', frame: 1 },
  { x: 26, y: 0, type: 'horFence1', frame: 1 },
  { x: 27, y: 0, type: 'horFence1', frame: 1 },
  { x: 28, y: 0, type: 'horFence1', frame: 1 },
  { x: 29, y: 0, type: 'horFence1', frame: 1 },
  { x: 30, y: 0, type: 'horFence1', frame: 1 },
  { x: 31, y: 0, type: 'horFence1', frame: 1 },
  { x: 32, y: 0, type: 'horFence1', frame: 1 },
  { x: 33, y: 0, type: 'horFence1', frame: 1 },
  { x: 34, y: 0, type: 'horFence1', frame: 1 },
  { x: 35, y: 0, type: 'horFence1', frame: 1 },
  { x: 36, y: 0, type: 'horFence1', frame: 1 },
  { x: 37, y: 0, type: 'horFence1', frame: 1 },
  { x: 38, y: 0, type: 'horFence1', frame: 1 }, 
  { x: 39, y: 0, type: 'lowerLeftCornerFence1', frame: 1 }, 
  { x: 39, y: 1, type: 'vertFence1', frame: 1 },
  { x: 39, y: 2, type: 'vertFence1', frame: 1 },
  { x: 39, y: 3, type: 'vertFence1', frame: 1 },
  { x: 39, y: 4, type: 'vertFence1', frame: 1 },
  { x: 39, y: 5, type: 'vertFence1', frame: 1 },
  { x: 39, y: 6, type: 'vertFence1', frame: 1 },
  { x: 39, y: 7, type: 'vertFence1', frame: 1 },
  { x: 39, y: 8, type: 'vertFence1', frame: 1 },
  { x: 39, y: 9, type: 'vertFence1', frame: 1 },
  { x: 39, y: 10, type: 'vertFence1', frame: 1 },
  { x: 39, y: 11, type: 'vertFence1', frame: 1 },
  { x: 39, y: 12, type: 'vertFence1', frame: 1 },
  { x: 39, y: 13, type: 'vertFence1', frame: 1 },
  { x: 39, y: 14, type: 'vertFence1', frame: 1 },
  { x: 39, y: 15, type: 'vertFence1', frame: 1 },
  { x: 39, y: 16, type: 'vertFence1', frame: 1 },
  { x: 39, y: 17, type: 'vertFence1', frame: 1 },
  { x: 39., y: 18, type: 'lowerLeftCornerFence1', frame: 1 }, 
  { x: 6, y: 18, type: 'horFence1', frame: 1 },
  { x: 7, y: 18, type: 'horFence1', frame: 1 },
  { x: 8, y: 18, type: 'horFence1', frame: 1 },
  { x: 9, y: 18, type: 'horFence1', frame: 1 },
  { x: 10, y: 18, type: 'horFence1', frame: 1 },
  { x: 11, y: 18, type: 'horFence1', frame: 1 },
  { x: 12, y: 18, type: 'horFence1', frame: 1 },
  { x: 13, y: 18, type: 'horFence1', frame: 1 },
  { x: 14, y: 18, type: 'horFence1', frame: 1 },
  { x: 15, y: 18, type: 'horFence1', frame: 1 },
  { x: 16, y: 18, type: 'horFence1', frame: 1 },
  { x: 17, y: 18, type: 'horFence1', frame: 1 },
  { x: 18, y: 18, type: 'horFence1', frame: 1 },
  { x: 19, y: 18, type: 'horFence1', frame: 1 },
  { x: 20, y: 18, type: 'horFence1', frame: 1 },
  { x: 21, y: 18, type: 'horFence1', frame: 1 },
  { x: 22, y: 18, type: 'horFence1', frame: 1 },
  { x: 23, y: 18, type: 'horFence1', frame: 1 },
  { x: 24, y: 18, type: 'horFence1', frame: 1 },
  { x: 25, y: 18, type: 'horFence1', frame: 1 },
  { x: 26, y: 18, type: 'horFence1', frame: 1 },
  { x: 27, y: 18, type: 'horFence1', frame: 1 },
  { x: 28, y: 18, type: 'horFence1', frame: 1 },
  { x: 29, y: 18, type: 'horFence1', frame: 1 },
  { x: 30, y: 18, type: 'horFence1', frame: 1 },
  { x: 31, y: 18, type: 'horFence1', frame: 1 },
  { x: 32, y: 18, type: 'horFence1', frame: 1 },
  { x: 33, y: 18, type: 'horFence1', frame: 1 },
  { x: 34, y: 18, type: 'horFence1', frame: 1 },
  { x: 35, y: 18, type: 'horFence1', frame: 1 },
  { x: 36, y: 18, type: 'horFence1', frame: 1 },
  { x: 37, y: 18, type: 'horFence1', frame: 1 },
  { x: 38, y: 18, type: 'horFence1', frame: 1 }, 
  { x: 5, y: 18, type: 'lowerLeftCornerFence1', frame: 1 }, 
  { x: 5, y: 1, type: 'vertFence1', frame: 1 },
  { x: 5, y: 2, type: 'vertFence1', frame: 1 },
  { x: 5, y: 3, type: 'vertFence1', frame: 1 },
  { x: 5, y: 4, type: 'vertFence1', frame: 1 },
  { x: 5, y: 5, type: 'vertFence1', frame: 1 },
  { x: 5, y: 6, type: 'vertFence1', frame: 1 },
  { x: 5, y: 7, type: 'vertFence1', frame: 1 },
  { x: 5, y: 8, type: 'vertFence1', frame: 1 },
  { x: 5, y: 9, type: 'vertFence1', frame: 1 },
  { x: 5, y: 10, type: 'vertFence1', frame: 1 },
  { x: 5, y: 11, type: 'vertFence1', frame: 1 },
  { x: 5, y: 12, type: 'vertFence1', frame: 1 },
  { x: 5, y: 13, type: 'vertFence1', frame: 1 },
  { x: 5, y: 14, type: 'vertFence1', frame: 1 },
  { x: 5, y: 15, type: 'vertFence1', frame: 1 },
  { x: 5, y: 16, type: 'vertFence1', frame: 1 },
  { x: 5, y: 17, type: 'vertFence1', frame: 1 }], 
  food: randomOrder([["apple", "apple"], ["apple"], ["apple", "cherry", "apple"]]), slabs: []});
  } else if (levelCode == "1-2"){
    return ({solidObjects: [
  { x: 5, y: 0, type: 'lowerLeftCornerFence1', frame: 1 },
  { x: 6, y: 0, type: 'horFence1', frame: 1 },
  { x: 7, y: 0, type: 'horFence1', frame: 1 },
  { x: 8, y: 0, type: 'horFence1', frame: 1 },
  { x: 9, y: 0, type: 'horFence1', frame: 1 },
  { x: 10, y: 0, type: 'horFence1', frame: 1 },
  { x: 11, y: 0, type: 'horFence1', frame: 1 },
  { x: 12, y: 0, type: 'horFence1', frame: 1 },
  { x: 13, y: 0, type: 'horFence1', frame: 1 },
  { x: 14, y: 0, type: 'horFence1', frame: 1 },
  { x: 15, y: 0, type: 'horFence1', frame: 1 },
  { x: 16, y: 0, type: 'horFence1', frame: 1 },
  { x: 17, y: 0, type: 'horFence1', frame: 1 },
  { x: 18, y: 0, type: 'horFence1', frame: 1 },
  { x: 19, y: 0, type: 'horFence1', frame: 1 },
  { x: 20, y: 0, type: 'horFence1', frame: 1 },
  { x: 21, y: 0, type: 'horFence1', frame: 1 },
  { x: 22, y: 0, type: 'horFence1', frame: 1 },
  { x: 23, y: 0, type: 'horFence1', frame: 1 },
  { x: 24, y: 0, type: 'horFence1', frame: 1 },
  { x: 25, y: 0, type: 'horFence1', frame: 1 },
  { x: 26, y: 0, type: 'horFence1', frame: 1 },
  { x: 27, y: 0, type: 'horFence1', frame: 1 },
  { x: 28, y: 0, type: 'horFence1', frame: 1 },
  { x: 29, y: 0, type: 'horFence1', frame: 1 },
  { x: 30, y: 0, type: 'horFence1', frame: 1 },
  { x: 31, y: 0, type: 'horFence1', frame: 1 },
  { x: 32, y: 0, type: 'horFence1', frame: 1 },
  { x: 33, y: 0, type: 'horFence1', frame: 1 },
  { x: 34, y: 0, type: 'horFence1', frame: 1 },
  { x: 35, y: 0, type: 'horFence1', frame: 1 },
  { x: 36, y: 0, type: 'horFence1', frame: 1 },
  { x: 37, y: 0, type: 'horFence1', frame: 1 },
  { x: 38, y: 0, type: 'horFence1', frame: 1 }, 
  { x: 39, y: 0, type: 'lowerLeftCornerFence1', frame: 1 }, 
  { x: 39, y: 1, type: 'vertFence1', frame: 1 },
  { x: 39, y: 2, type: 'vertFence1', frame: 1 },
  { x: 39, y: 3, type: 'vertFence1', frame: 1 },
  { x: 39, y: 4, type: 'vertFence1', frame: 1 },
  { x: 39, y: 5, type: 'vertFence1', frame: 1 },
  { x: 39, y: 6, type: 'vertFence1', frame: 1 },
  { x: 39, y: 7, type: 'vertFence1', frame: 1 },
  { x: 39, y: 8, type: 'vertFence1', frame: 1 },
  { x: 39, y: 9, type: 'vertFence1', frame: 1 },
  { x: 39, y: 10, type: 'vertFence1', frame: 1 },
  { x: 39, y: 11, type: 'vertFence1', frame: 1 },
  { x: 39, y: 12, type: 'vertFence1', frame: 1 },
  { x: 39, y: 13, type: 'vertFence1', frame: 1 },
  { x: 39, y: 14, type: 'vertFence1', frame: 1 },
  { x: 39, y: 15, type: 'vertFence1', frame: 1 },
  { x: 39, y: 16, type: 'vertFence1', frame: 1 },
  { x: 39, y: 17, type: 'vertFence1', frame: 1 },
  { x: 39., y: 18, type: 'lowerLeftCornerFence1', frame: 1 }, 
  { x: 6, y: 18, type: 'horFence1', frame: 1 },
  { x: 7, y: 18, type: 'horFence1', frame: 1 },
  { x: 8, y: 18, type: 'horFence1', frame: 1 },
  { x: 9, y: 18, type: 'horFence1', frame: 1 },
  { x: 10, y: 18, type: 'horFence1', frame: 1 },
  { x: 11, y: 18, type: 'horFence1', frame: 1 },
  { x: 12, y: 18, type: 'horFence1', frame: 1 },
  { x: 13, y: 18, type: 'horFence1', frame: 1 },
  { x: 14, y: 18, type: 'horFence1', frame: 1 },
  { x: 15, y: 18, type: 'horFence1', frame: 1 },
  { x: 16, y: 18, type: 'horFence1', frame: 1 },
  { x: 17, y: 18, type: 'horFence1', frame: 1 },
  { x: 18, y: 18, type: 'horFence1', frame: 1 },
  { x: 19, y: 18, type: 'horFence1', frame: 1 },
  { x: 20, y: 18, type: 'horFence1', frame: 1 },
  { x: 21, y: 18, type: 'horFence1', frame: 1 },
  { x: 22, y: 18, type: 'horFence1', frame: 1 },
  { x: 23, y: 18, type: 'horFence1', frame: 1 },
  { x: 24, y: 18, type: 'horFence1', frame: 1 },
  { x: 25, y: 18, type: 'horFence1', frame: 1 },
  { x: 26, y: 18, type: 'horFence1', frame: 1 },
  { x: 27, y: 18, type: 'horFence1', frame: 1 },
  { x: 28, y: 18, type: 'horFence1', frame: 1 },
  { x: 29, y: 18, type: 'horFence1', frame: 1 },
  { x: 30, y: 18, type: 'horFence1', frame: 1 },
  { x: 31, y: 18, type: 'horFence1', frame: 1 },
  { x: 32, y: 18, type: 'horFence1', frame: 1 },
  { x: 33, y: 18, type: 'horFence1', frame: 1 },
  { x: 34, y: 18, type: 'horFence1', frame: 1 },
  { x: 35, y: 18, type: 'horFence1', frame: 1 },
  { x: 36, y: 18, type: 'horFence1', frame: 1 },
  { x: 37, y: 18, type: 'horFence1', frame: 1 },
  { x: 38, y: 18, type: 'horFence1', frame: 1 }, 
  { x: 5, y: 18, type: 'lowerLeftCornerFence1', frame: 1 }, 
  { x: 5, y: 1, type: 'vertFence1', frame: 1 },
  { x: 5, y: 2, type: 'vertFence1', frame: 1 },
  { x: 5, y: 3, type: 'vertFence1', frame: 1 },
  { x: 5, y: 4, type: 'vertFence1', frame: 1 },
  { x: 5, y: 5, type: 'vertFence1', frame: 1 },
  { x: 5, y: 6, type: 'vertFence1', frame: 1 },
  { x: 5, y: 7, type: 'vertFence1', frame: 1 },
  { x: 5, y: 8, type: 'vertFence1', frame: 1 },
  { x: 5, y: 9, type: 'vertFence1', frame: 1 },
  { x: 5, y: 10, type: 'vertFence1', frame: 1 },
  { x: 5, y: 11, type: 'vertFence1', frame: 1 },
  { x: 5, y: 12, type: 'vertFence1', frame: 1 },
  { x: 5, y: 13, type: 'vertFence1', frame: 1 },
  { x: 5, y: 14, type: 'vertFence1', frame: 1 },
  { x: 5, y: 15, type: 'vertFence1', frame: 1 },
  { x: 5, y: 16, type: 'vertFence1', frame: 1 },
  { x: 5, y: 17, type: 'vertFence1', frame: 1 },
  { x: 6, y: 8, type: 'brickWall1', frame: 1 },
  { x: 7, y: 8, type: 'brickWall1', frame: 1 },
  { x: 8, y: 8, type: 'brickWall1', frame: 1 },
  { x: 9, y: 8, type: 'brickWall1', frame: 1 },
  { x: 10, y: 8, type: 'brickWall1', frame: 1 },
  { x: 11, y: 8, type: 'brickWall1', frame: 1 },
  { x: 12, y: 8, type: 'brickWall1', frame: 1 },
  { x: 13, y: 8, type: 'brickWall1', frame: 1 },
  { x: 14, y: 8, type: 'brickWall1', frame: 1 },
  { x: 15, y: 8, type: 'brickWall1', frame: 1 },
  { x: 29, y: 8, type: 'brickWall1', frame: 1 },
  { x: 30, y: 8, type: 'brickWall1', frame: 1 },
  { x: 31, y: 8, type: 'brickWall1', frame: 1 },
  { x: 32, y: 8, type: 'brickWall1', frame: 1 },
  { x: 33, y: 8, type: 'brickWall1', frame: 1 },
  { x: 34, y: 8, type: 'brickWall1', frame: 1 },
  { x: 35, y: 8, type: 'brickWall1', frame: 1 },
  { x: 36, y: 8, type: 'brickWall1', frame: 1 },
  { x: 37, y: 8, type: 'brickWall1', frame: 1 },
  { x: 38, y: 8, type: 'brickWall1', frame: 1 }
  ], food: randomOrder([["apple", "apple", "apple", "apple"], ["mango"], ["cherry", "apple"], ["mango", "apple"]]), slabs: []});
  } else if (levelCode == "lab"){
    return ({food: [{ x: 10, y: 10, type: 'rat', frame: 1 }]});
  } else if (levelCode == "1-3"){
    return ({solidObjects: [
  { x: 5, y: 0, type: 'lowerLeftCornerFence1', frame: 1 },
  { x: 6, y: 0, type: 'horFence1', frame: 1 },
  { x: 7, y: 0, type: 'horFence1', frame: 1 },
  { x: 8, y: 0, type: 'horFence1', frame: 1 },
  { x: 9, y: 0, type: 'horFence1', frame: 1 },
  { x: 10, y: 0, type: 'horFence1', frame: 1 },
  { x: 11, y: 0, type: 'horFence1', frame: 1 },
  { x: 12, y: 0, type: 'horFence1', frame: 1 },
  { x: 13, y: 0, type: 'horFence1', frame: 1 },
  { x: 14, y: 0, type: 'horFence1', frame: 1 },
  { x: 15, y: 0, type: 'horFence1', frame: 1 },
  { x: 16, y: 0, type: 'horFence1', frame: 1 },
  { x: 17, y: 0, type: 'horFence1', frame: 1 },
  { x: 18, y: 0, type: 'horFence1', frame: 1 },
  { x: 19, y: 0, type: 'horFence1', frame: 1 },
  { x: 20, y: 0, type: 'horFence1', frame: 1 },
  { x: 21, y: 0, type: 'horFence1', frame: 1 },
  { x: 22, y: 0, type: 'horFence1', frame: 1 },
  { x: 23, y: 0, type: 'horFence1', frame: 1 },
  { x: 24, y: 0, type: 'horFence1', frame: 1 },
  { x: 25, y: 0, type: 'horFence1', frame: 1 },
  { x: 26, y: 0, type: 'horFence1', frame: 1 },
  { x: 27, y: 0, type: 'horFence1', frame: 1 },
  { x: 28, y: 0, type: 'horFence1', frame: 1 },
  { x: 29, y: 0, type: 'horFence1', frame: 1 },
  { x: 30, y: 0, type: 'horFence1', frame: 1 },
  { x: 31, y: 0, type: 'horFence1', frame: 1 },
  { x: 32, y: 0, type: 'horFence1', frame: 1 },
  { x: 33, y: 0, type: 'horFence1', frame: 1 },
  { x: 34, y: 0, type: 'horFence1', frame: 1 },
  { x: 35, y: 0, type: 'horFence1', frame: 1 },
  { x: 36, y: 0, type: 'horFence1', frame: 1 },
  { x: 37, y: 0, type: 'horFence1', frame: 1 },
  { x: 38, y: 0, type: 'horFence1', frame: 1 }, 
  { x: 39, y: 0, type: 'lowerLeftCornerFence1', frame: 1 }, 
  { x: 39, y: 1, type: 'vertFence1', frame: 1 },
  { x: 39, y: 2, type: 'vertFence1', frame: 1 },
  { x: 39, y: 3, type: 'vertFence1', frame: 1 },
  { x: 39, y: 4, type: 'vertFence1', frame: 1 },
  { x: 39, y: 5, type: 'vertFence1', frame: 1 },
  { x: 39, y: 6, type: 'vertFence1', frame: 1 },
  { x: 39, y: 7, type: 'vertFence1', frame: 1 },
  { x: 39, y: 8, type: 'vertFence1', frame: 1 },
  { x: 39, y: 9, type: 'vertFence1', frame: 1 },
  { x: 39, y: 10, type: 'vertFence1', frame: 1 },
  { x: 39, y: 11, type: 'vertFence1', frame: 1 },
  { x: 39, y: 12, type: 'vertFence1', frame: 1 },
  { x: 39, y: 13, type: 'vertFence1', frame: 1 },
  { x: 39, y: 14, type: 'vertFence1', frame: 1 },
  { x: 39, y: 15, type: 'vertFence1', frame: 1 },
  { x: 39, y: 16, type: 'vertFence1', frame: 1 },
  { x: 39, y: 17, type: 'vertFence1', frame: 1 },
  { x: 39., y: 18, type: 'lowerLeftCornerFence1', frame: 1 }, 
  { x: 6, y: 18, type: 'horFence1', frame: 1 },
  { x: 7, y: 18, type: 'horFence1', frame: 1 },
  { x: 8, y: 18, type: 'horFence1', frame: 1 },
  { x: 9, y: 18, type: 'horFence1', frame: 1 },
  { x: 10, y: 18, type: 'horFence1', frame: 1 },
  { x: 11, y: 18, type: 'horFence1', frame: 1 },
  { x: 12, y: 18, type: 'horFence1', frame: 1 },
  { x: 13, y: 18, type: 'horFence1', frame: 1 },
  { x: 14, y: 18, type: 'horFence1', frame: 1 },
  { x: 15, y: 18, type: 'horFence1', frame: 1 },
  { x: 16, y: 18, type: 'horFence1', frame: 1 },
  { x: 17, y: 18, type: 'horFence1', frame: 1 },
  { x: 18, y: 18, type: 'horFence1', frame: 1 },
  { x: 19, y: 18, type: 'horFence1', frame: 1 },
  { x: 20, y: 18, type: 'horFence1', frame: 1 },
  { x: 21, y: 18, type: 'horFence1', frame: 1 },
  { x: 22, y: 18, type: 'horFence1', frame: 1 },
  { x: 23, y: 18, type: 'horFence1', frame: 1 },
  { x: 24, y: 18, type: 'horFence1', frame: 1 },
  { x: 25, y: 18, type: 'horFence1', frame: 1 },
  { x: 26, y: 18, type: 'horFence1', frame: 1 },
  { x: 27, y: 18, type: 'horFence1', frame: 1 },
  { x: 28, y: 18, type: 'horFence1', frame: 1 },
  { x: 29, y: 18, type: 'horFence1', frame: 1 },
  { x: 30, y: 18, type: 'horFence1', frame: 1 },
  { x: 31, y: 18, type: 'horFence1', frame: 1 },
  { x: 32, y: 18, type: 'horFence1', frame: 1 },
  { x: 33, y: 18, type: 'horFence1', frame: 1 },
  { x: 34, y: 18, type: 'horFence1', frame: 1 },
  { x: 35, y: 18, type: 'horFence1', frame: 1 },
  { x: 36, y: 18, type: 'horFence1', frame: 1 },
  { x: 37, y: 18, type: 'horFence1', frame: 1 },
  { x: 38, y: 18, type: 'horFence1', frame: 1 }, 
  { x: 5, y: 18, type: 'lowerLeftCornerFence1', frame: 1 }, 
  { x: 5, y: 1, type: 'vertFence1', frame: 1 },
  { x: 5, y: 2, type: 'vertFence1', frame: 1 },
  { x: 5, y: 3, type: 'vertFence1', frame: 1 },
  { x: 5, y: 4, type: 'vertFence1', frame: 1 },
  { x: 5, y: 5, type: 'vertFence1', frame: 1 },
  { x: 5, y: 6, type: 'vertFence1', frame: 1 },
  { x: 5, y: 7, type: 'vertFence1', frame: 1 },
  { x: 5, y: 8, type: 'vertFence1', frame: 1 },
  { x: 5, y: 9, type: 'vertFence1', frame: 1 },
  { x: 5, y: 10, type: 'vertFence1', frame: 1 },
  { x: 5, y: 11, type: 'vertFence1', frame: 1 },
  { x: 5, y: 12, type: 'vertFence1', frame: 1 },
  { x: 5, y: 13, type: 'vertFence1', frame: 1 },
  { x: 5, y: 14, type: 'vertFence1', frame: 1 },
  { x: 5, y: 15, type: 'vertFence1', frame: 1 },
  { x: 5, y: 16, type: 'vertFence1', frame: 1 },
  { x: 5, y: 17, type: 'vertFence1', frame: 1 },
  { x: 10, y: 8, type: 'brickWall1', frame: 1 },
  { x: 11, y: 8, type: 'brickWall1', frame: 1 },
  { x: 10, y: 9, type: 'brickWall1', frame: 1 },
  { x: 11, y: 9, type: 'brickWall1', frame: 1 },
  { x: 15, y: 8, type: 'brickWall1', frame: 1 },
  { x: 16, y: 8, type: 'brickWall1', frame: 1 },
  { x: 15, y: 9, type: 'brickWall1', frame: 1 },
  { x: 16, y: 9, type: 'brickWall1', frame: 1 },
  { x: 20, y: 8, type: 'brickWall1', frame: 1 },
  { x: 21, y: 8, type: 'brickWall1', frame: 1 },
  { x: 20, y: 9, type: 'brickWall1', frame: 1 },
  { x: 21, y: 9, type: 'brickWall1', frame: 1 },
  { x: 25, y: 8, type: 'brickWall1', frame: 1 },
  { x: 26, y: 8, type: 'brickWall1', frame: 1 },
  { x: 25, y: 9, type: 'brickWall1', frame: 1 },
  { x: 26, y: 9, type: 'brickWall1', frame: 1 },
  { x: 30, y: 8, type: 'brickWall1', frame: 1 },
  { x: 31, y: 8, type: 'brickWall1', frame: 1 },
  { x: 30, y: 9, type: 'brickWall1', frame: 1 },
  { x: 31, y: 9, type: 'brickWall1', frame: 1 },
  { x: 35, y: 8, type: 'brickWall1', frame: 1 },
  { x: 36, y: 8, type: 'brickWall1', frame: 1 },
  { x: 35, y: 9, type: 'brickWall1', frame: 1 },
  { x: 36, y: 9, type: 'brickWall1', frame: 1 } ], food: randomOrder([["naranja", "naranja", "limon", "mango", "naranja", "naranja", "naranja", "naranja", "naranja", "naranja", "naranja", "naranja"], ["limon", "mango", "apple", "apple"], ["sandia"]]), slabs: []})
  }  else if (levelCode == "1-4"){
    return ({solidObjects: [
  { x: 5, y: 0, type: 'lowerLeftCornerFence1', frame: 1 },
  { x: 6, y: 0, type: 'horFence1', frame: 1 },
  { x: 7, y: 0, type: 'horFence1', frame: 1 },
  { x: 8, y: 0, type: 'horFence1', frame: 1 },
  { x: 9, y: 0, type: 'horFence1', frame: 1 },
  { x: 10, y: 0, type: 'horFence1', frame: 1 },
  { x: 11, y: 0, type: 'horFence1', frame: 1 },
  { x: 12, y: 0, type: 'horFence1', frame: 1 },
  { x: 13, y: 0, type: 'horFence1', frame: 1 },
  { x: 14, y: 0, type: 'horFence1', frame: 1 },
  { x: 15, y: 0, type: 'horFence1', frame: 1 },
  { x: 16, y: 0, type: 'horFence1', frame: 1 },
  { x: 17, y: 0, type: 'horFence1', frame: 1 },
  { x: 18, y: 0, type: 'horFence1', frame: 1 },
  { x: 19, y: 0, type: 'horFence1', frame: 1 },
  { x: 20, y: 0, type: 'horFence1', frame: 1 },
  { x: 21, y: 0, type: 'horFence1', frame: 1 },
  { x: 22, y: 0, type: 'horFence1', frame: 1 },
  { x: 23, y: 0, type: 'horFence1', frame: 1 },
  { x: 24, y: 0, type: 'horFence1', frame: 1 },
  { x: 25, y: 0, type: 'horFence1', frame: 1 },
  { x: 26, y: 0, type: 'horFence1', frame: 1 },
  { x: 27, y: 0, type: 'horFence1', frame: 1 },
  { x: 28, y: 0, type: 'horFence1', frame: 1 },
  { x: 29, y: 0, type: 'horFence1', frame: 1 },
  { x: 30, y: 0, type: 'horFence1', frame: 1 },
  { x: 31, y: 0, type: 'horFence1', frame: 1 },
  { x: 32, y: 0, type: 'horFence1', frame: 1 },
  { x: 33, y: 0, type: 'horFence1', frame: 1 },
  { x: 34, y: 0, type: 'horFence1', frame: 1 },
  { x: 35, y: 0, type: 'horFence1', frame: 1 },
  { x: 36, y: 0, type: 'horFence1', frame: 1 },
  { x: 37, y: 0, type: 'horFence1', frame: 1 },
  { x: 38, y: 0, type: 'horFence1', frame: 1 }, 
  { x: 39, y: 0, type: 'lowerLeftCornerFence1', frame: 1 }, 
  { x: 39, y: 1, type: 'vertFence1', frame: 1 },
  { x: 39, y: 2, type: 'vertFence1', frame: 1 },
  { x: 39, y: 3, type: 'vertFence1', frame: 1 },
  { x: 39, y: 4, type: 'vertFence1', frame: 1 },
  { x: 39, y: 5, type: 'vertFence1', frame: 1 },
  { x: 39, y: 6, type: 'vertFence1', frame: 1 },
  { x: 39, y: 7, type: 'vertFence1', frame: 1 },
  { x: 39, y: 8, type: 'vertFence1', frame: 1 },
  { x: 39, y: 9, type: 'vertFence1', frame: 1 },
  { x: 39, y: 10, type: 'vertFence1', frame: 1 },
  { x: 39, y: 11, type: 'vertFence1', frame: 1 },
  { x: 39, y: 12, type: 'vertFence1', frame: 1 },
  { x: 39, y: 13, type: 'vertFence1', frame: 1 },
  { x: 39, y: 14, type: 'vertFence1', frame: 1 },
  { x: 39, y: 15, type: 'vertFence1', frame: 1 },
  { x: 39, y: 16, type: 'vertFence1', frame: 1 },
  { x: 39, y: 17, type: 'vertFence1', frame: 1 },
  { x: 39., y: 18, type: 'lowerLeftCornerFence1', frame: 1 }, 
  { x: 6, y: 18, type: 'horFence1', frame: 1 },
  { x: 7, y: 18, type: 'horFence1', frame: 1 },
  { x: 8, y: 18, type: 'horFence1', frame: 1 },
  { x: 9, y: 18, type: 'horFence1', frame: 1 },
  { x: 10, y: 18, type: 'horFence1', frame: 1 },
  { x: 11, y: 18, type: 'horFence1', frame: 1 },
  { x: 12, y: 18, type: 'horFence1', frame: 1 },
  { x: 13, y: 18, type: 'horFence1', frame: 1 },
  { x: 14, y: 18, type: 'horFence1', frame: 1 },
  { x: 15, y: 18, type: 'horFence1', frame: 1 },
  { x: 16, y: 18, type: 'horFence1', frame: 1 },
  { x: 17, y: 18, type: 'horFence1', frame: 1 },
  { x: 18, y: 18, type: 'horFence1', frame: 1 },
  { x: 19, y: 18, type: 'horFence1', frame: 1 },
  { x: 20, y: 18, type: 'horFence1', frame: 1 },
  { x: 21, y: 18, type: 'horFence1', frame: 1 },
  { x: 22, y: 18, type: 'horFence1', frame: 1 },
  { x: 23, y: 18, type: 'horFence1', frame: 1 },
  { x: 24, y: 18, type: 'horFence1', frame: 1 },
  { x: 25, y: 18, type: 'horFence1', frame: 1 },
  { x: 26, y: 18, type: 'horFence1', frame: 1 },
  { x: 27, y: 18, type: 'horFence1', frame: 1 },
  { x: 28, y: 18, type: 'horFence1', frame: 1 },
  { x: 29, y: 18, type: 'horFence1', frame: 1 },
  { x: 30, y: 18, type: 'horFence1', frame: 1 },
  { x: 31, y: 18, type: 'horFence1', frame: 1 },
  { x: 32, y: 18, type: 'horFence1', frame: 1 },
  { x: 33, y: 18, type: 'horFence1', frame: 1 },
  { x: 34, y: 18, type: 'horFence1', frame: 1 },
  { x: 35, y: 18, type: 'horFence1', frame: 1 },
  { x: 36, y: 18, type: 'horFence1', frame: 1 },
  { x: 37, y: 18, type: 'horFence1', frame: 1 },
  { x: 38, y: 18, type: 'horFence1', frame: 1 }, 
  { x: 5, y: 18, type: 'lowerLeftCornerFence1', frame: 1 }, 
  { x: 5, y: 1, type: 'vertFence1', frame: 1 },
  { x: 5, y: 2, type: 'vertFence1', frame: 1 },
  { x: 5, y: 3, type: 'vertFence1', frame: 1 },
  { x: 5, y: 4, type: 'vertFence1', frame: 1 },
  { x: 5, y: 5, type: 'vertFence1', frame: 1 },
  { x: 5, y: 6, type: 'vertFence1', frame: 1 },
  { x: 5, y: 7, type: 'vertFence1', frame: 1 },
  { x: 5, y: 8, type: 'vertFence1', frame: 1 },
  { x: 5, y: 9, type: 'vertFence1', frame: 1 },
  { x: 5, y: 10, type: 'vertFence1', frame: 1 },
  { x: 5, y: 11, type: 'vertFence1', frame: 1 },
  { x: 5, y: 12, type: 'vertFence1', frame: 1 },
  { x: 5, y: 13, type: 'vertFence1', frame: 1 },
  { x: 5, y: 14, type: 'vertFence1', frame: 1 },
  { x: 5, y: 15, type: 'vertFence1', frame: 1 },
  { x: 5, y: 16, type: 'vertFence1', frame: 1 },
  { x: 5, y: 17, type: 'vertFence1', frame: 1 },
  { x: 13, y: 4, type: 'brickWall1', frame: 1 },
  { x: 14, y: 4, type: 'brickWall1', frame: 1 },
  { x: 15, y: 4, type: 'brickWall1', frame: 1 },
  { x: 16, y: 4, type: 'brickWall1', frame: 1 },
  { x: 13, y: 5, type: 'brickWall1', frame: 1 },
  { x: 14, y: 5, type: 'brickWall1', frame: 1 },
  { x: 15, y: 5, type: 'brickWall1', frame: 1 },
  { x: 16, y: 5, type: 'brickWall1', frame: 1 },
  { x: 13, y: 6, type: 'brickWall1', frame: 1 },
  { x: 14, y: 6, type: 'brickWall1', frame: 1 },
  { x: 15, y: 6, type: 'brickWall1', frame: 1 },
  { x: 16, y: 6, type: 'brickWall1', frame: 1 },
  { x: 13, y: 7, type: 'brickWall1', frame: 1 },
  { x: 14, y: 7, type: 'brickWall1', frame: 1 },
  { x: 15, y: 7, type: 'brickWall1', frame: 1 },
  { x: 16, y: 7, type: 'brickWall1', frame: 1 },
  { x: 13, y: 10, type: 'brickWall1', frame: 1 },
  { x: 14, y: 10, type: 'brickWall1', frame: 1 },
  { x: 15, y: 10, type: 'brickWall1', frame: 1 },
  { x: 16, y: 10, type: 'brickWall1', frame: 1 },
  { x: 13, y: 11, type: 'brickWall1', frame: 1 },
  { x: 14, y: 11, type: 'brickWall1', frame: 1 },
  { x: 15, y: 11, type: 'brickWall1', frame: 1 },
  { x: 16, y: 11, type: 'brickWall1', frame: 1 },
  { x: 13, y: 12, type: 'brickWall1', frame: 1 },
  { x: 14, y: 12, type: 'brickWall1', frame: 1 },
  { x: 15, y: 12, type: 'brickWall1', frame: 1 },
  { x: 16, y: 12, type: 'brickWall1', frame: 1 },
  { x: 13, y: 13, type: 'brickWall1', frame: 1 },
  { x: 14, y: 13, type: 'brickWall1', frame: 1 },
  { x: 15, y: 13, type: 'brickWall1', frame: 1 },
  { x: 16, y: 13, type: 'brickWall1', frame: 1 },
  { x: 28, y: 5, type: 'brickWall1', frame: 1 },
  { x: 29, y: 5, type: 'brickWall1', frame: 1 },
  { x: 30, y: 5, type: 'brickWall1', frame: 1 },
  { x: 31, y: 5, type: 'brickWall1', frame: 1 },
  { x: 28, y: 6, type: 'brickWall1', frame: 1 },
  { x: 29, y: 6, type: 'brickWall1', frame: 1 },
  { x: 30, y: 6, type: 'brickWall1', frame: 1 },
  { x: 31, y: 6, type: 'brickWall1', frame: 1 },
  { x: 28, y: 7, type: 'brickWall1', frame: 1 },
  { x: 29, y: 7, type: 'brickWall1', frame: 1 },
  { x: 30, y: 7, type: 'brickWall1', frame: 1 },
  { x: 31, y: 7, type: 'brickWall1', frame: 1 },
  { x: 28, y: 8, type: 'brickWall1', frame: 1 },
  { x: 29, y: 8, type: 'brickWall1', frame: 1 },
  { x: 30, y: 8, type: 'brickWall1', frame: 1 },
  { x: 31, y: 8, type: 'brickWall1', frame: 1 },
  { x: 28, y: 11, type: 'brickWall1', frame: 1 },
  { x: 29, y: 11, type: 'brickWall1', frame: 1 },
  { x: 30, y: 11, type: 'brickWall1', frame: 1 },
  { x: 31, y: 11, type: 'brickWall1', frame: 1 },
  { x: 28, y: 12, type: 'brickWall1', frame: 1 },
  { x: 29, y: 12, type: 'brickWall1', frame: 1 },
  { x: 30, y: 12, type: 'brickWall1', frame: 1 },
  { x: 31, y: 12, type: 'brickWall1', frame: 1 },
  { x: 28, y: 13, type: 'brickWall1', frame: 1 },
  { x: 29, y: 13, type: 'brickWall1', frame: 1 },
  { x: 30, y: 13, type: 'brickWall1', frame: 1 },
  { x: 31, y: 13, type: 'brickWall1', frame: 1 },
  { x: 28, y: 14, type: 'brickWall1', frame: 1 },
  { x: 29, y: 14, type: 'brickWall1', frame: 1 },
  { x: 30, y: 14, type: 'brickWall1', frame: 1 },
  { x: 31, y: 14, type: 'brickWall1', frame: 1 }], food: randomOrder([["apple", "apple"], ["naranja", "cherry", "naranja", "naranja"], ["apple", "mango", "limon"], ["apple", "apple", "apple"], ["cherry", "sandia", "apple"]]), slabs: []})
  }  else {
    return ({solidObjects: [
  { x: 5, y: 0, type: 'lowerLeftCornerFence1', frame: 1 },
  { x: 6, y: 0, type: 'horFence1', frame: 1 },
  { x: 7, y: 0, type: 'horFence1', frame: 1 },
  { x: 8, y: 0, type: 'horFence1', frame: 1 },
  { x: 9, y: 0, type: 'horFence1', frame: 1 },
  { x: 10, y: 0, type: 'horFence1', frame: 1 },
  { x: 11, y: 0, type: 'horFence1', frame: 1 },
  { x: 12, y: 0, type: 'horFence1', frame: 1 },
  { x: 13, y: 0, type: 'horFence1', frame: 1 },
  { x: 14, y: 0, type: 'horFence1', frame: 1 },
  { x: 15, y: 0, type: 'horFence1', frame: 1 },
  { x: 16, y: 0, type: 'horFence1', frame: 1 },
  { x: 17, y: 0, type: 'horFence1', frame: 1 },
  { x: 18, y: 0, type: 'horFence1', frame: 1 },
  { x: 19, y: 0, type: 'horFence1', frame: 1 },
  { x: 20, y: 0, type: 'horFence1', frame: 1 },
  { x: 21, y: 0, type: 'horFence1', frame: 1 },
  { x: 22, y: 0, type: 'horFence1', frame: 1 },
  { x: 23, y: 0, type: 'horFence1', frame: 1 },
  { x: 24, y: 0, type: 'horFence1', frame: 1 },
  { x: 25, y: 0, type: 'horFence1', frame: 1 },
  { x: 26, y: 0, type: 'horFence1', frame: 1 },
  { x: 27, y: 0, type: 'horFence1', frame: 1 },
  { x: 28, y: 0, type: 'horFence1', frame: 1 },
  { x: 29, y: 0, type: 'horFence1', frame: 1 },
  { x: 30, y: 0, type: 'horFence1', frame: 1 },
  { x: 31, y: 0, type: 'horFence1', frame: 1 },
  { x: 32, y: 0, type: 'horFence1', frame: 1 },
  { x: 33, y: 0, type: 'horFence1', frame: 1 },
  { x: 34, y: 0, type: 'horFence1', frame: 1 },
  { x: 35, y: 0, type: 'horFence1', frame: 1 },
  { x: 36, y: 0, type: 'horFence1', frame: 1 },
  { x: 37, y: 0, type: 'horFence1', frame: 1 },
  { x: 38, y: 0, type: 'horFence1', frame: 1 }, 
  { x: 39, y: 0, type: 'lowerLeftCornerFence1', frame: 1 }, 
  { x: 39, y: 1, type: 'vertFence1', frame: 1 },
  { x: 39, y: 2, type: 'vertFence1', frame: 1 },
  { x: 39, y: 3, type: 'vertFence1', frame: 1 },
  { x: 39, y: 4, type: 'vertFence1', frame: 1 },
  { x: 39, y: 5, type: 'vertFence1', frame: 1 },
  { x: 39, y: 6, type: 'vertFence1', frame: 1 },
  { x: 39, y: 7, type: 'vertFence1', frame: 1 },
  { x: 39, y: 8, type: 'vertFence1', frame: 1 },
  { x: 39, y: 9, type: 'vertFence1', frame: 1 },
  { x: 39, y: 10, type: 'vertFence1', frame: 1 },
  { x: 39, y: 11, type: 'vertFence1', frame: 1 },
  { x: 39, y: 12, type: 'vertFence1', frame: 1 },
  { x: 39, y: 13, type: 'vertFence1', frame: 1 },
  { x: 39, y: 14, type: 'vertFence1', frame: 1 },
  { x: 39, y: 15, type: 'vertFence1', frame: 1 },
  { x: 39, y: 16, type: 'vertFence1', frame: 1 },
  { x: 39, y: 17, type: 'vertFence1', frame: 1 },
  { x: 39., y: 18, type: 'lowerLeftCornerFence1', frame: 1 }, 
  { x: 6, y: 18, type: 'horFence1', frame: 1 },
  { x: 7, y: 18, type: 'horFence1', frame: 1 },
  { x: 8, y: 18, type: 'horFence1', frame: 1 },
  { x: 9, y: 18, type: 'horFence1', frame: 1 },
  { x: 10, y: 18, type: 'horFence1', frame: 1 },
  { x: 11, y: 18, type: 'horFence1', frame: 1 },
  { x: 12, y: 18, type: 'horFence1', frame: 1 },
  { x: 13, y: 18, type: 'horFence1', frame: 1 },
  { x: 14, y: 18, type: 'horFence1', frame: 1 },
  { x: 15, y: 18, type: 'horFence1', frame: 1 },
  { x: 16, y: 18, type: 'horFence1', frame: 1 },
  { x: 17, y: 18, type: 'horFence1', frame: 1 },
  { x: 18, y: 18, type: 'horFence1', frame: 1 },
  { x: 19, y: 18, type: 'horFence1', frame: 1 },
  { x: 20, y: 18, type: 'horFence1', frame: 1 },
  { x: 21, y: 18, type: 'horFence1', frame: 1 },
  { x: 22, y: 18, type: 'horFence1', frame: 1 },
  { x: 23, y: 18, type: 'horFence1', frame: 1 },
  { x: 24, y: 18, type: 'horFence1', frame: 1 },
  { x: 25, y: 18, type: 'horFence1', frame: 1 },
  { x: 26, y: 18, type: 'horFence1', frame: 1 },
  { x: 27, y: 18, type: 'horFence1', frame: 1 },
  { x: 28, y: 18, type: 'horFence1', frame: 1 },
  { x: 29, y: 18, type: 'horFence1', frame: 1 },
  { x: 30, y: 18, type: 'horFence1', frame: 1 },
  { x: 31, y: 18, type: 'horFence1', frame: 1 },
  { x: 32, y: 18, type: 'horFence1', frame: 1 },
  { x: 33, y: 18, type: 'horFence1', frame: 1 },
  { x: 34, y: 18, type: 'horFence1', frame: 1 },
  { x: 35, y: 18, type: 'horFence1', frame: 1 },
  { x: 36, y: 18, type: 'horFence1', frame: 1 },
  { x: 37, y: 18, type: 'horFence1', frame: 1 },
  { x: 38, y: 18, type: 'horFence1', frame: 1 }, 
  { x: 5, y: 18, type: 'lowerLeftCornerFence1', frame: 1 }, 
  { x: 5, y: 1, type: 'vertFence1', frame: 1 },
  { x: 5, y: 2, type: 'vertFence1', frame: 1 },
  { x: 5, y: 3, type: 'vertFence1', frame: 1 },
  { x: 5, y: 4, type: 'vertFence1', frame: 1 },
  { x: 5, y: 5, type: 'vertFence1', frame: 1 },
  { x: 5, y: 6, type: 'vertFence1', frame: 1 },
  { x: 5, y: 7, type: 'vertFence1', frame: 1 },
  { x: 5, y: 8, type: 'vertFence1', frame: 1 },
  { x: 5, y: 9, type: 'vertFence1', frame: 1 },
  { x: 5, y: 10, type: 'vertFence1', frame: 1 },
  { x: 5, y: 11, type: 'vertFence1', frame: 1 },
  { x: 5, y: 12, type: 'vertFence1', frame: 1 },
  { x: 5, y: 13, type: 'vertFence1', frame: 1 },
  { x: 5, y: 14, type: 'vertFence1', frame: 1 },
  { x: 5, y: 15, type: 'vertFence1', frame: 1 },
  { x: 5, y: 16, type: 'vertFence1', frame: 1 },
  { x: 5, y: 17, type: 'vertFence1', frame: 1 },
  { x: 14, y: 1, type: 'brickWall1', frame: 1 },
  { x: 14, y: 2, type: 'brickWall1', frame: 1 },
  { x: 14, y: 3, type: 'brickWall1', frame: 1 },
  { x: 14, y: 4, type: 'brickWall1', frame: 1 },
  { x: 14, y: 5, type: 'brickWall1', frame: 1 },
  { x: 14, y: 6, type: 'brickWall1', frame: 1 },
  { x: 14, y: 10, type: 'brickWall1', frame: 1 },
  { x: 14, y: 11, type: 'brickWall1', frame: 1 },
  { x: 14, y: 12, type: 'brickWall1', frame: 1 },
  { x: 14, y: 13, type: 'brickWall1', frame: 1 },
  { x: 14, y: 14, type: 'brickWall1', frame: 1 },
  { x: 14, y: 15, type: 'brickWall1', frame: 1 },
  { x: 14, y: 16, type: 'brickWall1', frame: 1 },
  { x: 14, y: 17, type: 'brickWall1', frame: 1 },
  { x: 19, y: 1, type: 'brickWall1', frame: 1 },
  { x: 19, y: 2, type: 'brickWall1', frame: 1 },
  { x: 19, y: 3, type: 'brickWall1', frame: 1 },
  { x: 19, y: 4, type: 'brickWall1', frame: 1 },
  { x: 19, y: 5, type: 'brickWall1', frame: 1 },
  { x: 19, y: 6, type: 'brickWall1', frame: 1 },
  { x: 19, y: 7, type: 'brickWall1', frame: 1 },
  { x: 19, y: 8, type: 'brickWall1', frame: 1 },
  { x: 19, y: 9, type: 'brickWall1', frame: 1 },
  { x: 19, y: 10, type: 'brickWall1', frame: 1 },
  { x: 19, y: 15, type: 'brickWall1', frame: 1 },
  { x: 19, y: 16, type: 'brickWall1', frame: 1 },
  { x: 19, y: 17, type: 'brickWall1', frame: 1 },
  { x: 24, y: 1, type: 'brickWall1', frame: 1 },
  { x: 24, y: 2, type: 'brickWall1', frame: 1 },
  { x: 24, y: 3, type: 'brickWall1', frame: 1 },
  { x: 24, y: 4, type: 'brickWall1', frame: 1 },
  { x: 24, y: 5, type: 'brickWall1', frame: 1 },
  { x: 24, y: 10, type: 'brickWall1', frame: 1 },
  { x: 24, y: 11, type: 'brickWall1', frame: 1 },
  { x: 24, y: 12, type: 'brickWall1', frame: 1 },
  { x: 24, y: 13, type: 'brickWall1', frame: 1 },
  { x: 24, y: 14, type: 'brickWall1', frame: 1 },
  { x: 24, y: 15, type: 'brickWall1', frame: 1 },
  { x: 24, y: 16, type: 'brickWall1', frame: 1 },
  { x: 24, y: 17, type: 'brickWall1', frame: 1 }, { x: 29, y: 1, type: 'brickWall1', frame: 1 },
  { x: 29, y: 2, type: 'brickWall1', frame: 1 },
  { x: 29, y: 3, type: 'brickWall1', frame: 1 },
  { x: 29, y: 4, type: 'brickWall1', frame: 1 },
  { x: 29, y: 5, type: 'brickWall1', frame: 1 },
  { x: 29, y: 6, type: 'brickWall1', frame: 1 },
  { x: 29, y: 7, type: 'brickWall1', frame: 1 },
  { x: 29, y: 8, type: 'brickWall1', frame: 1 },
  { x: 29, y: 13, type: 'brickWall1', frame: 1 },
  { x: 29, y: 14, type: 'brickWall1', frame: 1 },
  { x: 29, y: 15, type: 'brickWall1', frame: 1 },
  { x: 29, y: 16, type: 'brickWall1', frame: 1 },
  { x: 29, y: 17, type: 'brickWall1', frame: 1 }], food: randomOrder([["apple", "mango", "apple", "apple", "limon"], ["cherry", "cherry", "naranja", "apple"], ["sandia", "apple", "naranja", "naranja", "apple"], ["mango", "limon", "sandia", "naranja", "naranja"]]), slabs: []})
  }
}

/*
Contrato: coordenada, coordenada, list -> Boolean
Propósito: Con esta función podemos hallar si hay coincidencia entre las coordenadas indicadas como parámetros y las coordenadas de cada objeto dentro de la lista asignada como parámetro. En palabras sencillas, vemos si la coordenada ingresada existe en la lista.
Prototipo: coorListExplorer(coorx, coory, list){...}
Ejemplo: coorListExplorer(1, 0, { x: 1, y: 0 }) -> true
*/ 
 
function coorListExplorer(coorx, coory, list){
  if (isEmpty(list) == true){
    return (false);
  } else if (coorx == (first(list)).x && coory == (first(list)).y){
    return (true);
  } else {
    return (coorListExplorer(coorx, coory, rest(list)));
  }
}

/*
Contrato: Mundo -> Boolean
Propósito: Con esta función detectamos si en el próximo fotograma habrá una colisión con un objeto sólido.
Prototipo: collisionWithSolidObject(Mundo){...}
Ejemplo: collisionWithSolidObject(Mundo) -> true or false (a partir de ciertas comprobaciones)
*/

function collisionWithSolidObject(Mundo){
  if (dirCheck(Mundo) == 'up'){
    if (coorListExplorer((first(Mundo.snakeBody)).x, (first(Mundo.snakeBody)).y - 1, Mundo.level.solidObjects) == true){
      return (true);
    } else {
      return (false);
    }
  } else if (dirCheck(Mundo) == 'down'){
    if (coorListExplorer((first(Mundo.snakeBody)).x, (first(Mundo.snakeBody)).y + 1, Mundo.level.solidObjects) == true){
      return (true);
    } else {
      return (false);
    }
  } else if (dirCheck(Mundo) == 'left'){
    if (coorListExplorer((first(Mundo.snakeBody)).x - 1, (first(Mundo.snakeBody)).y, Mundo.level.solidObjects) == true){
      return (true);
    } else {
      return (false);
    }
  } else {
    if (coorListExplorer((first(Mundo.snakeBody)).x + 1, (first(Mundo.snakeBody)).y, Mundo.level.solidObjects) == true){
      return (true);
    } else {
      return (false);
    }
  }
}

/*
Contrato: Mundo -> Boolean
Propósito: Con esta función detectamos si la serpiente choca con su propio cuerpo.
Prototipo: collisionWithBody(Mundo){...}
Ejemplo: collisionWithBody(Mundo) -> true or false (a partir de ciertas comprobaciones)
*/

function collisionWithBody(Mundo){
  if (dirCheck(Mundo) == 'up'){
    if (coorListExplorer((first(Mundo.snakeBody)).x, (first(Mundo.snakeBody)).y - 1, rest(Mundo.snakeBody)) == true){
      fail_sound.play();
      return (true);
    } else {
      return (false);
    }
  } else if (dirCheck(Mundo) == 'down'){
    if (coorListExplorer((first(Mundo.snakeBody)).x, (first(Mundo.snakeBody)).y + 1, rest(Mundo.snakeBody)) == true){
      fail_sound.play();
      return (true);
    } else {
      return (false);
    }
  } else if (dirCheck(Mundo) == 'left'){
    if (coorListExplorer((first(Mundo.snakeBody)).x - 1, (first(Mundo.snakeBody)).y, rest(Mundo.snakeBody)) == true){
      fail_sound.play();
      return (true);
    } else {
      return (false);
    }
  } else {
    if (coorListExplorer((first(Mundo.snakeBody)).x + 1, (first(Mundo.snakeBody)).y, rest(Mundo.snakeBody)) == true){
      fail_sound.play();
      return (true);
    } else {
      return (false);
    }
  }
}


/*
Contrato: List, string (dirección) -> Function or JSON
Propósito: Con esta función regulamos la velocidad de movimiento de la serpiente
Prototipo: moveSnakeAux(list, dir){...}
Ejemplo: moveSnakeAux([{ x: 3, y: 3 }, { x: 2, y: 2 }, { x: 1, y:1 }], "left") -> moveSnake([{ x: 3, y: 3 }, { x: 2, y: 3 }, { x: 1, y:3 }], "left") or [{ x: 3, y: 3 }, { x: 2, y: 3 }, { x: 1, y: 3 }] (dependiendo de las comprobaciones)
*/

function moveSnakeAux(list, dir){
  if (Mundo.snakeSpeed == "default"){
    if (Mundo.frameMovementSnake % 2 == 0){
      return (moveSnake(list, dir));
    } else {
      return (Mundo.snakeBody);
    }
  } else if (Mundo.snakeSpeed == "fast"){
    return (moveSnake(list, dir));
  } else {
    if (Mundo.frameMovementSnake % 3 == 0){
      return (moveSnake(list, dir));
    } else {
      return (Mundo.snakeBody);
    }
  }
}

/*
Contrato: JSON, string (dirección) -> list
Propósito: Esta función retorna una lista de las unidades del cuerpo de la serpiente con la velocidad de movimiento ya aplicada.
Prototipo: moveSnake(snake, dir){...}
Ejemplo: moveSnake([{ x: 3, y: 3 }, { x: 2, y: 3 }, { x: 1, y: 3 }], "left") -> [{ x: 2, y: 3 }, { x: 1, y: 3 }, { x: 0, y: 3 }]
*/

function moveSnake(snake, dir){
  return cons({ x: (first(snake)).x + dir.x, y: (first(snake)).y + dir.y }, snake.slice(0, length(snake) - 1));
}

/*
Contrato: JSON (object) -> string (dirección)
Propósito: Esta función retorna la dirección en la que se dirije la serpiente.
Prototipo: dirCheck(obj){...}
Ejemplo: dirCheck({ x: 1, y: 0 }) -> 'right'
*/

function dirCheck(obj) {
  if (obj.dir.x == 1  && obj.dir.y == 0) {
    return ('right');
  } else if (obj.dir.x == -1 && obj.dir.y == 0) {
    return ('left');
  } else if (obj.dir.x == 0 && obj.dir.y == 1) {
    return ('down');
  } else {
    return ('up');
  }
}

/*
Contrato: Mundo -> Boolean
Propósito: Con esta función se pueden programar acciones que ocurran en un determinado período de tiempo.
Prototipo: timeFrameController(min, max, number){...}
Ejemplo: timeFrameController(10, 20, 20) -> 10
timeFrameController(10, 20, 10) -> 10 + 1 -> 11
*/

function timeFrameController(min, max, number){
  if (number == max){
    return (min);
  } else {
    return (number + 1);
  }
}

/*
Contrato: Mundo -> Boolean Or Number
Propósito: Con esta función controlamos el movimiento por fotograma de la serpiente en sus distintas velocidades.
Prototipo: snakeMovePerFrameAux(Mundo){...}
Ejemplo: snakeMovePerFrameAux(Mundo) -> false or Mundo.snakeMovePerFrame (dependiendo de las comprobaciones que realiza)
*/

function snakeMovePerFrameAux(Mundo){
  if (Mundo.snakeSpeed == "default"){
    if (Mundo.frameMovementSnake % 2 == 0){
      return (false);
    } else {
      return (Mundo.snakeMovePerFrame);
    }
  } else if (Mundo.snakeSpeed == "fast"){
    return (false);
  } else/* if (Mundo.snakeSpeed == "slow")*/{
    if (Mundo.frameMovementSnake % 3 == 0){
      return (false);
    } else {
      return (Mundo.snakeMovePerFrame);
    }
  }
}

/*
Contrato: Mundo -> JSON (Causa de muerte)
Propósito: Con esta función determinamos la causa de muerte de la serpiente, que puede ser colisionando con ella misma o con un objeto sólido.
Prototipo: causeOfDeath(Mundo){...}
Ejemplo: causeOfDeath(Mundo) -> { type: 2, option: 0.01 } o { type: 2, option 0.02 } (la primera si fue con un objeto sólido y la segunda con su cuerpo)
*/

function causeOfDeath(Mundo){
  if (collisionWithSolidObject(Mundo) == true){
    fail_sound.play()
    return ({type: 2, option: 0.01});
  } else {
    return ({type:2, option:0.02})
  }
}

/*
Contrato: Mundo -> JSON (actualizacion de determinados objetos del mundo)
Propósito: Con esta función detectamos si en el próximo fotograma habrá una colisión con un objeto sólido.
Prototipo: snakeNotAlive(Mundo)
Ejemplo: snakeNotAlive(Mundo) -> update(Mundo, {mode: causeOfDeath(Mundo), snakeBody: Mundo.snakeBody, frameMovementSnake: timeFrameController(1, 30, Mundo.frameMovementSnake), snakeMovePerFrame: snakeMovePerFrameAux(Mundo), score: addScore(Mundo), signNumbers: addUnitFrame(signNumbersRemove(Mundo.signNumbers))})
*/

function snakeNotAlive(Mundo){
  return (update(Mundo, {mode: causeOfDeath(Mundo), snakeBody: Mundo.snakeBody, frameMovementSnake: timeFrameController(1, 30, Mundo.frameMovementSnake),
    snakeMovePerFrame: snakeMovePerFrameAux(Mundo), score: addScore(Mundo), signNumbers: addUnitFrame(signNumbersRemove(Mundo.signNumbers))}));
}

/*
Contrato: Mundo -> Boolean
Propósito: Con esta función determinamos si la serpiente está viva o no.
Prototipo: snakeAlive(Mundo){...}
Ejemplo: snakeAlive(Mundo) -> true or false (dependiendo de dos comparaciones)
*/

function snakeAlive(Mundo){
  if (collisionWithSolidObject(Mundo) == true || collisionWithBody(Mundo) == true){
    return (false);
  } else {
    return (true);
  }
}

/*
Contrato: Elemento -> JSON (datos de los elementos de la comida)
Propósito: Con esta función retornamos un JSON de los objetos de comida, con sus respectivos datos y una unidad en los fotogramas añadida.
Prototipo: foodAnimationFrameAux(element){...}
Ejemplo: foodAnimationFrameAux({x:1, y:2, type:'apple', frame: 1}) -> { x: 1, y: 2, type: 'apple', frame: 2}
*/

function foodAnimationFrameAux(element){
  return ({x: element.x, y:element.y, type:element.type, frame: timeFrameController(11, 30, element.frame)});
}

/*
Contrato: List -> List
Propósito: Con esta función añadimos una unidad a cada fotograma de cada objeto en la lista asignada como parámetro.
Prototipo: foodAnimationFrame(list){...}
Ejemplo: foodAnimationFrame([{ x: 2, y: 2, type: 'apple', frame: 1 }, { x: 3, y: 3, type: 'cherry', frame: 5 }]) -> [{ x: 2, y: 2, type: 'apple', frame:2}, { x: 3, y: 3, type: 'cherry', frame: 6}]
*/

function foodAnimationFrame(list){
  if (isEmpty(list) == true){
    return ([]);
  } else {
    return (cons(foodAnimationFrameAux(first(list)), foodAnimationFrame(rest(list))));
  }
}

/*
Contrato: Mundo -> Function or Boolean
Propósito: Con esta función determinamos si la serpiente consumió un alimento.
Prototipo: snakeAte(Mundo)
Ejemplo: snakeAte(Mundo) -> coorListExplorerObj((first(Mundo.snakeBody)).x, (first(Mundo.snakeBody)).y, first(Mundo.level.food)) or False (dependiendo de la comprobación)
*/

function snakeAte(Mundo){
  if (coorListExplorer((first(Mundo.snakeBody)).x, (first(Mundo.snakeBody)).y,  first(Mundo.level.food)) == true){
      return (coorListExplorerObj((first(Mundo.snakeBody)).x, (first(Mundo.snakeBody)).y, first(Mundo.level.food)));
    } else {
      return (false);
    }
}

/*
Contrato: Coordenada, coordenada, lista -> List or element
Propósito: Esta función la usamos para verificar si las coordenadas asignadas como parámetros se encuentran en algún objeto dentro de la lista asignada como parámetro, y   si es asi, retorna aquel elemento.
Prototipo: coorListExplorerObj(coorx, coory, list)
Ejemplo: coorListExplorer(0, 1, [{ x: 2, y: 3 }, { x: 0, y: 1}]) -> { x: 0, y: 1}
*/

function coorListExplorerObj(coorx, coory, list){
  if (isEmpty(list)){
    return ([]);
  } else if (coorx == (first(list)).x && coory == (first(list)).y){
    return (first(list));
  } else {
    return (coorListExplorerObj(coorx, coory, rest(list)));
  }
}

/*
Contrato: Coordenada, coordenada, lista -> number
Propósito: Esta función la usamos para verificar la posición de un objeto que tiene las coodenadas asignadas como parámetro en una lista de coordenadas. Si no existe devuelve 0, si está de primero devuelve 1.
Prototipo: coorElementPosition(coorx, coory, list)
Ejemplo: coorElementPosition(0, 1, [{ x: 2, y: 3 }, { x: 0, y: 1}]) -> 2
*/

function coorElementPosition(coorx, coory, list){
  if (isEmpty(list) == true){
    return (0);
  } else if (coorx == (first(list)).x && coory == (first(list)).y){
    return (1);
  } else {
    return (1 + coorElementPosition(coorx, coory, rest(list)));
  }
}

/*
Contrato: list -> Dato
Propósito: Esta función devuelve el último elemento de la lista que se le ingresa como parámetro.
Prototipo: lastItem(list)
Ejemplo: lastItem([1,2,3,4,5]) -> 5
*/

function lastItem(list){
  if (isEmpty(rest(list))){
    return (first(list));
  } else {
    return (lastItem(rest(list)));
  }
}

/*
Contrato: Mundo -> list
Propósito: Esta función retorna la lista de la serpiente con una unidad de crecimiento añadida.
Prototipo: snakeGrow(Mundo)
Ejemplo: snakeGrow(Mundo) -> [{ x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1}, { x: 3, y: 1 }] (Suponiendo claro que el juego esté en ejecución y que la serpiente esté en dicha ideal posición)
*/

function snakeGrow(Mundo){
  return (append(moveSnakeAux(Mundo.snakeBody, Mundo.dir), lastItem(Mundo.snakeBody)))
}

/*
Contrato: Mundo, JSON (object) -> list
Propósito: Esta función retorna una lista referente al objeto food cuando es necesario remover un elemento o continuar con la siguente ronda de alimentos. Cuando no quedan rondas, retorna una lista vacía.
Prototipo: foodRemove(Mundo, obj){...}
Ejemplo: foodRemove(Mundo, [{x:0, y:0, type:"apple", frame:1}]) -> (si de acuerdo a las comparaciones ya no hay rondas) -> []
*/

function foodRemove(Mundo, obj){
  if (lengthOfList(first(cons(removeElementInPosition(first(Mundo.level.food), coorElementPosition(obj.x, obj.y, first(Mundo.level.food))), rest(Mundo.level.food)))) == 0 && isEmpty(rest(Mundo.level.food)) == true){
    return ([]);
  } else if (lengthOfList(first(cons(removeElementInPosition(first(Mundo.level.food), coorElementPosition(obj.x, obj.y, first(Mundo.level.food))), rest(Mundo.level.food)))) == 0){
    return (cons(placeFoodAux(first(rest(Mundo.level.food)), [{x: 0, y:0}]), rest(rest(Mundo.level.food))));
  } else {
    return (cons(removeElementInPosition(first(Mundo.level.food), coorElementPosition(obj.x, obj.y, first(Mundo.level.food))), rest(Mundo.level.food)));
  }
}

/*
Contrato: Mundo -> list
Propósito: Esta función retorna una lista con tres unidades nuevas adjuntas, haciendo referencia a que se ingirió una cereza.
Prototipo: cherryGrow(Mundo){...}
Ejemplo: cherryGrow([{ x: 3, y: 3 }, { x: 2, y: 3 }, { x: 1, y: 3 }]) -> [{ x: 3, y: 3 }, { x: 2, y: 3 }, { x: 1, y: 3 }, { x: 1, y: 3 }, { x: 1, y: 3 }, { x: 1, y: 3 }]
*/

function cherryGrow(Mundo){
  return (joinLists(Mundo.snakeBody, cons(lastItem(Mundo.snakeBody), cons(lastItem(Mundo.snakeBody), cons(lastItem(Mundo.snakeBody), [])))));
}

/*
Contrato: number (type) -> JSON
Propósito: Esta función devuelve el modo de juego en el que la serpiente comió.
Prototipo: modeSnakeAte(type)
Ejemplo: modeSnakeAte(1) -> 2
*/

function modeSnakeAte(type){
  if (type == 1){
    return (Mundo.mode);
  } else {
    return ({type: 2, option: 0.52})
  }
}

/*
Contrato: JSON (object), String (type de food) -> function
Propósito: Esta función devuelve los efectos que causa consumir cierto elemento sobre el mundo.
Prototipo: foodEffect(obj, type)
Ejemplo: foodEffect([{ x: 14, y: 13, type: 'apple', frame: 1 }], 'apple') -> update(Mundo, {...}) 
*/

function foodEffect(obj, type){
  if (obj.type == "apple"){
    return (update(Mundo, {mode: modeSnakeAte(type), snakeBody: snakeGrow(Mundo), level: update(Mundo.level,{solidObjects: Mundo.level.solidObjects, food: foodRemove(Mundo, obj)}), frameMovementSnake: timeFrameController(1, 30, Mundo.frameMovementSnake),
    snakeMovePerFrame: snakeMovePerFrameAux(Mundo), score:{toShowScore: Mundo.score.toShowScore, accumulateScore: Mundo.score.accumulateScore + 25}, signNumbers: cons({x:obj.x*30, y:obj.y*30, txt:"25", type:"default", frame: 1,lim: 15}, addUnitFrame(Mundo.signNumbers))}));
  } else if (obj.type == "cherry"){
    return (update(Mundo, {mode: modeSnakeAte(type), snakeBody: cherryGrow(Mundo), level: update(Mundo.level,{solidObjects: Mundo.level.solidObjects, food: foodRemove(Mundo, obj)}), frameMovementSnake: timeFrameController(1, 30, Mundo.frameMovementSnake),
    snakeMovePerFrame: snakeMovePerFrameAux(Mundo), score:{toShowScore: Mundo.score.toShowScore, accumulateScore: Mundo.score.accumulateScore + 80}, signNumbers: cons({x:obj.x*30, y:obj.y*30, txt:"80", type:"default", frame: 1,lim: 15}, addUnitFrame(Mundo.signNumbers))}));
  } else if (obj.type == "mango"){
    return (update(Mundo, {mode: modeSnakeAte(type), snakeBody: snakeGrow(Mundo), snakeSpeed:"default", level: update(Mundo.level,{solidObjects: Mundo.level.solidObjects, food: foodRemove(Mundo, obj)}), frameMovementSnake: timeFrameController(1, 30, Mundo.frameMovementSnake),
    snakeMovePerFrame: snakeMovePerFrameAux(Mundo), score:{toShowScore: Mundo.score.toShowScore, accumulateScore: Mundo.score.accumulateScore + 50}, signNumbers: cons({x:obj.x*30, y:obj.y*30, txt:"50", type:"default", frame: 1,lim: 15}, addUnitFrame(Mundo.signNumbers))}));
  } else if (obj.type == "naranja"){
    return (update(Mundo, {mode: modeSnakeAte(type), snakeBody: snakeGrow(Mundo), level: update(Mundo.level,{solidObjects: Mundo.level.solidObjects, food: foodRemove(Mundo, obj)}), frameMovementSnake: timeFrameController(1, 30, Mundo.frameMovementSnake),
    snakeMovePerFrame: snakeMovePerFrameAux(Mundo), score:{toShowScore: Mundo.score.toShowScore, accumulateScore: Mundo.score.accumulateScore + 15}, signNumbers: cons({x:obj.x*30, y:obj.y*30, txt:"15", type:"default", frame: 1,lim: 15}, addUnitFrame(Mundo.signNumbers))}));
  } else if (obj.type == "sandia"){
    return (update(Mundo, {mode: modeSnakeAte(type), snakeBody: snakeGrow(Mundo), lives: Mundo.lives + 1, level: update(Mundo.level,{solidObjects: Mundo.level.solidObjects, food: foodRemove(Mundo, obj)}), frameMovementSnake: timeFrameController(1, 30, Mundo.frameMovementSnake),
    snakeMovePerFrame: snakeMovePerFrameAux(Mundo), score:{toShowScore: Mundo.score.toShowScore, accumulateScore: Mundo.score.accumulateScore + 70}, signNumbers: cons({x:obj.x*30, y:obj.y*30, txt:"70", type:"default", frame: 1,lim: 15}, addUnitFrame(Mundo.signNumbers))}));
  } else {
    return (update(Mundo, {mode: modeSnakeAte(type), snakeBody: snakeGrow(Mundo), snakeSpeed:"slow", level: update(Mundo.level,{solidObjects: Mundo.level.solidObjects, food: foodRemove(Mundo, obj)}), frameMovementSnake: timeFrameController(1, 30, Mundo.frameMovementSnake),
    snakeMovePerFrame: snakeMovePerFrameAux(Mundo), score:{toShowScore: Mundo.score.toShowScore, accumulateScore: Mundo.score.accumulateScore + 50}, signNumbers: cons({x:obj.x*30, y:obj.y*30, txt:"50", type:"default", frame: 1,lim: 15}, addUnitFrame(Mundo.signNumbers))}));
  } 
}

/*
Contrato: list -> list
Propósito: Esta función remueve de la pantalla la puntuación que aparece al consumir un alimento cuando llegan a su fotograma N. 15
Prototipo: signNumbersRemove(list){...}
Ejemplo: signNumbersRemove([{ x: 10, y: 10, value: '+25', frame: 15 }]) -> (suponiendo que el elemento se comporte de dicha manera y que el resto de la lista esté vacía) -> []
*/

function signNumbersRemove(list){
  if (isEmpty(list) == true){
    return ([]);
  } else if ((first(list)).frame == 15){
    return (signNumbersRemove(rest(list)));
  } else {
    return (cons(first(list), signNumbersRemove(rest(list))));
  }
}

/*
Contrato: list -> list
Propósito: Esta función se utiliza para añadir una unidad al objeto frame en la lista de objetos asignada como parámetro.
Prototipo: addUnitFrame(list)
Ejemplo: addUnitFrame([{ x: 1, y :1, value: '+25', frame: 10}]) -> [{ x: 1, y: 1, value: '+25', frame: 11 }]
*/

function addUnitFrame(list){
  if (isEmpty(list) == true){
    return ([]);
  } else {
    return (cons(update(first(list), {frame:(first(list)).frame + 1}), addUnitFrame(rest(list))));
  }
}

/*
Contrato: Mundo -> JSON
Propósito: Esta función realiza la tarea de añadir puntaje y acumularlo.
Prototipo: addScore(Mundo)
Ejemplo: addScore(Mundo) > (suponiendo que Mundo.score.accumulateScore sea 0) -> { toShowScore: 0, accumulateScore: 0 }
*/

function addScore(Mundo){
  if (Mundo.score.accumulateScore == 0){
    return ({toShowScore: Mundo.score.toShowScore, accumulateScore: Mundo.score.accumulateScore});
  } else {
    return ({toShowScore: Mundo.score.toShowScore + 1, accumulateScore: Mundo.score.accumulateScore - 1});
  }
}

/*
Contrato: Mundo -> function (update)
Propósito: Esta función indica que sucede con el mundo cuando la serpiente no recoge alimentos y tampoco se choca con algún obstáculo.
Prototipo: noEventOnTicGameMode(Mundo)
Ejemplo: noEventOnTicGameMode(Mundo) -> update(Mundo, {...}) (siempre devolverá eso, al menos por ahora, ya el cambio depende de los propios valores en el JSON)
*/

function noEventOnTicGameMode(Mundo){
  return (update(Mundo, {snakeBody: moveSnakeAux(Mundo.snakeBody, Mundo.dir), level: {solidObjects: Mundo.level.solidObjects, food: cons(foodAnimationFrame(first(Mundo.level.food)), rest(Mundo.level.food)), slabs: Mundo.level.slabs}, frameMovementSnake: timeFrameController(1, 30, Mundo.frameMovementSnake), snakeMovePerFrame: snakeMovePerFrameAux(Mundo), score: addScore(Mundo), signNumbers: addUnitFrame(signNumbersRemove(Mundo.signNumbers))}));
}

/*
Contrato: Mundo -> function (llamado)
Propósito: En esta función se específican todas las acciones que se realizan por fotograma durante la ejecución del juego.
Prototipo: onTicGameMode(Mundo)
Ejemplo: onTicGameMode(Mundo) -> function (dependiendo de ciertas comprobaciones llama a una función u otra)
*/

function onTicGameMode(Mundo){
  if (Mundo.mode.option == 0){
    if (snakeAte(Mundo) != false && lengthOfList(Mundo.level.food) == 1 && isEmpty(rest(first(Mundo.level.food))) == true){
      pick_up.setVolume(0.1);
      pick_up.play();
      return (foodEffect(snakeAte(Mundo), 2));
    } else if (snakeAlive(Mundo) == false){
    return (snakeNotAlive(Mundo));
    } else if (snakeAte(Mundo) != false){
      pick_up.setVolume(0.1);
      pick_up.play();
      return (foodEffect(snakeAte(Mundo), 1));
    } else {
      return (noEventOnTicGameMode(Mundo));
    } 
  } else if (Mundo.mode.option == 0.01 || Mundo.mode.option == 0.02){ 
    return (update(Mundo, {score: addScore(Mundo), signNumbers: addUnitFrame(signNumbersRemove(Mundo.signNumbers))}));
  } else if (Mundo.mode.option == 0.51){
    return (update(Mundo, {frameMovementSnake: timeFrameController(4, 30, Mundo.frameMovementSnake), level: {solidObjects: Mundo.level.solidObjects, food: cons(placeFood(first(Mundo.level.food)), rest(Mundo.level.food)), slabs: Mundo.level.slabs}, signNumbers: addUnitFrame(signNumbersRemove(Mundo.signNumbers))}));
  } else {
    return (update(Mundo, {frameMovementSnake: timeFrameController(1, 30, Mundo.frameMovementSnake), snakeMovePerFrame: snakeMovePerFrameAux(Mundo), score: addScore(Mundo), signNumbers: addUnitFrame(signNumbersRemove(Mundo.signNumbers))}))
  }
}


/*
Contrato: Mundo -> function (update)
Propósito: Esta función determina las acciones que se realizan por fotograma estando en el menú.
Prototipo: onTicMenuMode(Mundo)
Ejemplo: onTicMenuMode(Mundo) -> uptade(Mundo, {});
*/

function onTicMenuMode(Mundo){
  return (update(Mundo, {}));
}

/*
Contrato: Mundo -> function (update)
Propósito: Esta función determina las acciones que se realizan por fotograma estando en la sección de créditos.
Prototipo: onTicCredits(Mundo)
Ejemplo: onTicCredits(Mundo) -> uptade(Mundo, {});
*/

function onTicCredits(Mundo){
  return (update(Mundo, {}));
}

/*
Contrato: Mundo -> function (update)
Propósito: Esta función determina las acciones que se realizan por fotograma en la pantalla de carga del principio. Esta pantalla a pesar de no ser realista, es necesaria, para dar tiempo a que todos los sprites carguen correctamente.
Prototipo: onTicLoadingScreenMode(Mundo)
Ejemplo: onTicLoadingScreenMode(Mundo) -> (suponiendo que Mundo.mode.option = 100) -> update(Mundo, {mode: {type: 1, option: 1}})
*/

function onTicLoadingScreenMode(Mundo){
  if (Mundo.mode.option == 100){
    tss.play();
    return (update(Mundo, {mode: {type: 1, option: 1}}));   
  } else {
    return (update(Mundo, {mode: {type:0, option: Mundo.mode.option + 1}}))
  }
}

/*
Contrato: JSON(Mundo) -> JSON
Propósito: Administrar el comportamiento por fotograma cuando se está en el modo de instrucciones.
Prototipo: onTicInstructionsMode(Mundo)
Ejemplo: onTicInstructionsMode(Mundo) -> (update(Mundo, {}))
*/

function onTicInstructionsMode(Mundo){
  return (update(Mundo, {}));
}

/*
Contrato: JSON(Mundo) -> JSON
Propósito: Administrar el comportamiento por fotograma cuando se está en la pantalla de victoria.
Prototipo: onTicVictoryScreen(JSON(Mundo))
Ejemplo: onTicVictoryScreen(Mundo) -> (update(Mundo, {}))
*/
function onTicVictoryScreen(Mundo){
  return (update(Mundo, {}));
}

/*
Contrato: JSON(Mundo) -> JSON
Propósito: Administrar el comportamiento por fotograma cuando se está en la pantalla de perdida.
Prototipo: onTicLostScreen(JSON(Mundo))
Ejemplo: onTicLostScreen(Mundo) -> (update(Mundo, {}))
*/
function onTicLostScreen(Mundo){
  return (update(Mundo, {}));
}

/*
Contrato: Mundo -> function 
Propósito: Administrar el comportamiento por fotograma del mundo en general. Dependiendo del modo de juego, llama a las otras funciones que controlan el comportamiento con unas comprobaciones determinadas.
Prototipo: onTic(Mundo)
Ejemplo: onTic(Mundo) -> (suponiendo que Mundo.mode.type sea igual a 2) -> onTicGameMode(Mundo)
*/

function onTic(Mundo){
  if (Mundo.mode.type == 2){
    return (onTicGameMode(Mundo));
  } else if (Mundo.mode.type == 0){
    return (onTicLoadingScreenMode(Mundo));
  } else if (Mundo.mode.type == 1){
    return (onTicMenuMode(Mundo));
  } else if (Mundo.mode.type == 3){
    return (onTicLaberinthMode(Mundo));
  } else if (Mundo.mode.type == 4){
    return (onTicInstructionsMode(Mundo));
  } else if (Mundo.mode.type == -1){
    return (onTicCredits(Mundo));
  } else if (Mundo.mode.type == 5){
    return (onTicVictoryScreen(Mundo));
  } else {
    return (onTicLostScreen(Mundo));
  }
}

/*
Contrato: string -> string
Propósito: Función que retorna un string que indica cual es el siguiente nivel, tomando el string que representa el nivel actual como parámetro.
Prototipo: nextLevel(currentLevel)
Ejemplo: nextLevel("1-1") -> "1-2"
*/
function nextLevel(currentLevel){
  if (currentLevel == "1-1"){
    return ("1-2");
  } else if (currentLevel == "1-2"){
    return ("1-3");
  } else if (currentLevel == "1-3"){
    return ("1-4");
  } else {
    return ("1-5")
  }
}

/*
Contrato: Mundo -> function (update)
Propósito: Esta función determina las acciones que se realizan por fotograma estando en el modo de juego laberinto.
Prototipo: onTicLaberinthMode(Mundo){...}
Ejemplo: onTicLaberinthMode(Mundo) -> update(Mundo, {});
*/

function onTicLaberinthMode(Mundo){
  if((first(Mundo.snakeBody)).x > 29 && (first(Mundo.snakeBody)).x < 30 && (first(Mundo.snakeBody)).y > 18 && (first(Mundo.snakeBody)).y < 19){
    if (Mundo.currentLevel == "1-1"){
      fondolab.stop();
      rata.play();
      fondo.loop(1);   
      labent.stop();   
      return (update(Mundo, {mode: {type:2, option: 0.51}, snakeBody: (levelsdesignAux("1-2", Mundo)).snakeBody, snakeSpeed: "slow", dir: { x: 1, y: 0 }, frameMovementSnake: 1, snakeMovePerFrame: false,level: levelsdesign("1-2"), frameMovementSnake: 1, currentLevel: "1-2", score:{toShowScore: Mundo.score.toShowScore + 300 + Mundo.score.accumulateScore, accumulateScore: 0}, signNumbers: cons({x:1122, y:482, txt:"300", type:"default", frame: 1,lim: 15}, addUnitFrame(Mundo.signNumbers))}));
  } else if (Mundo.currentLevel == "1-2"){
    fondolab.stop();
      rata.play();
      fondo.loop(1);
      labent.stop();
    return (update(Mundo, {mode: {type:2, option: 0.51}, snakeBody: (levelsdesignAux("1-3", Mundo)).snakeBody, snakeSpeed: "slow", dir: { x: 1, y: 0 }, frameMovementSnake: 1, snakeMovePerFrame: false,level: levelsdesign("1-3"), frameMovementSnake: 1, currentLevel: "1-3", score:{toShowScore: Mundo.score.toShowScore + 300 + Mundo.score.accumulateScore, accumulateScore: 0}, signNumbers: cons({x:1122, y:482, txt:"300", type:"default", frame: 1,lim: 15}, addUnitFrame(Mundo.signNumbers))}));
  } else if (Mundo.currentLevel == "1-3"){
    fondolab.stop();
      rata.play();
      fondo.loop(1);
      labent.stop();
    return (update(Mundo, {mode: {type:2, option: 0.51}, snakeBody: (levelsdesignAux("1-4", Mundo)).snakeBody, snakeSpeed: "slow", dir: { x: 1, y: 0 }, frameMovementSnake: 1, snakeMovePerFrame: false,level: levelsdesign("1-4"), frameMovementSnake: 1, currentLevel: "1-4", score:{toShowScore: Mundo.score.toShowScore + 300 + Mundo.score.accumulateScore, accumulateScore: 0}, signNumbers: cons({x:1122, y:482, txt:"300", type:"default", frame: 1,lim: 15}, addUnitFrame(Mundo.signNumbers))}));
  } else if (Mundo.currentLevel == "1-4"){
    fondolab.stop();
      rata.play();
      labent.stop()
      fondo.loop(1);
    return (update(Mundo, {mode: {type:2, option: 0.51}, snakeBody: (levelsdesignAux("1-5", Mundo)).snakeBody, snakeSpeed: "slow", dir: { x: 1, y: 0 }, frameMovementSnake: 1, snakeMovePerFrame: false,level: levelsdesign("1-5"), frameMovementSnake: 1, currentLevel: "1-5", score:{toShowScore: Mundo.score.toShowScore + 300 + Mundo.score.accumulateScore, accumulateScore: 0}, signNumbers: cons({x:1122, y:482, txt:"300", type:"default", frame: 1,lim: 15}, addUnitFrame(Mundo.signNumbers))}));
  }
}
  if (isEmpty(grid) == true){
    return (update(Mundo, {}));
  } else {
    return (update(Mundo, {branches:grid}));
  } 
}

/*
Contrato: Mundo -> function (update)
Propósito: Esta función determina las reacciones del mundo ante ciertos eventos del mouse
Prototipo: onMouseEvent(Mundo, event){...}
Ejemplo: onMouseEvent(Mundo, event) -> update(Mundo, {})
*/

function onMouseEvent(Mundo, event) {
  return update(Mundo, {});
}


/*
Contrato: Mundo(JSON), number -> number or list 
Propósito: Esta función, si recibe type==1 retorna el puntaje después de haber perdido. Si recibe type== 2 retorna una lista con el signNumber para mostrar la reducción de puntaje. 
Prototipo: onMouseEvent(Mundo, event){...}
Ejemplo: onMouseEvent(Mundo, event) -> update(Mundo, {})
*/
function restartScore(Mundo, type){
  if (type == 1){
    if ((Mundo.score.toShowScore + Mundo.score.accumulateScore) < 100){
      return (Mundo.score.toShowScore + Mundo.score.accumulateScore);
    } else {
      return ((Mundo.score.toShowScore + Mundo.score.accumulateScore) - 100);
    }
  } else {
    if ((Mundo.score.toShowScore + Mundo.score.accumulateScore) < 100){
      return ([]);
    } else {
      return (cons({x:80, y:402, txt:"-100", type:"red", frame: 1,lim: 15}, addUnitFrame(Mundo.signNumbers)));
    }
  }
}


/*
Contrato: Mundo -> JSON (reiniciado)
Propósito: Esta función determinará los cambios del mundo cuando el usuario pierda una vida y quiere continuar con el juego.
Prototipo: restartLevel(Mundo)
Ejemplo: restartLevel(Mundo) -> {mode: {...}} (serie de cambios como por ejemplo, restar una vida, reiniciar el tamaño de la serpiente y demás)
*/
function restartLevel(Mundo){
  return ({mode: {type: 2, option: 0.51}, snakeBody: (levelsdesignAux(Mundo.currentLevel, Mundo)).snakeBody, snakeSpeed:(levelsdesignAux(Mundo.currentLevel, Mundo)).snakeSpeed ,frameMovementSnake: 1, level: levelsdesign(Mundo.currentLevel), lives: Mundo.lives - 1, score:{toShowScore: restartScore(Mundo, 1), accumulateScore: 0}, signNumbers: restartScore(Mundo, 2)});
}

/*
Contrato: Mundo -> function (update)
Propósito: Esta función determina las acciones que se realizan al presionar determinadas teclas durante la ejecución del juego, dependiendo del modo en el que se esté.
Prototipo: onKeyEventGameMode(Mundo){...}
Ejemplo: onKeyEventGameMode(Mundo) -> (suponiendo que se presione la flecha hacia arriba y la serpiente esté llendo hacia arriba o hacia abajo) -> update(Mundo, {})
*/

function onKeyEventGameMode(Mundo){
  if (Mundo.mode.option == 0){
    if (keyCode == UP_ARROW) {
    if (dirCheck(Mundo) == 'up' || dirCheck(Mundo) == 'down') {
      return (update(Mundo, { }));
    } else if ((dirCheck(Mundo) == 'left' || dirCheck(Mundo) == 'right') &&
    (Mundo.snakeMovePerFrame == false)) {
      return (update(Mundo, { dir: { y: -1, x: 0 }, snakeMovePerFrame: true }));
    } else {
      return (update(Mundo, { }));
    }
    } else if (keyCode == DOWN_ARROW) {
    if (dirCheck(Mundo) == 'down' || dirCheck(Mundo) == 'up') {
      return (update(Mundo, { }));
    } else if ((dirCheck(Mundo) == 'left' || dirCheck(Mundo) == 'right') &&
    (Mundo.snakeMovePerFrame == false)) {
      return (update(Mundo, { dir: { y:  1, x: 0 }, snakeMovePerFrame: true }));
    } else {
      return (update(Mundo, { }));
    }
    } else if (keyCode == LEFT_ARROW) {
    if (dirCheck(Mundo) == 'left' || dirCheck(Mundo) == 'right') {
      return (update(Mundo, { }));
    } else if ((dirCheck(Mundo) == 'up' || dirCheck(Mundo) == 'down') &&
    (Mundo.snakeMovePerFrame == false)) {
      return (update(Mundo, { dir: { y:  0, x: -1 }, snakeMovePerFrame: true }));
    } else {
      return (update(Mundo, { }));
    }
    } else if (keyCode == RIGHT_ARROW) {
    if (dirCheck(Mundo) == 'right' || dirCheck(Mundo) == 'left') {
      return (update(Mundo, { }));
    } else if ((dirCheck(Mundo) == 'up' || dirCheck(Mundo) == 'down') &&
    (Mundo.snakeMovePerFrame == false)) {
      return (update(Mundo, { dir: { y:  0, x: 1 }, snakeMovePerFrame: true }));
    } else {
      return (update(Mundo, { }));
    }
    } else {
    return (update(Mundo, {}));
    }
  } else if (Mundo.mode.option == 0.01 || Mundo.mode.option == 0.02){
     if (keyCode == 82){
      if (Mundo.lives >= 1){
        return (update(Mundo, restartLevel(Mundo)));
      } else {
        return (update(Mundo, {}));
      }
    } else if (keyCode == 13){
      if (Mundo.lives == 0){        
        gameover.play();
        fondo.stop();
        return (update(Mundo, {mode: {type:6, option:0}}));
      } else {
        return (update(Mundo, {}));
      }
    } else {
      return (update(Mundo, {}));
    }
  } else if (Mundo.mode.option == 0.51){
    if (Mundo.frameMovementSnake >= 4){
      if (keyCode == UP_ARROW){
      return (update(Mundo, {mode: {type:2, option:0}, dir:{y:-1, x:0}, frameMovementSnake: 1}));
      } else if (keyCode == DOWN_ARROW){
      return (update(Mundo, {mode: {type:2, option:0}, dir:{y:1, x:0}, frameMovementSnake: 1}));
      } else if (keyCode == RIGHT_ARROW){
      return (update(Mundo, {mode: {type:2, option:0}, dir:{y:0, x:1}, frameMovementSnake: 1}));
      } else {
      return (update(Mundo, {}));
      }
    } else {
      return (update(Mundo, {}));
    }
  } else if (Mundo.mode.option == 0.52){
     if (keyCode == 13){
    if (Mundo.currentLevel == "1-1"){
      fondo.stop();
      labent.play();
      fondolab.loop(8);
        fondo.stop();
       return (update(Mundo, {mode: {type:3, option:0}, dir:{x:1, y:0}, frameMovementSnake: 1, snakeBody: [{ x: 12, y: 10}, { x: 11, y: 10 }, { x: 10, y: 10 }], level: levelsdesign("lab")}));
    }
    if (Mundo.currentLevel != "1-5" && Mundo.currentLevel != "1-1"){
      fondo.stop();
      labent.play(2);
      fondolab.play(11);
      fondolab.stop(20);
        grid = [];
        stack = [];
        i = 0;
        j = 0;
        update(Mundo, {branches: []});
        setup();
        current = grid[2];        
       return (update(Mundo, {mode: {type:3, option:0}, dir:{x:1, y:0}, frameMovementSnake: 1, snakeBody: [{ x: 12, y: 10}, { x: 11, y: 10 }, { x: 10, y: 10 }], level: levelsdesign("lab")}));
    }  else {
      fondo.stop();
      gamend.play();
      return (update(Mundo, {mode:{type:5, option:0}})); 
    }
  } else {
    return (update(Mundo, {}));
  }
} else { 
    return (update(Mundo, {}));
  } 
} 


/*
Contrato: Mundo -> function (update)
Propósito: Esta función determina las acciones que se realizan al presionar determinadas teclas en el menú.
Prototipo: onKeyEventMenuMode(Mundo){...}
Ejemplo: onKeyEventMenuMode(Mundo) -> (suponiendo que la tecla presionada es la flecha hacia abajo y la opción del modo es 1) -> update(Mundo, {mode: {type: 1, option: 1.1}})
*/

function onKeyEventMenuMode(Mundo){
  if (keyCode == DOWN_ARROW){
    movemenu.setVolume(0.2);
    movemenu.play();
    if (Mundo.mode.option == 1){
      return (update(Mundo, {mode: {type: 1, option: 1.1}}));
    } else if (Mundo.mode.option == -1){
      return (update(Mundo, {mode: {type: 1, option: 1}}));
    } else if (Mundo.mode.option == 1.1){
      return (update(Mundo, {mode: {type: 1, option: -1}}));
    } else {
      return (update(Mundo, {}));
    }
  } else if (keyCode == UP_ARROW){
    movemenu.setVolume(0.2);
    movemenu.play();
    if (Mundo.mode.option == 1.1){
      return (update(Mundo, {mode: {type: 1, option: 1}}));
    } else if (Mundo.mode.option == -1){
      return (update(Mundo, {mode: {type: 1, option: 1.1}}));
    } else {
      return (update(Mundo, {}));
    }
  } else if (keyCode == 13){
    entermenu.setVolume(0.2);
    entermenu.play();
    if (Mundo.mode.option == 1){
      fondo.loop()
      return (update(Mundo, {mode: {type:2, option: 0.51}, currentLevel: "1-1",snakeBody: (levelsdesignAux(Mundo.currentLevel, Mundo)).snakeBody, lives:2,level: levelsdesign("1-1"), frameMovementSnake: 1, snakeSpeed:"slow", score:{toShowScore:0, accumulateScore:0}}));
    } else if (Mundo.mode.option == 1.1){
      return (update(Mundo, {mode:{type:4, option:1}}));
    } else if (Mundo.mode.option == -1){
      return (update(Mundo, {mode:{type:-1, option:1}}));
    } else {
    return (update(Mundo, {}));
  }
} else {
  return (update(Mundo, {}));
    }
}

/*
Contrato: Mundo -> JSON (después del llamado de la función update)
Propósito: Administrar el funcionamiento de las acciones de teclado durante el menú de instrucciones.
Prototipo: onKeyEventInstructiosMode(Mundo)
Ejemplo: onKeyEventInstructiosMode(Mundo) -> (suponiendo que keyCode == 13) -> update(Mundo, {mode:{type:1, option: 1}})
*/

function onKeyEventInstructiosMode(Mundo){
  if (keyCode == 13){
    backmenu.play();
    return (update(Mundo, {mode:{type:1, option: 1}}));
  } else {
    return (update(Mundo, {}));
  }
}

/*
Contrato: Mundo -> JSON (después del llamado de la función update)
Propósito: Administrar el funcionamiento de las acciones de teclado durante el menú de créditos.
Prototipo: onKeyEventCredits(Mundo)
Ejemplo: onKeyEventCredits(Mundo) -> (suponiendo que keyCode == 13) -> update(Mundo, {mode:{type:1, option: 1}})
*/

function onKeyEventCredits(Mundo){
  if (keyCode == 13){
    backmenu.play();
    return (update(Mundo, {mode:{type:1, option: 1}}));
  } else {
    return (update(Mundo, {}));
  }
}

//Función que retorna la coordenada, ya sea x o y, de donde está ubicada la cabeza de la serpiente en las cuadriculas. Si type == "x", retornada esta característica para las coordenas x. De igual forma respectivamente para "y". En coor colocamos la coordenada de la cabeza, ya sea x o y(número)
function snakeHeadGridLocationAux(type, coor){
  if (type == "x"){
    if (coor >= 9.45 && coor < 10.725){
      return (0);
    } else if (coor >= 10.725 && coor < 12){
      return (1);
    } else if (coor >= 12 && coor < 13.275){
      return (2);
    } else if (coor >= 13.275 && coor < 14.55){
      return (3);
    } else if (coor >= 14.55 && coor < 15.825000000000001){
      return (4);
    } else if (coor >= 15.825000000000001 && coor < 17.1){
      return (5);
    } else if (coor >= 17.1 && coor < 18.375){
      return (6);
    } else if (coor >= 18.375 && coor < 19.65){
      return (7);
    } else if (coor >= 19.65 && coor < 20.924999){
      return (8);
    } else if (coor >= 20.924999 && coor < 22.19){
      return (9);
    } else if (coor >= 22.19 && coor < 23.4749){
      return (10);
    } else if (coor >= 23.4749 && coor < 24.749){
      return (11);
    } else if (coor >= 24.749 && coor < 26.024){
      return (12);
    } else if (coor >= 26.024 && coor < 27.29){
      return (13);
    } else if (coor >= 27.29 && coor < 28.5749){
      return (14);
    } else if (coor >= 28.5749 && coor < 29.849){
      return (15);
    } else if (coor >= 29.849 && coor < 31){
      return (16);
    }
  } else if(type == "y"){
    if (coor >= 9.98 && coor < 11.274999){
    return (0);
  } else if (coor >= 11.2749999 && coor < 12.549){
    return (1);
  } else if (coor >= 12.549 && coor < 13.825){
    return (2);
  } else if (coor >= 13.825 && coor < 15.09){
    return (3);
  } else if (coor >= 15.1 && coor < 16.374){
    return (4);
  } else if (coor >= 16.375 && coor < 17.65){
    return (5);
  } else if (coor >= 17.65 && coor < 18.924){
    return (6);
  } else if (coor >= 18.924 && coor < 20){
    return (7);
  }
}
}

//función que retorna la lista de paredes que se encuentran alrededor de la unidad. En list, colocamos la lista de ramas(branches), y en coorx y coory, llamamos a la función auxiliar, con el type respectivo, con coor siendo la coordenada x o y de la cabeza
//ejemplo: snakeHeadGridLocation(Mundo.branches, snakeHeadGridLocationAux("x", first(Mundo.snakeBody).x, snakeHeadGridLocationAux("y", first(Mundo.snakeBody).y))
function snakeHeadGridLocation(list, coorx, coory){
  return (searchCell(list, coorx, coory).walls);
}

//función que revisa si hay una pared en la dirección que tomar la serpiente. En type, colocamos la dirección, y en snakeHeadGridList va la lista de las paredes alrededor de la unidad.
function gridWallCheck(snakeHeadGridList, type){
  if (type == "up"){
    if (elementInPosition(snakeHeadGridList, 1) == true){
      return (true);
    } else {
      return (false);
    }
  } else if (type == "right"){
    if (elementInPosition(snakeHeadGridList, 2) == true){
      return (true);
    } else {
      return (false);
    }
  } else if (type == "down"){
    if (elementInPosition(snakeHeadGridList, 3) == true){
      return (true);
    } else {
      return (false);
    }
  } else {
    if (elementInPosition(snakeHeadGridList, 4) == true){
      return (true);
    } else {
      return (false);
    }
  }
}


/*
Contrato: list, number, number -> JSON 
Propósito: Función que busca una determinada unidad dentro de la cuadricula de bonus, tomando como parámetros la lista donde están todas las unidades, y las respectivas coordenadas de la unidad que serán buscadas.
Prototipo: searchCell(list, coorx, coory)
Ejemplo: searchCell([{i:0, j:0}, {i:1, j:0}, {i:2, j:0}], 1, 0) -> {i:1, j:0}
*/
function searchCell(list, coorx, coory){
  if (isEmpty(list) == true){
    return (null);
  } else if (first(list).i == coorx &&  first(list).j == coory){
    return (first(list));
  } else {
    return (searchCell(rest(list), coorx, coory));
  }
}

/*
Contrato: Mundo -> JSON (después del llamado de la función update)
Propósito: Administrar el funcionamiento de las acciones de teclado durante el modo laberinto.
Prototipo: onKeyEventLab(Mundo)
Ejemplo: onKeyEventLab(Mundo) -> (suponiendo que keyCode == 'LEFT_ARROW' && dir == 'left') -> 
*/
function onKeyEventLab(Mundo){
   if (Mundo.mode.option == 0){
    if (Mundo.frameMovementSnake >= 1){
      if (keyCode == UP_ARROW){
        if(dirCheck(Mundo) == 'down'){
          return update(Mundo, {});
      } else { 
        if (gridWallCheck(snakeHeadGridLocation(Mundo.branches, snakeHeadGridLocationAux("x", first(Mundo.snakeBody).x), snakeHeadGridLocationAux("y", first(Mundo.snakeBody).y)), "up") == false){
        pasolab.setVolume(1);
        pasolab.play();
        return (update(Mundo, {mode: {type:3, option:0}, dir:{x:0, y:-1}, frameMovementSnake: 1, snakeBody: moveSnake(Mundo.snakeBody, {x:0, y:-1.275})}));
        } else { 
          golpe.setVolume(0.2);
          golpe.play();
          fondolab.stop();
          fondo.loop(1);
          labent.stop();
          return (update(Mundo, {mode: {type:2, option: 0.51}, snakeBody: (levelsdesignAux(Mundo.currentLevel, Mundo)).snakeBody, snakeSpeed: "slow", dir: { x: 1, y: 0 }, frameMovementSnake: 1, snakeMovePerFrame: false,level: levelsdesign(nextLevel(Mundo.currentLevel)), frameMovementSnake: 1, currentLevel: nextLevel(Mundo.currentLevel), score:{toShowScore: Mundo.score.toShowScore + Mundo.score.accumulateScore, accumulateScore: 0}, signNumbers: []}));
        }
      }
        } else if (keyCode == DOWN_ARROW){
         if(dirCheck(Mundo) == 'up'){
          return update(Mundo, {});
      } else {
        if (gridWallCheck(snakeHeadGridLocation(Mundo.branches, snakeHeadGridLocationAux("x", first(Mundo.snakeBody).x), snakeHeadGridLocationAux("y", first(Mundo.snakeBody).y)), "down") == false){
        pasolab.setVolume(1);
        pasolab.play();
        return (update(Mundo, {mode: {type:3, option:0}, dir:{x:0, y:1}, frameMovementSnake: 1, snakeBody: moveSnake(Mundo.snakeBody, {x:0, y:1.275})}));
        } else { 
          golpe.setVolume(0.2);
          golpe.play();
          fondolab.stop();
          fondo.loop(1);
          labent.stop();
          return (update(Mundo, {mode: {type:2, option: 0.51}, snakeBody: (levelsdesignAux(Mundo.currentLevel, Mundo)).snakeBody, snakeSpeed: "slow", dir: { x: 1, y: 0 }, frameMovementSnake: 1, snakeMovePerFrame: false,level: levelsdesign(nextLevel(Mundo.currentLevel)), frameMovementSnake: 1, currentLevel: nextLevel(Mundo.currentLevel), score:{toShowScore: Mundo.score.toShowScore + Mundo.score.accumulateScore, accumulateScore: 0}, signNumbers: []}));
        }
      }} else if (keyCode == RIGHT_ARROW){
         if(dirCheck(Mundo) == 'left'){
          return update(Mundo, {});
      } else {
        if (gridWallCheck(snakeHeadGridLocation(Mundo.branches, snakeHeadGridLocationAux("x", first(Mundo.snakeBody).x), snakeHeadGridLocationAux("y", first(Mundo.snakeBody).y)), "right") == false){
        pasolab.setVolume(1);
        pasolab.play();
        return (update(Mundo, {mode: {type:3, option:0}, dir:{x:1, y:0}, frameMovementSnake: 1, snakeBody: moveSnake(Mundo.snakeBody, {x:1.275, y:0})}));
        } else {
          labent.stop();
          golpe.setVolume(0.2);
          golpe.play();
          fondolab.stop();
          fondo.loop(1);
          return (update(Mundo, {mode: {type:2, option: 0.51}, snakeBody: (levelsdesignAux(Mundo.currentLevel, Mundo)).snakeBody, snakeSpeed: "slow", dir: { x: 1, y: 0 }, frameMovementSnake: 1, snakeMovePerFrame: false,level: levelsdesign(nextLevel(Mundo.currentLevel)), frameMovementSnake: 1, currentLevel: nextLevel(Mundo.currentLevel), score:{toShowScore: Mundo.score.toShowScore + Mundo.score.accumulateScore, accumulateScore: 0}, signNumbers: []}));
        }
      }} else if (keyCode == LEFT_ARROW){
         if(dirCheck(Mundo) == 'right'){
          return update(Mundo, {});
      } else {
        if (gridWallCheck(snakeHeadGridLocation(Mundo.branches, snakeHeadGridLocationAux("x", first(Mundo.snakeBody).x), snakeHeadGridLocationAux("y", first(Mundo.snakeBody).y)), "left") == false){
        pasolab.setVolume(1);
        pasolab.play();
        return (update(Mundo, {mode: {type:3, option:0}, dir:{x:-1, y:0}, frameMovementSnake: 1, snakeBody: moveSnake(Mundo.snakeBody, {x:-1.275, y:0})}));
        } else {
          labent.stop;
          golpe.setVolume(0.2);
          golpe.play();
          fondolab.stop();
          fondo.loop(1);
          return (update(Mundo, {mode: {type:2, option: 0.51}, snakeBody: (levelsdesignAux(Mundo.currentLevel, Mundo)).snakeBody, snakeSpeed: "slow", dir: { x: 1, y: 0 }, frameMovementSnake: 1, snakeMovePerFrame: false,level: levelsdesign(nextLevel(Mundo.currentLevel)), frameMovementSnake: 1, currentLevel: nextLevel(Mundo.currentLevel), score:{toShowScore: Mundo.score.toShowScore + Mundo.score.accumulateScore, accumulateScore: 0}, signNumbers: []}));
        }
      }} else {
        fondolab.stop();
      return (update(Mundo, {}));
      }
    } else {
      return (update(Mundo, {}));
    }
  }
 }

/*
Contrato: Mundo -> JSON (después del llamado de la función update)
Propósito: Administrar el funcionamiento de las acciones de teclado durante la pantalla de victoria.
Prototipo: onKeyEventVictoryScreen
Ejemplo: onKeyEventVictoryScreen -> (suponiendo que keyCode == 13(enter)) -> update(Mundo, {mode:{type:1, option:1}, snakeBody: [{ x: 12, y: 10}, { x: 11, y: 10 }, { x: 10, y: 10 }], snakeSpeed: "slow", dir: { x: 1, y: 0 }, frameMovementSnake: 1, snakeMovePerFrame: false,  level:{solidObjects: [], food: [], slabs: []}, lives: 2, currentLevel: "1-1", score: {toShowScore: 0, accumulateScore: 0}, score2: {toShowScore: 0, accumulateScore: 0}, signNumbers: [], branches: []})
*/
function onKeyEventVictoryScreen(Mundo){
  if (keyCode == 13){
    return (update(Mundo, {mode:{type:1, option:1}, snakeBody: [{ x: 12, y: 10}, { x: 11, y: 10 }, { x: 10, y: 10 }], snakeSpeed: "slow", dir: { x: 1, y: 0 }, frameMovementSnake: 1, snakeMovePerFrame: false, /*||Escenario||*/ level:{solidObjects: [], food: [], slabs: []},  /*||HUD||*/ lives: 2, currentLevel: "1-1", score: {toShowScore: 0, accumulateScore: 0}, score2: {toShowScore: 0, accumulateScore: 0}, signNumbers: [], branches: []}));
  } else {
    return (update(Mundo, {}));
  }
}

/*
Contrato: Mundo -> JSON (después del llamado de la función update)
Propósito: Administrar el funcionamiento de las acciones de teclado durante la pantalla de perdida.
Prototipo: onKeyEventLostScreen
Ejemplo: onKeyEventLostScreen -> (suponiendo que keyCode == 13(enter)) -> update(Mundo, {mode:{type:1, option:1}, snakeBody: [{ x: 12, y: 10}, { x: 11, y: 10 }, { x: 10, y: 10 }], snakeSpeed: "slow", dir: { x: 1, y: 0 }, frameMovementSnake: 1, snakeMovePerFrame: false,  level:{solidObjects: [], food: [], slabs: []}, lives: 2, currentLevel: "1-1", score: {toShowScore: 0, accumulateScore: 0}, score2: {toShowScore: 0, accumulateScore: 0}, signNumbers: [], branches: []})
*/
function onKeyEventLostScreen(Mundo){
  if (keyCode == 13){
    return (update(Mundo, {mode:{type:1, option:1}, currentLevel: "1-1"}))
  } else {
    return (update(Mundo, {}));
  }
}


/*
Contrato: Mundo -> function (update)
Propósito: Esta función determina las acciones que se realizan con los eventos del teclado, derivando a funciones auxiliares dependiendo del tipo de modo de juego.
Prototipo: onKeyEvent(Mundo)
Ejemplo: onKeyEvent(Mundo) -> (suponiendo que mundo.mode.type == 1) -> onKeyEventMenuMode(Mundo)
*/

function onKeyEvent(Mundo, keyCode){
  if (Mundo.mode.type == 0){
    return (update(Mundo, {}));
  } else if (Mundo.mode.type == 1){
    return (onKeyEventMenuMode(Mundo));
  } else if (Mundo.mode.type == 2){
    return (onKeyEventGameMode(Mundo));
  } else if (Mundo.mode.type == 4){
    return (onKeyEventInstructiosMode(Mundo));
  } else if (Mundo.mode.type == 3){
    return (onKeyEventLab(Mundo));
  } else if (Mundo.mode.type == -1){
    return (onKeyEventCredits(Mundo))
  } else if (Mundo.mode.type == 5){
    return (onKeyEventVictoryScreen(Mundo));
  } else {
    return (onKeyEventLostScreen(Mundo));
  }
}

/*
Contrato: 6 coodenadas, JSON (object) -> list
Propósito: Esta función la podemos usar para diseñar los niveles de forma más rápida, ya que retorna una lista de objetos con todas las coordenas dentro del área establecida, con las indicaciones que les queramos añadir.
Prototipo: drawFiller(coorx1, coory1, coorx2, coory2, coorx3, coory3, obj){...}
Ejemplo: onTicMenuMode(1, 0, 2, 0, 2, 0, obj) -> { x: 2, 0, obj } 
*/

function drawFiller(coorx1, coory1, coorx2, coory2, coorx3, coory3, obj){
  if ((coorx2 == coorx3) && (coory2 == coory3)){
    return (cons(update({x:coorx3, y:coory3}, obj), []));
  } else if (coorx2 == coorx3){
    return (cons(update({x:coorx3, y:coory3}, obj), drawFiller(coorx1, coory1, coorx2, coory2, coorx1, coory3 + 1, obj)));
  } else {
    return (cons(update({x:coorx3, y:coory3}, obj), drawFiller(coorx1, coory1, coorx2, coory2, coorx3 + 1, coory3, obj)));
  }
}

