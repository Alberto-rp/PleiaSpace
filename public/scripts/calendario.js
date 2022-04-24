window.addEventListener("load", init)
let arrayMeses = ["EN","FEB","MAR","ABR","MAY","JUN","JUL","AGO","SEPT","OCT","NOV","DIC"]

function init(){
    let fechaAct = new Date()
    document.querySelector("#anioActual").innerHTML = fechaAct.getFullYear()

    // Inicializamos el calendario
    let contador = 0
    let cadena = ""
    for(let i = 0; i < arrayMeses.length; i++){
        if(contador == 0){
            cadena += `<div class="row">`
        }
        cadena += `<div class="col">
                    <h6>${arrayMeses[i]}</h6>
                    <div id="m${i+1}"></div>
                   </div>`
        contador++
        if(contador == 4){
            cadena += `</div>`
            contador = 0
        }
    }
    document.querySelector("#cuerpoCalendario").innerHTML += cadena

    // Llamamos a la funcion asíncrona que carga los vuelos del año actual
    cambiarCalendario()
    
    // Inicializamos los botones
    document.querySelector("#anioAlante").addEventListener("click", avanzarAnio)
    document.querySelector("#anioAtras").addEventListener("click", retrocederAnio)
}

function avanzarAnio(){
    let anioAct = Number(document.querySelector("#anioActual").innerHTML)
    anioAct += 1
    document.querySelector("#anioActual").innerHTML = anioAct
    limpiarMeses()
    cambiarCalendario()
}

function retrocederAnio(){
    let anioAct = Number(document.querySelector("#anioActual").innerHTML)
    anioAct -= 1
    document.querySelector("#anioActual").innerHTML = anioAct
    limpiarMeses()
    cambiarCalendario()
    
}

async function cambiarCalendario(){
    // Recuperamos los datos del servidor
    fetch("/vuelos")
    .then(response => response.json())
    .then(data => {
        for(item of data){
            let fechaVuelo = new Date(item.fecha)
            if(document.querySelector("#anioActual").innerHTML == fechaVuelo.getFullYear()){
                let id = "#m"+(fechaVuelo.getMonth()+1)
                document.querySelector(id).innerHTML = `<div class='elemVuelo'>
                                                            Vuelo: ${item.id_vuelo}<br>
                                                            Orbita: ${item.orbita_destino}<br>
                                                            Tipo: ${item.tipo_vuelo}
                                                        </div>`
            }
        }
    })
    .catch(error => console.log(error))
}

function limpiarMeses(){
    for(let j = 1; j <= 12; j++){
        document.querySelector("#m"+j).innerHTML = ""
    }
}
