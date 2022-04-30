// Inicializar lista paises

window.addEventListener("load", initPaises)

function initPaises(){
    fetch("json/countries.json")
    .then(res => res.json())
    .then(data =>{
        for(item of data.countries){
            if(item.code == "ES"){
                document.querySelector("#country").innerHTML += `<option selected value='${item.code}'>${item.name_es}</option>`
            }else{
                document.querySelector("#country").innerHTML += `<option value='${item.code}'>${item.name_es}</option>`
            }
        }
    })
}