window.addEventListener("load", init)

// Recogemos parametros error de la URL
// const queryURL = window.location.search
// const parametros = new URLSearchParams(queryURL)
// let errorURL = parametros.get('error')

function init(){
    document.querySelector("#enviarFetch").addEventListener("click", enviarData)
    document.querySelector('#cv').addEventListener("change", pintarSize)
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

    //Limitar el tamaño del archivo
    // console.log(cv.files[0].size+" "+cv.files[0].name)
    if(cv.files[0].size < (1024 * 512)){
        if((cv.files[0].name).slice(((cv.files[0].name).length)- 4) == '.pdf'){
            let datos = new FormData()
            datos.append('cv', cv.files[0])
            datos.append('nombre', document.querySelector('#name').value)
            datos.append('apellidos', document.querySelector('#surnames').value)
            datos.append('email', document.querySelector('#email').value)
            datos.append('phone', document.querySelector('#phone').value)
            datos.append('ciudad', document.querySelector('#city').value)
        
            fetch('/api/file', {
                method: 'POST',
                body: datos,
                // headers:{'Content-Type': 'application/json'}
            })
            .then(resp => resp.json())
            .then(data => {
                tempAlert(2500, data.error)
                borrarCampos()
            })
        }else{
            tempAlert(2000,'pdf')
        }
    }else{
        tempAlert(2000,'size')
    }
}

function pintarSize(){
    document.querySelector("#cvHelp").innerHTML = ""
    
    if(document.querySelector('#cv').value != ""){
        let fileSize = document.querySelector('#cv').files[0].size 
        let size = 0
        if(fileSize < 1048576){
            size = (Math.floor(parseInt(fileSize) / 1024))+"KB"
        }else{
            size = (Math.floor(parseInt(fileSize) / (1024 * 1000)))+"MB"
        }
    
        if(fileSize < (1024 * 512)){
            document.querySelector("#cvHelp").innerHTML = "Tamaño del archivo: "+ size
        }else{
            document.querySelector("#cvHelp").innerHTML = "Tamaño del archivo: <span class='text-danger'>"+ size+"</span>"
        }
    }
}

function borrarCampos(){
    document.querySelector("#cvHelp").innerHTML = ""
    document.querySelector('#cv').value = ""
    document.querySelector('#name').value = ""
    document.querySelector('#surnames').value = ""
    document.querySelector('#email').value = ""
    document.querySelector('#phone').value = ""
    document.querySelector('#city').value = ""

}

// Alerta que se auto cierra
function tempAlert(duration, error){
    console.log(error)
    var divAlerta = document.querySelector("#alerta2");
    // Analizamos error
    switch(error){
        case 'size':
            divAlerta.classList.add("alert-danger")
            divAlerta.innerHTML = "<strong>Error!</strong> El CV no debe superar los 512KB!"
            break;
        case 'error':
            divAlerta.classList.add("alert-danger")
            divAlerta.innerHTML = "<strong>Error!</strong> Algo ha salido mal"
            break;
        case 'pdf':
            divAlerta.classList.add("alert-danger")
            divAlerta.innerHTML = "<strong>Error!</strong> El archivo debe ser en formato PDF"
            break;
        case 'noerror':
            divAlerta.classList.add("alert-success")
            divAlerta.innerHTML = "<strong>Bien!</strong> Datos registrados!"
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