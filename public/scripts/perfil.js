window.addEventListener("load", init)

function init(){
    fetch('/api/usuario')
    .then(resp => resp.json())
    .then(data => {
        document.querySelector("#tdUser").innerHTML = data[0].nombre+" "+data[0].apellidos
        document.querySelector("#tdMail").innerHTML = data[0].email
    })
}