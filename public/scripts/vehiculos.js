window.addEventListener('load', initVehicle)

function initVehicle(){
    window.addEventListener('scroll', animsVehicle)
}

function animsVehicle(){
    console.log(window.scrollY)

    if(window.scrollY >= 600){
        document.querySelector("#titu1").style.position = 'relative'
    }else{
        document.querySelector("#titu1").style.position = 'sticky'
    }
}