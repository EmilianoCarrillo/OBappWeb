// ------------------------------- TAREAS JS  ------------------------------- 

//-----------------Empty all inputs 
document.getElementById('itemTareasDescripcion').value = '';
			document.getElementById('inputTareaMateria').value = '';
			document.getElementById('inputTareaFecha').value = '';
			document.getElementById('itemTareasDescripcion').value = '';

//-----------------Formato (estados) de los botónes
var removeSVG = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 22 22" style="enable-background:new 0 0 22 22;" xml:space="preserve"><rect class="noFill" width="22" height="22"/><g><g><path class="fill" d="M16.1,3.6h-1.9V3.3c0-1.3-1-2.3-2.3-2.3h-1.7C8.9,1,7.8,2,7.8,3.3v0.2H5.9c-1.3,0-2.3,1-2.3,2.3v1.3c0,0.5,0.4,0.9,0.9,1v10.5c0,1.3,1,2.3,2.3,2.3h8.5c1.3,0,2.3-1,2.3-2.3V8.2c0.5-0.1,0.9-0.5,0.9-1V5.9C18.4,4.6,17.4,3.6,16.1,3.6z M9.1,3.3c0-0.6,0.5-1.1,1.1-1.1h1.7c0.6,0,1.1,0.5,1.1,1.1v0.2H9.1V3.3z M16.3,18.7c0,0.6-0.5,1.1-1.1,1.1H6.7c-0.6,0-1.1-0.5-1.1-1.1V8.2h10.6V18.7z M17.2,7H4.8V5.9c0-0.6,0.5-1.1,1.1-1.1h10.2c0.6,0,1.1,0.5,1.1,1.1V7z"/></g><g><g><path class="fill" d="M11,18c-0.4,0-0.6-0.3-0.6-0.6v-6.8c0-0.4,0.3-0.6,0.6-0.6s0.6,0.3,0.6,0.6v6.8C11.6,17.7,11.4,18,11,18z"/></g><g><path class="fill" d="M8,18c-0.4,0-0.6-0.3-0.6-0.6v-6.8c0-0.4,0.3-0.6,0.6-0.6c0.4,0,0.6,0.3,0.6,0.6v6.8C8.7,17.7,8.4,18,8,18z"/></g><g><path class="fill" d="M14,18c-0.4,0-0.6-0.3-0.6-0.6v-6.8c0-0.4,0.3-0.6,0.6-0.6c0.4,0,0.6,0.3,0.6,0.6v6.8C14.6,17.7,14.3,18,14,18z"/></g></g></g></svg>';
var completeSVG = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 22 22" style="enable-background:new 0 0 22 22;" xml:space="preserve"><rect y="0" class="noFill" width="22" height="22"/><g><path class="fill" d="M9.7,14.4L9.7,14.4c-0.2,0-0.4-0.1-0.5-0.2l-2.7-2.7c-0.3-0.3-0.3-0.8,0-1.1s0.8-0.3,1.1,0l2.1,2.1l4.8-4.8c0.3-0.3,0.8-0.3,1.1,0s0.3,0.8,0,1.1l-5.3,5.3C10.1,14.3,9.9,14.4,9.7,14.4z"/></g></svg>';


///////////////////////DATE CLAENDAR PICKER VIEW/////////////////////////
function CalendarView(){
	$('.datepicker').pickadate({
  		close: 'Cerrar',
  		min: 'true'
	});
}

//////////////////////FUNCIONES DE LOS BOTONES AL DAR CLICK/////////////////

//ELIMINAR ITEM BUTTON 
function removeItem() {
	var item = this.parentNode.parentNode.parentNode;
	var parent = item.parentNode;

	var rutaIDDescripcion = this.parentNode.parentNode.textContent; 

	parent.removeChild(item);
	EliminarTareas(rutaIDDescripcion);
}

