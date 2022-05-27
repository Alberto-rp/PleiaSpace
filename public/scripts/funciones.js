// Funcion para sacar precios PERFIL
function pintarPrecio(num){
    return new Number(num).toLocaleString("es-ES",{style:'currency',currency:'EUR'})
}

// Funcion sacar la fecha Guay
function fechaFormato(fechaEnt){
    let fecha = new Date(fechaEnt)
    let mes = (fecha.getMonth() < 10)? '0'+(fecha.getMonth()+1) : (fecha.getMonth()+1)
    return mes+"/"+fecha.getFullYear()  
}

//Pintar mes bonito
function mesFormat(mes){
    return (mes < 10)? '0'+(mes+1) : (mes+1)
}

//Inicializar los paises de los Select
function initPaises(){
    fetch("json/countries.json")
    .then(res => res.json())
    .then(data =>{
        for(item of data.countries){
            if(item.code == "ES"){
                document.querySelector("#country").innerHTML += `<option selected value='${item.code}'>${item.name_es}</option>`
            }else{
                document.querySelector("#country").innerHTML += `<option value='${item.code}'>${item.name_es}</option>`
            }
        }
    })
}

function verPasswd(){ //Login y registro
    const password = document.querySelector('#passwd');     
    const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
    password.setAttribute('type', type);

    // Toggle the eye and bi-eye icon
    this.classList.toggle('bi-eye');
    
}

//Devolver valor de una cookie
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}


