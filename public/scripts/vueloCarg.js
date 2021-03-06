window.addEventListener("load", init)

const orbitas = ['LEO', 'SSO', 'GTO']

//En un entorno real esto tendría que venir de la BBDD
const preciosAddon = [['seguro', 0.05], ['adapt', 10000], ['elect', 5000], ['fuel', 12000]]

const fechaActual = new Date(Date.now())

//Para coger los errores de la URL
const queryURL = window.location.search
const parametros = new URLSearchParams(queryURL)
let errorURL = parametros.get('error')

// Objeto global que guarda los vuelos
let vuelosTOTAL = []

// variable global que guarda los datos que se van seleccionando
let datosVueloSelectGEN = []

// Ha volado antes?? (Completar con modal) Si la compañia existe en BD se pone a true
let companieExisteEnBD = false



function init() {
    //Leer el error de la URL
    tempAlert(3000, errorURL)

    initPaises() //Inicializar paises Form

    // Inicializamos los inputs
    for (item of orbitas) {
        document.querySelector("#orbit").innerHTML += `<option value="${item}">${item}</option>`
    }

    document.querySelector("#fechaIn").value = fechaActual.getFullYear() + "-" + mesFormat(fechaActual.getMonth())



    //Listeners
    document.querySelector("#btnComp").addEventListener("click", calcularPrecio)
    document.querySelector("#buscNameComp").addEventListener("input", buscarComp)
    document.querySelector("#cargaDatos").addEventListener("click", cargarDatosComp)
    asignarFuncion("btnPORT", addon, 'click')
    asignarFuncion("checksFS4[]", inputChecks, "click")

}

// Calcular precio 1
function calcularPrecio() {
    window.scrollTo(0, 0); //Para volver arriba de la pag
    let orbitaSelect = document.querySelector("#orbit")[document.querySelector("#orbit").selectedIndex].value
    let masaInput = document.querySelector("#peso").value
    let fechaValue = document.querySelector("[name='fechaIn']").value

    if (masaInput != '' && masaInput <= 750 && masaInput > 0) {
        let datosEnviar = {
            orbita: orbitaSelect,
            fecha: fechaValue
        }

        fetch('/api/vuelosCAR', {
            method: 'POST',
            body: JSON.stringify(datosEnviar),
            headers: { 'Content-Type': 'application/json' }
        })
            .then(resp => resp.json())
            .then(vuelos => {
                console.log(vuelos)
                if (vuelos.length > 0) { //METER FUNCION COMPROBAR SLOTS
                    document.querySelector("#precio").innerHTML = pintarPrecio(vuelos[0].precio_kg * masaInput)
                    // Reiniciamos la tabla de resultados y la mostramos
                    vuelosTOTAL = []
                    let tabla = ''
                    let salida = document.querySelector("#tablaResult")
                    tabla += `<table class="table table-responsive bg-dark" id='LABELS'>
                                    <tr>
                                        <th class='text-colcomp'>ID</th>
                                        <th class='text-colcomp'>FECHA</th>
                                        <th class='text-colcomp'>ORBITA</th>
                                        <th class='text-colcomp'>PORT-A</th>
                                        <th class='text-colcomp'>PORT-B</th>
                                        <th class='text-colcomp'>VEHICULO</th>
                                        <th class='text-colcomp'>PRECIO</th>
                                        <th></th>
                                    </tr>`

                    // Insertamos los datos de cada vuelo
                    for (item of vuelos) {
                        if (item.disp_port_A > 0 || item.disp_port_B > 0) {
                            tabla += `<tr id='FILA${item.id_vuelo}' name='filaR[]'>
                                        <td>${item.id_vuelo}</td>
                                        <td class='w-auto'>${item.fecha.slice(0, 7)}</td>
                                        <td>${item.orbita_destino}</td>
                                        <td>${item.disp_port_A}</td>
                                        <td>${item.disp_port_B}</td>
                                        <td>${item.lanzador}</td>
                                        <td>${new Number(item.precio_kg).toLocaleString("es-ES", { style: 'currency', currency: 'EUR' })}/Kg</td>`
                            if (masaInput > 100 && item.lanzador == 'ELECTRA') {
                                tabla += `<td><button disabled class='btn btn-colcomp' name='vtnVuelos' id='${item.id_vuelo}'>Seleccionar</button></td></tr>`
                            } else {
                                tabla += `<td><button class='btn btn-colcomp' name='vtnVuelos' id='${item.id_vuelo}'>Seleccionar</button></td></tr>`
                            }

                            vuelosTOTAL.push(item)
                        }
                    }
                    tabla += '</table>'
                    salida.innerHTML = tabla
                    document.querySelector("#fs2").style.display = 'block'
                    document.querySelector("#seccHead").innerHTML = '<b>SELECCION DE VUELO</b>'

                    asignarFuncion('vtnVuelos', selectPort, 'click')

                    // Alerta de puertos
                    let botones = document.getElementsByName("vtnVuelos")
                    for (item of botones) {
                        if (item.disabled == true) {
                            item.parentElement.addEventListener("mouseenter", alertaDisabled)
                        }
                    }

                } else {
                    // Si no hay vuelos, mostrar mensaje:
                    document.querySelector("#fs2").style.display = 'block'
                    document.querySelector("#tablaResult").innerHTML = `<div class="row bg-dark">
                                                                        <div class="col text-center">
                                                                            <p>Lo sentimos, no hay vuelos para las fechas seleccionadas.<br> 
                                                                            Consulte la sección de <a href='/calendario'>Calendario</a> o contacte a <a href='mailto:pleiaspace@gmail.com'>pleiaspace@gmail.com</a> 
                                                                            </p>
                                                                        </div>
                                                                    </div>`
                }
            })

    } else if (masaInput == '' || masaInput == 0) {
        tempAlert(2000, 'blank')
    } else {
        document.querySelector("#fs2").style.display = 'block'
        document.querySelector("#tablaResult").innerHTML = `<div class="row bg-dark">
                                                                <div class="col text-center">
                                                                    <p>Lo sentimos, no hay puertos con tanta capacidad.<br> 
                                                                    Para revisar las capacidades de nuestros vehiculos consulte la seccion <a href='/vehiculos'>Vehiculos</a><br>
                                                                    Si necesita un lanzamiento dedicado contacte a <a href='mailto:pleiaspace@gmail.com'>pleiaspace@gmail.com</a> 
                                                                    </p>
                                                                </div>
                                                            </div>`
    }



}

