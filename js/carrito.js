const items = document.getElementById('items')
const footer = document.getElementById('footer')
const cobro = document.getElementById('cobro')
let templateCobro = document.getElementById('template-cobro').content
const templateFooter = document.getElementById('template-footer').content
const templateCarrito = document.getElementById('template-carrito').content
const fragment = document.createDocumentFragment()
let carrito = {}


document.addEventListener('DOMContentLoaded', () =>{
    if (localStorage.getItem('carrito') && (localStorage.getItem('usuarioActivo')||sessionStorage.getItem('usuarioActivo'))) {
        carrito = JSON.parse(localStorage.getItem('carrito'))
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
        if(producto.cantidad === 1){
            swal({
                title: "¿Estas seguro?",
                text: `¿Querés borrar ${producto.nombre} del carrito?`,
                icon: "warning",
                buttons: true,
                dangerMode: true,
              }).then((willDelete) => {
                if (willDelete) {
                    delete carrito[e.target.dataset.id]
                    nroItemCarrito.textContent = Object.keys(carrito).length
                    swal(`Se ha borrado ${producto.nombre} del carrito`, {
                        icon: "success",
                    });
                    pintarCarrito()
                } 
                else {
                  swal(`Tu producto sigue en el carrito`);
                  pintarCarrito()
                }
              });

        }
        else{
            producto.cantidad--
            pintarCarrito()
        }    
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

    const btnVaciar = document.getElementById('vaciar-carrito')
    btnVaciar.addEventListener('click', () =>{
        swal({
            title: "¿Estas seguro?",
            text: `¿Querés limpiar el carrito?`,
            icon: "warning",
            buttons: true,
            dangerMode: true,
          }).then((willDelete) => {
            if (willDelete) {
                carrito = {}
                nroItemCarrito.textContent = Object.keys(carrito).length
                swal(`Se ha limpiado el carrito`, {
                    icon: "success",
                });
                pintarCarrito()
            } 
            else {
              swal(`Su carrito sigue igual`);
              pintarCarrito()
            }
          });
        
    })
    const btnPagar = document.getElementById('pagar')
    btnPagar.addEventListener('click', () =>{
        if(templateCobro != undefined){
            if(localStorage.getItem('usuarioActivo')){
                [usuario, email] = JSON.parse(localStorage.getItem('usuarioActivo')) 
            }
            if(sessionStorage.getItem('usuarioActivo')){
                [usuario, email] = JSON.parse(sessionStorage.getItem('usuarioActivo'))
            }
            templateCobro.getElementById('total').value = nPrecio
            templateCobro.getElementById('usuario').value = usuario
            templateCobro.getElementById('email').value = email
            const clone = templateCobro.cloneNode(true)
            fragment.appendChild(clone)
            cobro.appendChild(fragment)

            const btn = document.getElementById('btn-pagar');

            document.getElementById('form-cobro').addEventListener('submit', function(event) {
            event.preventDefault();

            const checkboxes = cobro.querySelectorAll('input[type="radio"]')
            let tipoCobroSeleccionado
            checkboxes.forEach(check => check.checked == true? tipoCobroSeleccionado = check.value:null)
            tipoCobroSeleccionado == undefined && swal({title: '¡ Cuidado !',
                                                        text: 'Debe seleccionar algún método de pago',
                                                        icon:'warning'}); 
            if(tipoCobroSeleccionado != "efectivo" && tipoCobroSeleccionado != undefined){
                btn.value = 'Procesando...';
                const serviceID1 = 'default_service';
                const templateID1 = 'template_58hf8gv';

                emailjs.sendForm(serviceID1, templateID1, this)
                .then(() => {
                hacerPDF()
                btn.value = 'Finalizar compra';
                btn.disabled = true
                localStorage.removeItem('carrito')
                swal({
                    title: "Pago enviado",
                    text: "Se le ha enviado el comprobante a su cuenta de mail",
                    icon: "success",
                    button: "Aceptar",
                    }).then(function(){
                        window.location.href = '../index.html'
                    });;
                }, (err) => {
                btn.value = 'Send Email';
                btn.disabled = true
                localStorage.removeItem('carrito')
                swal({
                    title: "Error",
                    text: `${JSON.stringify(err)}`,
                    icon: "error",
                    button: "Aceptar",
                    }).then(function(){
                        window.location.href = '../index.html'
                    });
                });
            }
            else if(tipoCobroSeleccionado == "efectivo" && tipoCobroSeleccionado != undefined){
                btn.value = 'Procesando...';
                const serviceID2 = 'default_service';
                const templateID2 = 'template_i56it85';

                emailjs.sendForm(serviceID2, templateID2, this)
                .then(() => {
                hacerPDF()
                btn.value = 'Finalizar compra';
                btn.disabled = true
                localStorage.removeItem('carrito')
                swal({
                    title: "Pago enviado",
                    text: "Se le ha enviado el comprobante a su cuenta de mail",
                    icon: "success",
                    button: "Aceptar",
                    }).then(function(){
                        window.location.href = '../index.html'
                    });;
                }, (err) => {
                btn.value = 'Send Email';
                btn.disabled = true
                localStorage.removeItem('carrito')
                swal({
                    title: "Error",
                    text: `${JSON.stringify(err)}`,
                    icon: "error",
                    button: "Aceptar",
                    }).then(function(){
                        window.location.href = '../index.html'
                    });
                });
            }
            
            });
        }   
        templateCobro = undefined;
    })

    window.html2canvas = html2canvas;
    window.jsPDF = window.jspdf.jsPDF;

    function hacerPDF(){

        html2canvas(document.querySelector('#capture'),{
                    allowTaint:true,
                    useCORS:true,
                    scale:1
        }).then(canvas => {
                var img = canvas.toDataURL("image/png");

                var doc = new jsPDF('l','px','letter');
                doc.setFont('Arial');
                doc.getFontSize(11);
                doc.addImage(img,'PNG',10,10,550,100);
                doc.save(`Comprobante de compra de ${usuario}`)
            });
    }
}


