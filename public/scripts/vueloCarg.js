const orbitas = ['LEO','SSO','GTO']
const fechaActual = new Date(Date.now())
// Objeto global que guarda los vuelos
let vuelosTOTAL = []
let datosVueloSelectGEN = []


window.addEventListener("load", init)

function init(){

    // Inicializamos los inputs
    for(item of orbitas){
        document.querySelector("#orbit").innerHTML += `<option value="${item}">${item}</option>`
    }

    document.querySelector("#fechaIn").value = fechaActual.getFullYear()+"-"+mesFormat(fechaActual.getMonth())



    //Listeners
    document.querySelector("#btnComp").addEventListener("click", calcularPrecio)
    asignarFuncion("btnPORT", addon, 'click')

}

//Pintar mes bonito
function mesFormat(mes){
    return (mes < 10)? '0'+(mes+1) : (mes+1)
}

// Pintar precio bonito
function pintarPrecio(num){
    return new Number(num).toLocaleString("es-ES",{style:'currency',currency:'EUR'})
}

// Calcular precio 1
function calcularPrecio(){
    let orbitaSelect = document.querySelector("#orbit")[ document.querySelector("#orbit").selectedIndex].value
    let masaInput = document.querySelector("#peso").value
    let fechaValue = document.querySelector("[name='fechaIn']").value

    if(masaInput != '' && masaInput < 750){
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
            if(vuelos.length > 0){ //METER FUNCION COMPROBAR SLOTS
                document.querySelector("#precio").innerHTML = pintarPrecio(vuelos[0].precio_kg * masaInput)
                // Reiniciamos la tabla de resultados y la mostramos
                vuelosTOTAL = []
                let tabla = ''
                let salida = document.querySelector("#tablaResult")
                tabla += `<table class="table table-responsive bg-dark" id='LABELS'>
                                    <tr>
                                        <td>ID</td>
                                        <td>FECHA</td>
                                        <td>ORBITA</td>
                                        <td>PORT-A</td>
                                        <td>PORT-B</td>
                                        <td>VEHICULO</td>
                                        <td>PRECIO</td>
                                    </tr>`
    
                // Insertamos los datos de cada vuelo
                for(item of vuelos){
                    if(item.disp_port_A > 0 || item.disp_port_B > 0){
                        tabla += `<tr id='FILA${item.id_vuelo}' name='filaR[]'>
                                        <td>${item.id_vuelo}</td>
                                        <td class='w-auto'>${item.fecha.slice(0,7)}</td>
                                        <td>${item.orbita_destino}</td>
                                        <td>${item.disp_port_A}</td>
                                        <td>${item.disp_port_B}</td>
                                        <td>${item.lanzador}</td>
                                        <td>${new Number(item.precio_kg).toLocaleString("es-ES",{style:'currency',currency:'EUR'})}/Kg</td>`
                                        if(masaInput > 100 && item.lanzador == 'ELECTRA'){
                                            tabla += `<td><button disabled class='btn btn-primary' name='vtnVuelos' id='${item.id_vuelo}'>Seleccionar</button></td></tr>`
                                        }else{
                                            tabla += `<td><button class='btn btn-primary' name='vtnVuelos' id='${item.id_vuelo}'>Seleccionar</button></td></tr>`
                                        }
                                        
                        vuelosTOTAL.push(item)
                    }
                }
                tabla += '</table>'
                salida.innerHTML = tabla
                document.querySelector("#fs2").style.display = 'block'
                document.querySelector("#seccHead").innerHTML = 'SELECCION DE VUELO'

                asignarFuncion('vtnVuelos', selectPort, 'click')
                
                // Alerta de puertos
                let botones = document.getElementsByName("vtnVuelos")
                for(item of botones){
                    if(item.disabled == true){
                        item.parentElement.addEventListener("mouseenter", alertaDisabled)
                    }
                }
    
            }else{
                // Si no hay vuelos, mostrar mensaje:
                document.querySelector("#fs2").style.display = 'block'
                document.querySelector("#tablaResult").innerHTML = `<div class="row bg-dark">
                                                                        <div class="col text-center">
                                                                            <p>Lo sentimos, no hay vuelos para las fechas seleccionadas.<br> 
                                                                            Consulte la sección de <a href='/calendario'>Calendario</a> o contacte a <a href='#'>despegues@pleiaspace.com</a> 
                                                                            </p>
                                                                        </div>
                                                                    </div>`
            }
        })

    }else if(masaInput == ''){
        tempAlert(2000,'blank')
    }else{
        document.querySelector("#fs2").style.display = 'block'
        document.querySelector("#tablaResult").innerHTML = `<div class="row bg-dark">
                                                                <div class="col text-center">
                                                                    <p>Lo sentimos, no hay puertos con tanta capacidad.<br> 
                                                                    Para revisar las capacidades de nuestros vehiculos consulte la seccion <a href='#'>Vehiculos</a><br>
                                                                    Si necesita un lanzamiento dedicado contacte a <a href='#'>despegues@pleiaspace.com</a> 
                                                                    </p>
                                                                </div>
                                                            </div>`
    }


    
}

// Asignar botones
function asignarFuncion(nombre, funcion, disparador){
    let botones = document.getElementsByName(nombre)
    for(item of botones){
        item.addEventListener(disparador, funcion)
    }
}

