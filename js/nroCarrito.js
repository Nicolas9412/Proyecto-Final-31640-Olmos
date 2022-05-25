const nroItemCarrito = document.getElementById('nroItemsCarrito')
const usuarioRegistrado = document.getElementById('usuario-registrado')
const btnSesion = document.getElementById('btn-sesion')
const btnSesionMobile = document.getElementById('btn-sesion-mobile')

document.addEventListener('DOMContentLoaded', () =>{
    
    if(location.href == "http://127.0.0.1:5500/index.html"){
        btnSesion.setAttribute('href','./pages/iniciar-sesion.html')
        btnSesionMobile.setAttribute('href','./pages/iniciar-sesion.html')
    }
    else{
        btnSesion.setAttribute('href','./iniciar-sesion.html')
        btnSesionMobile.setAttribute('href','./iniciar-sesion.html')
    }
    
    btnSesion.textContent = "INICIAR SESION"
    btnSesionMobile.textContent = "INICIAR SESION"
    let usuarioRecuperado
    let carrito = {}
    if (localStorage.getItem('carrito')) {
        carrito = JSON.parse(localStorage.getItem('carrito'))
    }
    Object.keys(carrito).length === 0? nroItemCarrito.textContent = 0 : nroItemCarrito.textContent = Object.keys(carrito).length
    if (localStorage.getItem('registeredUsername')) {
        usuarioRecuperado = localStorage.getItem('registeredUsername')
        usuarioRegistrado.textContent = 'Hola ' + usuarioRecuperado + " !"
        btnSesion.textContent = "CERRAR SESION"
        btnSesion.setAttribute('href','../index.html')
        btnSesionMobile.textContent = "CERRAR SESION"
        btnSesionMobile.setAttribute('href','../index.html')
    }
    
})

btnSesion.addEventListener('click', () =>{
    if(btnSesion.textContent == "CERRAR SESION"){
        localStorage.removeItem('registeredUsername')
        usuarioRegistrado.textContent = " "
    }
})

btnSesionMobile.addEventListener('click', () =>{
    if(btnSesionMobile.textContent == "CERRAR SESION"){
        localStorage.removeItem('registeredUsername')
        usuarioRegistrado.textContent = " "
    }
})