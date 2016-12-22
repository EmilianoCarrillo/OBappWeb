$(document).ready(function(){
			   $('#footer').css({
						'visibility' : 'visible'
				});
			   showHamburgerMenu();
			});



/*------------------SCROLL FOOTER SHOW----------------------*/
 window.addEventListener("resize", BgFix);

 function BgFix(){

 	var window_height		=  	$(window).height(),
		window_width		=	$(window).width();

 	if( window_width<800 && window_width<window_height ){
		$('#bgVid').css({
			'visibility' : 'hidden'
		})
		$('#altBgPortrait').css({
			'visibility' : 'visible'
		})
		$('#altBgLandscape').css({
			'visibility' : 'hidden'
		})
	} else if(window_width<800 && window_width>window_height ){
		$('#bgVid').css({
			'visibility' : 'hidden'
		})
		$('#altBgPortrait').css({
			'visibility' : 'hidden'
		})
		$('#altBgLandscape').css({
			'visibility' : 'visible'
		})
	} else {
		$('#bgVid').css({
			'visibility' : 'visible'
		})
		$('#altBgPortrait').css({
			'visibility' : 'hidden'
		})
		$('#altBgLandscape').css({
			'visibility' : 'hidden'
		})
	}

 }

$(window).scroll(function(){

	var	wScroll 			=  $(window).scrollTop(),
		foreground_height 	=  $("#presentation").height();

	var window_height		=  	$(window).height(),
		window_width		=	$(window).width(),
		inicio_height		=  	$("#INICIO").height(),
		footer_height		= 	$("#footer").height();


/*-----------------------------ADJUST BG BY SCROLL AND BY DEVICE------------------------------*/
    

    if(wScroll > foreground_height) {
		$('.bgMainVideoContainer').css({
			'visibility' : 'hidden'
		})
	} else if( window_width<800 && window_width<window_height ){
		$('#bgVid').css({
			'visibility' : 'hidden'
		})
		$('#altBgPortrait').css({
			'visibility' : 'visible'
		})
		$('#altBgLandscape').css({
			'visibility' : 'hidden'
		})
	} else if(window_width<800 && window_width>window_height ){
		$('#bgVid').css({
			'visibility' : 'hidden'
		})
		$('#altBgPortrait').css({
			'visibility' : 'hidden'
		})
		$('#altBgLandscape').css({
			'visibility' : 'visible'
		})
	} else {
		$('#bgVid').css({
			'visibility' : 'visible'
		})
		$('#altBgPortrait').css({
			'visibility' : 'hidden'
		})
		$('#altBgLandscape').css({
			'visibility' : 'hidden'
		})
	}



/*-----------------------------MENU RESPONSIVE (PIN UP)------------------------------*/
	 if(wScroll > (foreground_height-1)) {
		$('.pinMenu').css({
			'height'	 : '60px',
			'transition' : '.5s height'
		})
	} else {
		$('.pinMenu').css({
			'height'	 : '0px',
			'transition' : '.5s height'

		})
	}
 


});


/*-----------------------------MENU RESPONSIVE (HAMBURGER MENU)------------------------------*/
	function validate() {
        if (document.getElementById('nav-trigger').checked) {
            $('#hamburgerMenu').css({
			'visibility' : 'visible',
			'height'	 : '100%',
			'transition' : '.2s height'
			})
        } else {
             $('#hamburgerMenu').css({
			'visibility' : 'visible',
			'height'	 : '0%',
			'transition' : '.2s height'
			})
        }
    }

/*------HIDE HAMBURGER, YOU FAT BITCH------------------------------*/
 window.addEventListener("resize", showHamburgerMenu);

 function showHamburgerMenu(){
 	var window_height		=  	$(window).height(),
		window_width		=	$(window).width();

 	if(window_width<800){
 		$('#hamburgerMenu').css({
			'visibility' : 'visible',
		})
		$('label').css({
			'visibility' : 'visible',
		})
		$('.menu').css({
			'visibility' : 'hidden',
		})
	} else {
		$('#hamburgerMenu').css({
			'visibility' : 'hidden',
		})
		$('label').css({
			'visibility' : 'hidden',
		})
		$('.menu').css({
			'visibility' : 'visible',
		})		
	}


 }


//AQUÍ CAMBIÉ
function closeHam(){
	$('#hamburgerMenu').css({
			'height'	 : '0%',
			'transition' : '.2s height'
		})
	document.getElementById("nav-trigger").checked = false;
}








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
 

