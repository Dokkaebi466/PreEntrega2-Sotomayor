class Producto {
  constructor(nombre, tipo, precio) {
    this.nombre = nombre;
    this.tipo = tipo;
    this.precio = precio;
  }
}

const productos = [
  new Producto('Pollo', 'carne', 8.0),
  new Producto('Pescado', 'carne', 12.0),
  new Producto('Zanahoria', 'verdura', 2.0),
  new Producto('Morron', 'verdura', 1.5),
];

let carrito = [];

// Obtener el carrito almacenado en localStorage al cargar la página
if (localStorage.getItem('carrito')) {
  carrito = JSON.parse(localStorage.getItem('carrito'));
  updateCartInfo();
}

function addToCart(nombre, precio) {
  const producto = productos.find(producto => producto.nombre === nombre);

  if (producto) {
    const cantidadInputId = `${nombre.replace(/\s+/g, '-').toLowerCase()}Cantidad`;
    const cantidadInput = document.getElementById(cantidadInputId);

    if (cantidadInput) {
      const cantidad = parseInt(cantidadInput.value);

      if (!isNaN(cantidad) && cantidad > 0) {
        const productoIndex = carrito.findIndex(item => item.nombre === nombre);

        if (productoIndex !== -1) {
          carrito[productoIndex].cantidad += cantidad;
        } else {
          carrito.push({ nombre, precio: producto.precio, cantidad });
        }

        updateCartInfo();

        // Guardar el carrito en localStorage
        localStorage.setItem('carrito', JSON.stringify(carrito));
      }
    }
  }
}

function removeFromCart(nombre) {
  const productoIndex = carrito.findIndex(item => item.nombre === nombre);
  
  if (productoIndex !== -1) {
    carrito.splice(productoIndex, 1);
    updateCartInfo();

    // Guardar el carrito en localStorage
    localStorage.setItem('carrito', JSON.stringify(carrito));
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
  const container = document.createElement('div');
  container.className = 'container mt-4';
  container.innerHTML = `
    <div id='carritoInfo'></div>
    <div class="mt-4">
      <h4>Agregar nuevo producto:</h4>
      <form id="nuevoProductoForm">
        <div class="form-group">
          <label for="nombreNuevoProducto">Nombre:</label>
          <input type="text" class="form-control" id="nombreNuevoProducto" required>
        </div>
        <div class="form-group">
          <label for="tipoNuevoProducto">Tipo:</label>
          <input type="text" class="form-control" id="tipoNuevoProducto" required>
        </div>
        <div class="form-group">
          <label for="precioNuevoProducto">Precio:</label>
          <input type="number" class="form-control" id="precioNuevoProducto" required step="0.01">
        </div>
        <button type="button" class="btn btn-success" id="agregarNuevoProductoBtn">Agregar Producto</button>
      </form>
    </div>
  `;
  document.body.appendChild(container);

  productos.forEach(producto => {
    addProductoForm(producto);
  });

  updateCartInfo();

  document.getElementById('agregarNuevoProductoBtn').addEventListener('click', function () {
    const nombreNuevoProducto = document.getElementById('nombreNuevoProducto').value;
    const tipoNuevoProducto = document.getElementById('tipoNuevoProducto').value;
    const precioNuevoProducto = parseFloat(document.getElementById('precioNuevoProducto').value);

    if (nombreNuevoProducto && tipoNuevoProducto && !isNaN(precioNuevoProducto) && precioNuevoProducto > 0) {
      agregarProducto(nombreNuevoProducto, tipoNuevoProducto, precioNuevoProducto);
      document.getElementById('nuevoProductoForm').reset();
    } else {
      alert('Por favor, complete todos los campos correctamente.');
    }
  });
});

function addProductoForm(producto) {
  const productoDiv = document.createElement('div');
  productoDiv.className = 'list-group-item';
  productoDiv.innerHTML = `
    <span>${producto.nombre} - Precio: $${producto.precio.toFixed(2)}</span>
    <form class="form-inline ml-3">
      <div class="form-group">
        <input type="number" class="form-control" id="${producto.nombre.replace(/\s+/g, '-').toLowerCase()}Cantidad" min="1" value="1">
      </div>
      <button type="button" class="btn btn-primary ml-2" onclick='addToCart("${producto.nombre}", ${producto.precio})'>Agregar</button>
    </form>
  `;

  document.getElementById('carritoInfo').appendChild(productoDiv);
}

// Agregar nuevos productos al listado
function agregarProducto(nombre, tipo, precio) {
  const nuevoProducto = new Producto(nombre, tipo, precio);
  productos.push(nuevoProducto);

  addProductoForm(nuevoProducto);

  // Guardar el carrito en localStorage
  carrito.push({ nombre, precio, cantidad: 1 });
  localStorage.setItem('carrito', JSON.stringify(carrito));

  updateCartInfo();
}
