fetch("/api/vuelosCOM"+devolverParametroPorNombre("fechaIn"))
.then(response => response.json())
.then(data => console.log(data))


//Coger el valor del parámetro fechaIn de la URL
function devolverParametroPorNombre(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}