// Asignar botones
function asignarFuncion(nombre, funcion, disparador) {
    let botones = document.getElementsByName(nombre)
    for (item of botones) {
        item.addEventListener(disparador, funcion)
    }
}

// Funcion Seleccion puerto 2
function selectPort() {
    window.scrollTo(0, 0);//Para volver arriba de la pag
    //Seleccionamos la salida y buscamos el vuelo seleccionado
    let datosSel = document.querySelector("#datosSeleccionados")
    let datosVuelo = ''
    for (item of vuelosTOTAL) {
        if (item.id_vuelo == this.id) {
            datosVuelo = item
        }
    }
    // Asignamos los input hide y datos de puertos
    document.querySelector("#idVueloSel").value = this.id
    let masaInput = document.querySelector("#peso").value
    document.querySelector("#precioEstimado").value = masaInput * datosVuelo.precio_kg
    actualizarDatosLanzador(datosVuelo.lanzador)

    if (datosVuelo.disp_port_A == 0) {
        document.querySelector("#A").disabled = true
        document.querySelector("#A").parentElement.addEventListener("mouseenter", alertaPort0)
    }
    if (datosVuelo.disp_port_B == 0) {
        document.querySelector("#B").disabled = true
        document.querySelector("#B").parentElement.addEventListener("mouseenter", alertaPort0)
    }


    // Mostramos los datos elegidos y el siguiente fileset    
    datosVueloSelectGEN = [['id', datosVuelo.id_vuelo],
    ['vehiculo', datosVuelo.lanzador],
    ['fecha', datosVuelo.fecha],
    ['orbita', datosVuelo.orbita_destino],
    ['peso', masaInput],
    ['coste', document.querySelector("#precioEstimado").value]
    ]
    //Mostramos el resumen
    document.querySelector("#resumen").style.display = "inline-block"
    pintarResumen()
    datosSel.style.opacity = 1
    document.querySelector("#fs3").style.display = "inline-block"

    // Ocultamos el resto
    document.querySelector("#precio").parentElement.style.display = "none"
    document.querySelector("#btnComp").parentElement.style.display = 'none'
    document.querySelector("#fs1").style.display = 'none'
    document.querySelector("#fs2").style.display = 'none'

    document.querySelector("#seccHead").innerHTML = '<b>SELECCION DE PUERTO</b>'

}

