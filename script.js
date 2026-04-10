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
    if(grid) {
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
    }
};

function agregarAlCarrito(id) {
    const p = productos.find(x => x.id === id);
    carrito.push(p);
    actualizarCarrito();
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
                    <p style="color:var(--primary)">${item.precio}€</p>
                </div>
                <button class="btn-remove" onclick="eliminarDelCarrito(${index})">Eliminar</button>
            </div>
        `;
    });

    totalDisplay.innerText = `${total}€`;
    countBadge.innerText = carrito.length;
}

function toggleCart() {
    document.getElementById('cart-sidebar').classList.toggle('active');
}

// FLUJO DE PAGO CON KO-FI
function procesarPago() {
    if (carrito.length === 0) return alert("La cesta está vacía");
    
    // 1. Calculamos el total y los nombres de los productos
    const total = carrito.reduce((sum, p) => sum + p.precio, 0);
    const articulos = carrito.map(i => i.nombre).join(", ");

    // 2. Guardamos los datos en localStorage (memoria del navegador)
    localStorage.setItem('totalO3D', total);
    localStorage.setItem('articulosO3D', articulos);
    
    // 3. Redirigimos a tu nueva página de checkout
    window.location.href = 'pago.html';
}
function mostrarFormularioEnvio() {
    document.getElementById('form-modal').style.display = 'flex';
}

function cerrarModal() {
    document.getElementById('form-modal').style.display = 'none';
    // Volvemos a mostrar el botón de pago por si quiere corregir algo
    document.getElementById('btn-pagar-main').style.display = 'block';
    document.getElementById('confirmacion-pago').style.display = 'none';
}

const SCRIPT_URL_GOOGLE = "https://script.google.com/macros/s/AKfycbyulcHYSz_OD3GRKXU7RCZkxFm9pY5Xi_afdZJW_BoyEI0hK0WaWDYV3Sy1We4Sq9tf/exec";

async function enviarPedido() {
    const nombre = document.getElementById('u-nombre').value;
    const email = document.getElementById('u-email').value;
    const idpago = document.getElementById('u-id-pago').value;
    const notas = document.getElementById('u-notas').value;

    if (!nombre || !email || !idpago) {
        return alert("Por favor, rellena los campos obligatorios para el envío.");
    }

    const datos = {
        nombre: nombre,
        email: email,
        idpago: idpago,
        notas: notas,
        total: document.getElementById('total-price').innerText,
        articulos: carrito.map(i => i.nombre).join(", ")
    };

    alert(`¡Gracias ${nombre}! Enviando datos a O3D-Print...`);
    
    // Limpieza
    carrito = [];
    actualizarCarrito();
    cerrarModal();
    if (document.getElementById('cart-sidebar').classList.contains('active')) {
        toggleCart();
    }
    
    // Enviar a Google de forma silenciosa
    try {
        fetch(SCRIPT_URL_GOOGLE, {
            method: 'POST',
            mode: 'no-cors', 
            body: JSON.stringify(datos)
        });
    } catch (error) {
        console.log("Error de red");
    }
}