// Alerta que se auto cierra
function tempAlert(duration, error){
    var divAlerta = document.querySelector("#alerta2");
    // Analizamos error
    switch(error){
        case'fail': //LOGIN
            divAlerta.classList.add("alert-danger")
            divAlerta.innerHTML = "<strong>Error</strong> Usuario o contraseña incorrectos"
            break;
        case 'noerrorLog': //LOGIN
            divAlerta.classList.add("alert-success")
            divAlerta.innerHTML = "<strong>Bien!</strong> Registrado correctamente"
            break;
        case 'activationSucess': //LOGIN
            divAlerta.classList.add("alert-success")
            divAlerta.innerHTML = "<strong>Bien!</strong> Su cuenta se ha activado correctamente"
            break;
        case 'auth': //LOGIN
            divAlerta.classList.add("alert-danger")
            divAlerta.innerHTML = "<strong>Error</strong> Debes iniciar sesión para reservar un vuelo"
            break;
        case 'activationError': //LOGIN
            divAlerta.classList.add("alert-danger")
            divAlerta.innerHTML = "<strong>Error</strong> Debes activar tú cuenta mediante el enlace que te hemos mandado al correo!"
            break;
        case 'error1': //VUELO_COMERCIAL
            divAlerta.classList.add("alert-danger")
            divAlerta.innerHTML = "<strong>Error</strong> Ya has efectuado una reserva en este vuelo.<br> Puedes modificar o cancelar tu reserva en la sección <i><a href='/perfil'>Perfil</a></i>"
            break;
        case 'noerrorVC': //VUELO_COMERCIAL
            divAlerta.classList.add("alert-success")
            divAlerta.innerHTML = "<strong>Exito! </strong>Reserva realizada correctamente!"
            break;
        case true: //PERFIL
            divAlerta.classList.add("alert-danger")
            divAlerta.innerHTML = "<strong>Error</strong> Error indeterminado"
            break;
        case 'reservDelet': //PERFIL
            divAlerta.classList.add("alert-success")
            divAlerta.innerHTML = "<strong>Éxito</strong> Reserva eliminada."
            break;
        case'outAsientos': //PERFIL
            divAlerta.classList.add("alert-danger")
            divAlerta.innerHTML = "<strong>Error</strong> Asientos insuficientes"
            break;
        case'reservaActiva': //PERFIL 
            divAlerta.classList.add("alert-danger")
            divAlerta.innerHTML = "<strong>Error</strong> Debes anular las reservas antes de eliminar tu cuenta"
            break;
        case false: //PERFIL
            divAlerta.classList.add("alert-success")
            divAlerta.innerHTML = "<strong>Bien!</strong> Reserva actualizada"
            break;
        case 'duplicate': //REGISTRO
            divAlerta.classList.add("alert-danger")
            divAlerta.innerHTML = "<strong>Error</strong> Este email ya está registrado!"
            break;
        case 'mayEdad': //REGISTRO
            divAlerta.classList.add("alert-danger")
            divAlerta.innerHTML = "<strong>Error</strong> Debes ser mayor de edad para registrarte!"
            break;
        case 'emailFail': //REGISTRO
            divAlerta.classList.add("alert-danger")
            divAlerta.innerHTML = "<strong>Error</strong> Debes introducir un email válido!"
            break;
        case 'nameFail': //REGISTRO
            divAlerta.classList.add("alert-danger")
            divAlerta.innerHTML = "<strong>Error</strong> Tu nombre no puede contener números!"
            break;
        case 'blank': //VUELOCARGA
            divAlerta.classList.add("alert-danger")
            divAlerta.innerHTML = "<strong>Error</strong> Debes introducir una masa!"
            break;
        case'portPeso': //VUELOCARGA
            divAlerta.classList.add("alert-danger")
            divAlerta.innerHTML = "La masa que has elegido excede las capacidades de este puerto."
            break;
        case'port0': //VUELOCARGA
            divAlerta.classList.add("alert-danger")
            divAlerta.innerHTML = "Los puertos típo A de este vehiculo están completos"
            break;
        case'vueloPeso': //VUELOCARGA
            divAlerta.classList.add("alert-danger")
            divAlerta.innerHTML = "La masa que has elegido excede las capacidades de este vehiculo.<br> Para revisar las capacidades de nuestros vehiculos consulte la seccion <a href='#'>Vehiculos</a>"
            break;
        case'rellenarCamps': //VUELOCARGA
            divAlerta.classList.add("alert-danger")
            divAlerta.innerHTML = "<strong>Error!</strong> Debes rellenar todos los datos!"
            break;
        case'nombreComp': //VUELOCARGA
            divAlerta.classList.add("alert-danger")
            divAlerta.innerHTML = "<strong>Error!</strong> Nombre de compañia duplicado!<br> Si ya ha reservado con anterioridad, cargue sus datos pulsando el botón CARGAR"
            break;
        case'selectOptionModal': //VUELOCARGA
            divAlerta.classList.add("alert-danger")
            divAlerta.innerHTML = "<strong>Error!</strong> Debes seleccionar una opción válida!"
            break;
        case'wrongMail': //VUELOCARGA
            divAlerta.classList.add("alert-danger")
            divAlerta.innerHTML = "<strong>Error!</strong> Datos incorrectos"
            break;
        case'contactoDuplicado': //VUELOCARGA
            divAlerta.classList.add("alert-danger")
            divAlerta.innerHTML = "<strong>Error!</strong> Este correo ya está registrado. Para cargar datos existentes pulse el botón CARGAR"
            break;
        case'errorDesconocido': //VUELOCARGA //REGISTRO
            divAlerta.classList.add("alert-danger")
            divAlerta.innerHTML = "<strong>Error!</strong> Algo ha salido mal"
            break;
        case'errorReservaEliminada': //VUELOCARGA
            divAlerta.classList.add("alert-danger")
            divAlerta.innerHTML = "<strong>Error!</strong> Esta reserva ya se eliminó"
            break;
        case 'noerror': //VUELOCARGA
            divAlerta.classList.add("alert-success")
            divAlerta.innerHTML = "<strong>Bien!</strong> Reserva realizada correctamente;<br> Recibirá un email con la información."
            break;
        case 'reservElim': //VUELOCARGA
            divAlerta.classList.add("alert-success")
            divAlerta.innerHTML = "<strong>Bien!</strong> Reserva eliminada correctamente."
            break;
        default: 
            divAlerta.innerHTML = ""
    }
    // Mostramos la alerta

    divAlerta.style.opacity = '1'
    setTimeout(function(){

    divAlerta.style.opacity = '0'
    divAlerta.className = ''
    divAlerta.classList.add("alert")

    },duration);
}