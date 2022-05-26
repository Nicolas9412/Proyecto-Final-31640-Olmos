const nroItemCarrito = document.getElementById('nroItemsCarrito')
const usuarioActivo = document.getElementById('usuario-registrado')
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

    if(!(localStorage.getItem('usuarioActivo') || sessionStorage.getItem('usuarioActivo'))){
        localStorage.removeItem('carrito')
    }
    
    btnSesion.textContent = "INICIAR SESION"
    btnSesionMobile.textContent = "INICIAR SESION"
    let carrito = {}
    if (localStorage.getItem('carrito') && (localStorage.getItem('usuarioActivo') || sessionStorage.getItem('usuarioActivo'))) {
        carrito = JSON.parse(localStorage.getItem('carrito'))
    }
    Object.keys(carrito).length === 0? nroItemCarrito.textContent = 0 : nroItemCarrito.textContent = Object.keys(carrito).length
    if (localStorage.getItem('usuarioActivo')) {
        // Desestructuración de array
        [usuarioRecuperado,emailRecuperado] = JSON.parse(localStorage.getItem('usuarioActivo'))
        usuarioActivo.textContent = 'Hola ' + usuarioRecuperado + " !"
        btnSesion.textContent = "CERRAR SESION"
        btnSesion.setAttribute('href','../index.html')
        btnSesionMobile.textContent = "CERRAR SESION"
        btnSesionMobile.setAttribute('href','../index.html')
    }
    if (sessionStorage.getItem('usuarioActivo')){
        // Desestructuración de array
        [usuarioRecuperado,emailRecuperado] = JSON.parse(sessionStorage.getItem('usuarioActivo'))
        usuarioActivo.textContent = 'Hola ' + usuarioRecuperado + " !"
        btnSesion.textContent = "CERRAR SESION"
        btnSesion.setAttribute('href','../index.html')
        btnSesionMobile.textContent = "CERRAR SESION"
        btnSesionMobile.setAttribute('href','../index.html')
    }
    
})

btnSesion.addEventListener('click', () =>{
    if(btnSesion.textContent == "CERRAR SESION"){
        localStorage.removeItem('usuarioActivo')
        sessionStorage.removeItem('usuarioActivo')
        localStorage.removeItem('carrito')
        usuarioActivo.textContent = " "
    }
})

btnSesionMobile.addEventListener('click', () =>{
    if(btnSesionMobile.textContent == "CERRAR SESION"){
        localStorage.removeItem('usuarioActivo')
        sessionStorage.removeItem('usuarioActivo')
        localStorage.removeItem('carrito')
        usuarioActivo.textContent = " "
    }
})