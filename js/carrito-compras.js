let productosDB = [
    { id: 1, title: "Blazer de cuerina Beige", price: 20000 },
    { id: 2, title: "Blazer de cuerina Negro", price: 20000 },
    { id: 3, title: "Blazer de cuerina Marron", price: 20000 },
    { id: 4, title: "Parka abrigada Azul", price: 70000 },
    { id: 5, title: "Parka abrigada Verde", price: 70000 },
    { id: 6, title: "Parka abrigada Negra", price: 70000 },
    { id: 7, title: "Parka abrigada Azul oscuro", price: 70000 },
    { id: 8, title: "Short de cuerina Beige", price: 10000 },
    { id: 9, title: "Short de cuerina Verde", price: 10000 },
    { id: 10, title: "Short de cuerina Negro", price: 10000 },
    { id: 11, title: "Short de cuerina Marron", price: 10000 },
    { id: 12, title: "Campera de cuero Marron", price: 45000 },
    { id: 13, title: "Campera de cuero Negra", price: 45000 },
    { id: 14, title: "Campera de cuero con cinturon", price: 50000 }
    
]; // Definimos los productos directamente

// Función para mostrar el modal del carrito
function mostrarModalCarrito() {
    const modal = document.getElementById("modal-carrito");
    const listaCarrito = document.getElementById("lista-carrito");
    const totalCarrito = document.getElementById("total-carrito");
    const carrito = JSON.parse(sessionStorage.getItem("carrito")) || [];

    listaCarrito.innerHTML = "";

    if (carrito.length === 0) {
        listaCarrito.innerHTML = "<p>No hay productos en el carrito.</p>";
        totalCarrito.textContent = "Total: $0.000";
    } else {
        let totalPrecio = 0;
        
        carrito.forEach((item) => {
            const producto = productosDB.find(p => p.id === item.id);
            if (!producto) return;
            
            const subtotal = producto.price * item.cantidad; // Calcular subtotal
            totalPrecio += subtotal; // Sumar al total
            const itemCarrito = document.createElement("div");
            itemCarrito.className = "item-carrito";
            itemCarrito.innerHTML = `
                <span><strong>${producto.title}</strong></span>
                <span>Precio: $${producto.price.toFixed(3)}</span>
                <span>Cantidad: ${item.cantidad}</span>
                <span>Subtotal: $${subtotal.toFixed(3)}</span>
            `;
            listaCarrito.appendChild(itemCarrito);
        });
        
        totalCarrito.textContent = `Total: $${totalPrecio.toFixed(3)}`;
    }

    modal.style.display = "block";
}

// Función para cerrar el modal
function cerrarModal() {
    document.getElementById("modal-carrito").style.display = "none";
}

// Función para manejar clicks fuera del modal
function manejarClicksModal(event) {
    const modal = document.getElementById("modal-carrito");
    if (event.target === modal || event.target.classList.contains("cerrar-modal")) {
        cerrarModal();
    }
}

// Función para actualizar el contador del carrito
function actualizarContadorCarrito() {
    const carrito = JSON.parse(sessionStorage.getItem("carrito")) || [];
    const contador = document.getElementById("contador-carrito");

    if (contador) {
        // Actualizar el número
        contador.textContent = carrito.reduce((acc, item) => acc + item.cantidad, 0); // Sumar cantidades
        contador.style.display = carrito.length > 0 ? "flex" : "none"; // Mostrar u ocultar
    }
}

// Función para agregar productos al carrito
function agregarAlCarrito(idProducto) {
    const cantidadInput = document.querySelector(`.producto[data-id="${idProducto}"] .cantidad`);
    const cantidad = parseInt(cantidadInput.value) || 1; // Obtener la cantidad

    let carrito = JSON.parse(sessionStorage.getItem("carrito")) || [];
    const productoExistente = carrito.find(item => item.id === idProducto);

    if (productoExistente) {
        productoExistente.cantidad += cantidad; // Aumentar la cantidad si ya existe
    } else {
        carrito.push({ id: idProducto, cantidad }); // Agregar nuevo producto
    }

    sessionStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarContadorCarrito();
}

// Función para vaciar el carrito
function vaciarCarrito() {
    sessionStorage.removeItem("carrito");
    actualizarContadorCarrito();
    cerrarModal();
}

// Función para preparar y redirigir a la página de pago
function pagar() {
    const carrito = JSON.parse(sessionStorage.getItem("carrito")) || [];

    if (carrito.length === 0) {
        return;
    }

    // Preparar datos para la página de compra
    const productosCompra = [];
    let totalCompra = 0;

    carrito.forEach(item => {
        const producto = productosDB.find(p => p.id === item.id);
        if (producto) {
            productosCompra.push({
                nombre: producto.title,
                precio: producto.price,
                cantidad: item.cantidad
            });
            totalCompra += producto.price * item.cantidad; // Multiplica por la cantidad
        }
    });

    // Guardar en sessionStorage
    sessionStorage.setItem('productos', JSON.stringify(productosCompra));
    sessionStorage.setItem('total', totalCompra.toFixed(3));

    // Redirigir a la página de compra
    window.location.href = 'compra.html';
}

// Inicialización cuando el DOM está listo
document.addEventListener("DOMContentLoaded", () => {
    actualizarContadorCarrito();
    
    // Event listeners
    document.getElementById("icono-carrito")?.addEventListener("click", mostrarModalCarrito);
    document.getElementById("vaciar-carrito")?.addEventListener("click", vaciarCarrito);
    document.getElementById("pagar")?.addEventListener("click", pagar);
    window.addEventListener("click", manejarClicksModal);
});
