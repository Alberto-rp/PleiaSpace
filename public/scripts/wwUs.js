window.addEventListener("load", init)

function init(){
    document.querySelector("#enviarFetch").addEventListener("click", enviarData)
}

function enviarData(){
    // let datosEnviar = {
    //     email : document.querySelector("#email").value,
    //     passwd : document.querySelector("#passwd").value
    // }

    let nombre = document.querySelector('#name')
    let apellidos = document.querySelector('#surnames')
    let email = document.querySelector('#email')
    let phone = document.querySelector('#phone')
    let ciudad = document.querySelector('#city')
    let cv = document.querySelector('#cv')

    let datos = new FormData()
    datos.append('cv', cv.files[0])
    datos.append('nombre', document.querySelector('#name'))
    datos.append('apellidos', document.querySelector('#surnames'))
    datos.append('email', document.querySelector('#email'))
    datos.append('phone', document.querySelector('#phone'))
    datos.append('ciudad', document.querySelector('#city'))

    fetch('/api/file', {
        method: 'POST',
        body: datos,
        //headers:{'Content-Type': 'application/json'}
    })
    .then(resp => resp.json())
    .then(data => {
        console.log(data)
    })
}