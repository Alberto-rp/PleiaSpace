window.addEventListener("load", init)
let vuelosDisponibles = null
let metodosPago = [['TC','Tarjeta de crédito'],['TF','Transferencia Bancaria'] ,['PMA','Pago mediante Activos']]
let asientosDisponibles = []

// Errores
const queryURL = window.location.search
const parametros = new URLSearchParams(queryURL)
let errorURL = parametros.get('error')

function init(){
    document.querySelector("#envio").addEventListener("click", despFormulario)
    let resp = Response

    tempAlert(4000, errorURL)

    initPaises() //Inicializar paises Form

    // Inicializamos el input
    let fechaAct = new Date(Date.now())
    document.querySelector("#fechaIn").value = fechaAct.getFullYear()+"-"+mesFormat(fechaAct.getMonth())

    // Inicializamos los métodos de pago
    for(item of metodosPago){
        document.querySelector('#payMeth').innerHTML += `<option value='${item[0]}'>${item[1]}</option>`
    }

    // Rellenamos los campos con los datos del usuario registrado
    fetch('/api/compCookie'+getCookie('usuario'))
    .then(res => res.json())
    .then(data => {
        // Si se verifica que la cookie es correcta, Se autorrellenan los campos
        if(data.ok){
            fetch('/api/usuario')
            .then(resp => resp.json())
            .then(data => {
                document.querySelector("#name").value = data[0].nombre
                document.querySelector("#surnames").value = data[0].apellidos
                document.querySelector("#email").value = data[0].email
                document.querySelector("#country").value = data[0].pais
                document.querySelector("#idUsuario").value = data[0].id_usuario
            })
    
        }
    })

    //Listeners
    document.querySelector("#atras").addEventListener("click", atrasForm)
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
            if(vuelosR.length > 0 && vuelosConAsiento(vuelosR)){
                // Reiniciamos la tabla de resultados y la mostramos
                let tabla = ''
                tabla += `<table class="table table-responsive bg-dark" id='LABELS'>
                                    <tr class='text-colcomp'>
                                        <th>ID</th>
                                        <th>FECHA</th>
                                        <th>ORBITA</th>
                                        <th>ASIENTOS</th>
                                        <th>PRECIO</th>
                                        <th></th>
                                    </tr>`

                // Insertamos los datos de cada vuelo
                for(item of vuelosR){
                    if(item.asientos_disponibles > 0){
                        tabla += `<tr id='FILA${item.id_vuelo}' name='filaR[]'>
                                        <td>${item.id_vuelo}</td>
                                        <td class='w-auto'>${item.fecha.slice(0,7)}</td>
                                        <td>${item.orbita_destino}</td>
                                        <td>${item.asientos_disponibles}</td>
                                        <td>${new Number(item.precio_asiento).toLocaleString("es-ES",{style:'currency',currency:'EUR'})}</td>
                                        <td><button class='btn btn-colcomp' name='vtnVuelos' id='${item.id_vuelo}'>Seleccionar</button></td>
                                        </tr>`
                        asientosDisponibles.push([item.id_vuelo, item.asientos_disponibles])
                    }
                }
                tabla += '</table>'
                divCont.innerHTML = tabla
                document.querySelector("#fs1_5").style.display = 'inline-block'
                document.querySelector("#fs1").style.display = 'none'
                asignarFuncion()
                
            }else{
                // Si no hay vuelos, mostrar mensaje:
                document.querySelector("#fs1_5").style.display = 'inline-block'
                document.querySelector("#fs1").style.display = 'none'
                divCont.innerHTML = `<div class="row darkColor">
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

function atrasForm(e){
    e.preventDefault()
    document.querySelector("#fs1").style.display = "inline-block"
    document.querySelector("#fs1_5").style.display = "none"
    document.querySelector("#fs2").style.display = "none"
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

// Comprobar que hay al menos un vuelo con asiento disponibles
function vuelosConAsiento(vuelos){
    let numAsientos = 0
    for(item of vuelos){
        numAsientos += item.asientos_disponibles
    }
    return (numAsientos > 0)? true : false
}

function mesFormat(mes){
    return (mes < 10)? '0'+(mes+1) : (mes+1)
}

function nextStep(e){
    document.body.style.paddingTop = '6rem'
    document.querySelector("#jumbo").style.display = "none"
    
    pintarResumen(this.id)
    e.preventDefault()
    //Ocultamos el formulario inicial y mostramos el segundo
    document.querySelector("#fs1").style.display = "none"
    document.querySelector("#fs1_5").style.display = "none"
    document.querySelector("#fs2").style.display = "inline-block"
    document.querySelector("#fs2").disabled = ""

    // Guardamos la id del vuelo en el formulario
    document.querySelector("#idVueloSel").value = this.id

    // Asignamos los asientos dispobibles
    for(item of asientosDisponibles){
        if(item[0] == this.id){
            iterador = item[1]
        }
    }
    for(let i = 1; i <= iterador; i++){
        document.querySelector("#numAsients").innerHTML += `<option value='${i}'>${i}</option>`
    }
    
    //Ocultamos los vuelos no seleccionados
    let filas = document.getElementsByName("filaR[]")
    for(item of filas){
        if(item.id != `FILA${this.id}` && item.id != 'LABELS'){
            item.style.display = "none"
        }
    }
}

// Pintar Resumen
function pintarResumen(idVuelo){
    let salida = document.querySelector("#datosSeleccionados")
    salida.innerHTML = ""
    let texto = ""

    for(item of vuelosDisponibles){
        if(item.id_vuelo == idVuelo){
            texto += `${item.id_vuelo} | ${fechaFormato(item.fecha)} | ${item.orbita_destino} | ${salidaDinero(item.precio_asiento)}`
        }
    }
    salida.innerHTML = texto
}

//Sacar dinero guay resumen
function salidaDinero(suma){
    return (suma < 1000000)? Number(suma/1000).toFixed(3)+'K €' : Number(suma/1000000).toFixed(3)+'M €'
}

