   const bdCarrito = [{
           id: 1,
           nombre: 'Punta de Anca',
           precio: 37000,
           imagen: 'puntaDeAnca.jpg'
       },
       {
           id: 2,
           nombre: 'Bandeja Paisa',
           precio: 26000,
           imagen: 'bandeja-paisa.jpg'
       },
       {
           id: 3,
           nombre: 'Cañon de cerdo',
           precio: 35000,
           imagen: 'cañon.jpg'
       },
       {
           id: 4,
           nombre: 'Cazuela de Frijol',
           precio: 27000,
           imagen: 'cazuela.jpg'
       },
       {
           id: 5,
           nombre: 'Empanadas',
           precio: 3500,
           imagen: 'empanadas.jpg'
       },
       {
           id: 6,
           nombre: 'Fritos',
           precio: 5000,
           imagen: 'fritos.jpg'
       },
       {
           id: 7,
           nombre: 'Mondongo',
           precio: 30000,
           imagen: 'mondongo.jpg'
       },
       {
           id: 8,
           nombre: 'Picada',
           precio: 57000,
           imagen: 'picada.jpg'
       },
       {
           id: 9,
           nombre: 'Sancocho Trifasico',
           precio: 32000,
           imagen: 'sancocho.jpg'
       },
       {
           id: 8,
           nombre: 'Solomo de res',
           precio: 37000,
           imagen: 'solomo.jpg'
       }
   ];

   localStorage.setItem('Carrito', JSON.stringify(bdCarrito));

   let carrito = [];
   const divisa = '$';
   const DOMitems = document.querySelector('#items');
   const DOMcarrito = document.querySelector('#carrito');
   const DOMtotal = document.querySelector('#total');
   const DOMbotonVaciar = document.querySelector('#boton-vaciar');
   const miLocalStorage = window.localStorage;

   function renderizarProductos() {
       bdCarrito.forEach((item) => {
           const miNodo = document.createElement('div');
           miNodo.classList.add('card');

           const miNodoCardBody = document.createElement('div');
           miNodoCardBody.classList.add('card-body');

           const miNodoTitle = document.createElement('h5');
           miNodoTitle.classList.add('card-title');
           miNodoTitle.textContent = item.nombre;

           const miNodoImagen = document.createElement('img');
           miNodoImagen.classList.add('img-fluid');
           miNodoImagen.setAttribute('src', './assets/' + item.imagen);

           const miNodoPrecio = document.createElement('p');
           miNodoPrecio.classList.add('card-text');
           miNodoPrecio.textContent = `${item.precio}${divisa}`;

           const miNodoBoton = document.createElement('button');
           miNodoBoton.classList.add('btn-item');
           miNodoBoton.textContent = 'Agregar';
           miNodoBoton.setAttribute('marcador', item.id);
           miNodoBoton.addEventListener('click', anyadirProductoAlCarrito);

           DOMitems.appendChild(miNodo);
           miNodo.appendChild(miNodoCardBody);
           miNodoCardBody.appendChild(miNodoImagen);
           miNodoCardBody.appendChild(miNodoTitle);
           miNodoCardBody.appendChild(miNodoPrecio);
           miNodoCardBody.appendChild(miNodoBoton);
       });
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
           console.log(`RobinDev - carrito`, carrito);
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