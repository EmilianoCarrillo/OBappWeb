// ------------------------------- ANUNCIOS JS  ------------------------------- 

	// Click en el boton de añadir tarea
	// si hay texto dentro de item, añadir ese item a la lista
	document.getElementById('addAnuncio').addEventListener('click', function() {
		var value = document.getElementById('itemAnuncios').value;
		if (value) {
			addItemAnuncios(value);
			document.getElementById('itemAnuncios').value = '';
		}
	});

	// Agregar item a la lista de anuncios
	function addItemAnuncios(text) {
		//Ver la fecha en la que éste ingresa
		var fecha = new Date();
		var minutos;

		if (fecha.getMinutes()<10){ minutos = "0" + fecha.getMinutes();} 
		else {minutos = fecha.getMinutes();}

		var fechaAnuncio = " (" + fecha.getDate() + "/" + (fecha.getMonth() +1) + "/" + fecha.getFullYear()+" "+  
		fecha.getHours() + ":"+ minutos +") "+ ":\n";

		var user = firebase.auth().currentUser;
		guardarMensajeEnBD(user.displayName, text, fechaAnuncio);

	}

// ------------------------------------------------------FIREBASE---------------------------------------------------

//----AÑADIR DATOS DE ANUNCIO A LA BD REALTIME
function DBalmacenarAnuncio(grupoTablon, autor, mensaje, fecha) {
  firebase.database().ref('Anuncios/'+ grupoTablon).push({
    autor: autor,
    mensaje: mensaje,
    fecha: fecha
  });
 }


//GUARDA EL MENSAJE EN LA BASE DE DATOS EN LA DIR ANUNCIOS/grupodelusuario
function guardarMensajeEnBD(name, contenido, fecha){
	//Primero se localiza al usuario para saber a que grupo pertenece
	var usuarioLocalizacion = database.ref('LocalizarUsuarios/' + name);
	usuarioLocalizacion.orderByValue().on("value", function(data) {
   		data.forEach(function(data) {
   			var grupoAlmacen = data.key;
   			//Se almacena todo con el formato dentro de la sig. función
   	 		DBalmacenarAnuncio( grupoAlmacen, name, contenido, fecha);	   
  		});
	});
}


//MOSTRAR ANUNCIOS EN TIEMPO REAL---------------------------
function mostrarAnuncios(nombre){
	//VERIFICAR LA RUTA (GRUPO DEL USUARIO)
	var pertenenciaUsuario = database.ref('LocalizarUsuarios/' + nombre);
	pertenenciaUsuario.on('value', function(snapshot) {
		snapshot.forEach(function(data) {
			var grupo = data.key;
	  		recoleccionDeDatosAnuncios(grupo);
	  		 //NOMBRE DEL GRUPO
          document.getElementById('nombreGrupo').innerHTML = grupo;
          	//Nombre del archivo del horario
          	mostrarHorario(grupo);
	  	});
	});
	//RECOLECCIÓN DE DATOS DE LOS ANUNCIOS YA EN BD
	function recoleccionDeDatosAnuncios(grupo){
		var anuncios = database.ref('Anuncios').child(grupo);
		anuncios.on('child_added', function(data) {
				var autor = data.val().autor;
   				var fecha = data.val().fecha;
   				var mensaje = data.val().mensaje;
   				
   				mostrarAnuncios(autor, fecha, mensaje);
		});

	}
	//MOSTRAR CON EL FORMATO DEBIDO
	function mostrarAnuncios(nombre, fecha, contenido){
		//Lista de anuncios
		var list = document.getElementById('anuncios');
		//items (nombre fecha)
		var info = document.createElement('li');
		info.innerText = (nombre + fecha);
		//contenido
		var item = document.createElement('h2');
		item.innerText = (contenido);
		//Crear item y mostrarlo en la appView
		list.insertBefore(info, list.childNodes[0]);
		info.appendChild(item);
	}
}