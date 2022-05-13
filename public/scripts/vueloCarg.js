const orbitas = ['LEO','MEO','GEO','POLAR']
const fechaActual = new Date(Date.now())

window.addEventListener("load", init)

function init(){

    // Inicializamos los inputs
    for(item of orbitas){
        document.querySelector("#orbit").innerHTML += `<option value="${item}">${item}</option>`
    }

    document.querySelector("#fechaIn").value = fechaActual.getFullYear()+"-"+mesFormat(fechaActual.getMonth())


    //Listeners
    document.querySelector("#peso").addEventListener("input", calcularPrecio)

}

//Pintar mes bonito
function mesFormat(mes){
    return (mes < 10)? '0'+(mes+1) : (mes+1)
}

// Calcular precio
function calcularPrecio(){
    let orbitaSelect = document.querySelector("#orbit")[ document.querySelector("#orbit").selectedIndex].value
    let masaInput = document.querySelector("#peso").value
}