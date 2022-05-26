const birlos = document.getElementById('birlos')
const templateCardKiAntirobo = document.getElementById('template-card-birlos').content

const fragment = document.createDocumentFragment()

let carrito = {}

document.addEventListener('DOMContentLoaded', () =>{
    fetchData()
    if (localStorage.getItem('carrito')) {
        carrito = JSON.parse(localStorage.getItem('carrito'))
    }
    Object.keys(carrito).length === 0? nroItemCarrito.textContent = 0 : nroItemCarrito.textContent = Object.keys(carrito).length
})

birlos.addEventListener('click', e => {
    addCarrito(e)
})

const fetchData = async () => {
    try {
        const res = await fetch('../productos.json')
        const data = await res.json()
        pintarCardBirlos(data)
    } catch (error) {
        console.log(error)
    }
}


const pintarCardBirlos = (data) => {
    let dataBirlos = filtarPorTipo("kit antirobo",data)
    dataBirlos.forEach(producto => {
        templateCardKiAntirobo.querySelector('h5').textContent = producto.nombre

        // Divido los items de la descripción
        let compuestoDe = producto.descripcion.split('.')

        templateCardKiAntirobo.querySelector('.card-text span:first-child').innerHTML = `<i class="bi bi-caret-right-fill"><b>Descripcion: </b></i>`

        // Pinto los items de la descripcón
        for(const cd of compuestoDe){
            templateCardKiAntirobo.querySelector('.card-text span:first-child').innerHTML += `<br>` + cd
        }
        templateCardKiAntirobo.querySelector('.card-text span:last-child').textContent = "$ " + producto.precio
        templateCardKiAntirobo.querySelector('img').setAttribute('src',producto.imagen)
        templateCardKiAntirobo.querySelector('img').setAttribute('alt',producto.nombre)
        templateCardKiAntirobo.querySelector('.btn').dataset.id = producto.id

        const clone = templateCardKiAntirobo.cloneNode(true)
        fragment.appendChild(clone)
    })
    birlos.appendChild(fragment)
}

const filtarPorTipo = (tipo, data) =>{
    let dataPorTipo = [];
    for (const d of data) {
        if(d.tipo == tipo){
            dataPorTipo.push(d)
        }
    }
    return dataPorTipo
}

const addCarrito = e => {
    if(e.target.classList.contains('btn-comprar')){
        if(localStorage.getItem('usuarioActivo') || sessionStorage.getItem('usuarioActivo')){
            setCarrito(e.target.parentElement)
            nroItemCarrito.textContent = Object.keys(carrito).length
        }
        else{
            swal({
                title: "Inicia sesión",
                text: "Antes de comprar debes iniciar sesión",
                icon: "warning",
                button: "Aceptar",
                }).then(function(){
                    window.location.href = './iniciar-sesion.html'
                });
        }
    }
    e.stopPropagation()
}

const setCarrito = objeto => {

    const producto = {
        id: objeto.querySelector('.btn-comprar').dataset.id,
        nombre: objeto.querySelector('h5').textContent,
        precio: objeto.querySelector('.card-text span:last-child').textContent,
        cantidad: 1
    }

    if(producto.cantidad == 1){
        swal({
            title: "Añadido al carrito!",
            text: `Has añadido ${producto.nombre}`,
            icon: "success",
            button: "Aceptar",
            });
    }
    
    if(carrito.hasOwnProperty(producto.id)){
        producto.cantidad = carrito[producto.id].cantidad + 1
        swal({
            title: "Añadido al carrito!",
            text: `Has añadido ${producto.nombre}, llevas ${producto.cantidad}`,
            icon: "success",
            button: "Aceptar",
          });
    }

    // Spead operator para hacer una copia del producto que se va a añadir al carrito
    carrito[producto.id] = {...producto}

    localStorage.setItem('carrito', JSON.stringify(carrito))
}