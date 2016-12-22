$('.form').find('input, textarea').on('keyup blur focus', function (e) {
  
  var $this = $(this),
      label = $this.prev('label');

	  if (e.type === 'keyup') {
			if ($this.val() === '') {
          label.removeClass('active highlight');
        } else {
          label.addClass('active highlight');
        }
    } else if (e.type === 'blur') {
    	if( $this.val() === '' ) {
    		label.removeClass('active highlight'); 
			} else {
		    label.removeClass('highlight');   
			}   
    } else if (e.type === 'focus') {
      
      if( $this.val() === '' ) {
    		label.removeClass('highlight'); 
			} 
      else if( $this.val() !== '' ) {
		    label.addClass('highlight');
			}
    }

});

$('.tab a').on('click', function (e) {
  
  e.preventDefault();
  
  $(this).parent().addClass('active');
  $(this).parent().siblings().removeClass('active');
  
  target = $(this).attr('href');

  $('.tab-content > div').not(target).hide();
  
  $(target).fadeIn(600);
  
});


function regresar(){
  window.location = "../index.html";
}




/*–––––––––––––––––––––––––––––––––––––––––––––––––FIREBASE––––––––––––––––––––––––––––––––––––––*/




    // Obtener elementos (FORM) -----------------------------
  const txtNombre          = document.getElementById('Nombre');
  const semestre           = document.getElementById('Semestre');
  const grupo              = document.getElementById('Grupo');
  const txtEmail           = document.getElementById('Email');
  const txtContraseña      = document.getElementById('Contraseña');
  const txtContraseña2     = document.getElementById('Contraseña2');

  const txtLoginEmail      = document.getElementById('EmailLog');
  const txtLoginContraseña = document.getElementById('ContraseñaLog');

  const btnRegistrar       = document.getElementById('RegistrarBtn');
  const btnIngresar        = document.getElementById('IniciarSesionBtn');

  var updatableName;

  //FUNCIONES ADICIONALES: ------------------------------------------

    function FunctionMagica(){
         //Para no redirigir a file://// (Solo funciona, no cuestiones su poder jaja)
          $(function() { $('form').submit(function(){ return false;}); });
      }

//----AÑADIR DATOS DE USUARIO A LA BD REALTIME
function DBguardarUsuario(grado, grupo, nombre, email, contraseña) {
  if (primeraVez == false) {
    //NADA
    window.location = "../index.html";
  }else{
   //GUARDAR EL PERFIL DE USUARIO EN SU INFO 
          var user = firebase.auth().currentUser;
          var name, email, photoUrl, uid;

          user.updateProfile({
            displayName: updatableName
          }).then(function() {
            console.log("Perfil de usuario actualizado excitosamente.");
             if (user != null) {
                name = user.displayName;
                email = user.email;
                photoUrl = user.photoURL;
                uid = user.uid; 
              }
            console.log(name + ": " + email);
            
             // ESTABLECER MIEMBROS DE CADA GRUPO (nombreUser: true)
              nombreUsuario = {}; 
              var tablon = grado + " " + grupo;
              nombreUsuario[tablon] = true; 
              firebase.database().ref('LocalizarUsuarios/'+ name).update(nombreUsuario);

          }, function(error) { 
            console.log("ERROR: no se pudo actualizar el perfil de Usuario.");
          });

    //Guardar en la base de datos su contraseña e email para un mayor control
      firebase.database().ref('Usuarios/'+ grado +'/' + grupo +'/' + nombre).update({
        email: email,
        contraseña: contraseña
      }).then(function() {
                console.log("BD actualizada excitosamente.");
                 window.location = "../index.html";
              }, function(error) { 
                console.log("ERROR: no se pudo actualizar la BD");
              });
  }
 }

//----¿HAS OLVIDADO TU CONTRASEÑA? ENVIAR UN CORREO PARA RESTABLECER LA CONTRASEÑA
function restablecerContraseña(){
  var auth = firebase.auth();
  const emailLogin     = txtLoginEmail.value;

  auth.sendPasswordResetEmail(emailLogin).then(function() {
    alert("Se envió un email para restablecer tu contraseña a la dirección: "+ emailLogin);
  }, function(error) {
     if (error.code == "auth/user-not-found") {
       alert('No existe una cuenta ligada al email introducido.');
      } else if(error.code == "auth/invalid-email"){
      alert('El correo que ingresaste es inválido. Revisa su sintaxis.');
      }
  });

}

var primeraVez = false;

   //REGISTRAR: ----------------------------------------------------------------------------
    btnRegistrar.addEventListener('click', function(e){
      const emailRegister     = txtEmail.value;
      const password  = txtContraseña.value;
      const auth      = firebase.auth();
      const nombre = txtNombre.value;

      //¿TODOS los campos fueron llenados?
      if(txtNombre.value.length!=0 && txtEmail.value.length!=0 && txtContraseña.value.length!=0 &&
        txtContraseña2.value.length!=0 && semestre.value.length!=0 && grupo.value.length!=0){
        //Contraseñas IGUALES?
        if (txtContraseña.value == txtContraseña2.value) {
          //¡REGISTRAR USUSARIO!
          const promise = auth.createUserWithEmailAndPassword(emailRegister, password);
          primeraVez = true;

          //MOTHERFUCKING ERRORS FO' DUMB USERS
          promise.catch(function(error) {
            if(error.code == "auth/invalid-email"){
              alert('El correo que ingresaste es inválido. Revisa su sintaxis.');
            } else if (error.code == "auth/email-already-in-use") {
              alert('Ya existe una cuenta ligada con el email que introdujiste.');
            } else if(error.code == "auth/operation-not-allowed") {
              alert('Parece que tu cuenta ha sido deshabilitada');
            } else if(error.code == "auth/weak-password") {
              alert('La contraseña debe ser de al menos 6 caracteres. Intenta con otra.');
            }     
          });

          updatableName = txtNombre.value;        
          FunctionMagica();
        } else{
          alert("Las contraseñas ingresadas no coinciden.\nIntente de nuevo.");
          FunctionMagica();
        }
      } else {
        alert("Algunos Campos requeridos están vacíos.\nIntente de nuevo.");
        FunctionMagica();
      }
    });
 
    //INGRESAR: -------------------v---------------------------------------------------------
    btnIngresar.addEventListener('click', function(e){
      const emailLogin     = txtLoginEmail.value;
      const password  = txtLoginContraseña.value;
      const auth      = firebase.auth();

      if (txtLoginEmail.value!="" && txtLoginContraseña.value!="") {
        const promise = auth.signInWithEmailAndPassword(emailLogin, password);
        primeraVez = false;

        //MOTHERFUCKING ERRORS FO' DUMB USERS
          promise.catch(function(error) {
            if (error.code == "auth/user-not-found") {
              alert('No existe una cuenta ligada al email introducido.');
            } else if(error.code == "auth/invalid-email"){
              alert('El correo que ingresaste es inválido. Revisa su sintaxis.');
            } else if(error.code == "auth/user-disabled") {
              alert('Parece que tu cuenta ha sido deshabilitada');
            } else if(error.code == "auth/weak-password") {
              alert('La contraseña debe ser de al menos 6 caracteres. Intenta con otra.');
            } else if(error.code == "auth/wrong-password"){
              alert('La contraseña y el correo electrónico no coinciden.\n(Intenta de nuevo, Si el error persiste da click en "¿Has olvidado tu contraseña?")');
            }
          });

        updatableName = updatableName;
        FunctionMagica();
      } else{
        alert("Por favor, llene los campos vacíos.");
        FunctionMagica();
      }
    });

    //AUTH LISTENER: -----------------------------------------------------------------------
    firebase.auth().onAuthStateChanged(function(firebaseUser) {
      if (firebaseUser){
        console.log('- INICIO DE SESIÓN EXITOSA -');

         //AÑADIR DATOS DE USUARIO A LA BD REALTIME
              const añoDB   = semestre.options[ semestre.selectedIndex ].text;
              const grupoDB = grupo.options[ grupo.selectedIndex ].text;
              const nombre = txtNombre.value;
              const emailRegister     = txtEmail.value;
              const password  = txtContraseña.value;

              DBguardarUsuario(añoDB , grupoDB , nombre, emailRegister, password);

          
      } else{
        console.log('- NO HAY SESIÓN INICIADA -');
      }
    });




























