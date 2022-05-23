const queryURL = window.location.search
const parametros = new URLSearchParams(queryURL)
let error = parametros.get('error')

window.addEventListener('load', init)

function init(){
    tempAlert(2000, error)
    initPaises() //Inicializar paises Form

    document.querySelector('#togglePassword').addEventListener("click", verPasswd)
    document.querySelector("#enviar").addEventListener("click", enviarForm)
}

function enviarForm(e){
    if(!(validarFecha() && validarEmail() && validarNames())){
        e.preventDefault() //Evitamos que se envie el formulario

        let alerta = ''
        if(!validarNames()){
            alerta = "nameFail"
        }else if(!validarEmail()){
            alerta = "emailFail"
        }else if(!validarFecha()){
            alerta = "mayEdad"
        }

        tempAlert(5000, alerta)
    }
}

function validarNames(){
    let name = document.querySelector("#name").value
    let surname = document.querySelector("#surnames").value

    let regNum = /^([^0-9]*)$/
    return regNum.test(name) && regNum.test(surname)
}

function validarFecha(){
    let fechaInput = new Date(document.querySelector("#birthDate").value)
    let fecha18 = new Date(Date.now())
    fecha18.setFullYear(fecha18.getFullYear() - 18)

    return (fechaInput < fecha18)
}

function validarEmail(){
    let emailValue = document.querySelector("#email").value
    let regEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g
    return (regEmail.test(emailValue))
}