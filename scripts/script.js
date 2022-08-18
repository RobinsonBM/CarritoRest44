let carrito = [];
let bdCarrito = [];
const divisa = '$';
const DOMitems = document.querySelector('#items');
const DOMcarrito = document.querySelector('#carrito');
const DOMtotal = document.querySelector('#total');
const DOMbotonVaciar = document.querySelector('#boton-vaciar');
const miLocalStorage = window.localStorage;

obtenerPlatos();
async function obtenerPlatos() {
    const data = await fetch("../scripts/platos.json");
    console.log(`RobinDev - data`, data);
    bdCarrito = await data.json();
    bdCarrito.forEach((producto) => renderizarProductos(producto))
};

function renderizarProductos(producto) {
    const miNodo = document.createElement('div');
    miNodo.classList.add('card');

    const miNodoCardBody = document.createElement('div');
    miNodoCardBody.classList.add('card-body');

    const miNodoTitle = document.createElement('h5');
    miNodoTitle.classList.add('card-title');
    miNodoTitle.textContent = producto.nombre;

    const miNodoImagen = document.createElement('img');
    miNodoImagen.classList.add('img-fluid');
    miNodoImagen.setAttribute('src', './assets/' + producto.imagen);

    const miNodoPrecio = document.createElement('p');
    miNodoPrecio.classList.add('card-text');
    miNodoPrecio.textContent = `${producto.precio}${divisa}`;

    const miNodoBoton = document.createElement('button');
    miNodoBoton.classList.add('btn-item');
    miNodoBoton.textContent = 'Agregar';
    miNodoBoton.setAttribute('marcador', producto.id);
    miNodoBoton.addEventListener('click', anyadirProductoAlCarrito);

    DOMitems.appendChild(miNodo);
    miNodo.appendChild(miNodoCardBody);
    miNodoCardBody.appendChild(miNodoImagen);
    miNodoCardBody.appendChild(miNodoTitle);
    miNodoCardBody.appendChild(miNodoPrecio);
    miNodoCardBody.appendChild(miNodoBoton);
}

function anyadirProductoAlCarrito(evento) {
    Toastify({
        text: "Item agregado",
        style: {
            background: "#d6961e",
            borderRadius: "10px"
        },
        duration: 1000
    }).showToast();
    carrito.push(evento.target.getAttribute('marcador'))
    renderizarCarrito();
    guardarCarritoEnLocalStorage();
    conteoCarrito();
}

function renderizarCarrito() {
    DOMcarrito.textContent = '';
    const carritoSinDuplicados = [...new Set(carrito)];
    carritoSinDuplicados.forEach((item) => {
        const miItem = bdCarrito.filter((itemBaseDatos) => {
            return itemBaseDatos.id === parseInt(item);
        });

        const numeroUnidadesItem = carrito.reduce((total, itemId) => {
            return itemId === item ? total += 1 : total;
        }, 0);

        const miNodo = document.createElement('li');
        miNodo.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        miNodo.textContent = `${numeroUnidadesItem} x ${miItem[0].nombre} - ${miItem[0].precio}${divisa}`;

        const miBoton = document.createElement('button');
        miBoton.classList.add('btn-quitar');
        miBoton.textContent = 'Quitar';
        miBoton.style.marginLeft = '1rem';
        miBoton.dataset.item = item;
        miBoton.addEventListener('click', borrarItemCarrito);

        miNodo.appendChild(miBoton);
        DOMcarrito.appendChild(miNodo);
    });

    DOMtotal.textContent = calcularTotal();
}

function borrarItemCarrito(evento) {
    Toastify({
        text: "Item Eliminado",
        style: {
            background: "#73221A",
            borderRadius: "10px"
        },
        duration: 1000
    }).showToast();
    const id = evento.target.dataset.item;
    carrito = carrito.filter((carritoId) => {
        return carritoId !== id;
    });
    renderizarCarrito();
    guardarCarritoEnLocalStorage();
    conteoCarrito();
}

function calcularTotal() {
    return carrito.reduce((total, item) => {
        const miItem = bdCarrito.filter((itemBaseDatos) => {
            return itemBaseDatos.id === parseInt(item);
        });
        return total + miItem[0].precio;
    }, 0).toFixed(0);
}

function vaciarCarrito() {
    Swal.fire({
        title: 'Estas seguro que quieres borrar Todo el carrito?',
        showCancelButton: true,
        confirmButtonText: 'Si',
        cancelButtonText: 'No',
        icon: 'warning',
        confirmButtonColor: '#73221A',
        focusConfirm: false
    }).then((result) => {
        console.log(`RobinDev - result`, result);
        if (result.isConfirmed && carrito.length > 0) {
            carrito = [];
            renderizarCarrito();
            localStorage.clear();
            conteoCarrito();
            Toastify({
                text: "Se eliminaron todos los items",
                style: {
                    background: "#73221A",
                    borderRadius: "10px"
                }
            }).showToast();
        } else if (result.isConfirmed && carrito.length === 0) {
            Toastify({
                text: "No hay items en el carrito",
                style: {
                    background: "#999999",
                    borderRadius: "10px"
                }
            }).showToast();
        }
    })
}

function guardarCarritoEnLocalStorage() {
    miLocalStorage.setItem('carrito', JSON.stringify(carrito));
}

function cargarCarritoDeLocalStorage() {
    if (miLocalStorage.getItem('carrito') !== null) {
        carrito = JSON.parse(miLocalStorage.getItem('carrito'));
    }
}

function conteoCarrito() {
    const p = document.querySelector('#conteo');
    p.textContent = carrito.length;
}


DOMbotonVaciar.addEventListener('click', vaciarCarrito);

cargarCarritoDeLocalStorage();
renderizarProductos();
renderizarCarrito();