window.addEventListener('load', init)
lanzada = false
lanzadaDesvan = true
// let timer


function init() {
    window.addEventListener('scroll', prueba)
}

let contador = 0
let contadorcarg = 0
function prueba() {
    // console.log(window.scrollY)
    if(window.scrollY < 50){
        document.querySelector("#titulo").style.opacity = 1
        contadorDesvanecer = 1
        contadorcarg = 0
        contador = 0
        lanzada = false
        document.querySelector("#contador").innerHTML = '<b>00</b>'
        document.querySelector("#contadorCarg").innerHTML = '<b>00</b>'
    }
    
    if(window.scrollY >= 200 && !lanzada){
        lanzada = true
        contCom()
        contCar()
    }

    if(window.scrollY >= 50 && window.scrollY < 100){
        desvanecer() //Meterlo en un if con diferente scrolly
    }


    
}
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

let contadorDesvanecer = 1
function desvanecer(){
    if(contadorDesvanecer > 0.0){
        setTimeout(desvanecer, 40)
    }
    if(contadorDesvanecer > 0.0){
        contadorDesvanecer -= 0.01
        document.querySelector("#titulo").style.opacity = contadorDesvanecer
    }

}

function salidaContadores(number){
    return (number <= 9)? '0'+number : number
}

// function fade(element) {
//     var op = 1;  // initial opacity
//     timer = setInterval(function () {
//         if (op <= 0){
//             clearInterval(timer);
//         }
//         element.style.opacity = op;
//         element.style.filter = 'alpha(opacity=' + op * 100 + ")";
//         op -= op * 0.1;
//     }, 50);
// }

// function fadeOut(element) {
//     var op = 0;  // initial opacity
//     var timer = setInterval(function () {
//         if (op >= 1){
//             clearInterval(timer);
//         }
//         element.style.opacity = op;
//         element.style.filter = 'alpha(opacity=' + op * 100 + ")";
//         op += op * 0.1;
//     }, 50);
// }