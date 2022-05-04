window.addEventListener("load", init)
let vuelosDisponibles = null
let metodosPago = [['TC','Tarjeta de crédito'],['TF','Transferencia Bancaria'] ,['PMA','Pago mediante Activos']]
let asientosDisponibles = []

// Errores
const queryURL = window.location.search
const parametros = new URLSearchParams(queryURL)
let error = parametros.get('error')

function init(){
    document.querySelector("#envio").addEventListener("click", despFormulario)

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

    // Comprobar errores URL
    switch(error){
        case'error1':
            divAlerta.classList.add("alert-danger")
            divAlerta.style.display = 'block'
            divAlerta.children[0].innerHTML = "<strong>Error</strong> Debes introducir algo"
            break;
        case'error2':
            divAlerta.classList.add("alert-danger")
            divAlerta.style.display = 'block'
            divAlerta.children[0].innerHTML = "<strong>Error</strong> Usuario o contraseña incorrectos"
            break;
        case'error3':
            divAlerta.classList.add("alert-danger")
            divAlerta.style.display = 'block'
            divAlerta.children[0].innerHTML = "<strong>Error</strong> Debes iniciar sesion para reservar vuelo"
            break;
        case'noerror':
            divAlerta.classList.add("alert-success")
            divAlerta.style.display = 'block'
            divAlerta.children[0].innerHTML = "<strong>Bien!</strong> Usuario creado correctamente"
        break;
    }
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
                    asientosDisponibles.push([item.id_vuelo, item.asientos_disponibles])
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
    let divResultado = document.querySelector("#tablaResult").children
    for(item of divResultado){
        if(item.id != `FILA${this.id}` && item.id != 'LABELS'){
            item.style.display = "none"
        }
    }
}

