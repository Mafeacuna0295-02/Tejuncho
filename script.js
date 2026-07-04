/* ============================================================
   TEJUNCHO · Lógica del sitio
   Catálogo, carrito (localStorage) y checkout WhatsApp / en página
   ============================================================ */

// --- Configuración ---
const WHATSAPP = "573207174673"; // +57 320 717 4673
const MONEDA = "COP";

// --- Catálogo de productos ---
// Edita libremente: precio en pesos, stock: "disponible" o "encargo"
const PRODUCTS = [
  { id:"spiderman", nombre:"Amigurumi Spider-Man", cat:"amigurumi", precio:45000, stock:"disponible",
    img:"img/producto-spiderman.jpg", desc:"Superhéroe tejido punto a punto, ideal para coleccionar o regalar." },
  { id:"stitch", nombre:"Amigurumi Stitch", cat:"amigurumi", precio:48000, stock:"disponible",
    img:"img/producto-stitch.jpg", desc:"El pequeño alienígena más tierno, tejido con lujo de detalle." },
  { id:"novios", nombre:"Novios Personalizados", cat:"amigurumi", precio:120000, stock:"encargo",
    img:"img/producto-novios.jpg", desc:"Réplica tejida de la pareja: peinado, gafas y traje a tu gusto." },
  { id:"virgen-cuadro", nombre:"Cuadro Virgen con Luces", cat:"religioso", precio:85000, stock:"encargo",
    img:"img/producto-virgen-cuadro.jpg", desc:"Cuadro tejido con flores y luces led. Un detalle lleno de fe." },
  { id:"virgen", nombre:"Virgen de Guadalupe", cat:"religioso", precio:35000, stock:"disponible",
    img:"img/producto-virgen.jpg", desc:"Figura tejida con manto dorado y rosario. Recuerdo especial." },
  { id:"rosario", nombre:"Rosario de Rosas Tejidas", cat:"religioso", precio:40000, stock:"disponible",
    img:"img/producto-rosario.jpg", desc:"Rosario decorativo con rosas y Virgen tejida a mano." },
  { id:"navidad", nombre:"Colección Navidad (x6)", cat:"temporada", precio:60000, stock:"encargo",
    img:"img/producto-navidad.jpg", desc:"Set de cabezas navideñas: Papá Noel, muñeco de nieve, reno y más." },
  { id:"gnomo", nombre:"Gnomo Navideño", cat:"temporada", precio:38000, stock:"disponible",
    img:"img/producto-gnomo.jpg", desc:"Gnomo tejido en hilo felpa, suavecito y decorativo." },
  { id:"abejas", nombre:"Llaveros Abejitas", cat:"llavero", precio:12000, stock:"disponible",
    img:"img/producto-abejas.jpg", desc:"Abejitas de mejillas rosadas para alegrar tus llaves o mochila." },
  { id:"aguacate", nombre:"Llavero Aguacate", cat:"llavero", precio:12000, stock:"disponible",
    img:"img/producto-aguacate.jpg", desc:"Aguacatito coqueto tejido con su moño. ¡Irresistible!" },
  { id:"tiburon", nombre:"Llavero Tiburón Bebé", cat:"llavero", precio:12000, stock:"disponible",
    img:"img/producto-tiburon.jpg", desc:"Mini tiburón bebé, tierno y del tamaño perfecto para llevar." },
  { id:"tortuga", nombre:"Llavero Tortuguita", cat:"llavero", precio:12000, stock:"disponible",
    img:"img/producto-tortuga.jpg", desc:"Tortuguita diminuta hecha a mano, un detalle que enamora." },
  { id:"mono", nombre:"Moño Rosa Tejido", cat:"accesorio", precio:10000, stock:"disponible",
    img:"img/producto-mono.jpg", desc:"Colita para el cabello con rosa tejida. Elegante y único." },
  { id:"scrunchie", nombre:"Scrunchie Tejido", cat:"accesorio", precio:14000, stock:"disponible",
    img:"img/producto-scrunchie.jpg", desc:"Scrunchie con textura de florecitas. Suave con tu cabello." },
  { id:"aretes-tejidos", nombre:"Aretes Tejidos con Perlas", cat:"accesorio", precio:18000, stock:"disponible",
    img:"img/aretes-tejidos.jpg", desc:"Aretes a crochet con detalles dorados. Tejido + brillo en una sola pieza." },
  // ---- Cover Gold & Acero ----
  { id:"gold-perla", nombre:"Aretes Perla & Circón", cat:"gold", precio:22000, stock:"disponible",
    img:"img/gold-aretes-perla.jpg", desc:"Aretes en cover gold con perla y circonias. Elegancia para el día a día." },
  { id:"gold-luna", nombre:"Set Aretes Luna & Estrella", cat:"gold", precio:28000, stock:"disponible",
    img:"img/gold-aretes-luna.jpg", desc:"Trío de aretes en cover gold: luna, estrella y topo. Combínalos a tu gusto." },
  { id:"gold-corazon", nombre:"Aretes Corazón Perla", cat:"gold", precio:24000, stock:"disponible",
    img:"img/gold-aretes-corazon.jpg", desc:"Corazón de perla con borde dorado. Un clásico romántico y sobrio." },
  { id:"gold-gota", nombre:"Aretes Gota Dorada", cat:"gold", precio:20000, stock:"disponible",
    img:"img/gold-aretes-gota.jpg", desc:"Aretes gota en cover gold, tendencia atemporal que estiliza." },
  { id:"gold-margaritas", nombre:"Collar Margaritas", cat:"gold", precio:32000, stock:"disponible",
    img:"img/gold-collar-margaritas.jpg", desc:"Collar de margaritas en acero dorado. Fresco, primaveral y delicado." },
  { id:"gold-pulsera", nombre:"Pulsera Perlas & Oro", cat:"gold", precio:26000, stock:"disponible",
    img:"img/gold-pulsera-perlas.jpg", desc:"Pulsera de perlas y esferas doradas. “Eres hermosa y valiente”." },
];

