# Snake Bits | FDP

Este es un pequeño proyecto realizado por los siguientes estudiantes:

* Paul Rodrigo Rojas Guerrero 
* Isabela Rosero Obando
* Jean Carlos Pasuy Recalde
* Brayan Andrés Sánchez Lozano
* Kevin Alejandro Velez Agudelo

Pertenecientes al programa de Ingeniería de Sistemas (3743), para el área de Fundamentos de programación.

## Notas 
- **Se recomienda abrir este programa en una página aparte.**
- El juego contará con la característica de tener niveles. Se acceden de uno al siguiente al consumir toda la comida en cada nivel.
- A diferencia del clásico snake, este juego tiene la característica de poder tener varios "elementos comestibles" en pantalla al mismo tiempo, a lo cual llamaremos rondas. Estas funcionan a través de la función _**placeFood**_, esta función recibe una lista de todas las listas de comida que podrán aparecer en la pantalla, las procesa y convierte en objetos con coordenadas que pueden ser localizados en el escenario.

- - **Ejemplo:** la función podrá recibir algo así: _**[["apple", "cherry"], ["apple"], ["apple", "apple"]]**_, estas frutas son colocadas dentro de la función anteriormente mencionda en un orden aleatorio, es decir, la lista principal tendrá las sublistas en desorden, podría ser: _**[["apple"], ["apple", "apple"], ["apple", "cherry"]]**_. Una vez asignado el parámetro, la función toma la primera ronda, imagínemos que fue _**["apple", "cherry"]**_, esta lista es procesada, y a cada elemento se le asigna unas coordenadas donde no se encuentre ningún objeto sólido, ni otro elemento comestible, conservando su tipo de comida, entonces, quedaría por ejemplo: _**[ { x: 33, y: 30, type: 'apple', frame: 1 }, { x: 32, y: 26, type: 'cherry', frame: 1 } ]**_ De esta manera es localizada en el mapa. Una vez la ronda quede vacía se procede a la siguiente con el mismo proceso.

- Este programa funciona de distintas formas, dependiendo del modo en el que esté, todo esto es manejado a través del objeto _**"mode"(Mundo.mode)**_, que almacena otro objeto conformado así: _**{type: número, option: número}**_, esto es usado para separar los procesos de pantalla de carga, menú, gameplay, juego perdido, etc. A continuación está su funcionamiento:

- - **Pantalla de carga ->** _**mode: {type: 0, option: número}**_, type debe ser cero, y option es el número del avance del proceso de carga.
- - **Menú ->** _**mode: {type: 1, option: número}**_, type debe ser 1, y option es la opción del menú que se encuentra seleccionado: _**option = 1 -> iniciar juego, option = 1.1 -> instrucciones.**_
- - **Gameplay ->** _**mode: {type: 2, option: número}**_, type debe ser 2, y en option se administra muchas cosas. A continuación su funcionamiento: **option = 0 ->** es cuando podemos jugar (la serpiente está viva.). **option = (número de 0,01 a 0,50), ->** estos  números indican que la serpiente no está viva y se han de comportar de igual forma, sin embargo, es útil tenerlos separados, ya que así podemos saber como perdió el jugador, **si option = 0.01 ->** el jugador chocó con un objeto sólido, y **si option = 0.02 ->** el jugador chocó contra su propio cuerpo. ** Option = (número de 0.51 a 0.99) ->** estos son distintos modos para procesar el gameplay, **si option = 0.51 ->** La serpiente no se puede mover hasta que el jugador presione alguna tecla de dirección, es el modo que está siempre que iniciamos un nivel, llámemoslo sleep. **Si option = 0.52 ->** el jugador acaba de terminar un nivel, y debe presionar enter para ir al siguiente.

## Acerca de
Este proyecto usa el lenguaje de etiquetas HTML, y el lenguaje Javascript desde distintos puntos, derivados en su mayoría de la programación funcional, el propio enfoque del curso. Estos están en la librería P5.js, en la librería functional light (estas dos desarrolladas por terceros) y finalmente en el archivo SnakeMovimiento-script.js que es aquel en el que se implementan las funciones del juego. Tiene un poco de la librería P5 sounds, de CSS y de una serie de pequeños sprites en 8-bits diseñados en su mayoría por nosotros.