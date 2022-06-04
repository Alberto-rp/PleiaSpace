window.addEventListener("load", init)

function init(){
    document.querySelector("#enviarFetch").addEventListener("click", enviarData)
    document.querySelector('#cv').addEventListener("change", pintarSize)
}

function enviarData(){
    window.scrollTo(0, 0);//Para volver arriba de la pag

    let nombre = document.querySelector('#name').value
    let apellidos = document.querySelector('#surnames').value
    let email = document.querySelector('#email').value
    let phone = document.querySelector('#phone').value
    let ciudad = document.querySelector('#city').value

    let arrayComprov = [nombre, apellidos, email, phone, ciudad]
    let validate = true
    for(item of arrayComprov){
        if(item === ''){
            validate = false
        }
    }
    let cv = document.querySelector('#cv')

    if(validate && cv.files[0] != undefined){
        //Limitar el tamaño del archivo
        if(cv.files[0].size < (1024 * 512)){
            //Comprobar que el archivo sea css
            if((cv.files[0].name).slice(((cv.files[0].name).length)- 4) == '.pdf'){
                //Validaciones
                if(validarEmail() && validarNames() && validarTel()){
                    let datos = new FormData()
                    datos.append('cv', cv.files[0])
                    datos.append('nombre', nombre)
                    datos.append('apellidos', apellidos)
                    datos.append('email', email)
                    datos.append('phone', phone)
                    datos.append('ciudad', ciudad)
                
                    fetch('/api/file', {
                        method: 'POST',
                        body: datos
                    })
                    .then(resp => resp.json())
                    .then(data => {
                        tempAlert(2500, data.error)
                        borrarCampos()
                    })
                }else{
                    if(!validarEmail()){
                        tempAlert(2000,'emailFail')
                    }else if(!validarNames()){
                        tempAlert(2000,'nameFail')
                    }else if(!validarTel()){
                        tempAlert(2000,'telFail')
                    }
                }
            }else{
                tempAlert(2000,'pdf')
            }
        }else{
            tempAlert(2000,'size')
        }
    }else{
        tempAlert(2000,'wwusBlank')
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

function validarNames(){
    let name = document.querySelector("#name").value
    let surname = document.querySelector("#surnames").value

    let regNum = /^([^0-9]*)$/
    return regNum.test(name) && regNum.test(surname)
}

function validarTel(){
    let telImput = document.querySelector("#phone").value
    console.log(telImput)
    let regTel = /^([0-9])*$/

    return (regTel.test(telImput) && (telImput.length == 9))
}

function validarEmail(){
    let emailValue = document.querySelector("#email").value
    let regEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g
    return (regEmail.test(emailValue))
}