// Funcion Seleccion puerto 2
function selectPort(){
    //Seleccionamos la salida y buscamos el vuelo seleccionado
    let datosSel = document.querySelector("#datosSeleccionados")
    let datosVuelo = ''
    for(item of vuelosTOTAL){
        if(item.id_vuelo == this.id){
            datosVuelo = item
        }
    }

    // Asignamos los input hide y datos de puertos
    document.querySelector("#idVueloSel").value = this.id
    let masaInput = document.querySelector("#peso").value
    document.querySelector("#precioEstimado").value = masaInput * datosVuelo.precio_kg
    actualizarDatosLanzador(datosVuelo.lanzador)
    

    // Mostramos los datos elegidos y el siguiente fileset    
    datosVueloSelectGEN = [['id',datosVuelo.id_vuelo],
                        ['vehiculo', datosVuelo.lanzador],
                        ['fecha', datosVuelo.fecha],
                        ['orbita', datosVuelo.orbita_destino],
                        ['peso', masaInput],
                        ['coste', document.querySelector("#precioEstimado").value]
                        ]
    pintarResumen()
    datosSel.style.opacity = 1
    document.querySelector("#fs3").style.display = "inline-block"

    // Ocultamos el resto
    document.querySelector("#precio").parentElement.style.display = "none"
    document.querySelector("#btnComp").parentElement.style.display = 'none'
    document.querySelector("#fs1").style.display = 'none'
    document.querySelector("#fs2").style.display = 'none'

    document.querySelector("#seccHead").innerHTML = 'SELECCION DE PUERTO'
    console.log(this.id)
}

// addons 3
function addon(){
    // Guardamos la seleccion en un input oculto
    document.querySelector("#puertoSel").value = this.id
    datosVueloSelectGEN.push(['puerto',this.id])
    // Si se selecciona el puerto A se incrementa el precio en un 25%
    if(this.id == 'A'){
        for(item of datosVueloSelectGEN){
            if(item[0] == 'coste'){
                item[1] *= 1.25
            }
        }
    }

    // Mostramos el resumen
    pintarResumen()

    // Mostrar siguiente form
    document.querySelector("#fs3").style.display = 'none'
    document.querySelector("#fs4").style.display = "inline-block"
    document.querySelector("#seccHead").innerHTML = 'COMPLETA TÚ VUELO'
}

// Funcion sacar la fecha Guay
function fechaFormato(fechaEnt){
    let fecha = new Date(fechaEnt)
    let mes = (fecha.getMonth() < 10)? '0'+(fecha.getMonth()+1) : (fecha.getMonth()+1)
    return mes+"/"+fecha.getFullYear()  
}

// Sacar dinero guay
function salidaDinero(suma){
    console.log(suma)
    return (suma < 1000000)? (suma/1000)+'K €' : (suma/1000000)+'M €'
}

// Pintar Resumen
function pintarResumen(){
    let salida = document.querySelector("#datosSeleccionados")
    salida.innerHTML = ""
    let texto = ""
    for(item of datosVueloSelectGEN){
        if(item[0] == 'fecha'){
            texto += fechaFormato(item[1])
        }else if(item[0] == 'peso'){
            texto += item[1]+"Kg"
        }else if(item[0] == 'coste'){
            texto += salidaDinero(item[1])
        }else if(item[0] == 'puerto'){
            texto += "Port "+item[1]
        }else{
            texto += item[1]
        }

        if(datosVueloSelectGEN.indexOf(item) !=  (datosVueloSelectGEN.length - 1)){
            texto += " | "
        }
    }
    salida.innerHTML = texto
}

// Datos lanzador
function actualizarDatosLanzador(vehiculo){
    fetch('/api/vehiculos'+vehiculo)
    .then(resp => resp.json())
    .then(datos => {
        document.querySelector("#datosA").innerHTML = `<b>Puerto ${datos[0].diam_port_A}\"</b><br> MAX ${datos[0].peso_max_pA} Kg`
        document.querySelector("#datosB").innerHTML = `<b>Puerto ${datos[0].diam_port_B}\"</b><br> MAX ${datos[0].peso_max_pB} Kg`

        if(document.querySelector("#peso").value > datos[0].peso_max_pB){
            document.querySelector("#B").disabled = true
            document.querySelector("#B").parentElement.addEventListener("mouseenter", alertaDisabledPort)
        }
    })
}

// Alerta cuando vuelo no es compatible
function alertaDisabled(){
    tempAlert(5000,'vueloPeso')
}

// Alerta cuando peso excede puerto
function alertaDisabledPort(){
    tempAlert(5000,'portPeso')
}

// Alerta que se auto cierra
function tempAlert(duration, error){
    var divAlerta = document.querySelector("#alerta2");
    // Analizamos error
    switch(error){
        case 'blank':
            divAlerta.classList.add("alert-danger")
            divAlerta.innerHTML = "<strong>Error</strong> Debes introducir una masa!"
            break;
        case'portPeso':
            divAlerta.classList.add("alert-danger")
            divAlerta.innerHTML = "La masa que has elegido excede las capacidades de este puerto."
            break;
        case'vueloPeso':
            divAlerta.classList.add("alert-danger")
            divAlerta.innerHTML = "La masa que has elegido excede las capacidades de este vehiculo.<br> Para revisar las capacidades de nuestros vehiculos consulte la seccion <a href='#'>Vehiculos</a>"
            break;
        case 'noerror':
            divAlerta.classList.add("alert-success")
            divAlerta.innerHTML = "<strong>Bien!</strong> Registrado correctamente"
            break;
        default:
            divAlerta.innerHTML = ""
    }

    // Mostramos la alerta
    divAlerta.style.opacity = '1'
    setTimeout(function(){

    divAlerta.style.opacity = '0'
    divAlerta.className = ''
    divAlerta.classList.add("alert")

    },duration);
}