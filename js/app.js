const parches = document.getElementById('parches')
const kitParche = document.getElementById('kit-parche')
const templateCardParche = document.getElementById('template-card-parche').content
const templateCardKitParche = document.getElementById('template-card-kit-parche').content

const fragment = document.createDocumentFragment()


let carrito = {}

document.addEventListener('DOMContentLoaded', () =>{
    fetchData()
    if (localStorage.getItem('carrito')) {
        carrito = JSON.parse(localStorage.getItem('carrito'))
    }
    Object.keys(carrito).length === 0? nroItemCarrito.textContent = 0 : nroItemCarrito.textContent = Object.keys(carrito).length
})

parches.addEventListener('click', e =>{
    addCarrito(e)
})

kitParche.addEventListener('click', e =>{
    addCarrito(e)
})


const fetchData = async () => {
    try {
        const res = await fetch('../productos.json')
        const data = await res.json()
        pintarCardParches(data)
        pintarCardKitParche(data)
    } catch (error) {
        console.log(error)
    }
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

const pintarCardParches = (data) => {
    let dataParche = filtarPorTipo("parche",data)
    dataParche.forEach(producto => {
        templateCardParche.querySelector('h5').textContent = producto.nombre
        templateCardParche.querySelector('.card-text span:first-child').innerHTML = `<i class="bi bi-caret-right-fill"><b>Descripcion: </b>${producto.descripcion}</i>`
        templateCardParche.querySelector('.card-text span:nth-child(2)').innerHTML = `<i class="bi bi-caret-right-fill"><b>Pack: </b>${producto.pack}</i>`
        templateCardParche.querySelector('.card-text span:nth-child(3)').innerHTML = `<i class="bi bi-caret-right-fill"><b>Dimension: </b>${producto.dimension}</i>`
        templateCardParche.querySelector('.card-text span:nth-child(4)').innerHTML = `<i class="bi bi-caret-right-fill"><b>Marca: </b>${producto.marca}</i>`
        templateCardParche.querySelector('.card-text span:last-child').textContent = "$ " + producto.precio
        templateCardParche.querySelector('img').setAttribute('src',producto.imagen)
        templateCardParche.querySelector('img').setAttribute('alt',producto.nombre)
        templateCardParche.querySelector('.btn').dataset.id = producto.id
        
        const clone = templateCardParche.cloneNode(true)
        fragment.appendChild(clone)
    })
    parches.appendChild(fragment)
}

const pintarCardKitParche = (data) => {
    let dataKitParche = filtarPorTipo("kit parche",data)
    dataKitParche.forEach(producto => {
        templateCardKitParche.querySelector('h5').textContent = producto.nombre

        // Divido los items de la descripción
        let compuestoDe = producto.descripcion.split(".")
        compuestoDe.pop()

        templateCardKitParche.querySelector('.card-text span:first-child').innerHTML = `<i class="bi bi-caret-right-fill"><b>Descripcion: </b></i>`

        // Pinto los items de la descripción
        for (const cd of compuestoDe) {
            templateCardKitParche.querySelector('.card-text span:first-child').innerHTML += `<br>` + cd
        }
        templateCardKitParche.querySelector('.card-text span:last-child').textContent = "$ " + producto.precio
        templateCardKitParche.querySelector('img').setAttribute('src',producto.imagen)
        templateCardKitParche.querySelector('img').setAttribute('alt',producto.nombre)
        templateCardKitParche.querySelector('.btn').dataset.id = producto.id
        
        const clone = templateCardKitParche.cloneNode(true)
        fragment.appendChild(clone)
    })
    kitParche.appendChild(fragment)
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
