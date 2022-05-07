window.addEventListener("load", init)

function init(){
    // Variables global para recoger el vuelo a modificar
    vueloMod = ''
    datosOriginales = {}
    // Sacamos los datos gracias a la cookie encriptada
    fetch('/api/usuario')
    .then(resp => resp.json())
    .then(data => {
        document.querySelector("#tdUserNam").innerHTML = data[0].nombre
        document.querySelector("#tdUserSur").innerHTML = data[0].apellidos
        document.querySelector("#tdMail").innerHTML = data[0].email
        document.querySelector("#tdFecha").innerHTML = salidaTexto(new Date(data[0].fecha_nac).toLocaleDateString())
        document.querySelector("#tdPais").innerHTML = salidaTexto(data[0].pais)
        document.querySelector("#tdTel").innerHTML = salidaTexto(data[0].telefono)
        document.querySelector("#tdProv").innerHTML = salidaTexto(data[0].provincia)
        document.querySelector("#tdCiudad").innerHTML = salidaTexto(data[0].ciudad)
        document.querySelector("#tdPostCode").innerHTML = salidaTexto(data[0].cod_postal)
        document.querySelector("#tdDirecc").innerHTML = salidaTexto(data[0].direccion)

        // Asignamos la id al formulario de anular vuelo, en caso de que quiera anularlo
        document.querySelector("#UsuarioCancela").value = data[0].id_usuario

        // Sacamos los datos de las reservas si tiene
        fetch('/api/vuelos/usuario'+data[0].id_usuario)
        .then(resp => resp.json())
        .then(datosVuelos => {

            let divVuelos = document.querySelector("#tdReserv")
            if(datosVuelos.length > 0){
                let tabla = ''
                tabla += `<table class="table table-responsive table-dark">
                            <tr>
                            <th><b>Vuelo</b></th>
                            <th><b>Fecha</b></th>
                            <th><b>Orbita</b></th>
                            <th><b>Asientos</b></th>
                            <th><b>Método de Pago</b></th>
                            </tr>`
                for(vuelo of datosVuelos){
                    // Calcular los asientos disponibles de cada vuelo para el MAX
                    tabla += `<tr>
                                <td>${vuelo.id_vuelo}</td>
                                <td>${new Date(vuelo.fecha).toLocaleDateString()}</td>
                                <td>${vuelo.orbita_destino}</td>
                                <td><input type="number" max="4" min="1" value="${vuelo.asientos_reservados}" class="noActiva" id="asients${vuelo.id_vuelo}" name="asients" readonly></td>
                                <td><select class="noActiva" id="metpag${vuelo.id_vuelo}" disabled>${generarSel(vuelo.metodo_pago)}</select>
                                <td><button class='btn btn-primary' name='btnModi[]' id="Modi${vuelo.id_vuelo}">Modificar</button></td>
                                <td><button class="btn btn-primary" data-toggle="modal" data-target="#ModalAnul" name='btnModales[]' id='Anul${vuelo.id_vuelo}'>Anular</button></td>
                              </tr>`
                }
                tabla += '</table>'
                divVuelos.innerHTML += tabla

                // Asignamos funcionalidad a los botones de cada vuelo. id del vuelo al que representan además
                initBotonesMod()
            }else{
                // Si no ha reservado vuelos, solo se muestran los campos de registro
                document.querySelector("#datosSecundarios").style.display = 'none'
                divVuelos.innerHTML += '<div class="row"><div class="col">No ha reservado ningun vuelo</div></div>'
            }
        })
        
    })
}

function salidaTexto(dato){
    return (dato == undefined)? 'No proporcionado' : dato
}

function initBotonesMod(){
    let botonesAn = document.getElementsByName("btnModales[]")
    let botonesMod = document.getElementsByName("btnModi[]")
    for(item of botonesAn){
        item.addEventListener("click", asignarId)
    }
    for(item of botonesMod){
        item.addEventListener("click", modificarReserva)
    }
}

function asignarId(){
    document.querySelector("#VueloCancela").value = this.id.slice(4)
}


function modificarReserva(){
    vueloMod = this.id.slice(4)
    
    inputAsiento = document.querySelector("#asients"+vueloMod)
    inputPago = document.querySelector("#metpag"+vueloMod)

    // Guardamos los valores originales en una variable global
    datosOriginales = {
        asientosOriginales : document.querySelector("#asients"+vueloMod).value,
        metPagoOriginal: inputPago[inputPago.selectedIndex].value
    }

    // Dejamos que los inputs sean editables
    inputAsiento.readOnly = false
    inputAsiento.classList = ''
    inputPago.disabled = false
    inputPago.classList = ''

    this.innerHTML = "Confirmar"
    this.removeEventListener("click", modificarReserva)
    this.addEventListener("click", EnviarModificacion)
}

function EnviarModificacion(){
    vueloMod = this.id.slice(4)

    inputAsientoValue = document.querySelector("#asients"+vueloMod).value
    inputPagoSel = document.querySelector("#metpag"+vueloMod)[document.querySelector("#metpag"+vueloMod).selectedIndex].value

    let datosEnviar = {
        idVuelo : vueloMod,
        idUsuario : document.querySelector("#UsuarioCancela").value,
        // Pasamos la resta de los asientos para pasar la cantidad a sumar
        sumaAsientos : (inputAsientoValue < datosOriginales.asientosOriginales)? (datosOriginales.asientosOriginales - inputAsientoValue) : '-'+(inputAsientoValue - datosOriginales.asientosOriginales),
        asientosReserva : inputAsientoValue,
        pagoSel : inputPagoSel
    }

    fetch('/api/modificarReserva', {
        method: 'POST',
        body: JSON.stringify(datosEnviar),
        headers:{'Content-Type': 'application/json'}
    })
    .then(function(response) {
        if(response.ok) {
            location.reload()

            
        } else {
            throw "Error en la llamada Ajax";
        }

    })
    .catch(function(err) {
        console.log(err);
    });
}

// Funcion para general el select dentro de cada reserva
function generarSel(metodo_pago){
    let metodosPago = [['TC','Tarjeta de crédito'],['TF','Transferencia Bancaria'] ,['PMA','Pago mediante Activos']]
    let cadena = ''
    for(item of metodosPago){
        if(metodo_pago == item[0]){
            cadena += `<option value='${item[0]}' selected>${item[1]}</option>`
        }else{
            cadena += `<option value='${item[0]}'>${item[1]}</option>`
        }
    }
    return cadena
}