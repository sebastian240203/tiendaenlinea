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
];


function mostrarModalCarrito() {
    const modal = document.getElementById("modal-carrito");
    const itemsCarrito = document.getElementById("items-carrito");
    const totalCarrito = document.getElementById("total-carrito");
    const carrito = JSON.parse(sessionStorage.getItem("carrito")) || [];

    itemsCarrito.innerHTML = "";

    if (carrito.length === 0) {
        itemsCarrito.innerHTML = "<tr><td colspan='5'>No hay productos en el carrito.</td></tr>";
        totalCarrito.textContent = "Total: $0.00 (0 artículos)";
    } else {
        let totalPrecio = 0;

        carrito.forEach((item) => {
            const producto = productosDB.find(p => p.id === item.id);
            if (!producto) return;

            const subtotal = producto.price * item.cantidad; 
            totalPrecio += subtotal; 

            const itemCarrito = document.createElement("tr");
            itemCarrito.innerHTML = `
                <td><strong>${producto.title}</strong></td>
                <td>$${producto.price.toFixed(3)}</td>
                <td class="cantidad-control">
                    <button onclick="cambiarCantidad(${item.id}, -1)">-</button>
                    <input type="number" value="${item.cantidad}" min="1" readonly>
                    <button onclick="cambiarCantidad(${item.id}, 1)">+</button>
                </td>
                <td>$${subtotal.toFixed(3)}</td> 
                <td>
                    <button class="eliminar-item" onclick="eliminarDelCarrito(${item.id})">Eliminar</button>
                </td>
            `;
            itemsCarrito.appendChild(itemCarrito);
        });

        totalCarrito.textContent = `Total: $${totalPrecio.toFixed(3)} (${carrito.length} artículos)`;
    }

    modal.style.display = "block";
}


function cambiarCantidad(idProducto, cambio) {
    let carrito = JSON.parse(sessionStorage.getItem("carrito")) || [];
    const productoExistente = carrito.find(item => item.id === idProducto);

    if (productoExistente) {
        productoExistente.cantidad += cambio;
        if (productoExistente.cantidad <= 0) {
            eliminarDelCarrito(idProducto);
        } else {
            sessionStorage.setItem("carrito", JSON.stringify(carrito));
            mostrarModalCarrito(); 
        }
    }
}


function eliminarDelCarrito(idProducto) {
    let carrito = JSON.parse(sessionStorage.getItem("carrito")) || [];
    carrito = carrito.filter(item => item.id !== idProducto);
    sessionStorage.setItem("carrito", JSON.stringify(carrito));
    mostrarModalCarrito(); 
    actualizarContadorCarrito(); 
}


function cerrarModal() {
    document.getElementById("modal-carrito").style.display = "none";
}


function manejarClicksModal(event) {
    const modal = document.getElementById("modal-carrito");
    if (event.target === modal || event.target.classList.contains("cerrar-modal")) {
        cerrarModal();
    }
}


function actualizarContadorCarrito() {
    const carrito = JSON.parse(sessionStorage.getItem("carrito")) || [];
    const contador = document.getElementById("contador-carrito");

    if (contador) {
        contador.textContent = carrito.reduce((acc, item) => acc + item.cantidad, 0); 
        contador.style.display = carrito.length > 0 ? "flex" : "none"; 
    }
}


function agregarAlCarrito(idProducto) {
    const cantidadInput = document.querySelector(`.producto[data-id="${idProducto}"] .cantidad`);
    const cantidad = parseInt(cantidadInput.value) || 1; 
    let carrito = JSON.parse(sessionStorage.getItem("carrito")) || [];
    const productoExistente = carrito.find(item => item.id === idProducto);

    if (productoExistente) {
        productoExistente.cantidad += cantidad; 
    } else {
        carrito.push({ id: idProducto, cantidad });
    }

    sessionStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarContadorCarrito();
}


function vaciarCarrito() {
    sessionStorage.removeItem("carrito");
    actualizarContadorCarrito();
    cerrarModal();
}


function pagar() {
    const carrito = JSON.parse(sessionStorage.getItem("carrito")) || [];

    if (carrito.length === 0) {
        return;
    }


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
            totalCompra += producto.price * item.cantidad; 
        }
    });


    sessionStorage.setItem('productos', JSON.stringify(productosCompra));
    sessionStorage.setItem('total', totalCompra.toFixed(3));


    window.location.href = 'compra.html';
}


document.addEventListener("DOMContentLoaded", () => {
    actualizarContadorCarrito();
    

    document.getElementById("icono-carrito")?.addEventListener("click", mostrarModalCarrito);
    document.getElementById("vaciar-carrito")?.addEventListener("click", vaciarCarrito);
    document.getElementById("pagar")?.addEventListener("click", pagar);
    window.addEventListener("click", manejarClicksModal);
});
