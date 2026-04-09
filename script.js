const PAYPAL_LINK = "https://www.paypal.me/empresao3d/";

const productos = [
    { id: 1, nombre: "Llavero personalizado", precio: 1, img: "img/Llavero.jpeg" },
    { id: 2, nombre: "Base de carga Xiaomi redmi watch 5, 5 lite y 5 active", precio: 3, img: "img/Reloj.jpeg" },
    { id: 3, nombre: "Imán intercambiable.", precio: 2, img: "img/Iman.jpeg" },
    { id: 4, nombre: "Llavero NFC", precio: 2, img: "img/Etiqueta_NFC.jpeg" }
];

let carrito = [];

// Cargar catálogo al inicio
window.onload = () => {
    const grid = document.getElementById('product-grid');
    productos.forEach(p => {
        grid.innerHTML += `
            <div class="card" data-aos="fade-up">
                <div class="img-container">
                    ${p.img ? `<img src="${p.img}" alt="${p.nombre}" onerror="this.style.display='none'; this.nextElementSibling.style.display='block'">` : ''}
                    <span class="img-placeholder" style="${p.img ? 'display:none;' : 'display:block;'}">O3D-PRINT</span>
                </div>
                <h3>${p.nombre}</h3>
                <p class="price">${p.precio}€</p>
                <button class="btn-add" onclick="agregarAlCarrito(${p.id})">Añadir a la Cesta</button>
            </div>
        `;
    });
};

function agregarAlCarrito(id) {
    const p = productos.find(x => x.id === id);
    carrito.push(p);
    actualizarCarrito();
    // Abrir sidebar automáticamente al añadir
    document.getElementById('cart-sidebar').classList.add('active');
}

function eliminarDelCarrito(index) {
    carrito.splice(index, 1);
    actualizarCarrito();
}

function actualizarCarrito() {
    const list = document.getElementById('cart-items');
    const totalDisplay = document.getElementById('total-price');
    const countBadge = document.getElementById('cart-count');
    
    list.innerHTML = "";
    let total = 0;

    carrito.forEach((item, index) => {
        total += item.precio;
        list.innerHTML += `
            <div class="cart-item">
                <div>
                    <h4>${item.nombre}</h4>
                    <p style="color:var(--primary)">$${item.precio}</p>
                </div>
                <button class="btn-remove" onclick="eliminarDelCarrito(${index})">Eliminar</button>
            </div>
        `;
    });

    totalDisplay.innerText = `$${total}`;
    countBadge.innerText = carrito.length;
}

function toggleCart() {
    document.getElementById('cart-sidebar').classList.toggle('active');
}

// FLUJO DE PAGO
function procesarPago() {
    if (carrito.length === 0) return alert("La cesta está vacía");
    
    const total = carrito.reduce((sum, p) => sum + p.precio, 0);
    
    // 1. Abrir PayPal en pestaña nueva
    window.open(`${PAYPAL_LINK}${total}`, '_blank');
    
    // 2. Abrir formulario de la web
    document.getElementById('form-modal').style.display = 'flex';
}

function cerrarModal() {
    document.getElementById('form-modal').style.display = 'none';
}

// URL DE TU GOOGLE APPS SCRIPT (Cópiala de cuando publicaste el script como Aplicación Web)
const SCRIPT_URL_GOOGLE = "https://script.google.com/macros/s/AKfycbyulcHYSz_OD3GRKXU7RCZkxFm9pY5Xi_afdZJW_BoyEI0hK0WaWDYV3Sy1We4Sq9tf/exec";

async function enviarPedido() {
    const nombre = document.getElementById('u-nombre').value;
    const email = document.getElementById('u-email').value;
    const idpago = document.getElementById('u-id-pago').value;
    const notas = document.getElementById('u-notas').value;

    if (!nombre || !email || !idpago) {
        return alert("Por favor, rellena todos los campos obligatorios.");
    }

    // Datos a enviar
    const datos = {
        nombre: nombre,
        email: email,
        idpago: idpago,
        notas: notas,
        total: document.getElementById('total-price').innerText,
        articulos: carrito.map(i => i.nombre).join(", ")
    };

    // --- PASO 1: FEEDBACK INMEDIATO ---
    alert(`¡Procesando pedido de ${nombre}! Pulsa OK para finalizar.`);
    
    // --- PASO 2: LIMPIEZA TOTAL ---
    // Reiniciamos el carrito
    carrito = [];
    actualizarCarrito();
    
    // Cerramos el modal y el sidebar
    cerrarModal();
    if (document.getElementById('cart-sidebar').classList.contains('active')) {
        toggleCart();
    }
    
    // REINICIAR EL FORMULARIO (Vaciar los inputs)
    document.getElementById('u-nombre').value = "";
    document.getElementById('u-email').value = "";
    document.getElementById('u-id-pago').value = "";
    document.getElementById('u-notas').value = "";

    // --- PASO 3: ENVÍO SILENCIOSO A GOOGLE ---
    try {
        fetch(SCRIPT_URL_GOOGLE, {
            method: 'POST',
            mode: 'no-cors', 
            body: JSON.stringify(datos)
        });
    } catch (error) {
        console.log("Error silencioso de red");
    }
}