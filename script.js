const productos = [
    { id: 1, nombre: "Llavero personalizado", precio: 1, img: "img/Llavero.jpeg" },
    { id: 2, nombre: "Base de carga Xiaomi redmi watch 5, 5 lite y 5 active", precio: 3, img: "img/Reloj.jpeg" },
    { id: 3, nombre: "Imán intercambiable.", precio: 2, img: "img/Iman.jpeg" },
    { id: 4, nombre: "Llavero NFC", precio: 2, img: "img/Etiqueta_NFC.jpeg" }
];

let carrito = [];

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

function procesarPago() {
    if (carrito.length === 0) return alert("La cesta está vacía");
    /*Quitar esto para usar el pago*/
    alert("Proximamente");
    return;
    /*Hasta aquí*/
    const total = carrito.reduce((sum, p) => sum + p.precio, 0);
    const articulos = carrito.map(i => i.nombre).join(", ");

    // GUARDADO CRÍTICO EN MEMORIA
    localStorage.setItem('totalO3D', total);
    localStorage.setItem('articulosO3D', articulos);
    
    window.location.href = './pago/';
}

// FUNCIONES PARA EL PEDIDO PERSONALIZADO
function abrirModalPersonalizado() {
    document.getElementById('modal-personalizado').style.display = 'flex';
}

function cerrarModalPersonalizado() {
    document.getElementById('modal-personalizado').style.display = 'none';
}

async function enviarPedidoPersonalizado() {
    const nombre = document.getElementById('custom-nombre').value;
    const email = document.getElementById('custom-email').value;
    const idea = document.getElementById('custom-idea').value;

    if (!nombre || !email || !idea) {
        return alert("Por favor, rellena todos los campos para poder ayudarte.");
    }

    const datos = {
        nombre: nombre,
        email: email,
        notas: idea,
        total: "PRESUPUESTO PENDIENTE",
        articulos: "SOLICITUD DE DISEÑO PERSONALIZADO",
        estado: "INFO_SOLICITADA"
    };

    // Usamos el mismo SCRIPT_URL de Google que ya tienes
    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyulcHYSz_OD3GRKXU7RCZkxFm9pY5Xi_afdZJW_BoyEI0hK0WaWDYV3Sy1We4Sq9tf/exec";

    alert("¡Solicitud enviada! En breve revisaremos tu idea y te escribiremos a " + email);

    try {
        await fetch(SCRIPT_URL, { 
            method: 'POST', 
            mode: 'no-cors', 
            body: JSON.stringify(datos) 
        });
        
        // Limpiamos y cerramos
        document.getElementById('custom-nombre').value = "";
        document.getElementById('custom-email').value = "";
        document.getElementById('custom-idea').value = "";
        cerrarModalPersonalizado();
        
    } catch (e) {
        console.log("Error al enviar solicitud");
    }
}

function abrirModalPersonalizado() {
    document.getElementById('modal-personalizado').style.display = 'flex';
}

function cerrarModalPersonalizado() {
    document.getElementById('modal-personalizado').style.display = 'none';
}

function envMailObj() {
    if (carrito.length === 0) return alert("La cesta está vacía");
    const total = carrito.reduce((sum, p) => sum + p.precio, 0);
    const articulos = carrito.map(i => i.nombre).join(", ");
    
    localStorage.setItem('totalO3D', total);
    localStorage.setItem('articulosO3D', articulos);
    
    window.location.href = './correo/?correo=yes';
}