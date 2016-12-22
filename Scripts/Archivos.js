// ------------------------------- ARCHIVOS JS  ------------------------------- 

//ELEMENTOS DEL DOM
var uploader = document.getElementById('uploader');
var fileButton = document.getElementById('fileButton');
var inputNombreArchivo = document.getElementById('inputNombreArchivo');

var percentage = 0;
var fileToUpload;
var task;


//listen for file selection
fileButton.addEventListener('change', function(e){
	//Get file
	fileToUpload = e.target.files[0];
	UploadFile(fileToUpload);
});



function UploadFile(fileToUpload){
	if (confirm('Una vez confirmes este cuadro de diálogo, se enviará el siguiente archivo:\n'+fileToUpload.name)) {
	   	//Conocer el grupo del Usuario
		var name = firebase.auth().currentUser.displayName;
		var usuarioLocalizacion = database.ref('LocalizarUsuarios/' + name);
		usuarioLocalizacion.orderByValue().on("value", function(data) {
		 	data.forEach(function(snapshot) {
		   		var grupo = snapshot.key;
		   		BDguardarArchivo(fileToUpload, grupo);
		  	});
		});
	}

	function BDguardarArchivo(fileToUpload, grupo){
		//Enviar el archivo a su ruta
				//Storage Ref
			var storageRef = firebase.storage().ref('Archivos/').child(grupo).child(fileToUpload.name);
				//GET METADATA
			var metadata = {
			  customMetadata: {'nombreSegunUsuario': inputNombreArchivo.value} 
			}
				//Upload file
			task = storageRef.put(fileToUpload);

			//Task managers
			task.on('state_changed',
			function progress(snapshot){
				//Progress bar
				percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
				uploader.value = percentage;
			},

			function error(err){
				alert("OH OH... Esto apena.\nHubo un error al cargar tu archivo.");
			},

			function complete(){
				//METADATA WRITE
					//Get download url and write on DB
				storageRef.getDownloadURL().then(function(url){
					guardarArchivoEnBD(firebase.auth().currentUser.displayName , url, inputNombreArchivo.value);
					  //Vaciar campos
					inputNombreArchivo.value ="";
				}).catch(function(error) {
				    console.error(error);
			 	});

				storageRef.updateMetadata(metadata).catch(function(error) {
				  console.log("ERROR AL CARGAR METADATA");
				});
			}
			);
	}
}




//MOSTRAR ARCHIVOS EN TIEMPO REAL---------------------------

//----AÑADIR DATOS DE ARCHIVO A LA BD REALTIME
function DBalmacenarArchivo(grupo, urlDescarga, nombreSegunUsuario) {
  firebase.database().ref('Archivos/'+ grupo).push({
    url : urlDescarga,
    nombreA : nombreSegunUsuario
  });
 }


//GUARDA EL MENSAJE EN LA BASE DE DATOS EN LA DIR ARCHIVOS/grupodelusuario
function guardarArchivoEnBD(name, urlDescarga, nombreSegunUsuario){
	//Primero se localiza al usuario para saber a que grupo pertenece
	var usuarioLocalizacion = database.ref('LocalizarUsuarios/' + name);
	usuarioLocalizacion.orderByValue().on("value", function(data) {
   		data.forEach(function(data) {
   			var grupo = data.key;
   			//Se almacena todo con el formato dentro de la sig. función
   	 		DBalmacenarArchivo( grupo, urlDescarga, nombreSegunUsuario);	   
  		});
	});
}


//MOSTRAR ARCHIVOS EN TIEMPO REAL---------------------------
function mostrarArchivos(nombre){
	//VERIFICAR LA RUTA (GRUPO DEL USUARIO)
	var pertenenciaUsuario = database.ref('LocalizarUsuarios/' + nombre);
	pertenenciaUsuario.on('value', function(snapshot) {
		snapshot.forEach(function(data) {
			var grupo = data.key;
	  		recoleccionDeDatosArchivos(grupo);
	  	});
	});
	//RECOLECCIÓN DE DATOS DE LOS ARCHIVOS YA EN BD
	function recoleccionDeDatosArchivos(grupo){
		var anuncios = database.ref('Archivos').child(grupo);
		anuncios.on('child_added', function(data) {
				var urlDescarga = data.val().url;
				var nombreSegunUsuario = data.val().nombreA;
   				
   				mostrarArchivos2(urlDescarga, nombreSegunUsuario);
   			
		});

	}
	//MOSTRAR CON EL FORMATO DEBIDO
	function mostrarArchivos2(urlDescarga, nombreSegunUsuario){
		//Lista de archivos
		var list = document.getElementById('archivos');
		//items (nombre fecha)
		var info = document.createElement('li');
		info.innerText = (nombreSegunUsuario);
		//contenido
		var item = document.createElement('a');
		item.innerText = ("\t[DESCARGAR]");
		item.href = urlDescarga;
		//Crear item y mostrarlo en la appView
		list.insertBefore(info, list.childNodes[0]);
		info.appendChild(item);
	}
}













