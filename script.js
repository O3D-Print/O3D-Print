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
    
    const total = carrito.reduce((sum, p) => sum + p.precio, 0);
    const articulos = carrito.map(i => i.nombre).join(", ");

    localStorage.setItem('totalO3D', total);
    localStorage.setItem('articulosO3D', articulos);
    
    // Redirección limpia a la carpeta pago
    window.location.href = './pago/';
}