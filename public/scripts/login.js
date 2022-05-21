const queryURL = window.location.search
const parametros = new URLSearchParams(queryURL)
let error = parametros.get('error')

window.addEventListener('load', init)

function init(){
    // Si hay una cookie de Sesion, evita acceder a Login
    if(document.cookie != ''){
        window.location.replace('/perfil')
    }
    tempAlert(2000, error)

    document.querySelector("#btnLogin").addEventListener("click", enviarDatos)
}

function enviarDatos(){
    let datosEnviar = {
        email : document.querySelector("#email").value,
        passwd : document.querySelector("#passwd").value
    }
    fetch('/api/login', {
        method: 'POST',
        body: JSON.stringify(datosEnviar),
        headers:{'Content-Type': 'application/json'}
    })
    .then(resp => {
        // Si el login es correcto redirigimos a vuela*
        if(resp.status == 200){
            window.location.replace('/vuela')
        }else{
            return resp.json()
        }
    }).then(data => {
        tempAlert(2000, data.error)
    })
}

// Alerta que se auto cierra
function tempAlert(duration, error){
    var divAlerta = document.querySelector("#alerta2");
    // Analizamos error
    switch(error){
        case 'blank':
            divAlerta.classList.add("alert-danger")
            divAlerta.innerHTML = "<strong>Error</strong> Debes rellenar los dos campos!"
            break;
        case'fail':
            divAlerta.classList.add("alert-danger")
            divAlerta.innerHTML = "<strong>Error</strong> Usuario o contraseña incorrectos"
            break;
        case 'auth':
            divAlerta.classList.add("alert-danger")
            divAlerta.innerHTML = "<strong>Error</strong> Debes iniciar sesión para reservar un vuelo"
            break;
        case 'noerror':
            divAlerta.classList.add("alert-success")
            divAlerta.innerHTML = "<strong>Bien!</strong> Registrado correctamente"
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