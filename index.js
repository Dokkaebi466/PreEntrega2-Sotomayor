class Producto {
  constructor(nombre, tipo, precio, imagen) {
    this.nombre = nombre;
    this.tipo = tipo;
    this.precio = precio;
    this.imagen = imagen;
  }
}

let carrito = [];
let productos = [];

// Obtener el carrito almacenado en localStorage al cargar la página
if (localStorage.getItem('carrito')) {
  carrito = JSON.parse(localStorage.getItem('carrito'));
  updateCartInfo();
}

function addToCart(nombre, precio) {
  const cantidadInputId = `${nombre.replace(/\s+/g, '-').toLowerCase()}Cantidad`;
  const cantidadInput = document.getElementById(cantidadInputId);

  if (cantidadInput) {
    const cantidad = parseInt(cantidadInput.value);

    if (!isNaN(cantidad) && cantidad > 0) {
      const productoIndex = carrito.findIndex(item => item.nombre === nombre);

      if (productoIndex !== -1) {
        carrito[productoIndex].cantidad += cantidad;
      } else {
        const producto = productos.find(producto => producto.nombre === nombre);
        if (producto) {
          carrito.push({
            nombre,
            precio: producto.precio,
            cantidad
          });
        }
      }

      // Guardar el carrito en localStorage
      localStorage.setItem('carrito', JSON.stringify(carrito));

      // Mostrar una alerta personalizada con SweetAlert2
      Swal.fire({
        title: 'Producto Agregado',
        text: `Se ha agregado ${cantidad} ${nombre} al carrito.`,
        icon: 'success',
        confirmButtonText: 'Ok'
      });

      updateCartInfo();
    }
  }
}

function removeFromCart(nombre) {
  const productoIndex = carrito.findIndex(item => item.nombre === nombre);

  if (productoIndex !== -1) {
    carrito.splice(productoIndex, 1);

    // Guardar el carrito en localStorage
    localStorage.setItem('carrito', JSON.stringify(carrito));

    // Mostrar una alerta de SweetAlert2 cuando se elimine un producto
    Swal.fire({
      title: 'Producto Eliminado',
      text: `Se ha eliminado ${nombre} del carrito.`,
      icon: 'error',
      confirmButtonText: 'Ok'
    });

    updateCartInfo();
  }
}

function updateCartInfo() {
  let carritoInfoHTML = "<ul class='list-group'>Productos en el carrito:";
  let totalCarrito = 0;

  carrito.forEach(item => {
    const subtotal = item.precio * item.cantidad;
    carritoInfoHTML += `
      <li class='list-group-item'>
        ${item.nombre} - Cantidad: ${item.cantidad} - Subtotal: $${subtotal.toFixed(2)}
        <button class='btn btn-danger btn-sm float-right' onclick='removeFromCart("${item.nombre}")'>Eliminar</button>
      </li>
    `;
    totalCarrito += subtotal;
  });

  carritoInfoHTML += `<li class='list-group-item active'>Total del carrito: $${totalCarrito.toFixed(2)}</li>`;
  carritoInfoHTML += "</ul>";

  document.getElementById('carritoInfo').innerHTML = carritoInfoHTML;
}

document.addEventListener('DOMContentLoaded', function () {
  const productosContainer = document.getElementById('productosContainer');

  // Reemplaza 'searchTerm' con el término de búsqueda que desees
  const searchTerm = 'motorola';

  fetch(`https://api.mercadolibre.com/sites/MLA/search?q=${encodeURIComponent(searchTerm)}`)
    .then(response => response.json())
    .then(data => {
      productos = data.results.map(producto => new Producto(producto.title, '', producto.price, producto.thumbnail));

      productos.forEach(producto => {
        const productoCard = document.createElement('div');
        productoCard.className = 'col-md-4 mb-4';

        productoCard.innerHTML = `
          <div class="card">
            <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}">
            <div class="card-body">
              <h5 class="card-title">${producto.nombre}</h5>
              <p class="card-text">Precio: $${producto.precio.toFixed(2)}</p>
              <form class="form-inline">
                <div class="form-group">
                  <input type="number" class="form-control" id="${producto.nombre.replace(/\s+/g, '-').toLowerCase()}Cantidad" min="1" value="1">
                </div>
                <button type="button" class="btn btn-primary ml-2" onclick='addToCart("${producto.nombre}", ${producto.precio})'>Agregar al Carrito</button>
              </form>
            </div>
          </div>
        `;

        productosContainer.appendChild(productoCard);
      });

      updateCartInfo();
    })
    .catch(error => {
      console.error('Error al cargar los productos:', error);
    });
});
