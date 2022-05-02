const queryURL = window.location.search
const parametros = new URLSearchParams(queryURL)

console.log()

let error = parametros.get('error')

window.addEventListener('load', init)

function init(){
    let divAlerta = document.querySelector("#alerta")
    divAlerta.style.display = 'block'
    switch(error){
        case'blank':
            divAlerta.children[0].innerHTML = "<strong>Error</strong> Debes introducir algo"
            break;
        case'fail':
            divAlerta.children[0].innerHTML = "<strong>Error</strong> Usuario o contraseña incorrectos"
            break;
        case'auth':
            divAlerta.children[0].innerHTML = "<strong>Error</strong> Debes iniciar sesion para reservar vuelo"
            break;

    }
}