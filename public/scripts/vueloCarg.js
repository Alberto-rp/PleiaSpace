const orbitas = ['LEO','SSO','GTO']
const fechaActual = new Date(Date.now())
// Objeto global que guarda los vuelos
let vuelosTOTAL = []


window.addEventListener("load", init)

function init(){

    // Inicializamos los inputs
    for(item of orbitas){
        document.querySelector("#orbit").innerHTML += `<option value="${item}">${item}</option>`
    }

    document.querySelector("#fechaIn").value = fechaActual.getFullYear()+"-"+mesFormat(fechaActual.getMonth())



    //Listeners
    document.querySelector("#btnComp").addEventListener("click", calcularPrecio)
    asignarFuncion("btnPORT", addon)

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
            document.querySelector("#precio").innerHTML = pintarPrecio(vuelos[0].precio_kg * masaInput)
            if(vuelos.length > 0){ //METER FUNCION COMPROBAR SLOTS
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
                                        <td>${new Number(item.precio_kg).toLocaleString("es-ES",{style:'currency',currency:'EUR'})}/Kg</td>
                                        <td><button class='btn btn-primary' name='vtnVuelos' id='${item.id_vuelo}'>Seleccionar</button></td>
                                        </tr>`
                        vuelosTOTAL.push(item)
                    }
                }
                tabla += '</table>'
                salida.innerHTML = tabla
                document.querySelector("#fs2").style.display = 'block'
                asignarFuncion('vtnVuelos', selectPort)
    
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
function asignarFuncion(nombre, funcion){
    let botones = document.getElementsByName(nombre)
    for(item of botones){
        item.addEventListener("click", funcion)
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
    datosSel.innerHTML = datosVuelo.id_vuelo+" | "+datosVuelo.lanzador+" | "+fechaFormato(datosVuelo.fecha)+" | "+datosVuelo.orbita_destino+" | "+(document.querySelector("#precioEstimado").value / 1000)+"K €"
    datosSel.style.opacity = 1
    document.querySelector("#fs3").style.display = "inline-block"

    // Ocultamos el resto
    document.querySelector("#precio").parentElement.style.display = "none"
    document.querySelector("#btnComp").parentElement.style.display = 'none'
    document.querySelector("#fs1").style.display = 'none'
    document.querySelector("#fs2").style.display = 'none'

    console.log(this.id)
}

// addons 3
function addon(){
    console.log(this.id)
}

// Funcion sacar la fecha Guay
function fechaFormato(fechaEnt){
    let fecha = new Date(fechaEnt)
    let mes = (fecha.getMonth() < 10)? '0'+(fecha.getMonth()+1) : (fecha.getMonth()+1)
    return mes+"/"+fecha.getFullYear()  
}

// Datos lanzador
function actualizarDatosLanzador(vehiculo){
    // fetch A FUTURO
    let pesoA = 0
    let pesoB = 0

    document.querySelector("#datosA").innerHTML = `12`
    document.querySelector("#datosB").innerHTML = `12`
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
        case'fail':
            divAlerta.classList.add("alert-danger")
            divAlerta.innerHTML = "<strong>Error</strong> Usuario o contraseña incorrectos"
            break;
        case 'auth':
            divAlerta.classList.add("alert-danger")
            divAlerta.innerHTML = "<strong>Error</strong> Debes iniciar sesión para reservar un vuelo"
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