// addons 3
function addon() {
    window.scrollTo(0, 0);//Para volver arriba de la pag
    // Guardamos la seleccion en un input oculto
    document.querySelector("#puertoSel").value = this.id
    datosVueloSelectGEN.push(['puerto', this.id])
    // Si se selecciona el puerto A se incrementa el precio en un 25%
    if (this.id == 'A') {
        for (item of datosVueloSelectGEN) {
            if (item[0] == 'coste') {
                item[1] *= 1.25
            }
        }
    }

    // Mostramos el resumen
    pintarResumen()

    // Mostrar siguiente form
    document.querySelector("#fs3").style.display = 'none'
    document.querySelector("#fs4").style.display = "inline-block"
    document.querySelector("#seccHead").innerHTML = '<b>COMPLETA TÚ VUELO</b>'

    // Boton confirmar evento
    document.querySelector("#confirmDatosAddons").addEventListener("click", initDatosConct)
}

// PASO 5/5
function initDatosConct() {
    window.scrollTo(0, 0);//Para volver arriba de la pag
    // Aztualizar Datos pasamos el coste de addons al total

    // Si se ha seleccionado y luego dejado a 0, eliminamos los indices
    if (valorMatriz(datosVueloSelectGEN, 'addons') == 0 && valorMatriz(datosVueloSelectGEN, 'addonsSEL').length == 0) {
        for (let i = 0; i < datosVueloSelectGEN.length; i++) {
            if (datosVueloSelectGEN[i][0] == 'addonsSEL' || datosVueloSelectGEN[i][0] == 'addons') {
                datosVueloSelectGEN.splice(i, 1)
                //Retrocedemos 1 en el indice para que se eliminen ambas
                i -= 1
            }
        }
    } else {
        // Actualizamos el precio total
        for (item of datosVueloSelectGEN) {
            if (item[0] == 'coste') {
                item[1] = (parseFloat(item[1]) + parseFloat(valorMatriz(datosVueloSelectGEN, 'addons')))
                break
            }
        }


        // Eliminamos el indice auxiliar addons
        for (let i = 0; i < datosVueloSelectGEN.length; i++) {
            if (datosVueloSelectGEN[i][0] == 'addons') {
                datosVueloSelectGEN.splice(i, 1)
                break
            }
        }
    }

    // Actualizamos datos
    pintarResumen()

    // Mostrar los siguientes elementos
    document.querySelector("#fs4").style.display = 'none'
    document.querySelector("#fs5").style.display = "inline-block"
    document.querySelector("#seccHead").innerHTML = '<b>DATOS DE CONTACTO</b>'
    document.querySelector("#sumaCheckout").innerHTML = pintarPrecio(valorMatriz(datosVueloSelectGEN, 'coste'))

    document.querySelector("#btnReservar").addEventListener("click", realizarReserva)
}

