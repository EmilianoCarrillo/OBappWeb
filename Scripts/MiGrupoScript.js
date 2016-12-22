
	/*–––––––––––––––––––––––––––––––––––––––––––––––––FIREBASE––––––––––––––––––––––––––––––––––––––*/


 // Initialize Firebase-----------------------------------
  var config = {
    apiKey: "AIzaSyBY36MWFRSogdhHtoq0gHry_x783v9kkrU",
    authDomain: "oficialbapp-web.firebaseapp.com",
    databaseURL: "https://oficialbapp-web.firebaseio.com",
    storageBucket: "oficialbapp-web.appspot.com",
  };
  firebase.initializeApp(config);
  const database = firebase.database();

//PARA CERRAR SESIÓN ---------------------
function CerrarSesion(){
        firebase.auth().signOut().then(function() {
		  console.log("- EL USUSARIO CERRÓ SESIÓN -");
		   window.location = "../index.html";
		}, function(error) {
		  console.log("ERROR: Hubo un error al querer cerrar sesión.");
		});
}

//----CAMBIAR DE HORARIO DEPENDIENDO DEL GRUPO
function mostrarHorario(nombreGrupo){
	var direccion = "../Multimedia/Horarios/"+ nombreGrupo + ".png";
	document.getElementById("Horario").src = direccion;
}



//CHECAR SI LA SESIÓN ESTÁ VIGENTE ------------------------------
firebase.auth().onAuthStateChanged(function(firebaseUser) {
    if (firebaseUser){
    	console.log('-SESIÓN INICIADA-');
        var user = firebase.auth().currentUser;
        var name;
        if (user != null) {
			name = user.displayName;
        }
		mostrarAnuncios(name);
    MostrarTareas(name);
    mostrarArchivos(name);
    TareaEliminada(name);
    } else{
        console.log('- NO HAY SESIÓN INICIADA -');
         window.location = "../index.html";
      }




});


///////////////////////////////RESPONSIVE DESIGN FOR MOBILE//////////////
window.addEventListener("resize", FixScrollSize);
$(window).load(FixScrollSize);


//FIX THE VIEW HEIGHTS
function FixScrollSize(){
  var windowWidth = $(window).width();
  var windowHeight = $(window).height();
  var screenWidth = window.screen.width;

  var anunciosContainerHeight = $(".AnunciosContainer").outerHeight();
  var nombreGrupoHeight = $("#nombreGrupo").outerHeight();

  var finalHeight = windowHeight - 130 - 50 - nombreGrupoHeight; 

  if (windowWidth > 425 || screenWidth > 425){
    $('#TablonDeAnuncios').css({'display'   : "block"});
    $('#Tareas').css({'display'   : "block"});
    $('#Archivos').css({'display'   : "block"});
    $('#Horario').css({'display'   : "block"});
  } 


  if (windowWidth <= 425 || screenWidth <=425) {
    $('.AnunciosContainer').css({
      'height'   : finalHeight + "px",
    })
     $('.TareasContainer').css({
      'height'   : windowHeight - 165 - 50 - nombreGrupoHeight+ "px",
    })
      $('.ArchivosContainer').css({
      'height'   : windowHeight - 110 - 50 - nombreGrupoHeight+ "px",
    })
     $('#Horario').css({
      'height'   : finalHeight +130 + "px",
    })
  } else {
    $('.AnunciosContainer').css({
      'height'   : "660px",
    })
    $('.TareasContainer').css({
      'height'   : "630px",
    })
    $('.ArchivosContainer').css({
      'height'   : "480px",
    })
    $('#Horario').css({
      'height'   : "auto",
    })
  }
}

//EVENT LISTENERS FOR BUTTONS (SHOW CONTENT AND STYLE OF BTN)
var mobileAnunciosBtn = document.getElementById('mobileAnunciosBtn');
var mobileTareasBtn = document.getElementById('mobileTareasBtn');
var mobileArchivosBtn = document.getElementById('mobileArchivosBtn');
var mobileHorarioBtn = document.getElementById('mobileHorarioBtn');

mobileAnunciosBtn.addEventListener('click', function() {
  $('#TablonDeAnuncios').css({'display'   : "block"});
  $('#Tareas').css({'display'   : "none"});
  $('#Archivos').css({'display'   : "none"});
  $('#Horario').css({'display'   : "none"});
  this.classList.add('current');
  mobileTareasBtn.classList.remove('current');
  mobileArchivosBtn.classList.remove('current');
  mobileHorarioBtn.classList.remove('current');
}, false);

mobileTareasBtn.addEventListener('click', function() {
  $('#TablonDeAnuncios').css({'display'   : "none"});
  $('#Tareas').css({'display'   : "block"});
  $('#Archivos').css({'display'   : "none"});
  $('#Horario').css({'display'   : "none"});
  this.classList.add('current');
  mobileAnunciosBtn.classList.remove('current');
  mobileHorarioBtn.classList.remove('current');
}, false);

mobileArchivosBtn.addEventListener('click', function() {
  $('#TablonDeAnuncios').css({'display'   : "none"});
  $('#Tareas').css({'display'   : "none"});
  $('#Archivos').css({'display'   : "block"});
  $('#Horario').css({'display'   : "none"});
  this.classList.add('current');
  mobileTareasBtn.classList.remove('current');
  mobileAnunciosBtn.classList.remove('current');
  mobileHorarioBtn.classList.remove('current');
}, false);


mobileHorarioBtn.addEventListener('click', function() {
  $('#TablonDeAnuncios').css({'display'   : "none"});
  $('#Tareas').css({'display'   : "none"});
  $('#Archivos').css({'display'   : "none"});
  $('#Horario').css({'display'   : "block",});
  this.classList.add('current');
  mobileAnunciosBtn.classList.remove('current');
  mobileTareasBtn.classList.remove('current');
  mobileArchivosBtn.classList.remove('current');
}, false);




















