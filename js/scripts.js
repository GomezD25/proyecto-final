let productos = [];
const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

const listaCarrito = document.getElementById('lista-carrito');
const cantidadCarrito = document.getElementById('cantidad-carrito');
const totalCarrito = document.getElementById('total-carrito');
const abrirCarrito = document.getElementById('abrir-carrito');
const cerrarCarrito = document.getElementById('cerrar-carrito');
const panelCarrito = document.getElementById('carrito-panel');
const vaciarCarritoBtn = document.getElementById('vaciar-carrito');
const finalizarCompraBtn = document.getElementById('finalizar-compra');
const mensajeCompra = document.getElementById('mensaje-compra');
const contenedorProductos = document.querySelector('.productos-grid');

// Función para cargar productos desde JSON
function cargarProductos() {
  fetch('productos.json')
    .then(response => response.json())
    .then(data => {
      productos = data;
      mostrarProductos();
    })
    .catch(error => console.error('Error al cargar productos:', error));
}

// Función para mostrar productos en cards dinámicas
function mostrarProductos() {
  contenedorProductos.innerHTML = '';

  productos.forEach(producto => {
    const card = document.createElement('div');
    card.className = 'card';

    card.innerHTML = `
      <img src="${producto.imagen}" alt="Medialuna de ${producto.nombre}" />
      <h3>${producto.nombre}</h3>
      <p class="precio">$${producto.precio}</p>
      <p>${producto.descripcion}</p>
      <button data-id="${producto.id}">Agregar al carrito</button>
    `;

    contenedorProductos.appendChild(card);
  });

  // Agregar eventos a botones de agregar
  const botones = document.querySelectorAll('.card button');
  botones.forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.getAttribute('data-id'));
      agregarAlCarrito(id);
    });
  });
}

// Función para guardar carrito en localStorage
function guardarCarrito() {
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Función para renderizar carrito
function renderizarCarrito() {
  listaCarrito.innerHTML = '';
  let total = 0;

  carrito.forEach((item, index) => {
    const li = document.createElement('li');
    li.textContent = `${item.nombre} x${item.cantidad} - $${item.precio * item.cantidad} `;

    // Botón para reducir cantidad
    const btnRestar = document.createElement('button');
    btnRestar.textContent = '-';
    btnRestar.title = 'Reducir cantidad';
    btnRestar.addEventListener('click', () => {
      if (item.cantidad > 1) {
        item.cantidad--;
      } else {
        carrito.splice(index, 1);
      }
      actualizarCarrito();
    });

    // Botón para aumentar cantidad
    const btnSumar = document.createElement('button');
    btnSumar.textContent = '+';
    btnSumar.title = 'Aumentar cantidad';
    btnSumar.addEventListener('click', () => {
      item.cantidad++;
      actualizarCarrito();
    });

    // Botón para eliminar producto
    const btnEliminar = document.createElement('button');
    btnEliminar.textContent = 'X';
    btnEliminar.title = 'Eliminar producto';
    btnEliminar.addEventListener('click', () => {
      carrito.splice(index, 1);
      actualizarCarrito();
    });

    li.appendChild(btnRestar);
    li.appendChild(btnSumar);
    li.appendChild(btnEliminar);
    listaCarrito.appendChild(li);

    total += item.precio * item.cantidad;
  });

  cantidadCarrito.textContent = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  totalCarrito.textContent = total;

  guardarCarrito();
}

// Actualizar carrito
function actualizarCarrito() {
  renderizarCarrito();
  mensajeCompra.style.display = 'none';
}

// Agregar producto al carrito
function agregarAlCarrito(id) {
  const producto = productos.find(p => p.id === id);
  if (!producto) return;

  const productoEnCarrito = carrito.find(item => item.id === producto.id);
  if (productoEnCarrito) {
    productoEnCarrito.cantidad++;
  } else {
    carrito.push({ ...producto, cantidad: 1 });
  }
  actualizarCarrito();
}

// Vaciar carrito
vaciarCarritoBtn.addEventListener('click', () => {
  carrito.length = 0;
  actualizarCarrito();
});

// Finalizar compra (simulado)
finalizarCompraBtn.addEventListener('click', () => {
  if (carrito.length === 0) {
    alert('El carrito está vacío.');
    return;
  }
  carrito.length = 0;
  actualizarCarrito();
  mensajeCompra.style.display = 'block';
});

// Abrir/Cerrar carrito
abrirCarrito.addEventListener('click', (e) => {
  e.preventDefault();
  panelCarrito.classList.toggle('oculto');
});

cerrarCarrito.addEventListener('click', () => {
  panelCarrito.classList.add('oculto');
});

// Carga inicial
cargarProductos();
actualizarCarrito();