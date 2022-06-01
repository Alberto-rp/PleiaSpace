window.addEventListener('load', initVehicle)

function initVehicle(){
    window.addEventListener('scroll', animsVehicle)
}

function animsVehicle(){
    // console.log(window.scrollY)

    // let media_queryPEQUE = 'screen and (max-width:576px)';
    // let media_queryMED = 'screen and (min-width:576px) and (max-width:1280px)';
    // let dependiente = 0

    // //Comprobar el mediaquery activo
    // let coincidePeque = window.matchMedia(media_queryPEQUE).matches
    // let coincideMed = window.matchMedia(media_queryMED).matches

    // if(coincidePeque){
    //     dependiente = 3000
    // }else if(coincideMed){
    //     dependiente = 3200
    // }else{
    //     dependiente = 2300
    // }

    // if(window.scrollY >= dependiente){
    //     document.querySelector("#titu1").style.position = 'relative'
    // }else{
    //     document.querySelector("#titu1").style.position = 'sticky'
    // }
}