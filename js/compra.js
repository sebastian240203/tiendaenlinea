document.addEventListener("DOMContentLoaded", function () {
    const productos = JSON.parse(sessionStorage.getItem('productos')) || [];
    const total = sessionStorage.getItem('total') || 0;
    const totalNumerico = parseFloat(total) || 0;
    const totalFormateado = totalNumerico.toFixed(3);

    const detalleDiv = document.getElementById("detalle");
    let resumenHTML = "";
    let cantidadTotal = 0;
    let totalGeneral = 0;

    productos.forEach(producto => {
        const subtotal = producto.precio * producto.cantidad;
        resumenHTML += `
            <tr>
                <td>${producto.nombre}</td>
                <td>$${producto.precio.toFixed(3)}</td>
                <td>${producto.cantidad}</td>
                <td>$${subtotal.toFixed(3)}</td>
            </tr>
        `;
        cantidadTotal += producto.cantidad;
        totalGeneral += subtotal;
    });

    detalleDiv.innerHTML = resumenHTML;
    document.getElementById('total-items').textContent = cantidadTotal;
    document.getElementById('total').textContent = `$${totalGeneral.toFixed(3)}`;

    function enviarFormulario(event) {
        event.preventDefault();

        const nombreContacto = document.getElementById('nombre').value.trim();
        const emailContacto = document.getElementById('contactoEmail').value.trim();
        const telefonoContacto = document.getElementById('telefono').value.trim();

        if (!nombreContacto || !emailContacto || !telefonoContacto) {
            alert("Por favor, completa todos los campos de contacto antes de enviar.");
            return;
        }

        let detallesCarritoParaEnvio = '';
        for (let i = 0; i < productos.length; i++) {
            const productoActual = productos[i];
            detallesCarritoParaEnvio += `${productoActual.nombre} - $${parseFloat(productoActual.precio).toFixed(3)} (Cantidad: ${productoActual.cantidad})\n`;
        }

        document.getElementById('carritoData').value = detallesCarritoParaEnvio;
        document.getElementById('totalCarrito').value = `$${totalFormateado}`;
        
        // Enviar el formulario
        document.getElementById('formulario').submit();
    }

    const botonEnviar = document.getElementById('botonEnviar');
    const botonRestablecer = document.getElementById('botonRestablecer');

    if (botonEnviar) {
        botonEnviar.addEventListener('click', enviarFormulario);
    } else {
        console.warn("ADVERTENCIA: No se encontró el botón con ID 'botonEnviar'.");
    }

    if (botonRestablecer) {
        botonRestablecer.addEventListener('click', function() {
            // Restablecer el formulario
            document.getElementById('formulario').reset();
            detalleDiv.innerHTML = ""; // Limpiar el resumen
            document.getElementById('total-items').textContent = "0"; // Reiniciar total de artículos
            document.getElementById('total').textContent = "$0.00"; // Reiniciar total a pagar
        });
    }
});
