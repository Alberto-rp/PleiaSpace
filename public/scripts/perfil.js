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

        // Sacamos los datos de las reservas si tiene
        fetch('/api/vuelos/usuario'+data[0].id_usuario)
        .then(resp => resp.json())
        .then(datosVuelos => {

            let divVuelos = document.querySelector("#tdReserv")
            if(datosVuelos.length > 0){
                divVuelos.innerHTML += `<div class="row">
                                            <div class="col"><b>Vuelo</b></div>
                                            <div class="col"><b>Fecha</b></div>
                                            <div class="col"><b>Orbita</b></div>
                                            <div class="col"><b>Asientos</b></div>
                                            <div class="col"><b>Pago</b></div>
                                            </div>`
                for(vuelo of datosVuelos){
                    divVuelos.innerHTML += `<div class="row">
                                            <div class="col">${vuelo.id_vuelo}</div>
                                            <div class="col">${new Date(vuelo.fecha).toLocaleDateString()}</div>
                                            <div class="col">${vuelo.orbita_destino}</div>
                                            <div class="col">${vuelo.asientos_reservados}</div>
                                            <div class="col">${vuelo.metodo_pago}</div>
                                            </div>`
                }
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