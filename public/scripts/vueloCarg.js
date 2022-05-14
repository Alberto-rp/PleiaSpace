const orbitas = ['LEO','SSO','GTO']
const fechaActual = new Date(Date.now())

window.addEventListener("load", init)

function init(){

    // Inicializamos los inputs
    for(item of orbitas){
        document.querySelector("#orbit").innerHTML += `<option value="${item}">${item}</option>`
    }

    document.querySelector("#fechaIn").value = fechaActual.getFullYear()+"-"+mesFormat(fechaActual.getMonth())


    //Listeners
    document.querySelector("#btnComp").addEventListener("click", calcularPrecio)

}

//Pintar mes bonito
function mesFormat(mes){
    return (mes < 10)? '0'+(mes+1) : (mes+1)
}

// Pintar precio bonito
function pintarPrecio(num){
    return new Number(num).toLocaleString("es-ES",{style:'currency',currency:'EUR'})
}

// Calcular precio
function calcularPrecio(){
    let orbitaSelect = document.querySelector("#orbit")[ document.querySelector("#orbit").selectedIndex].value
    let masaInput = document.querySelector("#peso").value
    let fechaValue = document.querySelector("[name='fechaIn']").value

    let datosEnviar = {
        orbita : orbitaSelect,
        fecha: fechaValue
    }

    fetch('/api/vuelosCAR', {
        method: 'POST',
        body: JSON.stringify(datosEnviar),
        headers:{'Content-Type': 'application/json'}
    })
    .then(resp => resp.json())
    .then(vuelos => {
        console.log(vuelos)
        document.querySelector("#precio").innerHTML = pintarPrecio(vuelos[0].precio_kg * masaInput)
        if(vuelos.length > 0){ //METER FUNCION COMPROBAR SLOTS
            // Reiniciamos la tabla de resultados y la mostramos
            let tabla = ''
            let salida = document.querySelector("#tablaResult")
            tabla += `<table class="table table-responsive bg-dark" id='LABELS'>
                                <tr>
                                    <td>ID</td>
                                    <td>FECHA</td>
                                    <td>ORBITA</td>
                                    <td>ASIENTOS</td>
                                    <td>PRECIO</td>
                                </tr>`

            // Insertamos los datos de cada vuelo
            for(item of vuelos){
                if(item.disp_port_A > 0 || item.disp_port_B > 0){
                    tabla += `<tr id='FILA${item.id_vuelo}' name='filaR[]'>
                                    <td>${item.id_vuelo}</td>
                                    <td class='w-auto'>${item.fecha.slice(0,7)}</td>
                                    <td>${item.orbita_destino}</td>
                                    <td>${item.asientos_disponibles}</td>
                                    <td>${new Number(item.precio_asiento).toLocaleString("es-ES",{style:'currency',currency:'EUR'})}</td>
                                    <td><button class='btn btn-primary' name='vtnVuelos' id='${item.id_vuelo}'>Seleccionar</button></td>
                                    </tr>`
                }
            }
            tabla += '</table>'
            salida.innerHTML = tabla
            salida.style.display = 'inline-block'

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