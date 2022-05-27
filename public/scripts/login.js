const queryURL = window.location.search
const parametros = new URLSearchParams(queryURL)
let error = parametros.get('error')

window.addEventListener('load', init)

function init(){
    // Si hay una cookie de Sesion, evita acceder a Login
    if(getCookie('usuario') != undefined){
        window.location.replace('/')
    }
    tempAlert(2000, error)

    document.querySelector("#btnLogin").addEventListener("click", enviarDatos)
    document.querySelector('#togglePassword').addEventListener("click", verPasswd)
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