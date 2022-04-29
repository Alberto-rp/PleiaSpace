window.addEventListener("load", init)
let vuelosDisponibles = null

function init(){
    document.querySelector("#envio").addEventListener("click", despFormulario)
}

function despFormulario(e){
    e.preventDefault()
    let fechaValue = document.querySelector("[name='fechaIn']").value

    if(fechaValue != ""){
        consultaFecha(fechaValue)
        .then(vuelosR => {
            // Guardamos todos los vuelos en una variable global
            vuelosDisponibles = vuelosR

            // Reiniciamos la tabla de resultados y la mostramos
            let divCont = document.querySelector("#tablaResult")
            divCont.style.display = "inline-block"
            divCont.innerHTML = `<div class="row bg-dark">
                                    <div class="col">ID</div>
                                    <div class="col">FECHA</div>
                                    <div class="col">ORBITA</div>
                                    <div class="col">ASIENTOS</div>
                                    <div class="col"></div>
                                </div>`

            // Insertamos los datos de cada vuelo
            let codigoHtml = ""
            for(item of vuelosR){
                codigoHtml += `<div class='row bg-dark'>
                                <div class='col'>${item.id_vuelo}</div>
                                <div class='col'>${item.fecha.slice(0,7)}</div>
                                <div class='col'>${item.orbita_destino}</div>
                                <div class='col'>${item.asientos_disponibles}</div>
                                <div class='col'><button>Seleccionar</button></div>
                                </div>`
            }
            divCont.innerHTML += codigoHtml
            // ocultar en el futuro
            // document.querySelector("#formulario1").style.display = "none"
        })
        
    }
    
}

async function consultaFecha(fecha){
    return fetch(`/api/vuelosCOM${fecha}`)
    .then(res => res.json())
}