//COMPLETAR ITEM BUTTON
function completeItem() {
	var item = this.parentNode.parentNode.parentNode;
	var parent = item.parentNode;
	var id = parent.id;
	var rutaIDDescripcion = this.parentNode.parentNode.textContent;

	// Verificar el estado de la tarea por usuario en la ruta
	var rutaABuscarCompletado = database.ref('Tareas').child(grupo);
	rutaABuscarCompletado.on("value", function(data) {
		data.forEach(function(snap) {
			var DB = snap.val().descripción;
			//utilizo la descripción de la tarea como identificador de ambos elementos
			if (DB == rutaIDDescripcion) {
				EstadoDeLaTareaParaUsuario(firebase.auth().currentUser.displayName, snap.key, id);
				FormatearEstadoDeLasTareas(item, parent, id);
			}			
  		});
  	});
}

//Escribir en la base de datos la nueva ruta (Del estado de dicha tarea)
function EstadoDeLaTareaParaUsuario(usuario, key, id){
    if (id == 'TareasPorHacer') {
    	object = {}; 
        object[usuario] = 'TareasHechas'; 
        firebase.database().ref('UsuariosYSusTareas/'+ key).update(object);
    } else {
   		object = {}; 
        object[usuario] = 'TareasPorHacer'; 
        firebase.database().ref('UsuariosYSusTareas/'+ key).update(object);
    }
}

function FormatearEstadoDeLasTareas(item, parent, id){
	// Checar si el item debe ser trasladado a hechos o de vuelta a no realizados
	var target = (id === 'TareasPorHacer') ? document.getElementById('TareasHechas'):document.getElementById('TareasPorHacer');

	parent.removeChild(item);
	target.insertBefore(item, target.childNodes[0]);
}


//AÑADIR TAREA BUTTON (SI HAY TEXTO EN TEXT AREA)
document.getElementById('addTarea').addEventListener('click', function() {
	var value = document.getElementById('itemTareasDescripcion').value;
	if (value) {
		DefinirVariablesParaEstaTarea();
		document.getElementById('itemTareasDescripcion').value = '';
		document.getElementById('inputTareaMateria').value = '';
		document.getElementById('inputTareaFecha').value = '';
	}
});

/////////////////// FUNCIONES DEL PROCESO //////////////////////

//------------ Global variables:
var autor, grupo, descripciónDeTarea, materia, fechaDeEntrega, fechaActual;

//RECUPERAR LOS DATOS DE LOS INPUTS DE LA NUEVA TAREA
function DefinirVariablesParaEstaTarea(){
	autor = firebase.auth().currentUser.displayName;
	materia = document.getElementById('inputTareaMateria').value;
	fechaDeEntrega = document.getElementById('inputTareaFecha').value;
	descripciónDeTarea = document.getElementById('itemTareasDescripcion').value;

	//Identidficar el grupo al que pertence este usuario
	var usuarioLocalizacion = database.ref('LocalizarUsuarios/' + autor);
	usuarioLocalizacion.orderByValue().on("value", function(data) {
   		data.forEach(function(data) {
   			grupo = data.key;
   			//almacenar en BD
   	 		GuardarTareaEnBD(autor, grupo, materia, fechaDeEntrega, descripciónDeTarea);
  		});
	});
}


//GUARDAR TAREA EN LA BASE DE DATOS FIREBASE
function GuardarTareaEnBD(autor, grupo, materia, fechaDeEntrega, descripciónDeTarea){
	firebase.database().ref('Tareas/'+ grupo).push({
    	autor: autor,
    	materia: materia.toUpperCase(),
		fechaDeEntrega: fechaDeEntrega,
    	descripción: descripciónDeTarea
	});
}


