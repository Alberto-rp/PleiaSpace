window.addEventListener('load', initVehicle)

function initVehicle(){
    document.querySelector("#botonCarg").addEventListener("click", cambiarImg)
}

function cambiarImg(){
    let ruta = document.querySelector("#img_atlas").src
    let imagenes = ['ATLAS_1.png', 'ATLAS_2.png']
    
    if(ruta.endsWith(imagenes[0])){
        document.querySelector("#img_atlas").src = ruta.split(imagenes[0])[0]+imagenes[1] //ruta.split() => ([URL],[ATLAS]) [0 para pillar la URL] + img[1] para añadirle el otro png
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