// --- Utilidades ---
const money = n => "$" + n.toLocaleString("es-CO");
const $ = sel => document.querySelector(sel);
const $$ = sel => document.querySelectorAll(sel);

// --- Estado del carrito ---
let cart = JSON.parse(localStorage.getItem("tejuncho_cart") || "[]");
const saveCart = () => localStorage.setItem("tejuncho_cart", JSON.stringify(cart));

// ============================================================
//  RENDER CATÁLOGO
// ============================================================
function renderProducts(filter = "all"){
  const grid = $("#productGrid");
  const list = filter === "all" ? PRODUCTS : PRODUCTS.filter(p => p.cat === filter);
  grid.innerHTML = list.map(p => `
    <article class="product-card reveal" data-cat="${p.cat}">
      <div class="product-media">
        <img src="${p.img}" alt="${p.nombre}" loading="lazy" />
        <span class="product-tag ${p.cat === "gold" ? "gold" : ""}">${catLabel(p.cat)}</span>
        <span class="product-stock ${p.stock === "encargo" ? "encargo" : ""}">
          ${p.stock === "encargo" ? "Bajo encargo" : "Disponible"}
        </span>
      </div>
      <div class="product-body">
        <h3>${p.nombre}</h3>
        <p class="product-desc">${p.desc}</p>
        <div class="product-foot">
          <span class="product-price">${money(p.precio)}</span>
          <button class="add-btn" data-add="${p.id}">
            + Agregar
          </button>
        </div>
      </div>
    </article>
  `).join("");
  observeReveals();
}

function catLabel(c){
  return { amigurumi:"Amigurumi", llavero:"Llavero", religioso:"Religioso",
           accesorio:"Accesorio", temporada:"Temporada", gold:"Cover Gold" }[c] || c;
}

// Highlights (destacados)
function renderHighlights(){
  const ids = ["novios","virgen-cuadro","stitch","gold-margaritas","navidad"];
  const grid = $("#highlightGrid");
  grid.innerHTML = ids.map(id => {
    const p = PRODUCTS.find(x => x.id === id);
    return `<a class="highlight-card reveal" href="#catalogo">
      <img src="${p.img}" alt="${p.nombre}" loading="lazy" />
      <span>${p.nombre}</span>
    </a>`;
  }).join("");
  observeReveals();
}

// ============================================================
//  CARRITO
// ============================================================
function addToCart(id){
  const prod = PRODUCTS.find(p => p.id === id);
  const existing = cart.find(i => i.id === id);
  if(existing) existing.qty++;
  else cart.push({ id, nombre:prod.nombre, precio:prod.precio, img:prod.img, qty:1 });
  saveCart(); updateCart(); showToast(`"${prod.nombre}" agregado 🧶`);
}
function changeQty(id, delta){
  const item = cart.find(i => i.id === id);
  if(!item) return;
  item.qty += delta;
  if(item.qty <= 0) cart = cart.filter(i => i.id !== id);
  saveCart(); updateCart();
}
function removeItem(id){ cart = cart.filter(i => i.id !== id); saveCart(); updateCart(); }
function cartTotal(){ return cart.reduce((s,i) => s + i.precio * i.qty, 0); }
function cartCount(){ return cart.reduce((s,i) => s + i.qty, 0); }

