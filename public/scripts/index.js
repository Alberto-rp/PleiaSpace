window.addEventListener('load', initIndex)

//Variables para controlar desvanecery scroll
lanzada = false
let contadorParp = 1
let contador = 0
let contadorcarg = 0

function initIndex() {
    window.addEventListener('scroll', anims)

    let num1Inicio = (window.scrollY * 100)/300
    let convertidaInicio = (1 - (num1Inicio/100))

    document.querySelector("#titulo").style.opacity = convertidaInicio
    document.querySelector("#contacto").style.opacity = 0
    parpadeo()
}


//Funcion que controla las "animaciones"
function anims() {
    if(window.scrollY <= 300){
        //Para desvanecer el titulo, cogemos la posición Y, y calculamos su porcentaje sabiendo que 300 es el 100% donde debe desaparecer
        let num1 = (window.scrollY * 100)/300
    
        //Convertimos ese valor en uno apto para opacity; el pixel Y0 equivale ahora a 1, y el pixel Y300 equivale a 0
        let convertida = (1 - (num1/100))
    
        document.querySelector("#titulo").style.opacity = convertida
    }

    //Desvanecer contacto
    let media_queryPEQUE = 'screen and (max-width:576px)';
    let media_queryMED = 'screen and (min-width:576px) and (max-width:1280px)';
    let dependiente = 0

    //Comprobar el mediaquery activo
    let coincidePeque = window.matchMedia(media_queryPEQUE).matches
    let coincideMed = window.matchMedia(media_queryMED).matches

    if(coincidePeque){
        dependiente = 2630
    }else if(coincideMed){
        dependiente = 2830
    }else{
        dependiente = 2950
    }

    if(window.scrollY >= dependiente){
        let num1 = ((window.scrollY - dependiente) * 100)/200
        let convertida = (num1/100)

    
        document.querySelector("#contacto").style.opacity = convertida
    }

    //Reiniciamos los números de lanzamientos
    if(window.scrollY < 80){
        contadorcarg = 0
        contador = 0
        lanzada = false
        document.querySelector("#contador").innerHTML = '<b>00</b>'
        document.querySelector("#contadorCarg").innerHTML = '<b>00</b>'
    }
    
    //Lanzamos los números de lanzamientos
    if(window.scrollY >= 200 && !lanzada){
        lanzada = true
        contCom()
        contCar()
    }


    
}

//Parpadeo para invitar a bajar (solo se ve en pantallas MD y en el movil)
function parpadeo(){
    let objetivo = document.querySelector("#slideDown")
    if(window.scrollY <= 400){

    
        if(contadorParp <= 1 && contadorParp > 0){
            setTimeout(parpadeo, 100)
        }else{
            contadorParp = 1
            objetivo.style.opacity = 1
            setTimeout(parpadeo, 100)
        }
    

        contadorParp -= 0.1
        objetivo.style.opacity = contadorParp
        
    }else{
        objetivo.style.opacity = 0
    }
}

//Funcion pintar numeros crecientes de Vuelos comerciales
function contCom(){
    if(contador < 24){
        if(contador <= 16){
            setTimeout(contCom, 20)
        }else{
            setTimeout(contCom, 150)
        }
    }
    if(contador < 24){
        document.querySelector("#contador").innerHTML = `<b>${salidaContadores(++contador)}</b>`
    }

}

//Funcion pintar numeros crecientes de Vuelos de carga
function contCar(){
    if(contadorcarg < 73){
        if(contadorcarg <= 60){
            setTimeout(contCar, 10)
        }else{
            setTimeout(contCar, 100)
        }
    }
    if(contadorcarg < 73){
        document.querySelector("#contadorCarg").innerHTML = `<b>${salidaContadores(++contadorcarg)}</b>`
    }

}

//Sacar el numero de los contadores bonito
function salidaContadores(number){
    return (number <= 9)? '0'+number : number
}