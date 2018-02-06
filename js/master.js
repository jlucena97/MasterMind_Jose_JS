let masterMind = (function(){
		//Varaibles del programa
			let colores = ["red","white","black","yellow","orange","brown","blue","green"];
			let random = [];
			let elegidos = [];
			let acertadas = [];
			let restantes = [];
			let copiaPosiciones = [];
			let win = 0;
			//Copias
			let copiaRandom = [];
			let copiaElegidos = [];
			//Contadores Negras y Blancas
			let negras = 0;
			let blancas = 0;

			//Recogemos los elementos con dichas clases
			let resultados;
			let posiciones;
			let img = document.getElementById("img");
			let h1 = document.getElementById("ganador");
			let colors = document.getElementsByClassName("color");
			let container = document.getElementById("resultado");

		//Funcion init que inicializa y crea una serie aleatoria de 4 colores
		function init(){
			//Reinicializa el array random cada vez que se crea una nueva partida
			random = [];
			//Oculta el boton salir
			salir.style = "display:none";
			//Elimina la funcionalidad anterior del boton comprobar 
			comprobar.removeEventListener("click",reiniciar);
			//Le damos una nueva funcionalidad al boton comprobar
			comprobar.addEventListener("click",generarElegidas);
			//Deshabilitamos el boton comprobar
			comprobar.disabled = true;
			//Le quitamos el estilo
			comprobar.style = " ";

			//Asignamos la colecction que nos devuelve el byclassname a resultado y lo mismo para posiciones
			resultados = document.getElementsByClassName("result");
			posiciones = document.getElementsByClassName("option");
			//Llamamos a los métodos que le dan funcionalidad a los botones
			funcionalidadBotones();
			funcionalidadColores();
			//Invalidamos los botones
			for (var i = 0; i < resultados.length; i++) {
				resultados[i].disabled = true;
			}
			//Creamos los 4 colores aleatorios de los 8 establecidos
			for (var b = 0; b < 4; b++) {
				let numAleatorio = Math.floor(Math.random() * colores.length);
				random.push(colores[numAleatorio]);
			}
		}

		//Función que quita el color y devuelve al boton a su estado inicial
		let quitarColor = function(){
			this.value = "w";
			this.style.background = "grey";
			//Lo eliminamos de los arrays donde se haya podido almacenar el color anterior
			//restantes.splice(restantes.indexOf(this.value),1);
			//copiaPosiciones.splice(copiaPosiciones.indexOf(this.value),1);
			//Deshabilitamos el boton comprobar
			comprobar.disabled = true;	
			comprobar.style = " ";
		}

		//Método dibujar que como dice el nombre dibuja los colores objetivos dependiendo del color asignado
		let dibujar = function(){
			let restantes = [];
			for (var i = 0; i < posiciones.length; i++) {
				if(posiciones[i].value === "w"){
					//Los que todavía no esten pintados se añaden a un array
					restantes.push(posiciones[i]);
				}
			}
			if(restantes.length !== 0){
				//Modificamos el valor del primer elemento no pintado y su color
				restantes[0].value = this.value;
				restantes[0].style.background=this.value;
				//Lo asignamos a un array copia que manejaremos para comprobar los 4 colores elegidos
				if(copiaPosiciones.length !== 4){
					copiaPosiciones.push(restantes[0]);
				}
			}
			if(restantes.length <= 1){
				//Si se ha completado la fila activamos el boton
				comprobar.disabled = false;
				comprobar.style = "opacity: 1;";
			}	
		}

		//Le damos funcionalidad a los botones o circulos objetivo
		let funcionalidadBotones = function(){
			for (var a = 0; a < posiciones.length; a++) {
				posiciones[a].addEventListener("click",quitarColor);
				//posiciones[a].style.cursor = "pointer";
			}
		}
		//Coloreamos los botones con colores y les damos funcionalidad
		let funcionalidadColores = function(){
			for (var c = 0; c < colors.length; c++) {
				colors[c].style.background = colors[c].value;
			}
			//Pasamos los elementos de las clases a arrays
			for (var i = colors.length - 1; i >= 0; i--) {
				colors[i].addEventListener("click",dibujar);
			}
		}

		//Añade una nueva fila de botones objetivos, los recoge y les da funcionalidad
		let nuevoIntento = function(){
			container.insertAdjacentHTML('beforeend','<div>'+
				'<button class="option" value="w"></button> '+
				'<button class="option" value="w"></button> '+
				'<button class="option" value="w"></button> '+
				'<button class="option" value="w"></button> '+
				'<span class="space"></span> '+
				'<button class="result" value="v"></button> '+
				'<button class="result" value="v"></button> '+
				'<button class="result" value="v"></button> '+
				'<button class="result" value="v"></button> '+
				'</div><br/>');

			funcionalidadBotones();
			goToScrollIntentos();
		}

		//Método que mantiene siempre visible la nueva linea
		let goToScrollIntentos = function(){
			container.scrollTo(container.scrollHeight,0);
		}
		//Método que pasa a un array los 4 elementos elegidos
		let generarElegidas = function(){
			//Se reiniciliza las variables cada vez que se le da al boton comprobar
			acertadas = [];
			elegidos = [];
			copiaElegidos = [];
			copiaRandom = [];
			win = 0;
			negras = 0;
			blancas = 0;
			//Deshabilitamos el boton comprobar
			comprobar.disabled = true;
			comprobar.style = " ";

			for (var i = 0; i < copiaPosiciones.length; i++) {
				elegidos.push(copiaPosiciones[i].value);
				console.log(copiaPosiciones[i].value);
				copiaPosiciones[i].disabled = true;
				copiaPosiciones[i].style.cursor = "not-allowed";
			}
			//Reincializamos el array copiaPosiciones que recoge los elementos nuevos (filas nuevas)
			copiaPosiciones = [];
			//Llamamos a los métodos que desarrollan el programa
			generarCopias();
			comprobarCoincidencia();
			//Si no ha ganadado muestra un nuevo intento
			if(mostrarResultado()){
				nuevoIntento();
			}

		}
		//Método mostrar (Solo sirve para ver los distintos colores aleatorio y el elegido por el usuario)
		let mostrar = function(){
			for (var i = 0; i < random.length; i++) {
				console.log(random[i]);
			}
		}

		//Generamos copias del elegido por el usuario y por el random para poder modificarlo y comprobar su similitud
		let generarCopias = function(){
			for (var i = 0; i < random.length; i++) {
				copiaRandom.push(random[i]);
			}
			for (var a = 0; a < elegidos.length; a++) {
				copiaElegidos.push(elegidos[a]);
			}
		}

		//El método más importante, que comprueba si hemos acertado un color o si hemos acertado color y posición.
		function comprobarCoincidencia(){
			for (var i = 0; i < random.length; i++) {
				if(random[i] === elegidos[i]){
					//Añadimos a un array acertados los elementos acertados.
					negras++;
					acertadas.push("black");
					copiaRandom[i] = 2;
					copiaElegidos[i] = 0;
				}
			}
			for (var a = 0; a < copiaElegidos.length; a++) {
					if(copiaRandom.indexOf(copiaElegidos[a]) != -1){
						copiaRandom[copiaRandom.indexOf(copiaElegidos[a])] = 1;
						blancas++;
						acertadas.push("white");
					}
				}
			}
		//Mostramos el resultado en su linea respectiva
		let mostrarResultado = function(){
			let restantesEspacios = [];
			for (var i = 0; i < resultados.length; i++) {
				if(resultados[i].value === "v"){
					restantesEspacios.push(resultados[i]);
				}
			}
			for (var c = 0; c < restantesEspacios.length; c++) {
				restantesEspacios[c].value="f";
				if(negras > c){
					restantesEspacios[c].style.background = "black";
				}
				if(c >= negras){
					//console.log((negras+blancas));
					if((negras + blancas) > c){
						restantesEspacios[c].style.background = "white";
					}
				}
			}
			//Comprobamos si ha ganado	
			if(negras === 4){
				//Indicamos que ha ganado
				h1.innerHTML = "HAS GANADO!!";
				comprobar.style = "width: 75px; height:75px; opacity: 1;";
				img.src="imagenes/restart.png";
				//Eliminamos el anterior comportamiento de comprobar y le damos uno nuevo
				comprobar.removeEventListener("click",generarElegidas);
				comprobar.addEventListener("click",reiniciar);
				//Habilitams el boton comprobar
				comprobar.disabled = false;
				//Mostramos el boton salir
				salir.style = "display:block";
				//Deshabilitamos los botones de los colores
				for (var a =  0; a < colors.length; a++) {
					colors[a].disabled=true;
				}
				//Deshabilitamos los botones objetivos
				for (var i = 0; i < posiciones.length; i++) {
					posiciones[i].disabled = true;
				}
				return false;
			}
			return true;
		}

		//Método limpiar que crea un nueva fila de botones objetivo
		let limpiar = function(){
			container.innerHTML = '<div>'+
				'<button class="option" value="w"></button> '+
				'<button class="option" value="w"></button> '+
				'<button class="option" value="w"></button> '+
				'<button class="option" value="w"></button> '+
				'<span class="space"></span> '+
				'<button class="result" value="v"></button> '+
				'<button class="result" value="v"></button> '+
				'<button class="result" value="v"></button> '+
				'<button class="result" value="v"></button> '+
				'</div><br/>';
		}

		//Método reiniciar que devuelve los valores iniciales
		let reiniciar = function(){
			h1.innerHTML = "Mastermind";
			img.src="imagenes/check.png";
			for (var a =  0; a < colors.length; a++) {
					colors[a].disabled=false;
			}
			for (var i = 0; i < posiciones.length; i++) {
				posiciones[i].value = "w";
				posiciones[i].style.background = "grey";
			}
			for (var b = 0; b < resultados.length; b++) {
				resultados[b].style.background = "orange";
			}
			limpiar();
			init();
		}
		
		return{
			init:init,
			mostrar:mostrar,
			comprobar:comprobarCoincidencia,
			resultado:mostrarResultado
		}
	})();

window.onload = () => {
	let salir = document.getElementById("salir");
	let comprobar = document.getElementById("comprobar");
	masterMind.init();	
}