function updateCart(){
  $("#cartCount").textContent = cartCount();
  const itemsEl = $("#cartItems"), emptyEl = $("#cartEmpty"), footEl = $("#cartFooter");
  if(cart.length === 0){
    itemsEl.innerHTML = ""; emptyEl.style.display = "flex"; footEl.style.display = "none";
    return;
  }
  emptyEl.style.display = "none"; footEl.style.display = "flex";
  itemsEl.innerHTML = cart.map(i => `
    <div class="cart-row">
      <img src="${i.img}" alt="${i.nombre}" />
      <div class="cart-row-info">
        <h4>${i.nombre}</h4>
        <span class="price">${money(i.precio)}</span>
        <div class="qty">
          <button data-minus="${i.id}" aria-label="Quitar uno">−</button>
          <span>${i.qty}</span>
          <button data-plus="${i.id}" aria-label="Agregar uno">+</button>
        </div>
      </div>
      <button class="cart-remove" data-remove="${i.id}" aria-label="Eliminar">🗑</button>
    </div>
  `).join("");
  $("#cartTotal").textContent = money(cartTotal());
}

// ============================================================
//  CHECKOUT
// ============================================================
function buildOrderText(datos){
  let msg = "¡Hola Tejuncho! 🧶 Quiero hacer este pedido:%0A%0A";
  cart.forEach(i => {
    msg += `• ${i.qty} × ${i.nombre} — ${money(i.precio * i.qty)}%0A`;
  });
  msg += `%0A*Total: ${money(cartTotal())}*%0A`;
  if(datos){
    msg += `%0A*Mis datos:*%0A`;
    msg += `Nombre: ${datos.nombre}%0A`;
    msg += `Teléfono: ${datos.telefono}%0A`;
    msg += `Ciudad/País: ${datos.ciudad}%0A`;
    msg += `Dirección: ${datos.direccion}%0A`;
    if(datos.notas) msg += `Notas: ${datos.notas}%0A`;
  }
  return msg;
}

function checkoutWhatsApp(){
  if(cart.length === 0){ showToast("Tu carrito está vacío"); return; }
  const url = `https://wa.me/${WHATSAPP}?text=${buildOrderText()}`;
  window.open(url, "_blank");
}

// ============================================================
//  MODAL CHECKOUT EN PÁGINA
// ============================================================
function openCheckoutModal(){
  if(cart.length === 0){ showToast("Tu carrito está vacío"); return; }
  const modalBody = $("#modalBody");
  modalBody.dataset.mode = "form";
  // Restaurar formulario si estaba en éxito
  if(!$("#checkoutFormEl")) location.reload();
  const summary = $("#modalSummary");
  summary.innerHTML = cart.map(i =>
    `<div class="sum-row"><span>${i.qty} × ${i.nombre}</span><span>${money(i.precio*i.qty)}</span></div>`
  ).join("") + `<div class="sum-row"><span>Total</span><span>${money(cartTotal())}</span></div>`;
  $("#modalOverlay").classList.add("open");
  closeCart();
}

function handleCheckoutSubmit(e){
  e.preventDefault();
  const fd = new FormData(e.target);
  const datos = Object.fromEntries(fd.entries());
  // Guardamos el pedido localmente (registro de ventas)
  const pedido = { fecha:new Date().toISOString(), items:cart, total:cartTotal(), cliente:datos };
  const ventas = JSON.parse(localStorage.getItem("tejuncho_ventas") || "[]");
  ventas.push(pedido);
  localStorage.setItem("tejuncho_ventas", JSON.stringify(ventas));

  // Mostrar confirmación con opción de enviar copia a WhatsApp
  const waUrl = `https://wa.me/${WHATSAPP}?text=${buildOrderText(datos)}`;
  $("#modalBody").innerHTML = `
    <div class="modal-success">
      <div class="big">🎉</div>
      <h3>¡Pedido recibido, ${datos.nombre.split(" ")[0]}!</h3>
      <p class="modal-sub">Guardamos tu pedido por <strong>${money(pedido.total)}</strong>.
        Para coordinar el pago y el envío más rápido, envíanos la confirmación:</p>
      <a href="${waUrl}" target="_blank" class="btn btn-whatsapp full">
        <span class="wa-ico"></span> Confirmar por WhatsApp
      </a>
      <button class="btn btn-ghost full" id="modalDone" style="margin-top:.7rem">Listo, cerrar</button>
    </div>`;
  cart = []; saveCart(); updateCart();
  $("#modalDone").addEventListener("click", closeModal);
}

