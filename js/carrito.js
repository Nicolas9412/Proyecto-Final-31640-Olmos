const items = document.getElementById('items')
const templateFooter = document.getElementById('template-footer').content
const templateCarrito = document.getElementById('template-carrito').content
const fragment = document.createDocumentFragment()
let carrito = {}

document.addEventListener('DOMContentLoaded', () =>{
    if (localStorage.getItem('carrito')) {
        carrito = JSON.parse(localStorage.getItem('carrito'))
        console.log(carrito)
        pintarCarrito()
    }
    Object.keys(carrito).length === 0? nroItemCarrito.textContent = 0 : nroItemCarrito.textContent = Object.keys(carrito).length
})

items.addEventListener('click', e =>{
    btnAccion(e)
})

const btnAccion = (e) => {

    // AUMENTAR
    if(e.target.classList.contains('btn-info')){
        carrito[e.target.dataset.id]
        const producto = carrito[e.target.dataset.id]
        producto.cantidad++
        carrito[e.target.dataset.id] = {...producto}
        pintarCarrito()
    }

    // DISMINUIR
    if(e.target.classList.contains('btn-danger')){
        const producto = carrito[e.target.dataset.id]
        producto.cantidad--
        if(producto.cantidad === 0){
            delete carrito[e.target.dataset.id]
            nroItemCarrito.textContent = Object.keys(carrito).length
        }
        pintarCarrito()
    }
    e.stopPropagation()
} 

const pintarCarrito = () => {
    items.innerHTML = " "
    Object.values(carrito).forEach(producto => {
        templateCarrito.querySelector('th').textContent = producto.id
        templateCarrito.querySelectorAll('td')[0].textContent = producto.nombre
        templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad
        templateCarrito.querySelector('.btn-info').dataset.id = producto.id
        templateCarrito.querySelector('.btn-danger').dataset.id = producto.id
        templateCarrito.querySelector('span').textContent = producto.cantidad * parseInt(producto.precio.substring(2))

        const clone = templateCarrito.cloneNode(true)
        fragment.appendChild(clone)
    })
    items.appendChild(fragment)

    pintarFooter()

    localStorage.setItem('carrito', JSON.stringify(carrito))
}

const pintarFooter = () =>{
    footer.innerHTML = ''
    if(Object.keys(carrito).length === 0){
        footer.innerHTML = `<th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>`
        return
    }
    const nCantidad = Object.values(carrito).reduce((acc,{cantidad}) => acc + parseInt(cantidad),0)
    const nPrecio = Object.values(carrito).reduce((acc,{cantidad, precio}) => acc + cantidad * parseInt(precio.substring(2)),0)

    templateFooter.querySelectorAll('td')[0].textContent = nCantidad
    templateFooter.querySelector('span').textContent = nPrecio

    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)
    footer.appendChild(fragment)

    const btnVaciar =document.getElementById('vaciar-carrito')
    btnVaciar.addEventListener('click', () =>{
        carrito = {}
        nroItemCarrito.textContent = Object.keys(carrito).length
        pintarCarrito()
    })
} 
