window.addEventListener('load', initVehicle)

function initVehicle(){
    window.addEventListener('scroll', animsVehicle)
    document.querySelector("#botonCarg").addEventListener("click", cambiarImg)
}

function cambiarImg(){
    let ruta = document.querySelector("#img_atlas").src
    let imagenes = ['ATLAS_1.png', 'ATLAS_2.png']
    
    if(ruta.endsWith(imagenes[0])){
        document.querySelector("#img_atlas").src = ruta.split(imagenes[0])[0]+imagenes[1] //ruta.split(URL + ATLAS)[0 para pillar atlas]
        this.innerHTML = 'MOSTRAR CONF CARGA'
        
        document.querySelector("#prt1").classList = 'd-none'
        document.querySelector("#prt1").classList = 'd-none'
        document.querySelector("#payload").innerHTML = `
                                                        <td>ASIENTOS</td>
                                                        <td class="text-right">4</td>
                                                        `

    }else{
        document.querySelector("#img_atlas").src = ruta.split(imagenes[1])[0]+imagenes[0]
        this.innerHTML = 'MOSTRAR CONF COMERCIAL'
        document.querySelector("#prt1").classList = 'table-row'
        document.querySelector("#prt2").classList = 'table-row'

        document.querySelector("#payload").innerHTML = `
                                                        <td>CARGA A LEO</td>
                                                        <td class="text-right">1.500Kg</td>
                                                        `
    }
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