// ============================================================
//  CONTROLES UI
// ============================================================
function openCart(){ $("#cartDrawer").classList.add("open"); $("#cartOverlay").classList.add("open"); }
function closeCart(){ $("#cartDrawer").classList.remove("open"); $("#cartOverlay").classList.remove("open"); }
function closeModal(){ $("#modalOverlay").classList.remove("open"); }

let toastTimer;
function showToast(msg){
  const t = $("#toast"); t.textContent = msg; t.classList.add("show");
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove("show"), 2400);
}

// Formulario de personalizados -> WhatsApp
function handleCustomSubmit(e){
  e.preventDefault();
  const fd = new FormData(e.target);
  const d = Object.fromEntries(fd.entries());
  let msg = "¡Hola Tejuncho! 🧶 Quiero un pedido personalizado:%0A%0A";
  msg += `Nombre: ${d.nombre}%0A`;
  msg += `Tipo: ${d.tipo}%0A`;
  msg += `Idea: ${d.detalle}%0A`;
  window.open(`https://wa.me/${WHATSAPP}?text=${msg}`, "_blank");
}

// Animaciones reveal
let revealObserver;
function observeReveals(){
  if(!revealObserver){
    revealObserver = new IntersectionObserver(entries => {
      entries.forEach(en => { if(en.isIntersecting){ en.target.classList.add("in"); revealObserver.unobserve(en.target); } });
    }, { threshold:.12 });
  }
  $$(".reveal:not(.in)").forEach(el => revealObserver.observe(el));
}

// ============================================================
//  INIT
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  renderHighlights();
  updateCart();
  $("#year").textContent = new Date().getFullYear();

  // Delegación de eventos: agregar al carrito + qty
  document.addEventListener("click", e => {
    const add = e.target.closest("[data-add]");
    if(add){ addToCart(add.dataset.add); return; }
    const plus = e.target.closest("[data-plus]");
    if(plus){ changeQty(plus.dataset.plus, 1); return; }
    const minus = e.target.closest("[data-minus]");
    if(minus){ changeQty(minus.dataset.minus, -1); return; }
    const rem = e.target.closest("[data-remove]");
    if(rem){ removeItem(rem.dataset.remove); return; }
  });

  // Filtros
  $("#filters").addEventListener("click", e => {
    const chip = e.target.closest(".filter-chip");
    if(!chip) return;
    $$(".filter-chip").forEach(c => c.classList.remove("is-active"));
    chip.classList.add("is-active");
    renderProducts(chip.dataset.filter);
  });

  // Carrito
  $("#cartBtn").addEventListener("click", openCart);
  $("#cartClose").addEventListener("click", closeCart);
  $("#cartOverlay").addEventListener("click", closeCart);
  $("#cartEmptyBtn").addEventListener("click", closeCart);
  $("#checkoutWa").addEventListener("click", checkoutWhatsApp);
  $("#checkoutForm").addEventListener("click", openCheckoutModal);

  // Modal
  $("#modalClose").addEventListener("click", closeModal);
  $("#modalOverlay").addEventListener("click", e => { if(e.target === $("#modalOverlay")) closeModal(); });
  $("#checkoutFormEl").addEventListener("submit", handleCheckoutSubmit);

  // Personalizados
  $("#customForm").addEventListener("submit", handleCustomSubmit);

  // Menú móvil
  const nav = $("#mainNav"), toggle = $("#navToggle");
  toggle.addEventListener("click", () => nav.classList.toggle("open"));
  nav.addEventListener("click", e => { if(e.target.tagName === "A") nav.classList.remove("open"); });

  // Reveal para secciones estáticas
  $$(".section-head, .custom-info, .custom-form, .story-text, .story-media, .contact-card, .value-item, .encargo-card, .encargo-title, .encargo-sub, .lifestyle-media, .lifestyle-text")
    .forEach(el => el.classList.add("reveal"));
  observeReveals();

  // Cerrar con Escape
  document.addEventListener("keydown", e => {
    if(e.key === "Escape"){ closeCart(); closeModal(); }
  });
});