// -----AVISOS UPDATE-----------------------------------

const dbAvisosObject	= database.ref('Avisos');
const avisosTitulos 		= document.getElementById('avisosTitulo');
const avisosContenidos 	= document.getElementById('avisosContenido');
const avisosInfos 	= document.getElementById('avisosInfo');

	//Actualizar en vivo el título de los avisos
dbAvisosObject.child('avisosTitulo').on('value', function(snapshot) {
	avisosTitulos.innerText = JSON.stringify(snapshot.val(), null, 0).replace(/\"/g, "");
});

//Actualizar en vivo el contenido del mismo
dbAvisosObject.child('avisosContenido').on('value', function(snapshot) { 
	avisosContenidos.innerText = JSON.stringify(snapshot.val(), null, 0).replace(/\"/g, "");
});

//Actualizar en vivo la info del mismo
dbAvisosObject.child('avisosInfo').on('value', function(snapshot) { 
	avisosInfos.innerText = JSON.stringify(snapshot.val(), null, 0).replace(/\"/g, "");
});
  


//AUTH LISTENER:
	//MOSTRAR/OCULTAR BOTONES DE INICIO/CERRAR SESIÓN DEPENDIENDO DEL ESTADO DEL USUARIO

	var IniciarSesionBtn= document.getElementsByClassName('mI');
	var HamburgerISBtn	= IniciarSesionBtn[0];
	var ForegroundISBtn	= IniciarSesionBtn[1];
	var PinUpISBtn	= IniciarSesionBtn[2];

	var CerrarSesionBtn= document.getElementsByClassName('mC');
	var HamburgerCSBtn	= CerrarSesionBtn[0];
	var ForegroundCSBtn	= CerrarSesionBtn[1];
	var PinUpCSBtn	= CerrarSesionBtn[2];

	var premiumItems= document.getElementsByClassName('premium');
	var premium0	= premiumItems[0];
	var premium1	= premiumItems[1];
	var premium2	= premiumItems[2];
	var premium3	= premiumItems[3];
	var premium4	= premiumItems[4];
	var premium5	= premiumItems[5];


firebase.auth().onAuthStateChanged( function(firebaseUser) {


    	//Usuario con sesión iniciada primero
    	if (firebaseUser){
        	console.log('- SESIÓN INICIADA -');

        	//User Information store
          var user = firebase.auth().currentUser;
          var name, email, photoUrl, uid;

          if (user != null) {
            name = user.displayName;
            email = user.email;
            photoUrl = user.photoURL;
            uid = user.uid; 
          }

          console.log(name + ": " + email);

         //BIENVENIDA
          document.getElementById('Welcome').innerHTML = "Hola, " + user.displayName;


          //Arreglar premium tabs
			HamburgerISBtn.style.display = 'none';
        	ForegroundISBtn.style.display = 'none';
        	PinUpISBtn.style.display = 'none';
        	//
        	HamburgerCSBtn.style.display = 'block';
        	ForegroundCSBtn.style.display = 'block';
        	PinUpCSBtn.style.display = 'block';

        	for (var i = 0; i <=6; i++) {
        		premiumItems[i].style.display = 'block';
        		premiumItems[i].innerText = "MI GRUPO";
        	}


      	} else{
        	console.log('- NO HAY SESIÓN INICIADA -');

        	 //BIENVENIDA
          document.getElementById('Welcome').style. display = 'none';

        	HamburgerCSBtn.style.display = 'none';
        	ForegroundCSBtn.style.display = 'none';
        	PinUpCSBtn.style.display = 'none';
        	//
        	HamburgerISBtn.style.display = 'block';
        	ForegroundISBtn.style.display = 'block';
        	PinUpISBtn.style.display = 'block';

        	for (var i = 0; i <=6; i++) {
        		premiumItems[i].style.opacity = "0.3";
        		premiumItems[i].style.pointerEvents = "none";
        		premiumItems[i].innerText = "Inicia Sesión para entrar a \"Mi Grupo\"";
        	}

      	}
    });


//PARA CERRAR SESIÓN ---------------------
function CerrarSesion(){
        firebase.auth().signOut().then(function() {
		  console.log("- EL USUSARIO CERRÓ SESIÓN -");
		}, function(error) {
		  console.log("ERROR: Hubo un error al querer cerrar sesión.");
		});
}




