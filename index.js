class Producto {
    constructor(nombre, tipo, precio) {
      this.nombre = nombre;
      this.tipo = tipo;
      this.precio = precio;
    }
  }
  
  // Funciones de operaciones
  function suma(a, b) {
    return a + b;
  }
  
  function resta(a, b) {
    return a - b;
  }
  
  function porcentaje(valor, porcentaje) {
    return (valor * porcentaje) / 100;
  }
  
  // Definimos los productos disponibles como objetos de la clase Producto
  const productos = [
    new Producto("Carne de res", "carne", 10.0),
    new Producto("Pollo", "carne", 8.0),
    new Producto("Pescado", "carne", 12.0),
    new Producto("Zanahoria", "verdura", 2.0),
    new Producto("Brócoli", "verdura", 3.0),
    new Producto("Pimiento", "verdura", 1.5)
  ];
  
  // Creamos el carrito de compras como un array vacío
  const carrito = [];
  
  // Capturamos las entradas del usuario para agregar productos al carrito
  while (true) {
    const producto = prompt("Ingrese el nombre del producto (o escriba 'salir' para terminar de agregar productos al carrito):");
    if (producto.toLowerCase() === "salir") {
      break;
    }
  
    const cantidad = parseInt(prompt(`Ingrese la cantidad de ${producto}:`));
    if (isNaN(cantidad)) {
      alert("La cantidad ingresada no es válida. Intente nuevamente.");
      continue;
    }
  
    // Buscamos el producto en la lista de productos disponibles
    const productoEncontrado = productos.find((p) => p.nombre.toLowerCase() === producto.toLowerCase());
    if (productoEncontrado) {
      carrito.push({ producto: productoEncontrado, cantidad });
    } else {
      alert("El producto ingresado no se encuentra disponible.");
    }
  }
  
  // Mostramos los productos en el carrito
  let carritoInfo = "Productos en el carrito:\n";
  let totalCarrito = 0;
  for (const item of carrito) {
    const { producto, cantidad } = item;
    carritoInfo += `${producto.nombre} - Cantidad: ${cantidad} - Precio unitario: $${producto.precio.toFixed(2)}\n`;
    totalCarrito += producto.precio * cantidad;
  }
  carritoInfo += `Total del carrito: $${totalCarrito.toFixed(2)}`;
  
  // Realizamos algunas operaciones con los valores del carrito
  const descuentoPorcentaje = parseFloat(prompt("Ingrese el porcentaje de descuento a aplicar (sin símbolo de %):"));
  if (isNaN(descuentoPorcentaje)) {
    alert("El porcentaje ingresado no es válido. No se aplicará descuento.");
  } else {
    const descuento = porcentaje(totalCarrito, descuentoPorcentaje);
    const nuevoTotal = resta(totalCarrito, descuento);
    const mensajeOperaciones = `Operaciones con el carrito:
  - Descuento (${descuentoPorcentaje}%): $${descuento.toFixed(2)}
  - Total con descuento: $${nuevoTotal.toFixed(2)}`;
    carritoInfo += "\n\n" + mensajeOperaciones;
  }
  
  // Mostramos la información del carrito y las operaciones en un alert
  alert(carritoInfo);
  