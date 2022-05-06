window.addEventListener("load", init)

function init(){
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
                            <th><b>Pago</b></th>
                            </tr>`
                for(vuelo of datosVuelos){
                    tabla += `<tr>
                                <td>${vuelo.id_vuelo}</td>
                                <td>${new Date(vuelo.fecha).toLocaleDateString()}</td>
                                <td>${vuelo.orbita_destino}</td>
                                <td>${vuelo.asientos_reservados}</td>
                                <td><input type="text" value="${vuelo.metodo_pago}" class="noActiva" id="metpag" name="metpag" readonly></td>
                                <td><button class='btn btn-primary' id="Mod${vuelo.id_vuelo}">Modificar</button></td>
                                <td><button class="btn btn-primary" data-toggle="modal" data-target="#ModalAnul" name='btnModales[]' id='Anul${vuelo.id_vuelo}'>Anular</button></td>
                              </tr>`
                }
                tabla += '</table>'
                divVuelos.innerHTML += tabla
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
    let botones = document.getElementsByName("btnModales[]")
    for(item of botones){
        item.addEventListener("click", asignarId)
    }
}

function asignarId(){
    document.querySelector("#VueloCancela").value = this.id.slice(4)
}