//MOSTRAR TAREAS EN TIEMPO REAL---------------------------
function MostrarTareas(autor){
	//Identidficar el grupo al que pertence este usuario
	var usuarioLocalizacion = database.ref('LocalizarUsuarios/' + autor);
	usuarioLocalizacion.orderByValue().on("value", function(data) {
   		data.forEach(function(data) {
   			grupo = data.key;
   			DarleFormatoALasTareas(grupo);
  		});
	});

	function DarleFormatoALasTareas(grupo){
		var tareasRuta = database.ref('Tareas').child(grupo);
		tareasRuta.on('child_added', function(data) {
			var autorBD = data.val().autor;
   			var materiaBD = data.val().materia;
   			var fechaDeEntregaBD = data.val().fechaDeEntrega;
   			var descripciónDeTareaBD = data.val().descripción;


   			var list = document.getElementById('TareasPorHacer');
			//BOTONES
			var buttons = document.createElement('div');
			buttons.classList.add('buttons');

			var remove = document.createElement('button');
			remove.classList.add('remove');
			remove.innerHTML = removeSVG;

			// Event para eliminar item
			remove.addEventListener('click', removeItem);

			var complete = document.createElement('button');
			complete.classList.add('complete');
			complete.innerHTML = completeSVG;

			// Event para realizar item
			complete.addEventListener('click', completeItem);

			//Mostrar lo recuperado de la BD
			//items (nombre fecha)
			var info = document.createElement('li');
			info.innerText = (materiaBD + " (PARA: " +fechaDeEntregaBD + ")");
			info.style.color = "#2266a2";
			//contenido
			var item = document.createElement('h2');
			item.innerText = (descripciónDeTareaBD);
			item.style.color = "black";
			//Crear item y mostrarlo en la appView
			list.insertBefore(info, list.childNodes[0]);
			info.appendChild(item);

			buttons.appendChild(remove);
			buttons.appendChild(complete);
			item.appendChild(buttons);

			ChecarImportanciaDeLaTarea(fechaDeEntregaBD, info, remove);

			var username = firebase.auth().currentUser.displayName;
			var keyT = data.key;
			var BDrefEstadoItems = firebase.database().ref('UsuariosYSusTareas/').child(keyT).child(username);

			BDrefEstadoItems.once('value').then(function(snapshot) {
			  if (snapshot.val() == 'TareasHechas'){
			  	complete.click();
			  }

			});

		});
	}
	
}


function ChecarImportanciaDeLaTarea(fechaDeLaTarea, estaTarea, remove){
	var fechaDeHoy = new Date();
	var fechaDeMañana = new Date();
	var fechaDeAyerLimite = new Date();
	fechaDeMañana.setDate(fechaDeHoy.getDate() + 1);
	fechaDeAyerLimite.setDate(fechaDeHoy.getDate() - 1);
	var formato = {weekday: "long", year: "numeric", month: "long", day: "numeric"};
	fechaDeHoy = fechaDeHoy.toLocaleDateString("es-ES", formato);
	fechaDeMañana = fechaDeMañana.toLocaleDateString("es-ES", formato);
	fechaDeAyerLimite = fechaDeAyerLimite.toLocaleDateString("es-ES", formato);

	//Si coincide con la fecha de ayer, eliminar
	if(fechaDeLaTarea == fechaDeAyerLimite){
		remove.click();
	}

	//Si coincide con la fecha de hoy o mañana (Darle formato de importancia)
	if(fechaDeLaTarea == fechaDeHoy || fechaDeLaTarea == fechaDeMañana){
		estaTarea.style.border = "solid #FF6A6A 2px";
		estaTarea.style.color = "#FF6A6A";
	} 
}




//ELIMINAR TAREAS EN TIEMPO REAL---------------------------
function EliminarTareas (rutaIDDescripcion){
	//Identidficar el grupo al que pertence este usuario
	var usuarioLocalizacion = database.ref('LocalizarUsuarios/' + firebase.auth().currentUser.displayName);
	usuarioLocalizacion.orderByValue().on("value", function(data) {
   		data.forEach(function(data) {
   			grupo = data.key;
   			ProcederAEliminar(grupo);
  		});
	});

	//Buscar cual de las tareas es (con la descripción de la misma) y ELIMINAR DE BD
	function ProcederAEliminar(grupo){
		var tareasRutaABuscarEliminacion = database.ref('Tareas').child(grupo);
		tareasRutaABuscarEliminacion.orderByValue().on("value", function(snapshot) {
			snapshot.forEach(function(data) {
				data.forEach(function(foo) {
					if (foo.key == "descripción" && foo.val() == rutaIDDescripcion) {
						var RutaAEliminar = database.ref('Tareas').child(grupo).child(data.key);
						var RutaAEliminar2 = firebase.database().ref('UsuariosYSusTareas').child(data.key).child(firebase.auth().currentUser.displayName);
						RutaAEliminar.remove();
						RutaAEliminar2.remove();
					}
	  			});
	  		});
	  	});
	}

}

	



























