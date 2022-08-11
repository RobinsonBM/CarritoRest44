   // Variables
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
   const btnCarrito = document.querySelector('#btnCarrito');

   // Funciones

   /**
    * Dibuja todos los productos a partir de la base de datos. No confundir con el carrito
    */
   function renderizarProductos() {
       bdCarrito.forEach((item) => {
           // Estructura
           const miNodo = document.createElement('div');
           miNodo.classList.add('card');
           // Body
           const miNodoCardBody = document.createElement('div');
           miNodoCardBody.classList.add('card-body');
           // Titulo
           const miNodoTitle = document.createElement('h5');
           miNodoTitle.classList.add('card-title');
           miNodoTitle.textContent = item.nombre;
           // Imagen
           const miNodoImagen = document.createElement('img');
           miNodoImagen.classList.add('img-fluid');
           miNodoImagen.setAttribute('src', './assets/' + item.imagen);
           // Precio
           const miNodoPrecio = document.createElement('p');
           miNodoPrecio.classList.add('card-text');
           miNodoPrecio.textContent = `${item.precio}${divisa}`;
           // Boton 
           const miNodoBoton = document.createElement('button');
           miNodoBoton.classList.add('btn-item');
           miNodoBoton.textContent = 'Agregar';
           miNodoBoton.setAttribute('marcador', item.id);
           miNodoBoton.addEventListener('click', anyadirProductoAlCarrito);
           // Insertamos
           DOMitems.appendChild(miNodo);
           miNodo.appendChild(miNodoCardBody);
           miNodoCardBody.appendChild(miNodoImagen);
           miNodoCardBody.appendChild(miNodoTitle);
           miNodoCardBody.appendChild(miNodoPrecio);
           miNodoCardBody.appendChild(miNodoBoton);
       });
   }

   /**
    * Evento para añadir un producto al carrito de la compra
    */
   function anyadirProductoAlCarrito(evento) {
       // Anyadimos el Nodo a nuestro carrito
       carrito.push(evento.target.getAttribute('marcador'))
       // Actualizamos el carrito 
       renderizarCarrito();
       // Actualizamos el LocalStorage
       guardarCarritoEnLocalStorage();
       conteoCarrito();
   }

   /**
    * Dibuja todos los productos guardados en el carrito
    */
   function renderizarCarrito() {
       // Vaciamos todo el html
       DOMcarrito.textContent = '';
       // Quitamos los duplicados
       const carritoSinDuplicados = [...new Set(carrito)];
       // Generamos los Nodos a partir de carrito
       carritoSinDuplicados.forEach((item) => {
           // Obtenemos el item que necesitamos de la variable base de datos
           const miItem = bdCarrito.filter((itemBaseDatos) => {
               // ¿Coincide las id? Solo puede existir un caso
               return itemBaseDatos.id === parseInt(item);
           });
           // Cuenta el número de veces que se repite el producto
           const numeroUnidadesItem = carrito.reduce((total, itemId) => {
               // ¿Coincide las id? Incremento el contador, en caso contrario no mantengo
               return itemId === item ? total += 1 : total;
           }, 0);
           // Creamos el nodo del item del carrito
           const miNodo = document.createElement('li');
           miNodo.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
           miNodo.textContent = `${numeroUnidadesItem} x ${miItem[0].nombre} - ${miItem[0].precio}${divisa}`;
           // Boton de borrar
           const miBoton = document.createElement('button');
           miBoton.classList.add('btn-quitar');
           miBoton.textContent = 'Quitar';
           miBoton.style.marginLeft = '1rem';
           miBoton.dataset.item = item;
           miBoton.addEventListener('click', borrarItemCarrito);
           // Mezclamos nodos
           miNodo.appendChild(miBoton);
           DOMcarrito.appendChild(miNodo);
       });
       // Renderizamos el precio total en el HTML
       DOMtotal.textContent = calcularTotal();
   }

   /**
    * Evento para borrar un elemento del carrito
    */
   function borrarItemCarrito(evento) {
       // Obtenemos el producto ID que hay en el boton pulsado
       const id = evento.target.dataset.item;
       // Borramos todos los productos
       carrito = carrito.filter((carritoId) => {
           return carritoId !== id;
       });
       // volvemos a renderizar
       renderizarCarrito();
       // Actualizamos el LocalStorage
       guardarCarritoEnLocalStorage();
       conteoCarrito();
   }

   /**
    * Calcula el precio total teniendo en cuenta los productos repetidos
    */
   function calcularTotal() {
       // Recorremos el array del carrito 
       return carrito.reduce((total, item) => {
           // De cada elemento obtenemos su precio
           const miItem = bdCarrito.filter((itemBaseDatos) => {
               return itemBaseDatos.id === parseInt(item);
           });
           // Los sumamos al total
           return total + miItem[0].precio;
       }, 0).toFixed(2);
   }

   /**
    * Varia el carrito y vuelve a dibujarlo
    */
   function vaciarCarrito() {
       Swal.fire({
           title: 'Estas seguro que queires borrar Todo el carrito?',
           showCancelButton: true,
           confirmButtonText: 'Si',
           cancelButtonText: 'No'
       }).then((result) => {
           if (result.isConfirmed) {
               // Limpiamos los productos guardados
               carrito = [];
               // Renderizamos los cambios
               renderizarCarrito();
               // Borra LocalStorage
               localStorage.clear();
               conteoCarrito();
               Swal.fire('Saved!', '', 'success')
           } 
       })
   }

   function guardarCarritoEnLocalStorage() {
       miLocalStorage.setItem('carrito', JSON.stringify(carrito));
   }

   function cargarCarritoDeLocalStorage() {
       // ¿Existe un carrito previo guardado en LocalStorage?
       if (miLocalStorage.getItem('carrito') !== null) {
           // Carga la información
           carrito = JSON.parse(miLocalStorage.getItem('carrito'));
       }
   }

   function conteoCarrito() {
       const p = document.querySelector('#conteo');
       p.textContent = carrito.length;
   }

   function mostrarCarrito() {
       Toastify({
           text: `${carrito.forEach((item) => {

           })}`,
           className: "info",
           duration: 5000,
           style: {
               background: "linear-gradient(to right, #00b09b, #96c93d)",
           }
       }).showToast();
   }

   // Eventos
   DOMbotonVaciar.addEventListener('click', vaciarCarrito);
   btnCarrito.addEventListener('click', mostrarCarrito)


   // Inicio
   cargarCarritoDeLocalStorage();
   renderizarProductos();
   renderizarCarrito();