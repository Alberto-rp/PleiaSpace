const queryURL = window.location.search
const parametros = new URLSearchParams(queryURL)
let error = parametros.get('error')

window.addEventListener('load', init)

function init(){
    let divAlerta = document.querySelector("#alerta")
    switch(error){
        case'blank':
            divAlerta.classList.add("alert-danger")
            divAlerta.style.display = 'block'
            divAlerta.children[0].innerHTML = "<strong>Error</strong> Debes introducir algo"
            break;
        case'fail':
            divAlerta.classList.add("alert-danger")
            divAlerta.style.display = 'block'
            divAlerta.children[0].innerHTML = "<strong>Error</strong> Usuario o contraseña incorrectos"
            break;
        case'auth':
            divAlerta.classList.add("alert-danger")
            divAlerta.style.display = 'block'
            divAlerta.children[0].innerHTML = "<strong>Error</strong> Debes iniciar sesion para reservar vuelo"
            break;
        case'duplicate':
            divAlerta.classList.add("alert-danger")
            divAlerta.style.display = 'block'
            divAlerta.children[0].innerHTML = "<strong>Error</strong> El correo ya está registrado en la web"
            break;
        case'noerror':
            divAlerta.classList.add("alert-success")
            divAlerta.style.display = 'block'
            divAlerta.children[0].innerHTML = "<strong>Bien!</strong> Usuario creado correctamente"
        break;
    }
}