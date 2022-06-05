window.addEventListener("load", init)

// Recogemos parametros error de la URL
const queryURL = window.location.search
const parametros = new URLSearchParams(queryURL)
let errorURL = parametros.get('error')

function init(){
    tempAlert(2500, errorURL)
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

        // Asignamos la id al formulario de anular vuelo y eliminar cuenta, en caso de que quiera anularlo
        document.querySelector("#UsuarioCancela").value = data[0].id_usuario
        document.querySelector("#UsuarioElimina").value = data[0].id_usuario

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
                            <th><b>Precio</b></th>
                            <th><b>Asientos</b></th>
                            <th><b>Método de Pago</b></th>
                            </tr>`
                for(vuelo of datosVuelos){
                    // Calcular los asientos disponibles de cada vuelo para el MAX
                    tabla += `<tr>
                                <td>${vuelo.id_vuelo}</td>
                                <td>${new Date(vuelo.fecha).toLocaleDateString()}</td>
                                <td>${vuelo.orbita_destino}</td>
                                <td id="Prec${vuelo.id_vuelo}" name="${vuelo.precio_asiento}">${pintarPrecio(vuelo.precio_asiento * vuelo.asientos_reservados)}</td>
                                <td><input type="number" max="4" min="1" value="${vuelo.asientos_reservados}" class="noActiva" id="asients${vuelo.id_vuelo}" name="asients" readonly></td>
                                <td><select class="noActiva" id="metpag${vuelo.id_vuelo}" disabled>${generarSel(vuelo.metodo_pago)}</select>
                                <td><button class='btn btn-primary' name='btnModi[]' id="Modi${vuelo.id_vuelo}">Modificar</button></td>
                                <td><button class="btn btn-danger" data-toggle="modal" data-target="#ModalAnul" name='btnModales[]' id='Anul${vuelo.id_vuelo}'>Anular</button></td>
                              </tr>`
                }
                tabla += '</table>'
                divVuelos.innerHTML += tabla

                // Asignamos funcionalidad a los botones de cada vuelo. id del vuelo al que representan además
                initBotonesMod()
            }else{
                // Si no ha reservado vuelos, solo se muestran los campos de registro
                // document.querySelector("#datosSecundarios").style.display = 'none'
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
        item.addEventListener("click", resetBotonAnular)
    }
    for(item of botonesMod){
        item.addEventListener("click", modificarReserva)
    }
}

function asignarId(){
    document.querySelector("#VueloCancela").value = this.id.slice(4)
}

// PRIMER PARADA MODIFICAR RESERVA
function modificarReserva(){
    vueloMod = this.id.slice(4)
    
    inputAsiento = document.querySelector("#asients"+vueloMod)
    inputPago = document.querySelector("#metpag"+vueloMod)

    // evento para recalcular precio
    inputAsiento.addEventListener("input", recalcularPrecio)

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

    // Sustituimos el boton de anular por un CANCELAR
    let btnAnul = document.querySelector("#Anul"+vueloMod)
    btnAnul.removeAttribute('data-toggle')
    btnAnul.removeAttribute('data-target')
    btnAnul.innerHTML = "Cancelar"
    btnAnul.className = 'btn btn-danger'
    btnAnul.removeEventListener("click", asignarId)
    btnAnul.removeEventListener("click", resetBotonAnular)
    btnAnul.addEventListener("click", cancelarMod)
}

// SEGUNDA PARADA ENVIAR DATOS
function EnviarModificacion(){
    vueloMod = this.id.slice(4)
    this.disabled = true

    inputAsiento = document.querySelector("#asients"+vueloMod)
    inputPago = document.querySelector("#metpag"+vueloMod)

    inputAsientoValue = inputAsiento.value
    inputPagoSel = inputPago[inputPago.selectedIndex].value

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
    .then(resp => {
        
        console.log(resp.status)
        if(resp.status == 200){
            inputAsiento.readOnly = true
            inputAsiento.classList = 'noActiva'
            inputPago.disabled = true
            inputPago.classList = 'noActiva'

            this.innerHTML = "Modificar"
            this.removeEventListener("click", EnviarModificacion)
            this.addEventListener("click", modificarReserva)
            inputAsiento.removeEventListener("input", recalcularPrecio)

            btnAnul = document.querySelector("#Anul"+vueloMod)
            btnAnul.removeEventListener("click", cancelarMod)
            btnAnul.addEventListener("click", asignarId)
            btnAnul.addEventListener("click", resetBotonAnular)
            btnAnul.innerHTML = "Anular"
            btnAnul.className = 'btn btn-danger'
            
        }else if(resp.status == 404){
            console.log('ERROR') //METER ERROR AQUI
        }
        this.disabled = false
        return resp.json()
    })
    .then(data =>{
        console.log(data)
        tempAlert(2000, data.error)
    })
    .catch(function(err) {
        console.log(err);
    });
}

// Cancelar la modificacion
function cancelarMod(){
    let btnAnul = document.querySelector("#Anul"+vueloMod)
    let btnMod = document.querySelector("#Modi"+vueloMod)
    inputAsiento = document.querySelector("#asients"+vueloMod)
    inputPago = document.querySelector("#metpag"+vueloMod)

    //Valores Originales
    inputAsiento.value = datosOriginales.asientosOriginales
    inputPago.value= datosOriginales.metPagoOriginal

    // Inputs
    inputAsiento.readOnly = true
    inputAsiento.classList = 'noActiva'
    inputPago.disabled = true
    inputPago.classList = 'noActiva'

    // Boton anular
    btnAnul.removeEventListener("click", cancelarMod)
    btnAnul.addEventListener("click", asignarId)
    btnAnul.addEventListener("click", resetBotonAnular)
    btnAnul.innerHTML = "Anular"
    btnAnul.className = 'btn btn-danger'

    // Boton modificar
    btnMod.innerHTML = "Modificar"
    btnMod.removeEventListener("click", EnviarModificacion)
    btnMod.addEventListener("click", modificarReserva)
}

function resetBotonAnular(){
    let btnAnul = document.querySelector("#Anul"+vueloMod)
    if(btnAnul.getAttribute('data-toggle') == null && btnAnul.getAttribute('data-target') == null){
        btnAnul.setAttribute('data-toggle', 'modal')
        btnAnul.setAttribute('data-target', '#ModalAnul')
    }
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

// Recalcular precio vuelo
function recalcularPrecio(idVuelo){
    let vueloMod = this.id.slice(7)
    document.querySelector("#Prec"+vueloMod).innerHTML = pintarPrecio(this.value * document.querySelector("#Prec"+vueloMod).attributes[1].value)
    //Ocultamos en el name el precio del asiento para evitar harcode
}