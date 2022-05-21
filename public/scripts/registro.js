const queryURL = window.location.search
const parametros = new URLSearchParams(queryURL)
let error = parametros.get('error')

window.addEventListener('load', init)

function init(){
    tempAlert(2000, error)
    initPaises() //Inicializar paises Form
}