// Completar la reserva y enviar los datos
function realizarReserva() {
    window.scrollTo(0, 0);//Para volver arriba de la pag

    //Recogemos los nuevos datos y comprobamos que están rellenos
    let datosCompany = []
    let validate = true

    let nombreComp = document.querySelector("#nameComp").value
    let adress = document.querySelector("#adress").value
    let city = document.querySelector("#city").value
    let prov = document.querySelector("#prov").value
    let codPost = document.querySelector("#cod_Post").value
    let country = document.querySelector("#country").value
    let nombreContacto = document.querySelector("#nameContact").value
    let email = document.querySelector("#emailContact").value
    let phone = document.querySelector("#telContact").value

    datosCompany.push(nombreComp, adress, city, prov, codPost, country, nombreContacto, email, phone, companieExisteEnBD)

    //Si la compañia existe en BBDD, incluye el id de la misma
    if (companieExisteEnBD) {
        idComp = document.querySelector("#idComp").value
        datosCompany.push(idComp)
    }

    for (item of datosCompany) {
        //console.log(item)
        if (item === "") { //=== para poder enviar el false
            validate = false
        }
    }

    if (validate) {
        // Si todo esta relleno
        datosVueloSelectGEN.push(['datosComp', datosCompany])

        // Guardamos los datos del array en un objeto
        let datosEnviar = {}
        for (item of datosVueloSelectGEN) {
            if (item[0] != 'vehiculo' && item[0] != 'fecha' && item[0] != 'orbita') //No necesitamos estos datos para la reserva en el servidor, solo para mostrarlos durante el form
                datosEnviar[item[0]] = item[1]
        }

        fetch('/api/reservaCarga', {
            method: 'POST',
            body: JSON.stringify(datosEnviar),
            headers: { 'Content-Type': 'application/json' }
        })
            .then(resp => {

                console.log(resp.status)
                if (resp.status == 200) {
                    //Si todo sale bien OCULTAR TODO EL FORMULARIO
                    document.querySelector("#fs5").style.display = 'none'
                    document.querySelector("#padreDatosSelect").style.display = 'none'
                    document.querySelector("#seccHead").innerHTML = '<b>RESERVA REALIZADA</b>'
                } else if (resp.status == 404) {
                    console.log('ERROR')
                }
                return resp.json()
            })
            .then(data => {
                //console.log(data)
                tempAlert(4000, data.error)
            })
            .catch(function (err) {
                console.log(err);
            });
    } else {
        tempAlert(3000, 'rellenarCamps')
    }

}

// Funcion recalcular precio segun checks de ADDONS 
function inputChecks() {
    adons = []
    let checks = document.getElementsByName("checksFS4[]")
    for (item of checks) {
        if (item.checked) {
            adons.push(item.value)
        }
    }

    totalDinero = 0
    // SUMAR PRECIOS
    for (item of preciosAddon) {
        if (adons.indexOf(item[0]) != -1) {
            if (item[0] != 'seguro') {
                totalDinero += item[1]
            } else {
                totalDinero += (item[1] * valorMatriz(datosVueloSelectGEN, 'coste'))
            }
        }
    }

    // Mostramos el la suma total de los addons y la guardamos en la matriz de datos
    document.querySelector("#sumaAddon").innerHTML = pintarPrecio(totalDinero)

    if (valorMatriz(datosVueloSelectGEN, 'addons') == -1) {
        datosVueloSelectGEN.push(['addons', totalDinero])
    } else {
        for (item of datosVueloSelectGEN) {
            if (item[0] == 'addons') {
                item[1] = totalDinero
                break
            }
        }
    }

    // Guardamos los datos seleccionados
    if (valorMatriz(datosVueloSelectGEN, 'addonsSEL') == -1) {
        datosVueloSelectGEN.push(['addonsSEL', adons])
    } else {
        for (item of datosVueloSelectGEN) {
            if (item[0] == 'addonsSEL') {
                item[1] = adons
                break
            }
        }
    }
}

//funcion para buscar el indice de una matriz
function valorMatriz(matriz, elemento) {
    let salida = -1
    for (item of matriz) {
        if (item[0] == elemento) {
            salida = item[1]
        }
    }
    return salida
}

// Sacar dinero guay
function salidaDinero(suma) {
    return (suma < 1000000) ? Number(suma / 1000).toFixed(1) + 'K €' : Number(suma / 1000000).toFixed(2) + 'M €'
}

// Pintar Resumen
function pintarResumen() {
    let salida = document.querySelector("#datosSeleccionados")
    salida.innerHTML = ""
    let texto = ""
    for (item of datosVueloSelectGEN) {
        if (item[0] == 'fecha') {
            texto += fechaFormato(item[1])
        } else if (item[0] == 'peso') {
            texto += item[1] + "Kg"
        } else if (item[0] == 'coste') {
            texto += salidaDinero(item[1])
        } else if (item[0] == 'puerto') {
            texto += "Port " + item[1]
        } else if (item[0] != 'addonsSEL') {
            texto += item[1]
        }

        //Mientras no sea el ultimo elemento, y no sea puerto
        if (datosVueloSelectGEN.indexOf(item) != (datosVueloSelectGEN.length - 1) && item[0] != 'puerto') {
            texto += " | "
        }
    }
    salida.innerHTML = texto
}

