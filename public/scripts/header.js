

window.addEventListener("load", initHead)

function initHead(){
    //Traemos el header   
    fetch("header.html")
    .then(response => {
        return response.text()
    })
    .then(data => {
        // Cargar la cabecera en cada página
        document.querySelector("nav").innerHTML = data;
        document.querySelector("nav").classList = "navbar fixed-top navbar-expand-lg header"
    
        // Cargar el logo de la pestaña
        document.querySelector("head").innerHTML += `<link rel="shortcut icon" href="img/Minitura.png">`
    
        // Iluminar colores
        let elementos = document.querySelectorAll(".nav-item")
        for(item of elementos){
            item.addEventListener("mouseover", iluminarBtn)
            item.addEventListener("mouseout", borrarBtn)
        }
    });


    // Funcion que comprueba el nombre de usuario codificado en el servidor
    if(document.cookie != ''){
        fetch('/api/compCookie'+getCookie('usuario'))
        .then(res => res.json())
        .then(data => {
            // Si se verifica que la cookie es correcta, se actualiza la cabecera
            if(data.ok){
                fetch('/api/usuario')
                .then(resp => resp.json())
                .then(data => {
                    document.querySelector("#navbardrop").innerHTML = data[0].nombre.toUpperCase()
                })
        
                document.querySelector("#variables_perfil").innerHTML = `<a class="dropdown-item" href="/perfil">Perfil</a>
                <a class="dropdown-item" href="/api/logout">Logout</a>`
            }
        })

    }
    
}


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

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }