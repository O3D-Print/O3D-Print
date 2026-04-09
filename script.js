const productos = [
    { id: 1, nombre: "Figura STL 10cm", precio: 25 },
    { id: 2, nombre: "Engranaje PETG", precio: 15 },
    { id: 3, nombre: "Casco Escala 1:4", precio: 55 },
    { id: 4, nombre: "Maceta Geométrica", precio: 20 }
];

let carrito = [];
let total = 0;

// 1. Dibujar los productos
const grid = document.getElementById('product-grid');
productos.forEach(p => {
    grid.innerHTML += `
        <div class="product-card">
            <div class="img-placeholder">STL MODEL</div>
            <h3>${p.nombre}</h3>
            <div class="price">$${p.precio}</div>
            <button class="btn-add" onclick="agregarAlCarrito(${p.id})">Encargar Impresión</button>
        </div>
    `;
});

// 2. Funciones del carrito
function agregarAlCarrito(id) {
    const p = productos.find(item => item.id === id);
    carrito.push(p);
    actualizarCarrito();
    document.getElementById('cart-modal').style.display = 'block';
}

function actualizarCarrito() {
    const lista = document.getElementById('cart-items');
    const totalDisplay = document.getElementById('total-price');
    const badge = document.getElementById('cart-count');
    
    lista.innerHTML = '';
    total = 0;

    carrito.forEach((p, index) => {
        total += p.precio;
        lista.innerHTML += `
            <div style="display:flex; justify-content:space-between; margin-bottom:10px; background:#222; padding:10px; border-radius:5px;">
                <span>${p.nombre}</span>
                <span>$${p.precio}</span>
            </div>
        `;
    });

    totalDisplay.innerText = total;
    badge.innerText = carrito.length;
}

// 3. Abrir/Cerrar Modal
document.getElementById('cart-toggle').onclick = () => document.getElementById('cart-modal').style.display = 'block';
document.querySelector('.close-modal').onclick = () => document.getElementById('cart-modal').style.display = 'none';

// 4. PAYPAL - ESTA ES LA CLAVE
if (typeof paypal !== 'undefined') {
    paypal.Buttons({
        style: { layout: 'vertical', color: 'orange', shape: 'rect' },
        createOrder: function(data, actions) {
            if (total <= 0) {
                alert("La cesta está vacía");
                return;
            }
            return actions.order.create({
                purchase_units: [{ amount: { value: total.toString() } }]
            });
        },
        onApprove: function(data, actions) {
            return actions.order.capture().then(function(details) {
                alert('¡Pago Confirmado! Empezaré a imprimir tu modelo ahora mismo, ' + details.payer.name.given_name);
                carrito = [];
                actualizarCarrito();
                document.getElementById('cart-modal').style.display = 'none';
            });
        }
    }).render('#paypal-button-container');
} else {
    console.error("No se pudo cargar el SDK de PayPal.");
}