
window.addEventListener("load", init)

function init(){
    console.log(document.cookie)
    if(document.cookie != ''){
        document.querySelector("#variables_perfil").innerHTML = `<a class="dropdown-item" href="/login">Perfil</a>
        <a class="dropdown-item" href="/api/logout">Logout</a>`
    }
}

fetch("header.html")
.then(response => {
    return response.text()
})
.then(data => {
    // Cargar la cabecera en cada página
    document.querySelector("nav").innerHTML = data;
    document.querySelector("nav").classList = "navbar fixed-top navbar-expand-lg navbar-dark header"

    // Cargar el logo de la pestaña
    document.querySelector("head").innerHTML += `<link rel="icon" href="img/Minitura.png">`

    // Iluminar colores
    let elementos = document.querySelectorAll(".nav-item")
    for(item of elementos){
        item.addEventListener("mouseover", iluminarBtn)
        item.addEventListener("mouseout", borrarBtn)
    }
});

function iluminarBtn(){
    this.children[0].style.color = "#6699FF"
    this.children[0].style.textDecorationLine = "underline"
    this.children[0].style.textUnderlineOffset = "1rem";
}

function borrarBtn(){
    this.children[0].style.color = ""
    this.children[0].style.textDecorationLine = ""
    this.children[0].style.textUnderlineOffset = "";
}