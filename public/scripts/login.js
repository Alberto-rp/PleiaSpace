const queryURL = window.location.search
const parametros = new URLSearchParams(queryURL)

console.log()

let error = parametros.get('error')

window.addEventListener('load', init)

function init(){
    let divAlerta = document.querySelector("#alerta")
    switch(error){
        case'blank':
            divAlerta.style.display = 'block'
            divAlerta.children[0].innerHTML = "<strong>Error</strong> Debes introducir algo"
            break;
        case'fail':
            divAlerta.style.display = 'block'
            divAlerta.children[0].innerHTML = "<strong>Error</strong> Usuario o contraseña incorrectos"
            break;
    }
}