const queryURL = window.location.search
const parametros = new URLSearchParams(queryURL)
let error = parametros.get('error')

window.addEventListener('load', init)

function init(){

    // Listeners
    // let divAlerta = document.querySelector("#alerta")
    // switch(error){
    //     case'blank':
    //         divAlerta.classList.add("alert-danger")
    //         divAlerta.style.display = 'block'
    //         divAlerta.children[0].innerHTML = "<strong>Error</strong> Debes introducir algo"
    //         break;
    //     case'fail':
    //         divAlerta.classList.add("alert-danger")
    //         divAlerta.style.display = 'block'
    //         divAlerta.children[0].innerHTML = "<strong>Error</strong> Usuario o contraseña incorrectos"
    //         break;
    //     case'auth':
    //         divAlerta.classList.add("alert-danger")
    //         divAlerta.style.display = 'block'
    //         divAlerta.children[0].innerHTML = "<strong>Error</strong> Debes iniciar sesion para reservar vuelo"
    //         break;
    //     case'duplicate':
    //         divAlerta.classList.add("alert-danger")
    //         divAlerta.style.display = 'block'
    //         divAlerta.children[0].innerHTML = "<strong>Error</strong> El correo ya está registrado en la web"
    //         break;
    //     case'noerror':
    //         divAlerta.classList.add("alert-success")
    //         divAlerta.style.display = 'block'
    //         divAlerta.children[0].innerHTML = "<strong>Bien!</strong> Usuario creado correctamente"
    //     break;
    // }

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
    console.log(error)
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
    }

    // Mostramos la alerta
    divAlerta.style.opacity = '1'
    setTimeout(function(){

    divAlerta.style.opacity = '0'
    divAlerta.className = ''
    divAlerta.classList.add("alert")

    },duration);
}