// Datos lanzador
function actualizarDatosLanzador(vehiculo) {
    fetch('/api/vehiculos' + vehiculo)
        .then(resp => resp.json())
        .then(datos => {
            document.querySelector("#datosA").innerHTML = `<b>Puerto ${datos[0].diam_port_A}\"</b><br> MAX ${datos[0].peso_max_pA} Kg`
            document.querySelector("#datosB").innerHTML = `<b>Puerto ${datos[0].diam_port_B}\"</b><br> MAX ${datos[0].peso_max_pB} Kg`

            if (document.querySelector("#peso").value > datos[0].peso_max_pB) {
                document.querySelector("#B").disabled = true
                document.querySelector("#B").parentElement.addEventListener("mouseenter", alertaDisabledPort)
            }
        })
}

//nombre Compañia para cargar datos
function buscarComp() {

    if (this.value != "") {
        document.querySelector("#outputBusc").innerHTML = ''

        fetch(`/api/company${this.value}`)
            .then(resp => resp.json())
            .then(data => {

                if (data.length != undefined && data.length != 0) {
                    for (item of data) {
                        document.querySelector("#outputBusc").innerHTML += `<option value="${item.cod_comp}">${item.nombre}, ${item.ciudad},${item.pais}</option>`
                    }
                } else {
                    document.querySelector("#outputBusc").innerHTML = '<option value="-1">Sin resultados</option>'
                }
            })
    }
}

//Carga de datos de compañia y contacto
function cargarDatosComp() {
    let idComp = document.querySelector("#outputBusc").value
    let correoContact = document.querySelector("#correoComp").value

    let datosEnvioC = {
        id: idComp,
        correo: correoContact
    }

    if (idComp != -1) {
        fetch('/api/company/data', {
            method: 'POST',
            body: JSON.stringify(datosEnvioC),
            headers: { 'Content-Type': 'application/json' }
        })
            .then(resp => resp.json())
            .then(data => {
                if (data.error == undefined) {
                    document.querySelector("#nameComp").value = data.datosCompany[0].nombre
                    document.querySelector("#adress").value = data.datosCompany[0].direccion
                    document.querySelector("#city").value = data.datosCompany[0].ciudad
                    document.querySelector("#prov").value = data.datosCompany[0].provincia
                    document.querySelector("#cod_Post").value = data.datosCompany[0].codigo_postal
                    document.querySelector("#country").value = data.datosCompany[0].pais
                    document.querySelector("#nameContact").value = data.datosContact[0].nombre
                    document.querySelector("#emailContact").value = data.datosContact[0].email
                    document.querySelector("#telContact").value = data.datosContact[0].telefono

                    companieExisteEnBD = true
                    document.querySelector("#idComp").value = data.datosCompany[0].cod_comp

                } else {
                    document.querySelector("#buscNameComp").value = ''
                    document.querySelector("#correoComp").value = ''
                    document.querySelector("#outputBusc").innerHTML = '<option value="-1">Sin resultados</option>'
                    tempAlert(4000, data.error)
                }

            })
    } else {
        tempAlert(4000, 'selectOptionModal')
    }
}

// Alerta cuando vuelo no es compatible
function alertaDisabled() {
    window.scrollTo(0, 0);//Para volver arriba de la pag
    tempAlert(5000, 'vueloPeso')
}

// Alerta cuando peso excede puerto
function alertaDisabledPort() {
    window.scrollTo(0, 0);//Para volver arriba de la pag
    tempAlert(5000, 'portPeso')
}

// Alerta cuando no quedan puertos de este tipo
function alertaPort0() {
    window.scrollTo(0, 0);//Para volver arriba de la pag
    tempAlert(5000, 'port0')
}