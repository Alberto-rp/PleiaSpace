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
            
            // Seleccionamos y mostramos la tabla resultado
            let divCont = document.querySelector("#tablaResult")
            divCont.style.display = "inline-block"

            // Comprobamos que hay vuelos disponibles
            if(vuelosR.length > 0){
                // Reiniciamos la tabla de resultados y la mostramos
                divCont.innerHTML = `<div class="row bg-primary" id='LABELS'>
                                        <div class="col">ID</div>
                                        <div class="col">FECHA</div>
                                        <div class="col">ORBITA</div>
                                        <div class="col">ASIENTOS</div>
                                        <div class="col"></div>
                                    </div>`

                // Insertamos los datos de cada vuelo
                let codigoHtml = ""
                for(item of vuelosR){
                    codigoHtml += `<div class='row bg-primary' id='FILA${item.id_vuelo}'>
                                    <div class='col'>${item.id_vuelo}</div>
                                    <div class='col'>${item.fecha.slice(0,7)}</div>
                                    <div class='col'>${item.orbita_destino}</div>
                                    <div class='col'>${item.asientos_disponibles}</div>
                                    <div class='col'><button name='vtnVuelos' id='${item.id_vuelo}'>Seleccionar</button></div>
                                    </div>`
                }
                divCont.innerHTML += codigoHtml
                asignarFuncion()

            }else{
                // Si no hay vuelos, mostrar mensaje:
                divCont.innerHTML = `<div class="row bg-dark">
                                        <div class="col text-center">
                                            <p>Lo sentimos, no hay vuelos para las fechas seleccionadas.<br> 
                                            Consulte la sección de <a href='/calendario'>Calendario</a> o contacte a <a href='#'>despegues@pleiaspace.com</a> 
                                            </p>
                                        </div>
                                     </div>`
            }
        })
        
    }
    
}

async function consultaFecha(fecha){
    return fetch(`/api/vuelosCOM${fecha}`)
    .then(res => res.json())
}

function asignarFuncion(){
    let botones = document.getElementsByName("vtnVuelos")
    for(item of botones){
        item.addEventListener("click", nextStep)
    }
}

function nextStep(e){
    e.preventDefault()
    //Ocultamos el formulario inicial y mostramos el segundo
    document.querySelector("#fs1").style.display = "none"
    document.querySelector("#fs2").style.display = "inline-block"
    document.querySelector("#fs2").disabled = ""

    // Guardamos la id del vuelo en el formulario
    document.querySelector("#idVueloSel").value = this.id
    
    //Ocultamos los vuelos no seleccionados
    let divResultado = document.querySelector("#tablaResult").children
    for(item of divResultado){
        if(item.id != `FILA${this.id}` && item.id != 'LABELS'){
            item.style.display = "none"
        }
    }
}

