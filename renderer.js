const CATEGORIAS_DEFAULT = [
  { id: 1, nombre: "Vivienda", icono: "🏠", color: "blue", total: 0 },
  { id: 2, nombre: "Trabajo", icono: "💼", color: "green", total: 0 },
  { id: 3, nombre: "Salud", icono: "🏥", color: "red", total: 0 },
  { id: 4, nombre: "Obra Pública", icono: "🏗️", color: "yellow", total: 0 },
  { id: 5, nombre: "Educación", icono: "📚", color: "purple", total: 0 },
  { id: 6, nombre: "Desarrollo Social", icono: "🤝", color: "orange", total: 0 },
  { id: 7, nombre: "Mujer", icono: "👩", color: "pink", total: 0 },
  { id: 8, nombre: "Legales", icono: "⚖️", color: "gray", total: 0 },
  { id: 10, nombre: "Planos", icono: "🗺️", color: "indigo", total: 0, parent: "Barrios", tipo: "planos" },
  { id: 11, nombre: "Encuesta", icono: "📝", color: "orange", total: 0, parent: "Barrios", tipo: "encuesta" }
];

let categorias = [];
let categoriasEliminadas = [];
let modoEliminarBases = false;
let personas = [];
let registros = [];
let planos = [];
let encuestas = [];
let agendas = [];
let notasCalcular = [];
let libroPaginas = [];

let vista = "panel";
let catActiva = null;
let editandoId = null;
let registrosAbiertos = null;
let barriosAbierto = false;
let planoAbiertoId = null;
let preguntasEncuesta = [];
let editandoAgendaId = null;
let editandoNotaId = null;

let libroPaginaActual = 0;
let libroColorLapiz = "#111827";
let libroColorResaltado = "#fdf07e";
let libroResaltadorActivo = false;
let libroEditorActivo = null;
let libroUltimoRango = null;
let libroPasandoPagina = "";
let libroPaginaSeleccionada = 0;

const $ = (id) => document.getElementById(id);

// ===============================
// STORAGE
// ===============================

function guardarStorage() {
  localStorage.setItem("categorias", JSON.stringify(categorias));
  localStorage.setItem("categoriasEliminadas", JSON.stringify(categoriasEliminadas));
  localStorage.setItem("personas", JSON.stringify(personas));
  localStorage.setItem("registros", JSON.stringify(registros));
  localStorage.setItem("planos", JSON.stringify(planos));
  localStorage.setItem("encuestas", JSON.stringify(encuestas));
  localStorage.setItem("agendas", JSON.stringify(agendas));
  localStorage.setItem("notasCalcular", JSON.stringify(notasCalcular));
  localStorage.setItem("libroPaginas", JSON.stringify(libroPaginas));
}

function cargarStorage() {
  categorias = JSON.parse(localStorage.getItem("categorias")) || [];
  categoriasEliminadas = JSON.parse(localStorage.getItem("categoriasEliminadas")) || [];
  personas = JSON.parse(localStorage.getItem("personas")) || [];
  registros = JSON.parse(localStorage.getItem("registros")) || [];
  planos = JSON.parse(localStorage.getItem("planos")) || [];
  encuestas = JSON.parse(localStorage.getItem("encuestas")) || [];
  agendas = JSON.parse(localStorage.getItem("agendas")) || [];
  notasCalcular = JSON.parse(localStorage.getItem("notasCalcular")) || [];
  libroPaginas = JSON.parse(localStorage.getItem("libroPaginas")) || [];

  let huboCambios = false;

  CATEGORIAS_DEFAULT.forEach((catDefault) => {
    const fueEliminada = categoriasEliminadas.some(
      (x) => Number(x) === Number(catDefault.id) || String(x).toLowerCase() === String(catDefault.nombre).toLowerCase()
    );

    if (fueEliminada) return;

    const index = categorias.findIndex(
      (cat) => String(cat.nombre).toLowerCase() === catDefault.nombre.toLowerCase()
    );

    if (index === -1) {
      categorias.push({ ...catDefault });
      huboCambios = true;
    } else {
      const actualizada = { ...categorias[index], ...catDefault };
      if (JSON.stringify(categorias[index]) !== JSON.stringify(actualizada)) {
        categorias[index] = actualizada;
        huboCambios = true;
      }
    }
  });

  categorias = ordenarCategorias(categorias);

  if (!libroPaginas || libroPaginas.length === 0) {
    libroPaginas = [crearPaginaLibro("Página 1"), crearPaginaLibro("Página 2")];
    huboCambios = true;
  } else if (libroPaginas.length === 1) {
    libroPaginas.push(crearPaginaLibro("Página 2"));
    huboCambios = true;
  }

  if (huboCambios) guardarStorage();
}

// ===============================
// HELPERS
// ===============================


function esCategoriaDefault(cat) {
  return CATEGORIAS_DEFAULT.some(
    (c) => Number(c.id) === Number(cat.id) || String(c.nombre).toLowerCase() === String(cat.nombre).toLowerCase()
  );
}

function puedeBorrarCategoria(cat) {
  return !!cat;
}

function ordenarCategorias(lista) {
  const orden = CATEGORIAS_DEFAULT.map((cat) => cat.nombre);

  return [...lista].sort((a, b) => {
    const ia = orden.indexOf(a.nombre);
    const ib = orden.indexOf(b.nombre);

    if (ia !== -1 && ib !== -1) return ia - ib;
    if (ia !== -1) return -1;
    if (ib !== -1) return 1;

    return String(a.nombre).localeCompare(String(b.nombre));
  });
}

function formatPersonas(n) {
  return `${n} persona${n !== 1 ? "s" : ""}`;
}

function totalEnCategoria(catId) {
  if (Number(catId) === 10) return planos.length;
  if (Number(catId) === 11) return encuestas.length;
  return personas.filter((p) => Number(p.categoria_id) === Number(catId)).length;
}

function escapeHtml(str) {
  return String(str || "").replace(/[&<>'"]/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;"
  }[c]));
}

function convertirFechaInput(fecha) {
  if (!fecha) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(fecha)) return fecha;
  const m = String(fecha).match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!m) return "";
  return `${m[3]}-${m[2].padStart(2, "0")}-${m[1].padStart(2, "0")}`;
}

function moverFormularioA(lugar) {
  const form = $("formPersona");
  if (!form) return;

  if (lugar === "categoria") {
    const containerCategoria = $("categoriaView").querySelector(".container");
    const busqueda = $("busqueda");
    if (containerCategoria && busqueda) containerCategoria.insertBefore(form, busqueda);
  } else {
    const containerPanel = $("panelView").querySelector(".container");
    const cards = $("cardsCategorias");
    if (containerPanel && cards) containerPanel.insertBefore(form, cards);
  }
}

function nombreArchivoSeguro(nombre) {
  return String(nombre || "archivo")
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70) || "archivo";
}

async function descargarHTML(nombre, contenidoHtml) {
  const html = `
    <!doctype html>
    <html lang="es">
    <head>
      <meta charset="UTF-8" />
      <title>${escapeHtml(nombre)}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          padding: 30px;
          color: #111827;
          background: white;
        }

        h1 { margin-top: 0; }

        .card {
          border: 1px solid #ddd;
          border-radius: 12px;
          padding: 18px;
          margin-bottom: 16px;
          page-break-inside: avoid;
        }

        pre {
          white-space: pre-wrap;
          font-size: 14px;
        }

        img {
          max-width: 100%;
          max-height: 760px;
          object-fit: contain;
          border: 1px solid #ddd;
          border-radius: 10px;
          background: #f3f4f6;
        }

        iframe {
          width: 100%;
          height: 760px;
          border: 1px solid #ddd;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th,
        td {
          border: 1px solid #999;
          padding: 8px;
          vertical-align: top;
        }

        th {
          background: #818cf8;
        }

        .print-doble {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 18px;
        }

        .pagina-print {
          border: 1px solid #d1d5db;
          padding: 25px;
          min-height: 700px;
          background: white;
          page-break-inside: avoid;
        }

        .pagina-print.lined {
          background-image: linear-gradient(#ffffff 39px, #dbeafe 40px);
          background-size: 100% 40px;
        }
      </style>
    </head>
    <body>${contenidoHtml}</body>
    </html>
  `;

  const nombrePdf = `${nombreArchivoSeguro(nombre)}.pdf`;

  if (!(window.api && typeof window.api.guardarPdfHTML === "function")) {
    alert("Para guardar PDF directo tenés que abrir la app desde el .exe o con npm run dev. Si abrís index.html en Chrome, el navegador no deja guardar archivos directo.");
    return;
  }

  const resultado = await window.api.guardarPdfHTML({
    nombre: nombrePdf,
    html
  });

  if (resultado?.cancelado) return;

  if (resultado?.ok) {
    alert(`PDF guardado correctamente en:
${resultado.ruta}`);
    return;
  }

  alert(resultado?.error || "No se pudo guardar el PDF.");
}

function abrirCorreo(asunto, cuerpo) {
  const mailto = `mailto:?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`;
  window.location.href = mailto;
}

function imprimirHTML(titulo, contenidoHtml) {
  const ventana = window.open("", "_blank");
  if (!ventana) {
    alert("No se pudo abrir la ventana de impresión. Revisá si el navegador bloqueó ventanas emergentes.");
    return;
  }

  ventana.document.write(`
    <!doctype html>
    <html>
    <head>
      <title>${escapeHtml(titulo)}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 30px; color: #111827; }
        h1 { margin-top: 0; }
        .card { border: 1px solid #ddd; border-radius: 12px; padding: 18px; margin-bottom: 16px; }
        img { max-width: 100%; max-height: 760px; object-fit: contain; }
        iframe { width: 100%; height: 760px; border: 1px solid #ddd; }
        pre { white-space: pre-wrap; font-size: 14px; }
        table { width:100%; border-collapse:collapse; }
        th, td { border: 1px solid #999; padding: 8px; vertical-align: top; }
        th { background: #818cf8; }
        .print-doble{display:grid;grid-template-columns:1fr 1fr;gap:18px}
        .pagina-print{border:1px solid #d1d5db;padding:25px;min-height:700px;background:white}
        .pagina-print.lined{background-image:linear-gradient(#ffffff 39px,#dbeafe 40px);background-size:100% 40px}
        @media print { button { display:none; } }
      </style>
    </head>
    <body>
      ${contenidoHtml}
      <script>window.onload = function(){ setTimeout(function(){ window.print(); }, 300); }<\/script>
    </body>
    </html>
  `);

  ventana.document.close();
}

function abrirFichaCorreoHTML(titulo, contenidoHtml, cuerpoTexto = "") {
  const ventana = window.open("", "_blank");

  if (!ventana) {
    alert("No se pudo abrir la ficha de correo. Revisá si se bloquearon ventanas emergentes.");
    return;
  }

  ventana.document.write(`
    <!doctype html>
    <html>
    <head>
      <title>${escapeHtml(titulo)}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 30px; color: #111827; background: #f9fafb; }
        .no-print { background: white; border: 1px solid #ddd; border-radius: 14px; padding: 18px; margin-bottom: 18px; box-shadow: 0 2px 8px #0001; }
        .card { background:white; border:1px solid #ddd; border-radius:12px; padding:18px; margin-bottom:16px; }
        img { max-width:100%; max-height:750px; object-fit:contain; border:1px solid #ddd; border-radius:10px; background:#f3f4f6; }
        iframe { width:100%; height:750px; border:1px solid #ddd; border-radius:10px; background:white; }
        pre { white-space:pre-wrap; font-size:14px; }
        button { display:inline-block; background:#2563eb; color:white; border:none; border-radius:8px; padding:12px 18px; font-weight:800; cursor:pointer; text-decoration:none; margin:4px; }
        button.secondary { background:#e5e7eb; color:#374151; }
        .warning { background:#fff7ed; border:1px solid #fdba74; color:#9a3412; padding:12px; border-radius:10px; margin-top:12px; font-size:14px; line-height:1.45; }
        @media print { .no-print { display:none; } body { background:white; } }
      </style>
    </head>

    <body>
      <div class="no-print">
        <h2>Ficha de correo</h2>

        <button onclick="navigator.clipboard.writeText(document.getElementById('correoTexto').innerText).then(() => alert('Texto copiado.'))">
          📋 Copiar texto
        </button>

        <button class="secondary" onclick="window.print()">💾 Guardar como PDF / Imprimir</button>

        <div class="warning">
          Si el correo no se abrió con adjunto, esta ficha muestra la imagen/PDF para copiarla o guardarla como PDF.
        </div>

        <pre id="correoTexto" style="display:none">${escapeHtml(cuerpoTexto || "")}</pre>
      </div>

      ${contenidoHtml}
    </body>
    </html>
  `);

  ventana.document.close();
}


function dataUrlExtension(dataUrl, fallback = "archivo") {
  const texto = String(dataUrl || "");
  const mime = (texto.match(/^data:([^;]+);base64,/) || [])[1] || "";

  if (mime.includes("png")) return "png";
  if (mime.includes("jpeg") || mime.includes("jpg")) return "jpg";
  if (mime.includes("webp")) return "webp";
  if (mime.includes("gif")) return "gif";
  if (mime.includes("pdf")) return "pdf";

  const partes = String(fallback || "").split(".");
  return partes.length > 1 ? partes.pop().toLowerCase() : "bin";
}

function crearAdjuntoDesdeDataUrl(nombre, dataUrl) {
  if (!dataUrl) return null;

  const extension = dataUrlExtension(dataUrl, nombre);
  let nombreFinal = nombre || `archivo.${extension}`;

  if (!String(nombreFinal).includes(".")) {
    nombreFinal = `${nombreArchivoSeguro(nombreFinal)}.${extension}`;
  }

  return {
    filename: nombreFinal,
    dataUrl
  };
}

async function abrirCorreoComputadora({ asunto, cuerpo, html, adjuntos }) {
  if (!(window.api && typeof window.api.abrirCorreoConAdjuntos === "function")) {
    alert("Para abrir el correo de la computadora con adjuntos tenés que usar el .exe o npm run dev. En Chrome no se puede adjuntar imágenes automáticamente.");
    return;
  }

  const resultado = await window.api.abrirCorreoConAdjuntos({
    asunto,
    cuerpo,
    html,
    adjuntos: (adjuntos || []).filter(Boolean)
  });

  if (resultado?.ok) return;

  alert(resultado?.error || "No se pudo abrir el correo de la computadora.");
}

function cuerpoHtmlCorreo(titulo, contenidoHtml) {
  return `
    <!doctype html>
    <html lang="es">
    <head>
      <meta charset="UTF-8" />
      <style>
        body { font-family: Arial, sans-serif; color:#111827; }
        .card { border:1px solid #ddd; border-radius:12px; padding:18px; margin-bottom:16px; }
        pre { white-space:pre-wrap; font-size:14px; }
        img { max-width:100%; height:auto; border:1px solid #ddd; border-radius:10px; }
        table { width:100%; border-collapse:collapse; }
        th,td { border:1px solid #999; padding:8px; vertical-align:top; }
        th { background:#818cf8; }
      </style>
    </head>
    <body>
      <h1>${escapeHtml(titulo || "Correo")}</h1>
      ${contenidoHtml}
    </body>
    </html>
  `;
}



function limpiarHtmlResaltadoLibro(html) {
  return html || "";
}





function limpiarResaltadosGuardadosLibro() {
  return;
}






// ===============================
// INICIO
// ===============================

function init() {
  cargarStorage();
  bindEvents();
  renderTodo();
}






function asegurarBotonEliminarBases() {
  const box = document.querySelector(".new-db-box");
  if (!box) return;

  let btn = $("btnToggleEliminarBases");

  if (!btn) {
    btn = document.createElement("button");
    btn.id = "btnToggleEliminarBases";
    btn.type = "button";
    btn.className = "new-db-btn delete-db-toggle";
    box.appendChild(btn);
  }

  btn.onclick = () => {
    modoEliminarBases = !modoEliminarBases;
    actualizarBotonEliminarBases();
    renderSidebar();
    renderPanel();
  };

  actualizarBotonEliminarBases();
}

function actualizarBotonEliminarBases() {
  const btn = $("btnToggleEliminarBases");
  if (!btn) return;

  btn.textContent = modoEliminarBases
    ? "✅ Terminar eliminación"
    : "🗑️ Eliminar base de datos";

  btn.classList.toggle("activo", modoEliminarBases);
}


function bindEvents() {
  asegurarBotonEliminarBases();
  actualizarBotonEliminarBases();
  $("btnPanel").onclick = mostrarPanel;

  if ($("btnAgenda")) $("btnAgenda").onclick = mostrarAgenda;
  if ($("btnLibro")) $("btnLibro").onclick = mostrarLibro;
  if ($("btnCalcular")) $("btnCalcular").onclick = mostrarCalcular;

  $("btnCargarPersona").onclick = () => {
    vista = "panel";
    moverFormularioA("panel");
    abrirFormPersona();
  };

  $("btnCancelarPersona").onclick = cerrarFormPersona;
  $("btnGuardarPersona").onclick = guardarPersona;
  $("categoriaSelect").onchange = actualizarAvisoDestino;

  $("btnMostrarNuevaCat").onclick = () => {
    $("btnMostrarNuevaCat").classList.add("hidden");
    $("formNuevaCat").classList.remove("hidden");
    $("inputNuevaCat").focus();
  };

  $("btnCancelarNuevaCat").onclick = cerrarNuevaCat;
  $("btnGuardarNuevaCat").onclick = crearCategoria;

  $("inputNuevaCat").onkeydown = (e) => {
    if (e.key === "Enter") crearCategoria();
  };

  $("busqueda").oninput = renderCategoria;
}

function renderTodo() {
  renderSidebar();
  renderSelectCategorias();

  if (vista === "panel") renderPanel();
  else if (vista === "agenda") renderAgenda();
  else if (vista === "libro") renderLibro();
  else if (vista === "calcular") renderCalcular();
  else renderCategoria();
}

// ===============================
// SIDEBAR / PANEL
// ===============================

function activarNavPrincipal(idActivo) {
  document.querySelectorAll(".nav-btn").forEach((b) => b.classList.remove("active"));
  if ($(idActivo)) $(idActivo).classList.add("active");
}

function renderSidebar() {
  actualizarBotonEliminarBases();

  const total = personas.length + planos.length + encuestas.length;

  $("totalPersonas").textContent =
    `${formatPersonas(total)} cargada${total !== 1 ? "s" : ""}`;

  let html = "";

  const categoriasNormales = categorias.filter((cat) => !cat.parent);
  const categoriasBarrios = categorias.filter((cat) => cat.parent === "Barrios");

  categoriasNormales.forEach((cat) => {
    const totalCat = totalEnCategoria(cat.id);

    html += `
      <div class="cat-row">
        <button class="cat-btn ${catActiva?.id === cat.id ? "active bg-" + cat.color : ""}" data-cat="${cat.id}">
          <span class="left"><span>${cat.icono}</span><span>${cat.nombre}</span></span>
          <span class="count">${totalCat}</span>
        </button>

        ${
          modoEliminarBases
            ? `<button class="cat-delete-btn" title="Eliminar base de datos" onclick="borrarCategoriaCompleta(${cat.id}); event.stopPropagation();">🗑️</button>`
            : ""
        }
      </div>
    `;
  });

  html += `
    <button class="cat-btn ${barriosAbierto ? "active" : ""}" id="btnBarrios" type="button">
      <span class="left"><span>🏘️</span><span>Barrios</span></span>
      <span>${barriosAbierto ? "▾" : "▸"}</span>
    </button>
  `;

  if (barriosAbierto) {
    categoriasBarrios.forEach((cat) => {
      const totalCat = totalEnCategoria(cat.id);

      html += `
        <div class="cat-row">
          <button class="cat-btn sub-cat ${catActiva?.id === cat.id ? "active bg-" + cat.color : ""}" data-cat="${cat.id}">
            <span class="left"><span>${cat.icono}</span><span>${cat.nombre}</span></span>
            <span class="count">${totalCat}</span>
          </button>

          ${
            modoEliminarBases
              ? `<button class="cat-delete-btn" title="Eliminar base de datos" onclick="borrarCategoriaCompleta(${cat.id}); event.stopPropagation();">🗑️</button>`
              : ""
          }
        </div>
      `;
    });
  }

  $("categoriasSidebar").innerHTML = html;

  document.querySelectorAll(".cat-btn[data-cat]").forEach((btn) => {
    btn.onclick = () => mostrarCategoria(Number(btn.dataset.cat));
  });

  const btnBarrios = $("btnBarrios");
  if (btnBarrios) {
    btnBarrios.onclick = () => {
      barriosAbierto = !barriosAbierto;
      renderSidebar();
    };
  }
}

function renderSelectCategorias() {
  const normales = categorias.filter((cat) => !cat.parent);

  $("categoriaSelect").innerHTML =
    `<option value="">— Seleccioná una base de datos —</option>` +
    normales.map((cat) => `<option value="${cat.id}">${cat.icono} ${cat.nombre}</option>`).join("");
}

function renderPanel() {
  activarNavPrincipal("btnPanel");

  const categoriasPanel = categorias.filter((cat) => !cat.parent);

  $("cardsCategorias").innerHTML = categoriasPanel.map((cat) => {
    const totalCat = totalEnCategoria(cat.id);
    return `
      <div class="card" data-cat="${cat.id}">
        <div class="emoji">${cat.icono}</div>
        <h3>${cat.nombre}</h3>
        <span class="badge badge-${cat.color}">${formatPersonas(totalCat)}</span>
      </div>
    `;
  }).join("");

  $("cardsCategorias").innerHTML += `
    <div class="card" id="cardBarrios">
      <div class="emoji">🏘️</div>
      <h3>Barrios</h3>
      <span class="badge badge-indigo">Planos / Encuesta</span>
    </div>
  `;

  document.querySelectorAll(".card[data-cat]").forEach((card) => {
    card.onclick = () => mostrarCategoria(Number(card.dataset.cat));
  });

  const cardBarrios = $("cardBarrios");
  if (cardBarrios) {
    cardBarrios.onclick = () => {
      barriosAbierto = true;
      renderSidebar();
      mostrarCategoria(10);
    };
  }
}

function mostrarPanel() {
  document.body.classList.remove("modo-libro");
  vista = "panel";
  catActiva = null;

  moverFormularioA("panel");

  activarNavPrincipal("btnPanel");
  $("panelView").classList.remove("hidden");
  $("categoriaView").classList.add("hidden");
  $("busqueda").style.display = "block";

  cerrarFormPersona();
  renderTodo();
}

function mostrarCategoria(catId) {
  document.body.classList.remove("modo-libro");
  vista = "categoria";
  catActiva = categorias.find((c) => Number(c.id) === Number(catId));

  activarNavPrincipal("");
  $("panelView").classList.add("hidden");
  $("categoriaView").classList.remove("hidden");

  $("busqueda").value = "";
  registrosAbiertos = null;

  if (catActiva?.tipo === "planos" || catActiva?.tipo === "encuesta") {
    cerrarFormPersona();
    $("formPersona").classList.add("hidden");
    renderTodo();
    return;
  }

  moverFormularioA("categoria");
  cerrarFormPersona();
  renderTodo();
}

// ===============================
// CATEGORÍAS NORMALES
// ===============================

function renderCategoria() {
  if (!catActiva) return;

  catActiva = categorias.find((c) => Number(c.id) === Number(catActiva.id));
  if (!catActiva) return;

  if (catActiva.tipo === "planos") {
    renderPlanos();
    return;
  }

  if (catActiva.tipo === "encuesta") {
    renderEncuesta();
    return;
  }

  $("busqueda").style.display = "block";

  const totalCat = totalEnCategoria(catActiva.id);

  $("categoriaHeader").className = `cat-header bg-${catActiva.color}`;
  $("categoriaHeader").innerHTML = `
    <div class="left">
      <div class="emoji">${catActiva.icono}</div>
      <div>
        <h2>${catActiva.nombre}</h2>
        <p>${formatPersonas(totalCat)} en esta base de datos</p>
      </div>
    </div>

    <div class="cat-actions">
      <button id="btnAgregarAqui">+ Agregar Persona Aquí</button>
      <button onclick="imprimirBase()">🖨️ Imprimir base</button>
      <button onclick="correoBase()">📧 Correo base</button>
      <button onclick="descargarBase()">⬇️ Descargar base</button>
    </div>
  `;

  $("btnAgregarAqui").onclick = () => {
    vista = "categoria";
    moverFormularioA("categoria");
    abrirFormPersona(catActiva.id);
  };

  const texto = $("busqueda").value.toLowerCase();

  const personasFiltradas = personas.filter((p) => {
    const mismaCategoria = Number(p.categoria_id) === Number(catActiva.id);
    const coincide =
      !texto ||
      String(p.nombre || "").toLowerCase().includes(texto) ||
      String(p.barrio || "").toLowerCase().includes(texto) ||
      String(p.celular || "").toLowerCase().includes(texto) ||
      String(p.direccion || "").toLowerCase().includes(texto) ||
      String(p.motivo_consulta || "").toLowerCase().includes(texto) ||
      String(p.fecha_carga || "").toLowerCase().includes(texto);

    return mismaCategoria && coincide;
  });

  if (personasFiltradas.length === 0) {
    $("personasLista").innerHTML = `
      <div class="empty">
        <div style="font-size:54px">${catActiva.icono}</div>
        <p>No hay personas en esta base de datos.</p>
        <small>Usá el botón <b>+ Agregar Persona Aquí</b> para cargar una persona en <b>${catActiva.nombre}</b>.</small>
      </div>
    `;
    return;
  }

  $("personasLista").innerHTML = personasFiltradas.map((p) => {
    const regs = registros.filter(
      (r) => Number(r.persona_id) === Number(p.id) && Number(r.categoria_id) === Number(catActiva.id)
    );

    return `
      <div class="persona-card" id="persona-${p.id}">
        <div class="persona-top">
          <div class="persona-main">
            <div class="avatar bg-${catActiva.color}">${(p.nombre || "?").charAt(0).toUpperCase()}</div>
            <div>
              <h3>${escapeHtml(p.nombre)}</h3>
              <p>📍 ${escapeHtml(p.barrio || "—")} &nbsp;|&nbsp; 📱 ${escapeHtml(p.celular || "—")}</p>
              ${p.direccion ? `<p>🏠 ${escapeHtml(p.direccion)}</p>` : ""}
              ${p.motivo_consulta ? `<p>💬 ${escapeHtml(p.motivo_consulta)}</p>` : ""}
              <p>📅 Cargada el: ${escapeHtml(p.fecha_carga || "—")}</p>
            </div>
          </div>

          <div class="registro-actions">
            <button class="icon-btn" onclick="imprimirPersona(${p.id})">🖨️</button>
            <button class="icon-btn" onclick="correoPersona(${p.id})">📧</button>
            <button class="icon-btn" onclick="descargarPersona(${p.id})">⬇️</button>
            <button class="icon-btn edit" data-id="${p.id}">✏️</button>
            <button class="icon-btn del danger" data-id="${p.id}">🗑️</button>
          </div>
        </div>

        <div class="registros">
          <div class="reg-head">
            <strong>REGISTROS (${regs.length})</strong>
            <button class="link-btn nuevo-reg" data-id="${p.id}">+ Nuevo registro</button>
          </div>

          <div id="regform-${p.id}" class="${registrosAbiertos === p.id ? "" : "hidden"} reg-form">
            <div class="reg-form-grid">
              <input id="regtitulo-${p.id}" placeholder="Título *" />
              <input id="regfecha-${p.id}" type="date" />
            </div>

            <textarea id="regdesc-${p.id}" rows="2" placeholder="Descripción..."></textarea>

            <div class="mini-actions">
              <button class="guardar-reg" data-id="${p.id}">Guardar</button>
              <button class="cancelar-reg" data-id="${p.id}">Cancelar</button>
            </div>
          </div>

          ${
            regs.length
              ? regs.map((r) => `
                <div class="reg-item">
                  <div>
                    <h4>${escapeHtml(r.titulo)}</h4>
                    <p>📅 ${escapeHtml(r.fecha || "")}</p>
                    ${r.descripcion ? `<p>${escapeHtml(r.descripcion)}</p>` : ""}
                  </div>

                  <div class="registro-actions">
                    <button class="icon-btn" onclick="imprimirRegistro(${r.id})">🖨️</button>
                    <button class="icon-btn" onclick="correoRegistro(${r.id})">📧</button>
                    <button class="icon-btn" onclick="descargarRegistro(${r.id})">⬇️</button>
                    <button class="icon-btn del-reg danger" data-id="${r.id}">🗑️</button>
                  </div>
                </div>
              `).join("")
              : `<p style="font-size:13px;color:#9ca3af"><i>Sin registros aún.</i></p>`
          }
        </div>
      </div>
    `;
  }).join("");

  bindPersonaButtons(personasFiltradas);
}

function bindPersonaButtons(personasFiltradas) {
  document.querySelectorAll(".edit").forEach((btn) => {
    btn.onclick = () => {
      const p = personasFiltradas.find((x) => Number(x.id) === Number(btn.dataset.id));
      if (!p) return;
      vista = "categoria";
      moverFormularioA("categoria");
      abrirFormPersona(p.categoria_id, p);
    };
  });

  document.querySelectorAll(".del").forEach((btn) => {
    btn.onclick = () => {
      if (confirm("¿Eliminar esta persona?")) {
        personas = personas.filter((p) => Number(p.id) !== Number(btn.dataset.id));
        registros = registros.filter((r) => Number(r.persona_id) !== Number(btn.dataset.id));
        guardarStorage();
        renderTodo();
      }
    };
  });

  document.querySelectorAll(".nuevo-reg").forEach((btn) => {
    btn.onclick = () => {
      registrosAbiertos = Number(btn.dataset.id);
      renderCategoria();
    };
  });

  document.querySelectorAll(".cancelar-reg").forEach((btn) => {
    btn.onclick = () => {
      registrosAbiertos = null;
      renderCategoria();
    };
  });

  document.querySelectorAll(".guardar-reg").forEach((btn) => {
    btn.onclick = () => guardarRegistro(Number(btn.dataset.id));
  });

  document.querySelectorAll(".del-reg").forEach((btn) => {
    btn.onclick = () => {
      if (!confirm("¿Eliminar este registro?")) return;
      registros = registros.filter((r) => Number(r.id) !== Number(btn.dataset.id));
      guardarStorage();
      renderCategoria();
    };
  });
}

// ===============================
// FORMULARIO NORMAL
// ===============================

function abrirFormPersona(categoriaId = "", persona = null) {
  if (vista === "categoria") moverFormularioA("categoria");
  else moverFormularioA("panel");

  editandoId = persona ? persona.id : null;

  $("formTitle").textContent = persona ? "✏️ Editar Persona" : "➕ Nueva Persona";
  $("btnGuardarPersona").textContent = persona ? "Guardar Cambios" : "Guardar Persona";

  $("nombre").value = persona?.nombre || "";
  $("celular").value = persona?.celular || "";
  $("direccion").value = persona?.direccion || "";
  $("barrio").value = persona?.barrio || "";
  $("motivo").value = persona?.motivo_consulta || "";
  $("fechaCarga").value = convertirFechaInput(persona?.fecha_carga || "");
  $("categoriaSelect").value = persona?.categoria_id || categoriaId || "";

  $("formPersona").classList.remove("hidden");
  actualizarAvisoDestino();

  $("formPersona").scrollIntoView({ behavior: "smooth", block: "start" });
}

function cerrarFormPersona() {
  editandoId = null;
  $("formPersona").classList.add("hidden");

  ["nombre", "celular", "direccion", "barrio", "motivo", "fechaCarga"].forEach((id) => {
    if ($(id)) $(id).value = "";
  });

  if ($("categoriaSelect")) $("categoriaSelect").value = "";
  actualizarAvisoDestino();
}

function guardarPersona() {
  const data = {
    id: editandoId || Date.now(),
    nombre: $("nombre").value.trim(),
    celular: $("celular").value.trim(),
    direccion: $("direccion").value.trim(),
    barrio: $("barrio").value.trim(),
    motivo_consulta: $("motivo").value.trim(),
    categoria_id: Number($("categoriaSelect").value),
    fecha_carga: $("fechaCarga").value || new Date().toLocaleDateString("es-AR")
  };

  if (!data.nombre || !data.categoria_id) {
    alert("Completá Nombre y Base de Datos de Destino.");
    return;
  }

  if (editandoId) {
    personas = personas.map((p) => Number(p.id) === Number(editandoId) ? data : p);
  } else {
    personas.push(data);
  }

  const categoriaGuardadaId = data.categoria_id;

  guardarStorage();
  cerrarFormPersona();
  renderTodo();

  if (vista === "categoria") mostrarCategoria(categoriaGuardadaId);
}

function actualizarAvisoDestino() {
  if (!$("categoriaSelect") || !$("destinoAviso")) return;

  const id = Number($("categoriaSelect").value);
  const cat = categorias.find((c) => Number(c.id) === Number(id));

  if (!cat) {
    $("destinoAviso").classList.add("hidden");
    return;
  }

  $("destinoAviso").className = `destino-aviso badge-${cat.color}`;
  $("destinoAviso").innerHTML = `✅ Esta persona será guardada en: <strong>${cat.icono} ${cat.nombre}</strong>`;
}


function borrarCategoriaCompleta(catId) {
  const cat = categorias.find((c) => Number(c.id) === Number(catId));

  if (!cat) {
    alert("No se encontró la base de datos.");
    return;
  }

  let detalle = "";

  if (cat.tipo === "planos") {
    detalle = `También se eliminarán ${planos.length} plano${planos.length !== 1 ? "s" : ""}.`;
  } else if (cat.tipo === "encuesta") {
    detalle = `También se eliminarán ${encuestas.length} encuesta${encuestas.length !== 1 ? "s" : ""}.`;
  } else {
    const totalPersonas = personas.filter((p) => Number(p.categoria_id) === Number(catId)).length;
    const totalRegistros = registros.filter((r) => Number(r.categoria_id) === Number(catId)).length;

    detalle =
      `También se eliminarán ${totalPersonas} persona${totalPersonas !== 1 ? "s" : ""} ` +
      `y ${totalRegistros} registro${totalRegistros !== 1 ? "s" : ""}.`;
  }

  const confirmar = confirm(
    `¿Seguro que quieres eliminar la base de datos "${cat.nombre}"?\\n\\n` +
    `${detalle}\\n\\n` +
    `Aceptar = Sí, eliminar\\n` +
    `Cancelar = No, conservar`
  );

  if (!confirmar) return;

  categorias = categorias.filter((c) => Number(c.id) !== Number(catId));

  if (esCategoriaDefault(cat)) {
    categoriasEliminadas.push(cat.id);
    categoriasEliminadas.push(cat.nombre);
    categoriasEliminadas = [...new Set(categoriasEliminadas.map(String))];
  }

  if (cat.tipo === "planos") {
    planos = [];
    planoAbiertoId = null;
  } else if (cat.tipo === "encuesta") {
    encuestas = [];
    preguntasEncuesta = [];
  } else {
    personas = personas.filter((p) => Number(p.categoria_id) !== Number(catId));
    registros = registros.filter((r) => Number(r.categoria_id) !== Number(catId));
  }

  modoEliminarBases = false;

  if (catActiva && Number(catActiva.id) === Number(catId)) {
    catActiva = null;
    vista = "panel";
    $("panelView").classList.remove("hidden");
    $("categoriaView").classList.add("hidden");
    $("busqueda").style.display = "block";
    activarNavPrincipal("btnPanel");
  }

  guardarStorage();
  renderTodo();
}

function borrarCategoriaNueva(catId) {
  borrarCategoriaCompleta(catId);
}


function crearCategoria() {
  const nombre = $("inputNuevaCat").value.trim();
  if (!nombre) return;

  const existe = categorias.find((c) => c.nombre.toLowerCase() === nombre.toLowerCase());
  if (existe) {
    cerrarNuevaCat();
    mostrarCategoria(existe.id);
    return;
  }

  const nuevoId = categorias.length > 0 ? Math.max(...categorias.map((c) => Number(c.id))) + 1 : 1;
  const nuevaCat = { id: nuevoId, nombre, icono: "📁", color: "indigo", total: 0 };

  categorias.push(nuevaCat);
  categorias = ordenarCategorias(categorias);

  guardarStorage();
  cerrarNuevaCat();
  renderTodo();
  mostrarCategoria(nuevaCat.id);
}

function cerrarNuevaCat() {
  $("inputNuevaCat").value = "";
  $("formNuevaCat").classList.add("hidden");
  $("btnMostrarNuevaCat").classList.remove("hidden");
}

function guardarRegistro(personaId) {
  const titulo = $(`regtitulo-${personaId}`).value.trim();
  if (!titulo) {
    alert("El título del registro es obligatorio.");
    return;
  }

  registros.push({
    id: Date.now(),
    persona_id: personaId,
    categoria_id: catActiva.id,
    titulo,
    descripcion: $(`regdesc-${personaId}`).value.trim(),
    fecha: $(`regfecha-${personaId}`).value || new Date().toLocaleDateString("es-AR")
  });

  registrosAbiertos = null;
  guardarStorage();
  renderCategoria();
}

// ===============================
// PLANOS
// ===============================

function renderPlanos() {
  cerrarFormPersona();
  $("formPersona").classList.add("hidden");

  const totalCat = planos.length;

  $("categoriaHeader").className = `cat-header bg-${catActiva.color}`;
  $("categoriaHeader").innerHTML = `
    <div class="left">
      <div class="emoji">${catActiva.icono}</div>
      <div>
        <h2>${catActiva.nombre}</h2>
        <p>${totalCat} archivo${totalCat !== 1 ? "s" : ""} cargado${totalCat !== 1 ? "s" : ""}</p>
      </div>
    </div>

    <div class="cat-actions">
      <button onclick="imprimirBase()">🖨️ Imprimir base</button>
      <button onclick="correoBase()">📧 Correo base</button>
      <button onclick="descargarBase()">⬇️ Descargar base</button>
    </div>
  `;

  $("busqueda").value = "";
  $("busqueda").style.display = "none";

  $("personasLista").innerHTML = `
    <div class="form-card">
      <h2>🗺️ Cargar Plano / Archivo</h2>

      <div class="grid-form">
        <label>
          Nombre del archivo *
          <input id="planoNombre" placeholder="Ej: Barrio Centro - Manzana 1" />
        </label>

        <label>
          Imagen o PDF *
          <input id="planoArchivo" type="file" accept="image/*,.pdf,application/pdf" />
        </label>

        <label class="full">
          Observaciones
          <textarea id="planoObs" rows="3" placeholder="Observaciones del archivo..."></textarea>
        </label>
      </div>

      <div id="previewPlanoCrear" class="plano-preview-crear hidden">
        <div class="preview-title">Vista previa del archivo seleccionado</div>
        <div id="previewPlanoCrearContenido" class="preview-content"></div>
      </div>

      <div class="actions">
        <button class="primary" onclick="guardarPlano()">Guardar Archivo</button>
      </div>
    </div>

    <div class="planos-lista">
      ${
        planos.length
          ? planos.map((plano) => renderPlanoCard(plano)).join("")
          : `<div class="empty"><p>No hay archivos cargados.</p></div>`
      }
    </div>
  `;

  const inputPlano = $("planoArchivo");
  if (inputPlano) {
    inputPlano.addEventListener("change", mostrarPreviewPlanoCrear);
  }
}

function renderPlanoCard(plano) {
  const terminado = plano.estado === "terminado";
  const abierto = Number(planoAbiertoId) === Number(plano.id);
  const archivoPlano = plano.archivo || plano.imagen || "";

  return `
    <div class="plano-card-mini ${terminado ? "plano-ok" : "plano-pendiente"}">
      <div class="plano-mini-top">
        <div>
          <h3>${escapeHtml(plano.nombre)}</h3>
          <p>📄 ${escapeHtml(plano.nombreArchivo || "Archivo cargado")}</p>
          <p>📅 ${escapeHtml(plano.fecha || "—")}</p>
          <p>Estado: <b>${terminado ? "Terminado" : "Pendiente"}</b></p>
        </div>

        <div class="plano-status">
          <button class="estado-btn estado-verde ${terminado ? "activo" : ""}" onclick="cambiarEstadoPlano(${plano.id}, 'terminado')" title="Plano terminado">✅</button>
          <button class="estado-btn estado-rojo ${!terminado ? "activo" : ""}" onclick="cambiarEstadoPlano(${plano.id}, 'pendiente')" title="Plano pendiente">❌</button>
        </div>
      </div>

      <p>${escapeHtml(plano.observaciones || "")}</p>

      <div class="registro-actions">
        <button class="icon-btn" onclick="togglePlanoAbierto(${plano.id})">${abierto ? "🔼 Cerrar" : "👁️ Ver / Editar"}</button>
        <button class="icon-btn" onclick="imprimirPlano(${plano.id})">🖨️ Imprimir</button>
        <button class="icon-btn" onclick="correoPlano(${plano.id})">📧 Correo</button>
        <button class="icon-btn" onclick="descargarPlano(${plano.id})">⬇️ Descargar</button>
        <button class="icon-btn danger" onclick="eliminarPlano(${plano.id})">🗑️ Eliminar</button>
      </div>

      ${
        abierto
          ? `
            <div class="plano-editor">
              <div class="grid-form">
                <label>
                  Nombre del archivo
                  <input id="editPlanoNombre-${plano.id}" value="${escapeHtml(plano.nombre)}" />
                </label>

                <label>
                  Reemplazar imagen o PDF
                  <input id="editPlanoArchivo-${plano.id}" type="file" accept="image/*,.pdf,application/pdf" />
                </label>

                <label class="full">
                  Observaciones
                  <textarea id="editPlanoObs-${plano.id}" rows="3">${escapeHtml(plano.observaciones || "")}</textarea>
                </label>
              </div>

              <div class="plano-preview grande">
                ${
                  plano.tipo === "pdf"
                    ? `<iframe src="${archivoPlano}" title="PDF"></iframe>`
                    : `<img src="${archivoPlano}" alt="Plano" />`
                }
              </div>

              <div class="actions">
                <button class="primary" onclick="guardarEdicionPlano(${plano.id})">Guardar cambios</button>
                <button class="secondary" onclick="togglePlanoAbierto(${plano.id})">Cerrar</button>
              </div>
            </div>
          `
          : ""
      }
    </div>
  `;
}


function mostrarPreviewPlanoCrear() {
  const input = $("planoArchivo");
  const box = $("previewPlanoCrear");
  const contenido = $("previewPlanoCrearContenido");

  if (!input || !box || !contenido) return;

  const archivo = input.files && input.files[0];

  if (!archivo) {
    limpiarPreviewPlanoCrear();
    return;
  }

  const pesoMaximoMB = 2;
  const pesoMB = archivo.size / 1024 / 1024;

  if (pesoMB > pesoMaximoMB) {
    box.classList.remove("hidden");
    contenido.innerHTML = `
      <div class="preview-error">
        El archivo es muy pesado. Usá archivos de hasta ${pesoMaximoMB} MB.
      </div>
    `;
    return;
  }

  const esPdf =
    archivo.type === "application/pdf" ||
    archivo.name.toLowerCase().endsWith(".pdf");

  const reader = new FileReader();

  reader.onload = function (e) {
    box.classList.remove("hidden");

    if (esPdf) {
      contenido.innerHTML = `
        <iframe src="${e.target.result}" title="Vista previa PDF"></iframe>
      `;
    } else {
      contenido.innerHTML = `
        <img src="${e.target.result}" alt="Vista previa del plano" />
      `;
    }
  };

  reader.readAsDataURL(archivo);
}

function limpiarPreviewPlanoCrear() {
  const box = $("previewPlanoCrear");
  const contenido = $("previewPlanoCrearContenido");

  if (box) box.classList.add("hidden");
  if (contenido) contenido.innerHTML = "";
}

function guardarPlano() {
  const nombre = $("planoNombre").value.trim();
  const archivo = $("planoArchivo").files[0];
  const observaciones = $("planoObs").value.trim();

  if (!nombre || !archivo) {
    alert("Completá el nombre y seleccioná una imagen o PDF.");
    return;
  }

  const pesoMaximoMB = 2;
  const pesoMB = archivo.size / 1024 / 1024;

  if (pesoMB > pesoMaximoMB) {
    alert(`El archivo es muy pesado. Para esta versión usá archivos de hasta ${pesoMaximoMB} MB.`);
    return;
  }

  const esPdf = archivo.type === "application/pdf" || archivo.name.toLowerCase().endsWith(".pdf");
  const reader = new FileReader();

  reader.onload = function (e) {
    planos.push({
      id: Date.now(),
      nombre,
      observaciones,
      archivo: e.target.result,
      nombreArchivo: archivo.name,
      tipo: esPdf ? "pdf" : "imagen",
      estado: "pendiente",
      fecha: new Date().toLocaleDateString("es-AR")
    });

    guardarStorage();
    planoAbiertoId = null;
    limpiarPreviewPlanoCrear();
    renderTodo();
  };

  reader.readAsDataURL(archivo);
}

function togglePlanoAbierto(id) {
  planoAbiertoId = Number(planoAbiertoId) === Number(id) ? null : id;
  renderTodo();
}

function guardarEdicionPlano(id) {
  const nombre = $(`editPlanoNombre-${id}`).value.trim();
  const observaciones = $(`editPlanoObs-${id}`).value.trim();
  const inputArchivo = $(`editPlanoArchivo-${id}`);
  const archivoNuevo = inputArchivo.files[0];

  if (!nombre) {
    alert("El nombre del archivo es obligatorio.");
    return;
  }

  const actualizarPlano = (archivoData = null, archivoInfo = null) => {
    planos = planos.map((plano) => {
      if (Number(plano.id) !== Number(id)) return plano;
      return {
        ...plano,
        nombre,
        observaciones,
        archivo: archivoData || plano.archivo || plano.imagen,
        imagen: undefined,
        nombreArchivo: archivoInfo?.nombreArchivo || plano.nombreArchivo,
        tipo: archivoInfo?.tipo || plano.tipo
      };
    });

    guardarStorage();
    renderTodo();
  };

  if (!archivoNuevo) {
    actualizarPlano();
    return;
  }

  const pesoMaximoMB = 2;
  const pesoMB = archivoNuevo.size / 1024 / 1024;
  if (pesoMB > pesoMaximoMB) {
    alert(`El archivo es muy pesado. Para esta versión usá archivos de hasta ${pesoMaximoMB} MB.`);
    return;
  }

  const esPdf = archivoNuevo.type === "application/pdf" || archivoNuevo.name.toLowerCase().endsWith(".pdf");
  const reader = new FileReader();

  reader.onload = function (e) {
    actualizarPlano(e.target.result, {
      nombreArchivo: archivoNuevo.name,
      tipo: esPdf ? "pdf" : "imagen"
    });
  };

  reader.readAsDataURL(archivoNuevo);
}

function cambiarEstadoPlano(id, estado) {
  planos = planos.map((plano) => Number(plano.id) === Number(id) ? { ...plano, estado } : plano);
  guardarStorage();
  renderTodo();
}

function eliminarPlano(id) {
  if (!confirm("¿Eliminar este archivo cargado?")) return;

  planos = planos.filter((plano) => Number(plano.id) !== Number(id));

  if (Number(planoAbiertoId) === Number(id)) planoAbiertoId = null;

  guardarStorage();
  renderTodo();
}

// ===============================
// ENCUESTAS
// ===============================

function renderEncuesta() {
  cerrarFormPersona();
  $("formPersona").classList.add("hidden");

  const totalCat = encuestas.length;

  $("categoriaHeader").className = `cat-header bg-${catActiva.color}`;
  $("categoriaHeader").innerHTML = `
    <div class="left">
      <div class="emoji">${catActiva.icono}</div>
      <div>
        <h2>${catActiva.nombre}</h2>
        <p>${totalCat} encuesta${totalCat !== 1 ? "s" : ""} cargada${totalCat !== 1 ? "s" : ""}</p>
      </div>
    </div>

    <div class="cat-actions">
      <button onclick="imprimirBase()">🖨️ Imprimir base</button>
      <button onclick="correoBase()">📧 Correo base</button>
      <button onclick="descargarBase()">⬇️ Descargar base</button>
    </div>
  `;

  $("busqueda").value = "";
  $("busqueda").style.display = "none";

  $("personasLista").innerHTML = `
    <div class="form-card">
      <h2>📝 Nueva Encuesta</h2>

      <div class="grid-form">
        <label>Nombre *<input id="encNombre" placeholder="Nombre completo" /></label>
        <label>Teléfono<input id="encTelefono" placeholder="Ej: 2926-123456" /></label>
        <label class="full">Dirección *<input id="encDireccion" placeholder="Dirección" /></label>
        <label class="full">Observaciones<textarea id="encObs" rows="3" placeholder="Observaciones..."></textarea></label>
      </div>

      <div class="multiple-box">
        <h3>Preguntas tipo encuesta</h3>
        <div id="preguntasContainer"></div>
        <button class="secondary" onclick="agregarPreguntaMultiple()">+ Agregar pregunta</button>
      </div>

      <div class="actions">
        <button class="primary" onclick="guardarEncuesta()">Guardar Encuesta</button>
      </div>
    </div>

    <div class="personas-lista">
      ${
        encuestas.length
          ? encuestas.map((enc) => `
            <div class="persona-card">
              <div class="persona-top">
                <div>
                  <h3>${escapeHtml(enc.nombre)}</h3>
                  <p>🏠 ${escapeHtml(enc.direccion)}</p>
                  <p>📱 ${escapeHtml(enc.telefono || "—")}</p>
                  <p>💬 ${escapeHtml(enc.observaciones || "—")}</p>
                  <p>📅 ${escapeHtml(enc.fecha)}</p>
                </div>

                <div class="registro-actions">
                  <button class="icon-btn" onclick="imprimirEncuesta(${enc.id})">🖨️</button>
                  <button class="icon-btn" onclick="correoEncuesta(${enc.id})">📧</button>
                  <button class="icon-btn" onclick="descargarEncuesta(${enc.id})">⬇️</button>
                  <button class="icon-btn danger" onclick="eliminarEncuesta(${enc.id})">🗑️</button>
                </div>
              </div>

              <div class="registros">
                <strong>RESPUESTAS</strong>
                ${
                  enc.preguntas && enc.preguntas.length
                    ? enc.preguntas.map((p) => `
                      <div class="reg-item">
                        <div>
                          <h4>${escapeHtml(p.pregunta)}</h4>
                          ${
                            p.opciones && p.opciones.length
                              ? p.opciones.map((op) => `<p>• ${escapeHtml(op.texto)}: <b>${escapeHtml(op.respuesta)}</b></p>`).join("")
                              : `<p>Respuesta: <b>${escapeHtml(p.respuesta || "—")}</b></p>`
                          }
                        </div>
                      </div>
                    `).join("")
                    : `<p style="font-size:13px;color:#9ca3af"><i>Sin preguntas.</i></p>`
                }
              </div>
            </div>
          `).join("")
          : `<div class="empty"><p>No hay encuestas cargadas.</p></div>`
      }
    </div>
  `;

  preguntasEncuesta = [];
}

function agregarPreguntaMultiple() {
  preguntasEncuesta.push({
    id: Date.now(),
    pregunta: "",
    opciones: [{ id: Date.now() + 1, texto: "", respuesta: "Sí" }]
  });

  renderPreguntasMultiple();
}

function renderPreguntasMultiple() {
  const contenedor = $("preguntasContainer");
  if (!contenedor) return;

  contenedor.innerHTML = preguntasEncuesta.map((p, index) => `
    <div class="pregunta-card">
      <label class="full">
        Pregunta ${index + 1}
        <input placeholder="Ej: ¿Agrega una encuesta?" value="${escapeHtml(p.pregunta)}" oninput="actualizarPregunta(${p.id}, this.value)" />
      </label>

      <div class="opciones-encuesta">
        ${
          p.opciones.map((op, opIndex) => `
            <div class="opcion-row">
              <div class="opcion-left">
                <input placeholder="Opción ${opIndex + 1}" value="${escapeHtml(op.texto)}" oninput="actualizarOpcionTexto(${p.id}, ${op.id}, this.value)" />
              </div>

              <div class="opcion-si-no">
                <label><input type="radio" name="resp-${p.id}-${op.id}" ${op.respuesta === "Sí" ? "checked" : ""} onchange="actualizarOpcionRespuesta(${p.id}, ${op.id}, 'Sí')" /> Sí</label>
                <label><input type="radio" name="resp-${p.id}-${op.id}" ${op.respuesta === "No" ? "checked" : ""} onchange="actualizarOpcionRespuesta(${p.id}, ${op.id}, 'No')" /> No</label>
                <button class="icon-btn danger" onclick="eliminarOpcion(${p.id}, ${op.id})">🗑️</button>
              </div>
            </div>
          `).join("")
        }
      </div>

      <div class="mini-actions">
        <button onclick="agregarOpcion(${p.id})">+ Agregar opción</button>
        <button onclick="eliminarPregunta(${p.id})">Eliminar pregunta</button>
      </div>
    </div>
  `).join("");
}

function actualizarPregunta(id, valor) {
  preguntasEncuesta = preguntasEncuesta.map((p) => Number(p.id) === Number(id) ? { ...p, pregunta: valor } : p);
}

function agregarOpcion(preguntaId) {
  preguntasEncuesta = preguntasEncuesta.map((p) => {
    if (Number(p.id) !== Number(preguntaId)) return p;
    return { ...p, opciones: [...p.opciones, { id: Date.now(), texto: "", respuesta: "Sí" }] };
  });

  renderPreguntasMultiple();
}

function actualizarOpcionTexto(preguntaId, opcionId, valor) {
  preguntasEncuesta = preguntasEncuesta.map((p) => {
    if (Number(p.id) !== Number(preguntaId)) return p;
    return {
      ...p,
      opciones: p.opciones.map((op) => Number(op.id) === Number(opcionId) ? { ...op, texto: valor } : op)
    };
  });
}

function actualizarOpcionRespuesta(preguntaId, opcionId, valor) {
  preguntasEncuesta = preguntasEncuesta.map((p) => {
    if (Number(p.id) !== Number(preguntaId)) return p;
    return {
      ...p,
      opciones: p.opciones.map((op) => Number(op.id) === Number(opcionId) ? { ...op, respuesta: valor } : op)
    };
  });
}

function eliminarOpcion(preguntaId, opcionId) {
  preguntasEncuesta = preguntasEncuesta.map((p) => {
    if (Number(p.id) !== Number(preguntaId)) return p;
    return { ...p, opciones: p.opciones.filter((op) => Number(op.id) !== Number(opcionId)) };
  });

  renderPreguntasMultiple();
}

function eliminarPregunta(id) {
  preguntasEncuesta = preguntasEncuesta.filter((p) => Number(p.id) !== Number(id));
  renderPreguntasMultiple();
}

function guardarEncuesta() {
  const nombre = $("encNombre").value.trim();
  const direccion = $("encDireccion").value.trim();
  const telefono = $("encTelefono").value.trim();
  const observaciones = $("encObs").value.trim();

  if (!nombre || !direccion) {
    alert("Completá nombre y dirección.");
    return;
  }

  const preguntasValidas = preguntasEncuesta
    .map((p) => ({ ...p, opciones: p.opciones.filter((op) => op.texto.trim()) }))
    .filter((p) => p.pregunta.trim() && p.opciones.length > 0);

  encuestas.push({
    id: Date.now(),
    nombre,
    direccion,
    telefono,
    observaciones,
    preguntas: preguntasValidas,
    fecha: new Date().toLocaleDateString("es-AR")
  });

  preguntasEncuesta = [];
  guardarStorage();
  renderTodo();
}

function eliminarEncuesta(id) {
  if (!confirm("¿Eliminar esta encuesta?")) return;
  encuestas = encuestas.filter((e) => Number(e.id) !== Number(id));
  guardarStorage();
  renderTodo();
}

// ===============================
// TEXTOS / IMPRESIÓN / CORREO / DESCARGA
// ===============================

function textoPersona(p) {
  return `
Nombre: ${p.nombre || "—"}
Dirección: ${p.direccion || "—"}
Celular: ${p.celular || "—"}
Barrio: ${p.barrio || "—"}
Motivo de consulta: ${p.motivo_consulta || "—"}
Fecha de carga: ${p.fecha_carga || "—"}
`;
}

function textoRegistro(r) {
  const persona = personas.find((p) => Number(p.id) === Number(r.persona_id));
  return `
Persona: ${persona?.nombre || "—"}
Título: ${r.titulo || "—"}
Fecha: ${r.fecha || "—"}
Descripción: ${r.descripcion || "—"}
`;
}

function textoEncuesta(enc) {
  const preguntas = enc.preguntas && enc.preguntas.length
    ? enc.preguntas.map((p) => {
      const opciones = p.opciones && p.opciones.length
        ? p.opciones.map((op) => `  - ${op.texto}: ${op.respuesta}`).join("\n")
        : "  Sin opciones";
      return `Pregunta: ${p.pregunta}\n${opciones}`;
    }).join("\n\n")
    : "Sin preguntas";

  return `
Nombre: ${enc.nombre || "—"}
Dirección: ${enc.direccion || "—"}
Teléfono: ${enc.telefono || "—"}
Observaciones: ${enc.observaciones || "—"}
Fecha: ${enc.fecha || "—"}

Preguntas:
${preguntas}
`;
}

function textoPlano(plano) {
  return `
Nombre: ${plano.nombre || "—"}
Archivo: ${plano.nombreArchivo || "—"}
Tipo: ${plano.tipo || "—"}
Estado: ${plano.estado === "terminado" ? "Terminado" : "Pendiente"}
Observaciones: ${plano.observaciones || "—"}
Fecha: ${plano.fecha || "—"}
`;
}

function htmlPersona(p) {
  return `<h1>Registro: ${escapeHtml(p.nombre)}</h1><div class="card"><pre>${escapeHtml(textoPersona(p))}</pre></div>`;
}

function htmlRegistro(r) {
  return `<h1>Registro interno</h1><div class="card"><pre>${escapeHtml(textoRegistro(r))}</pre></div>`;
}

function htmlEncuesta(e) {
  return `<h1>Encuesta: ${escapeHtml(e.nombre)}</h1><div class="card"><pre>${escapeHtml(textoEncuesta(e))}</pre></div>`;
}

function htmlPlano(p) {
  const archivoPlano = p.archivo || p.imagen || "";
  return `
    <h1>Plano: ${escapeHtml(p.nombre)}</h1>
    <div class="card">
      <pre>${escapeHtml(textoPlano(p))}</pre>
      ${
        archivoPlano
          ? p.tipo === "pdf"
            ? `<iframe src="${archivoPlano}"></iframe>`
            : `<img src="${archivoPlano}" />`
          : `<p>No hay imagen cargada.</p>`
      }
    </div>
  `;
}

function imprimirBase() {
  if (!catActiva) return;

  if (catActiva.tipo === "planos") {
    imprimirHTML("Imprimir Planos", `<h1>Base de datos: Planos</h1>${planos.length ? planos.map(htmlPlano).join("") : "<p>No hay planos cargados.</p>"}`);
    return;
  }

  if (catActiva.tipo === "encuesta") {
    imprimirHTML("Imprimir Encuestas", `<h1>Base de datos: Encuesta</h1>${encuestas.length ? encuestas.map(htmlEncuesta).join("") : "<p>No hay encuestas cargadas.</p>"}`);
    return;
  }

  const personasCat = personas.filter((p) => Number(p.categoria_id) === Number(catActiva.id));
  imprimirHTML(`Imprimir ${catActiva.nombre}`, `<h1>Base de datos: ${escapeHtml(catActiva.nombre)}</h1>${personasCat.length ? personasCat.map(htmlPersona).join("") : "<p>No hay registros cargados.</p>"}`);
}

function descargarBase() {
  if (!catActiva) return;

  if (catActiva.tipo === "planos") {
    descargarHTML("base-planos", `<h1>Base de datos: Planos</h1>${planos.length ? planos.map(htmlPlano).join("") : "<p>No hay planos cargados.</p>"}`);
    return;
  }

  if (catActiva.tipo === "encuesta") {
    descargarHTML("base-encuestas", `<h1>Base de datos: Encuesta</h1>${encuestas.length ? encuestas.map(htmlEncuesta).join("") : "<p>No hay encuestas cargadas.</p>"}`);
    return;
  }

  const personasCat = personas.filter((p) => Number(p.categoria_id) === Number(catActiva.id));
  descargarHTML(`base-${catActiva.nombre}`, `<h1>Base de datos: ${escapeHtml(catActiva.nombre)}</h1>${personasCat.length ? personasCat.map(htmlPersona).join("") : "<p>No hay registros cargados.</p>"}`);
}

async function correoBase() {
  if (!catActiva) return;

  if (catActiva.tipo === "planos") {
    const cuerpo = planos.length
      ? planos.map((p, i) => `${i + 1}) ${textoPlano(p)}`).join("\n----------------\n")
      : "No hay planos cargados.";

    const adjuntos = planos.map((p) =>
      crearAdjuntoDesdeDataUrl(p.nombreArchivo || p.nombre, p.archivo || p.imagen || "")
    );

    await abrirCorreoComputadora({
      asunto: "Base de datos - Planos",
      cuerpo: `Base de datos: Planos

${cuerpo}`,
      html: cuerpoHtmlCorreo("Base de datos - Planos", planos.length ? planos.map(htmlPlano).join("") : "<p>No hay planos cargados.</p>"),
      adjuntos
    });
    return;
  }

  if (catActiva.tipo === "encuesta") {
    const cuerpo = encuestas.length
      ? encuestas.map((e, i) => `${i + 1}) ${textoEncuesta(e)}`).join("\n----------------\n")
      : "No hay encuestas cargadas.";

    abrirCorreo("Base de datos - Encuesta", `Base de datos: Encuesta

${cuerpo}`);
    return;
  }

  const personasCat = personas.filter((p) => Number(p.categoria_id) === Number(catActiva.id));
  const cuerpo = personasCat.length
    ? personasCat.map((p, i) => `${i + 1}) ${textoPersona(p)}`).join("\n----------------\n")
    : "No hay registros cargados.";

  abrirCorreo(`Base de datos - ${catActiva.nombre}`, `Base de datos: ${catActiva.nombre}

${cuerpo}`);
}

function imprimirPersona(id) {
  const p = personas.find((x) => Number(x.id) === Number(id));
  if (p) imprimirHTML(`Imprimir ${p.nombre}`, htmlPersona(p));
}

function correoPersona(id) {
  const p = personas.find((x) => Number(x.id) === Number(id));
  if (p) abrirCorreo(`Registro - ${p.nombre}`, textoPersona(p));
}

function descargarPersona(id) {
  const p = personas.find((x) => Number(x.id) === Number(id));
  if (p) descargarHTML(`persona-${p.nombre}`, htmlPersona(p));
}

function imprimirRegistro(id) {
  const r = registros.find((x) => Number(x.id) === Number(id));
  if (r) imprimirHTML(`Registro - ${r.titulo}`, htmlRegistro(r));
}

function correoRegistro(id) {
  const r = registros.find((x) => Number(x.id) === Number(id));
  if (r) abrirCorreo(`Registro - ${r.titulo}`, textoRegistro(r));
}

function descargarRegistro(id) {
  const r = registros.find((x) => Number(x.id) === Number(id));
  if (r) descargarHTML(`registro-${r.titulo}`, htmlRegistro(r));
}

function imprimirPlano(id) {
  const p = planos.find((x) => Number(x.id) === Number(id));
  if (p) imprimirHTML(`Imprimir ${p.nombre}`, htmlPlano(p));
}

async function correoPlano(id) {
  const p = planos.find((x) => Number(x.id) === Number(id));
  if (!p) return;

  const archivoPlano = p.archivo || p.imagen || "";
  const adjunto = crearAdjuntoDesdeDataUrl(p.nombreArchivo || p.nombre, archivoPlano);

  await abrirCorreoComputadora({
    asunto: `Plano - ${p.nombre}`,
    cuerpo: textoPlano(p),
    html: cuerpoHtmlCorreo(`Plano - ${p.nombre}`, htmlPlano(p)),
    adjuntos: [adjunto]
  });
}

function descargarPlano(id) {
  const p = planos.find((x) => Number(x.id) === Number(id));
  if (p) descargarHTML(`plano-${p.nombre}`, htmlPlano(p));
}

function imprimirEncuesta(id) {
  const e = encuestas.find((x) => Number(x.id) === Number(id));
  if (e) imprimirHTML(`Imprimir ${e.nombre}`, htmlEncuesta(e));
}

function correoEncuesta(id) {
  const e = encuestas.find((x) => Number(x.id) === Number(id));
  if (e) abrirCorreo(`Encuesta - ${e.nombre}`, textoEncuesta(e));
}

function descargarEncuesta(id) {
  const e = encuestas.find((x) => Number(x.id) === Number(id));
  if (e) descargarHTML(`encuesta-${e.nombre}`, htmlEncuesta(e));
}

// ===============================
// AGENDA
// ===============================

function mostrarAgenda() {
  document.body.classList.remove("modo-libro");
  vista = "agenda";
  catActiva = null;

  cerrarFormPersona();

  activarNavPrincipal("btnAgenda");
  $("panelView").classList.add("hidden");
  $("categoriaView").classList.remove("hidden");
  $("busqueda").style.display = "none";

  renderTodo();
}

function renderAgenda() {
  $("categoriaHeader").className = "cat-header bg-indigo";
  $("categoriaHeader").innerHTML = `
    <div class="left">
      <div class="emoji">📒</div>
      <div>
        <h2>Agenda</h2>
        <p>Agendas semanales separadas por fecha, nombre e importancia</p>
      </div>
    </div>

    <div class="cat-actions">
      <button onclick="imprimirAgendas()">🖨️ Imprimir base</button>
      <button onclick="correoAgendas()">📧 Correo base</button>
      <button onclick="descargarAgendas()">⬇️ Descargar base</button>
    </div>
  `;

  $("personasLista").innerHTML = `
    <section class="agenda-main agenda-full">
      <div class="agenda-section-head">
        <h2>📅 Crear agendas</h2>
        <input id="buscarAgenda" class="search" placeholder="🔍 Buscar por nombre o fecha..." oninput="renderListaAgendas()" />
      </div>

      <div class="form-card">
        <div class="grid-form">
          <label>Nombre de agenda *<input id="agendaNombre" placeholder="Ej: Horario semanal barrio centro" /></label>
          <label>Fecha de creación<input id="agendaFecha" type="date" /></label>
          <label class="full check-line"><input id="agendaImportante" type="checkbox" /> Marcar como importante</label>
        </div>

        <div class="agenda-plantilla">
          <div class="agenda-table-title">HORARIO SEMANAL</div>
          <table class="agenda-table">
            <thead>
              <tr>
                <th>HORAS</th><th>LUNES</th><th>MARTES</th><th>MIÉRCOLES</th><th>JUEVES</th><th>VIERNES</th><th>SÁBADO</th><th>DOMINGO</th>
              </tr>
            </thead>
            <tbody>
              ${Array.from({ length: 7 }).map((_, row) => `
                <tr>
                  ${Array.from({ length: 8 }).map((_, col) => `<td contenteditable="true" id="agendaCell-${row}-${col}"></td>`).join("")}
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>

        <div class="actions">
          <button class="primary" onclick="guardarAgenda()">${editandoAgendaId ? "Guardar cambios" : "Guardar agenda"}</button>
          ${editandoAgendaId ? `<button class="secondary" onclick="cancelarEdicionAgenda()">Cancelar edición</button>` : ""}
        </div>
      </div>

      <div id="listaAgendas"></div>
    </section>
  `;

  renderListaAgendas();
}

function obtenerCeldasAgenda() {
  const filas = [];
  for (let r = 0; r < 7; r++) {
    const fila = [];
    for (let c = 0; c < 8; c++) {
      const celda = document.getElementById(`agendaCell-${r}-${c}`);
      fila.push(celda ? celda.innerText.trim() : "");
    }
    filas.push(fila);
  }
  return filas;
}

function limpiarFormularioAgenda() {
  if ($("agendaNombre")) $("agendaNombre").value = "";
  if ($("agendaFecha")) $("agendaFecha").value = "";
  if ($("agendaImportante")) $("agendaImportante").checked = false;

  for (let r = 0; r < 7; r++) {
    for (let c = 0; c < 8; c++) {
      const celda = document.getElementById(`agendaCell-${r}-${c}`);
      if (celda) celda.innerText = "";
    }
  }
}

function guardarAgenda() {
  const nombre = $("agendaNombre").value.trim();
  const fecha = $("agendaFecha").value || new Date().toISOString().slice(0, 10);
  const importante = $("agendaImportante").checked;
  const celdas = obtenerCeldasAgenda();

  if (!nombre) {
    alert("Poné un nombre para la agenda.");
    return;
  }

  if (editandoAgendaId) {
    agendas = agendas.map((a) =>
      Number(a.id) === Number(editandoAgendaId) ? { ...a, nombre, fecha, importante, celdas } : a
    );
    editandoAgendaId = null;
  } else {
    agendas.push({ id: Date.now(), nombre, fecha, importante, celdas, created_at: new Date().toLocaleDateString("es-AR") });
  }

  guardarStorage();
  limpiarFormularioAgenda();
  renderAgenda();
}

function renderListaAgendas() {
  const cont = $("listaAgendas");
  if (!cont) return;

  const texto = ($("buscarAgenda")?.value || "").toLowerCase();

  const lista = agendas
    .filter((a) => !texto || String(a.nombre).toLowerCase().includes(texto) || String(a.fecha).toLowerCase().includes(texto))
    .sort((a, b) => {
      if (a.importante && !b.importante) return -1;
      if (!a.importante && b.importante) return 1;
      return String(b.fecha).localeCompare(String(a.fecha));
    });

  cont.innerHTML = lista.length
    ? lista.map((a) => `
      <div class="agenda-card ${a.importante ? "agenda-importante" : ""}">
        <div class="persona-top">
          <div>
            <h3>${a.importante ? "🔴 " : ""}${escapeHtml(a.nombre)}</h3>
            <p>📅 ${escapeHtml(a.fecha || "—")}</p>
            <p>${a.importante ? "Importante" : "Normal"}</p>
          </div>

          <div class="registro-actions">
            <button class="icon-btn" onclick="editarAgenda(${a.id})">✏️ Editar</button>
            <button class="icon-btn" onclick="imprimirAgenda(${a.id})">🖨️ Imprimir</button>
            <button class="icon-btn" onclick="correoAgenda(${a.id})">📧 Correo</button>
            <button class="icon-btn" onclick="descargarAgenda(${a.id})">⬇️ Descargar</button>
            <button class="icon-btn danger" onclick="eliminarAgenda(${a.id})">🗑️ Eliminar</button>
          </div>
        </div>
      </div>
    `).join("")
    : `<div class="empty"><p>No hay agendas guardadas.</p></div>`;
}

function renderTablaAgenda(celdas) {
  return `
    <div class="agenda-plantilla mini">
      <table class="agenda-table">
        <thead>
          <tr><th>HORAS</th><th>LUNES</th><th>MARTES</th><th>MIÉRCOLES</th><th>JUEVES</th><th>VIERNES</th><th>SÁBADO</th><th>DOMINGO</th></tr>
        </thead>
        <tbody>
          ${Array.from({ length: 7 }).map((_, r) => `
            <tr>${Array.from({ length: 8 }).map((_, c) => `<td>${escapeHtml(celdas?.[r]?.[c] || "")}</td>`).join("")}</tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function editarAgenda(id) {
  const agenda = agendas.find((a) => Number(a.id) === Number(id));
  if (!agenda) return;

  editandoAgendaId = id;

  $("agendaNombre").value = agenda.nombre || "";
  $("agendaFecha").value = agenda.fecha || "";
  $("agendaImportante").checked = !!agenda.importante;

  for (let r = 0; r < 7; r++) {
    for (let c = 0; c < 8; c++) {
      const celda = document.getElementById(`agendaCell-${r}-${c}`);
      if (celda) celda.innerText = agenda.celdas?.[r]?.[c] || "";
    }
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function cancelarEdicionAgenda() {
  editandoAgendaId = null;
  renderAgenda();
}

function eliminarAgenda(id) {
  if (!confirm("¿Eliminar esta agenda?")) return;
  agendas = agendas.filter((a) => Number(a.id) !== Number(id));
  guardarStorage();
  renderAgenda();
}

function textoAgenda(a) {
  return `
Agenda: ${a.nombre}
Fecha: ${a.fecha}
Importante: ${a.importante ? "Sí" : "No"}
`;
}

function htmlAgenda(a) {
  return `<h1>${escapeHtml(a.nombre)}</h1><pre>${escapeHtml(textoAgenda(a))}</pre>${renderTablaAgenda(a.celdas || [])}`;
}

function imprimirAgenda(id) {
  const a = agendas.find((x) => Number(x.id) === Number(id));
  if (a) imprimirHTML(`Agenda - ${a.nombre}`, htmlAgenda(a));
}

function correoAgenda(id) {
  const a = agendas.find((x) => Number(x.id) === Number(id));
  if (a) abrirCorreo(`Agenda - ${a.nombre}`, textoAgenda(a));
}

function descargarAgenda(id) {
  const a = agendas.find((x) => Number(x.id) === Number(id));
  if (a) descargarHTML(`agenda-${a.nombre}`, htmlAgenda(a));
}

function imprimirAgendas() {
  imprimirHTML("Agendas", `<h1>Agendas</h1>${agendas.length ? agendas.map((a) => `<div class="card">${htmlAgenda(a)}</div>`).join("") : "<p>No hay agendas guardadas.</p>"}`);
}

function correoAgendas() {
  const cuerpo = agendas.map((a, i) => `${i + 1}) ${textoAgenda(a)}`).join("\n----------------\n");
  abrirCorreo("Agendas", cuerpo || "No hay agendas guardadas.");
}

function descargarAgendas() {
  descargarHTML("base-agendas", `<h1>Agendas</h1>${agendas.length ? agendas.map((a) => `<div class="card">${htmlAgenda(a)}</div>`).join("") : "<p>No hay agendas guardadas.</p>"}`);
}

// ===============================
// CALCULAR
// ===============================

function mostrarCalcular() {
  document.body.classList.remove("modo-libro");
  vista = "calcular";
  catActiva = null;

  cerrarFormPersona();

  activarNavPrincipal("btnCalcular");
  $("panelView").classList.add("hidden");
  $("categoriaView").classList.remove("hidden");
  $("busqueda").style.display = "none";

  renderTodo();
}

function renderCalcular() {
  $("categoriaHeader").className = "cat-header bg-green";
  $("categoriaHeader").innerHTML = `
    <div class="left">
      <div class="emoji">🧮</div>
      <div>
        <h2>Calcular</h2>
        <p>Notas con motivo, consumidor, factura y calculadora</p>
      </div>
    </div>

    <div class="cat-actions">
      <button onclick="imprimirNotasCalcular()">🖨️ Imprimir base</button>
      <button onclick="correoNotasCalcular()">📧 Correo base</button>
      <button onclick="descargarNotasCalcular()">⬇️ Descargar base</button>
    </div>
  `;

  $("personasLista").innerHTML = `
    <section class="calcular-full">
      <div class="form-card">
        <h2>🧮 Nueva nota de cálculo</h2>

        <div class="grid-form">
          <label class="full">Motivo<textarea id="notaMotivo" rows="3" placeholder="Escribí el motivo..."></textarea></label>

          <label>Consumidor
            <select id="notaConsumidor">
              <option value="Comprador">Comprador</option>
              <option value="Vendedor">Vendedor</option>
            </select>
          </label>

          <label>Nombre / detalle<input id="notaConsumidorTexto" placeholder="Escribir comprador o vendedor..." /></label>

          <label>Factura
            <select id="notaFactura">
              <option value="Ticket">Ticket</option>
              <option value="Remito">Remito</option>
              <option value="Factura">Factura</option>
              <option value="Transferencia">Transferencia</option>
            </select>
          </label>

          <label>Cálculo<input id="notaCalculo" placeholder="Ej: 1500 + 2300 - 500" oninput="calcularNota()" /></label>
          <label>Resultado<input id="notaResultado" readonly /></label>
        </div>

        <div class="calculadora-botones">
          ${["7","8","9","/","4","5","6","*","1","2","3","-","0",".","(",")","+"].map(v => `<button onclick="agregarCalculo('${v}')">${v}</button>`).join("")}
          <button onclick="borrarUltimoCalculo()">⌫</button>
          <button onclick="limpiarCalculo()">C</button>
        </div>

        <div class="actions">
          <button class="primary" onclick="guardarNotaCalcular()">Guardar nota</button>
        </div>
      </div>

      <div id="listaNotasCalcular"></div>
    </section>
  `;

  renderListaNotasCalcular();
}

function agregarCalculo(valor) {
  $("notaCalculo").value += valor;
  calcularNota();
}

function borrarUltimoCalculo() {
  const input = $("notaCalculo");
  if (!input) return;

  input.value = input.value.slice(0, -1);
  calcularNota();
}

function limpiarCalculo() {
  $("notaCalculo").value = "";
  $("notaResultado").value = "";
}

function calcularNota() {
  const expr = $("notaCalculo").value.trim();
  try {
    if (!expr) {
      $("notaResultado").value = "";
      return;
    }

    if (!/^[0-9+\-*/().,\s]+$/.test(expr)) {
      $("notaResultado").value = "Error";
      return;
    }

    const limpio = expr.replaceAll(",", ".");
    const resultado = Function(`"use strict"; return (${limpio})`)();
    $("notaResultado").value = isFinite(resultado) ? resultado : "Error";
  } catch {
    $("notaResultado").value = "Error";
  }
}

function guardarNotaCalcular() {
  const motivo = $("notaMotivo").value.trim();
  const consumidor = $("notaConsumidor").value;
  const consumidorTexto = $("notaConsumidorTexto").value.trim();
  const factura = $("notaFactura").value;
  const calculo = $("notaCalculo").value.trim();
  const resultado = $("notaResultado").value.trim();

  if (!motivo) {
    alert("Escribí un motivo.");
    return;
  }

  notasCalcular.push({
    id: Date.now(),
    motivo,
    consumidor,
    consumidorTexto,
    factura,
    calculo,
    resultado,
    fecha: new Date().toLocaleDateString("es-AR")
  });

  guardarStorage();
  renderCalcular();
}

function renderListaNotasCalcular() {
  const cont = $("listaNotasCalcular");
  if (!cont) return;

  cont.innerHTML = notasCalcular.length
    ? notasCalcular.map((n) => `
      <div class="nota-card">
        <h3>${escapeHtml(n.motivo)}</h3>
        <p>👤 ${escapeHtml(n.consumidor)}: ${escapeHtml(n.consumidorTexto || "—")}</p>
        <p>🧾 ${escapeHtml(n.factura)}</p>
        <p>🧮 ${escapeHtml(n.calculo || "—")} = <b>${escapeHtml(n.resultado || "—")}</b></p>
        <p>📅 ${escapeHtml(n.fecha)}</p>

        <div class="registro-actions">
          <button class="icon-btn" onclick="imprimirNotaCalcular(${n.id})">🖨️</button>
          <button class="icon-btn" onclick="correoNotaCalcular(${n.id})">📧</button>
          <button class="icon-btn" onclick="descargarNotaCalcular(${n.id})">⬇️</button>
          <button class="icon-btn danger" onclick="eliminarNotaCalcular(${n.id})">🗑️</button>
        </div>
      </div>
    `).join("")
    : `<div class="empty"><p>No hay notas de cálculo guardadas.</p></div>`;
}

function textoNotaCalcular(n) {
  return `
Motivo: ${n.motivo}
Consumidor: ${n.consumidor}
Detalle: ${n.consumidorTexto || "—"}
Factura: ${n.factura}
Cálculo: ${n.calculo || "—"}
Resultado: ${n.resultado || "—"}
Fecha: ${n.fecha}
`;
}

function htmlNotaCalcular(n) {
  return `<h1>${escapeHtml(n.motivo)}</h1><pre>${escapeHtml(textoNotaCalcular(n))}</pre>`;
}

function imprimirNotaCalcular(id) {
  const n = notasCalcular.find((x) => Number(x.id) === Number(id));
  if (n) imprimirHTML(`Nota - ${n.motivo}`, htmlNotaCalcular(n));
}

function correoNotaCalcular(id) {
  const n = notasCalcular.find((x) => Number(x.id) === Number(id));
  if (n) abrirCorreo(`Nota cálculo - ${n.motivo}`, textoNotaCalcular(n));
}

function descargarNotaCalcular(id) {
  const n = notasCalcular.find((x) => Number(x.id) === Number(id));
  if (n) descargarHTML(`nota-calculo-${n.motivo}`, htmlNotaCalcular(n));
}

function eliminarNotaCalcular(id) {
  if (!confirm("¿Eliminar esta nota?")) return;
  notasCalcular = notasCalcular.filter((n) => Number(n.id) !== Number(id));
  guardarStorage();
  renderCalcular();
}

function imprimirNotasCalcular() {
  imprimirHTML("Notas de cálculo", `<h1>Notas de cálculo</h1>${notasCalcular.length ? notasCalcular.map((n) => `<div class="card">${htmlNotaCalcular(n)}</div>`).join("") : "<p>No hay notas guardadas.</p>"}`);
}

function correoNotasCalcular() {
  const cuerpo = notasCalcular.map((n, i) => `${i + 1}) ${textoNotaCalcular(n)}`).join("\n----------------\n");
  abrirCorreo("Notas de cálculo", cuerpo || "No hay notas guardadas.");
}

function descargarNotasCalcular() {
  descargarHTML("base-notas-calcular", `<h1>Notas de cálculo</h1>${notasCalcular.length ? notasCalcular.map((n) => `<div class="card">${htmlNotaCalcular(n)}</div>`).join("") : "<p>No hay notas guardadas.</p>"}`);
}

// ===============================
// LIBRO
// ===============================

function mostrarLibro() {
  document.body.classList.add("modo-libro");
  vista = "libro";
  catActiva = null;

  cerrarFormPersona();

  activarNavPrincipal("btnLibro");
  $("panelView").classList.add("hidden");
  $("categoriaView").classList.remove("hidden");
  $("busqueda").style.display = "none";

  renderTodo();
}


function textoPlanoLibro(html) {
  const div = document.createElement("div");
  div.innerHTML = html || "";
  return div.innerText.trim();
}

function paginaLibroTieneContenido(pagina) {
  if (!pagina) return false;

  if (pagina.tipo === "imagen") {
    return !!pagina.imagen;
  }

  const tieneTitulo =
    pagina.titulo &&
    !/^página\s+\d+$/i.test(String(pagina.titulo).trim());

  const tieneTexto = textoPlanoLibro(pagina.contenido || "").length > 0;

  return !!tieneTitulo || !!tieneTexto;
}

function guardarSeleccionPaginaLibro(index) {
  libroPaginaSeleccionada = Number(index) || 0;
}

function crearPaginaLibro(titulo = "") {
  return {
    id: Date.now() + Math.floor(Math.random() * 9999),
    titulo: titulo || `Página ${libroPaginas.length + 1}`,
    contenido: "",
    color: "#111827",
    tipo: "texto",
    imagen: "",
    fecha: new Date().toLocaleDateString("es-AR")
  };
}

function asegurarPaginasLibro() {
  if (!libroPaginas || libroPaginas.length === 0) {
    libroPaginas = [crearPaginaLibro("Página 1"), crearPaginaLibro("Página 2")];
    libroPaginaActual = 0;
    guardarStorage();
  }

  if (libroPaginas.length === 1) {
    libroPaginas.push(crearPaginaLibro("Página 2"));
    guardarStorage();
  }
}

function renderLibro() {
  asegurarPaginasLibro();

  const izquierdaIndex = libroPaginaActual;
  const derechaIndex = libroPaginaActual + 1;

  const paginaIzq = libroPaginas[izquierdaIndex];
  const paginaDer = libroPaginas[derechaIndex];

  $("categoriaHeader").className = "cat-header bg-blue";
  $("categoriaHeader").innerHTML = `
    <div class="left">
      <div class="emoji">📘</div>
      <div>
        <h2>Libro</h2>
        <p>Dos páginas, renglones, lápiz, resaltador, fotos, impresión y descarga</p>
      </div>
    </div>

    <div class="cat-actions">
      <button onclick="guardarPaginasLibro()">💾 Guardar</button>
      <button onclick="imprimirPaginaLibro()">🖨️ Imprimir página</button>
      <button onclick="correoPaginaLibro()">📧 Correo página</button>
      <button onclick="descargarPaginaLibro()">⬇️ Descargar página</button>
      <button onclick="imprimirLibro()">🖨️ Imprimir libro</button>
      <button onclick="correoLibro()">📧 Correo libro</button>
      <button onclick="descargarLibro()">⬇️ Descargar libro</button>
    </div>
  `;

  $("personasLista").innerHTML = `
    <div class="libro-zona">
      <div class="libro-tools">
        <div class="libro-search-box">
          <input id="buscarLibro" placeholder="🔍 Buscar página por título o texto..." oninput="buscarSugerenciasLibro()" />
          <div id="sugerenciasLibro" class="sugerencias-libro hidden"></div>
        </div>

        <span class="pagina-indicador">Páginas ${izquierdaIndex + 1}${paginaDer ? " y " + (derechaIndex + 1) : ""} de ${libroPaginas.length}</span>
        <button type="button" onclick="nuevaPaginaLibro()">+ Nueva página</button>

        <div class="lapiz-grupo">
          <label class="tool-label">
            Color lápiz
            <input id="libroColor" type="color" value="${libroColorLapiz}" onchange="cambiarColorLapiz(this.value)" />
          </label>
          <button type="button" onclick="lapizNormal()">Lápiz normal</button>
        </div>

        <div class="resaltador-grupo">
          <label class="tool-label">
            Color resaltador
            <input id="libroColorResaltado" type="color" value="${libroColorResaltado}" onchange="cambiarColorResaltado(this.value)" />
          </label>

          <button
            type="button"
            id="btnResaltador"
            class="btn-resaltador-libro ${libroResaltadorActivo ? "activo" : ""}"
            onmousedown="event.preventDefault()"
            onclick="toggleResaltadorLibro()"
          >
            🖍️ Resaltador
          </button>
        </div>

        <label class="subir-img-libro">
          🖼️ Agregar foto
          <input id="libroImagen" type="file" accept="image/*" onchange="agregarImagenLibro()" />
        </label>
      </div>

      <div class="libro-wrapper">
        <button class="flecha-libro flecha-izq" onclick="paginaAnterior()">‹</button>

        <div class="libro-abierto ${libroPasandoPagina}">
          ${renderPaginaLibro(paginaIzq, izquierdaIndex, "izq")}
          ${paginaDer ? renderPaginaLibro(paginaDer, derechaIndex, "der") : `<div class="libro-hoja pagina-vacia"></div>`}
        </div>

        <button class="flecha-libro flecha-der" onclick="paginaSiguiente()">›</button>
      </div>
    </div>
  `;

  activarEventosLibro();
}






function renderPaginaLibro(pagina, index, lado) {
  if (!pagina) return "";

  if (pagina.tipo === "imagen") {
    return `
      <div class="libro-hoja sin-renglones" data-index="${index}" onclick="guardarSeleccionPaginaLibro(${index})">
        <input class="libro-titulo img-title" id="libroTitulo-${lado}" value="${escapeHtml(pagina.titulo || "")}" placeholder="Título de la imagen..." oninput="guardarTituloImagenLibro(${index}, this.value)" />
        <img class="libro-img-full" src="${pagina.imagen}" />
        <div class="foto-actions">
          <button onclick="reemplazarImagenLibro(${index})">Reemplazar imagen</button>
          <button class="danger" onclick="eliminarFotoLibro(${index})">🗑️ Borrar foto</button>
          <input id="replaceImg-${index}" type="file" accept="image/*" class="hidden" onchange="guardarReemplazoImagenLibro(${index})" />
        </div>
      </div>
    `;
  }

  return `
    <div class="libro-hoja" data-index="${index}" onclick="guardarSeleccionPaginaLibro(${index})">
      <input id="libroTitulo-${lado}" class="libro-titulo" onfocus="guardarSeleccionPaginaLibro(${index})" value="${escapeHtml(pagina.titulo || "")}" placeholder="Título..." />
      <div id="libroContenido-${lado}" class="libro-editor" contenteditable="true" onfocus="guardarSeleccionPaginaLibro(${index})" spellcheck="false" style="color:${pagina.color || "#111827"}">${pagina.contenido || ""}</div>
    </div>
  `;
}


























































function activarEventosLibro() {
  ["izq", "der"].forEach((lado) => {
    const editor = document.getElementById(`libroContenido-${lado}`);
    if (!editor) return;

    editor.addEventListener("focus", () => {
      libroEditorActivo = editor;
      guardarRangoLibro();

      if (!libroResaltadorActivo) {
        document.execCommand("foreColor", false, libroColorLapiz);
      }
    });

    editor.addEventListener("mouseup", () => {
      libroEditorActivo = editor;
      guardarRangoLibro();
    });

    editor.addEventListener("keyup", () => {
      libroEditorActivo = editor;
      guardarRangoLibro();
    });

    editor.addEventListener("click", () => {
      libroEditorActivo = editor;
      guardarRangoLibro();
    });

    editor.addEventListener("beforeinput", (e) => {
      libroEditorActivo = editor;
      guardarRangoLibro();

      if (libroResaltadorActivo) {
        if (e.inputType === "insertText") {
          e.preventDefault();
          insertarTextoConResaltador(e.data || "");
          guardarPaginaLibroSinAlerta();
          return;
        }

        if (e.inputType === "insertParagraph") {
          e.preventDefault();
          insertarSaltoLineaLibro();
          guardarPaginaLibroSinAlerta();
          return;
        }

        return;
      }

      // FIX CLAVE:
      // Si el resaltador está apagado pero el cursor quedó dentro de un span resaltado,
      // evitamos que el navegador siga escribiendo dentro del resaltado.
      if (cursorEstaDentroDeResaltadoLibro()) {
        if (e.inputType === "insertText") {
          e.preventDefault();
          insertarTextoNormalFueraDelResaltado(e.data || "");
          guardarPaginaLibroSinAlerta();
          return;
        }

        if (e.inputType === "insertParagraph") {
          e.preventDefault();
          insertarTextoNormalFueraDelResaltado("\n");
          guardarPaginaLibroSinAlerta();
          return;
        }
      }
    });
  });

  actualizarBotonResaltador();
}



















function lapizNormal() {
  libroResaltadorActivo = false;
  libroColorLapiz = "#111827";

  if ($("libroColor")) {
    $("libroColor").value = "#111827";
  }

  salirDelResaltadoActivo();
  document.execCommand("foreColor", false, "#111827");
  actualizarBotonResaltador();
}



























































































function editorContieneNodoLibro(editor, nodo) {
  if (!editor || !nodo) return false;
  return editor === nodo || editor.contains(nodo);
}

function guardarRangoLibro() {
  const sel = window.getSelection();

  if (!sel || sel.rangeCount === 0) return;

  const range = sel.getRangeAt(0);
  const editor = obtenerEditorLibroActual();

  if (!editor) return;

  if (
    editorContieneNodoLibro(editor, range.startContainer) &&
    editorContieneNodoLibro(editor, range.endContainer)
  ) {
    libroEditorActivo = editor;
    libroUltimoRango = range.cloneRange();
  }
}

function restaurarRangoLibro() {
  const editor = libroEditorActivo;
  const sel = window.getSelection();

  if (!editor || !sel) return false;

  editor.focus();

  if (
    libroUltimoRango &&
    editorContieneNodoLibro(editor, libroUltimoRango.startContainer) &&
    editorContieneNodoLibro(editor, libroUltimoRango.endContainer)
  ) {
    sel.removeAllRanges();
    sel.addRange(libroUltimoRango);
    return true;
  }

  const range = document.createRange();
  range.selectNodeContents(editor);
  range.collapse(false);

  sel.removeAllRanges();
  sel.addRange(range);
  libroUltimoRango = range.cloneRange();

  return true;
}

function cambiarColorResaltado(color) {
  libroColorResaltado = color || "#fdf07e";
  actualizarBotonResaltador();
}

function obtenerEditorLibroActual() {
  const sel = window.getSelection();

  if (sel && sel.rangeCount > 0) {
    let nodo = sel.anchorNode;

    while (nodo && nodo !== document.body) {
      if (
        nodo.nodeType === 1 &&
        nodo.classList &&
        nodo.classList.contains("libro-editor")
      ) {
        libroEditorActivo = nodo;
        return nodo;
      }

      nodo = nodo.parentNode;
    }
  }

  return libroEditorActivo;
}

function insertarNodoEnCursorLibro(nodo) {
  const editor = obtenerEditorLibroActual();

  if (!editor) return false;

  restaurarRangoLibro();

  const sel = window.getSelection();
  let range = null;

  if (sel && sel.rangeCount > 0) {
    range = sel.getRangeAt(0);
  } else {
    range = document.createRange();
    range.selectNodeContents(editor);
    range.collapse(false);
  }

  range.deleteContents();
  range.insertNode(nodo);

  range.setStartAfter(nodo);
  range.setEndAfter(nodo);

  sel.removeAllRanges();
  sel.addRange(range);

  libroUltimoRango = range.cloneRange();

  return true;
}

function insertarTextoConResaltador(texto) {
  const span = document.createElement("span");

  span.className = "texto-resaltado-libro";
  span.style.backgroundColor = libroColorResaltado;
  span.textContent = texto || "";

  insertarNodoEnCursorLibro(span);
}

function insertarSaltoLineaLibro() {
  insertarNodoEnCursorLibro(document.createElement("br"));
  insertarNodoEnCursorLibro(document.createElement("br"));
}

function salirDelResaltadoActivo() {
  restaurarRangoLibro();

  const editor = obtenerEditorLibroActual();
  const sel = window.getSelection();

  if (!editor || !sel || sel.rangeCount === 0) return;

  let nodo = sel.anchorNode;

  if (nodo && nodo.nodeType === Node.TEXT_NODE) {
    nodo = nodo.parentNode;
  }

  let spanResaltado = null;

  while (nodo && nodo !== editor && nodo !== document.body) {
    if (
      nodo.nodeType === 1 &&
      nodo.classList &&
      nodo.classList.contains("texto-resaltado-libro")
    ) {
      spanResaltado = nodo;
      break;
    }

    nodo = nodo.parentNode;
  }

  const salida = document.createTextNode("\u200B");
  const range = document.createRange();

  if (spanResaltado) {
    if (spanResaltado.nextSibling) {
      spanResaltado.parentNode.insertBefore(salida, spanResaltado.nextSibling);
    } else {
      spanResaltado.parentNode.appendChild(salida);
    }
  } else {
    const actual = sel.getRangeAt(0);
    actual.collapse(false);
    actual.insertNode(salida);
  }

  range.setStart(salida, 1);
  range.setEnd(salida, 1);

  sel.removeAllRanges();
  sel.addRange(range);
  libroUltimoRango = range.cloneRange();

  editor.focus();
}



function obtenerSpanResaltadoActualLibro() {
  const sel = window.getSelection();

  if (!sel || sel.rangeCount === 0) return null;

  let nodo = sel.anchorNode;

  if (nodo && nodo.nodeType === Node.TEXT_NODE) {
    nodo = nodo.parentNode;
  }

  const editor = obtenerEditorLibroActual();

  while (nodo && nodo !== editor && nodo !== document.body) {
    if (
      nodo.nodeType === 1 &&
      nodo.classList &&
      nodo.classList.contains("texto-resaltado-libro")
    ) {
      return nodo;
    }

    nodo = nodo.parentNode;
  }

  return null;
}

function cursorEstaDentroDeResaltadoLibro() {
  return !!obtenerSpanResaltadoActualLibro();
}

function insertarTextoNormalFueraDelResaltado(texto) {
  const editor = obtenerEditorLibroActual();
  const spanResaltado = obtenerSpanResaltadoActualLibro();

  if (!editor || !spanResaltado) return false;

  const sel = window.getSelection();
  const range = document.createRange();

  let nodoNuevo;

  if (texto === "\n") {
    nodoNuevo = document.createElement("br");
  } else {
    nodoNuevo = document.createTextNode(texto || "");
  }

  if (spanResaltado.nextSibling) {
    spanResaltado.parentNode.insertBefore(nodoNuevo, spanResaltado.nextSibling);
  } else {
    spanResaltado.parentNode.appendChild(nodoNuevo);
  }

  range.setStartAfter(nodoNuevo);
  range.setEndAfter(nodoNuevo);

  sel.removeAllRanges();
  sel.addRange(range);
  libroUltimoRango = range.cloneRange();

  editor.focus();

  return true;
}

function toggleResaltadorLibro() {
  restaurarRangoLibro();

  libroResaltadorActivo = !libroResaltadorActivo;

  if (!libroResaltadorActivo) {
    salirDelResaltadoActivo();
    document.execCommand("foreColor", false, libroColorLapiz);
  }

  actualizarBotonResaltador();

  const editor = obtenerEditorLibroActual();
  if (editor) editor.focus();
}


function actualizarBotonResaltador() {
  const btn = $("btnResaltador");
  if (!btn) return;

  btn.classList.toggle("activo", libroResaltadorActivo);
  btn.setAttribute("aria-pressed", libroResaltadorActivo ? "true" : "false");

  if (libroResaltadorActivo) {
    btn.style.backgroundColor = libroColorResaltado;
  } else {
    btn.style.backgroundColor = "";
  }
}

function guardarPaginasLibro() {
  guardarPaginaVisible("izq", libroPaginaActual);
  guardarPaginaVisible("der", libroPaginaActual + 1);
  guardarStorage();
  mostrarMensajeTemporal("Libro guardado.");
}

function guardarPaginaVisible(lado, index) {
  const pagina = libroPaginas[index];
  if (!pagina) return;

  const titulo = document.getElementById(`libroTitulo-${lado}`);
  const contenido = document.getElementById(`libroContenido-${lado}`);

  if (titulo) pagina.titulo = titulo.value.trim() || `Página ${index + 1}`;

  if (pagina.tipo !== "imagen" && contenido) {
    pagina.contenido = contenido.innerHTML;
    pagina.color = libroColorLapiz;
  }
}

function guardarPaginaLibroSinAlerta() {
  guardarPaginaVisible("izq", libroPaginaActual);
  guardarPaginaVisible("der", libroPaginaActual + 1);
  guardarStorage();
}

function mostrarMensajeTemporal(texto) {
  const aviso = document.createElement("div");
  aviso.className = "toast-libro";
  aviso.textContent = texto;
  document.body.appendChild(aviso);
  setTimeout(() => aviso.remove(), 1400);
}

function nuevaPaginaLibro() {
  guardarPaginaLibroSinAlerta();
  libroPaginas.push(crearPaginaLibro(`Página ${libroPaginas.length + 1}`));
  if (libroPaginas.length % 2 !== 0) libroPaginas.push(crearPaginaLibro(`Página ${libroPaginas.length + 1}`));
  libroPaginaActual = libroPaginas.length - 2;
  libroPaginaSeleccionada = libroPaginaActual;
  guardarStorage();
  renderLibro();
}

function paginaAnterior() {
  guardarPaginaLibroSinAlerta();
  if (libroPaginaActual > 0) {
    libroPasandoPagina = "pasando-izq";
    libroPaginaActual = Math.max(0, libroPaginaActual - 2);
    libroPaginaSeleccionada = libroPaginaActual;
    renderLibro();
    setTimeout(() => { libroPasandoPagina = ""; }, 450);
  }
}

function paginaSiguiente() {
  guardarPaginaLibroSinAlerta();
  if (libroPaginaActual + 2 < libroPaginas.length) {
    libroPasandoPagina = "pasando-der";
    libroPaginaActual += 2;
    libroPaginaSeleccionada = libroPaginaActual;
    renderLibro();
    setTimeout(() => { libroPasandoPagina = ""; }, 450);
  }
}






























function agregarImagenLibro() {
  const input = $("libroImagen");
  const archivo = input?.files?.[0];

  if (!archivo) return;

  guardarPaginaLibroSinAlerta();

  let indexDestino = Number(libroPaginaSeleccionada);

  if (Number.isNaN(indexDestino) || indexDestino < 0 || indexDestino >= libroPaginas.length) {
    indexDestino = libroPaginaActual;
  }

  const paginaDestino = libroPaginas[indexDestino];

  if (!paginaDestino) {
    alert("No se encontró la página donde querés agregar la imagen.");
    return;
  }

  const tieneContenido = paginaLibroTieneContenido(paginaDestino);

  let titulo = "";

  if (tieneContenido) {
    const nombrePagina = paginaDestino.titulo || `Página ${indexDestino + 1}`;

    const confirmar = confirm(
      `¿Estás seguro que querés sobreescribir una imagen en la página: "${nombrePagina}"?\n\nEsta página ya tiene contenido escrito o una imagen. Si aceptás, se reemplaza por la imagen.`
    );

    if (!confirmar) {
      input.value = "";
      return;
    }

    titulo = prompt("Agregar título para esta imagen:", archivo.name) || archivo.name;
  } else {
    titulo = prompt("Agregar título para esta imagen:", archivo.name) || archivo.name;
  }

  const pesoMB = archivo.size / 1024 / 1024;

  if (pesoMB > 1) {
    alert("La imagen es muy pesada. Usá una imagen de hasta 1 MB.");
    input.value = "";
    return;
  }

  const reader = new FileReader();

  reader.onload = function (e) {
    libroPaginas[indexDestino] = {
      id: paginaDestino.id || Date.now(),
      titulo,
      contenido: "",
      color: "#111827",
      tipo: "imagen",
      imagen: e.target.result,
      fecha: new Date().toLocaleDateString("es-AR")
    };

    libroPaginaSeleccionada = indexDestino;
    libroPaginaActual = indexDestino % 2 === 0 ? indexDestino : indexDestino - 1;

    guardarStorage();
    renderLibro();
  };

  reader.readAsDataURL(archivo);
}

function guardarTituloImagenLibro(index, titulo) {
  if (!libroPaginas[index]) return;
  libroPaginas[index].titulo = titulo.trim() || `Imagen ${index + 1}`;
  guardarStorage();
}

function reemplazarImagenLibro(index) {
  const input = document.getElementById(`replaceImg-${index}`);
  if (input) input.click();
}

function guardarReemplazoImagenLibro(index) {
  const input = document.getElementById(`replaceImg-${index}`);
  const archivo = input.files[0];

  if (!archivo || !libroPaginas[index]) return;

  const pesoMB = archivo.size / 1024 / 1024;
  if (pesoMB > 1) {
    alert("La imagen es muy pesada. Usá una imagen de hasta 1 MB.");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    libroPaginas[index].imagen = e.target.result;
    libroPaginas[index].titulo = libroPaginas[index].titulo || archivo.name;
    guardarStorage();
    renderLibro();
  };

  reader.readAsDataURL(archivo);
}

function eliminarFotoLibro(index) {
  const pagina = libroPaginas[index];

  if (!pagina || pagina.tipo !== "imagen") {
    alert("Esta página no tiene una foto para borrar.");
    return;
  }

  if (!confirm("¿Borrar esta foto del libro? La página quedará vacía para escribir.")) return;

  libroPaginas[index] = {
    id: pagina.id || Date.now(),
    titulo: pagina.titulo || `Página ${index + 1}`,
    contenido: "",
    color: "#111827",
    tipo: "texto",
    imagen: "",
    fecha: new Date().toLocaleDateString("es-AR")
  };

  libroPaginaSeleccionada = index;
  guardarStorage();
  renderLibro();
}

function buscarSugerenciasLibro() {
  const texto = $("buscarLibro").value.toLowerCase().trim();
  const sugerencias = $("sugerenciasLibro");

  if (!texto) {
    sugerencias.classList.add("hidden");
    sugerencias.innerHTML = "";
    return;
  }

  const resultados = libroPaginas
    .map((p, index) => ({ ...p, index }))
    .filter((p) =>
      String(p.titulo || "").toLowerCase().includes(texto) ||
      String(p.contenido || "").toLowerCase().includes(texto)
    )
    .slice(0, 8);

  sugerencias.classList.remove("hidden");

  sugerencias.innerHTML = resultados.length
    ? resultados.map((p) => `
      <button class="sugerencia-item" onclick="irAPaginaLibro(${p.index})">
        <b>${escapeHtml(p.titulo || "Sin título")}</b>
        <small>Página ${p.index + 1} ${p.tipo === "imagen" ? "🖼️" : "📝"}</small>
      </button>
    `).join("")
    : `<div class="sugerencia-item">Sin resultados</div>`;
}

function irAPaginaLibro(index) {
  guardarPaginaLibroSinAlerta();
  libroPaginaActual = index % 2 === 0 ? index : index - 1;
  renderLibro();
}

function htmlPaginaLibro(pagina, index) {
  if (!pagina) return "";

  if (pagina.tipo === "imagen") {
    return `
      <div class="pagina-print">
        <h2>Página ${index + 1}: ${escapeHtml(pagina.titulo || "")}</h2>
        <img src="${pagina.imagen}" />
      </div>
    `;
  }

  return `
    <div class="pagina-print lined">
      <h2>Página ${index + 1}: ${escapeHtml(pagina.titulo || "")}</h2>
      <div>${pagina.contenido || ""}</div>
    </div>
  `;
}


function textoPaginaLibro(pagina, index) {
  if (!pagina) return "";

  return `
Página: ${index + 1}
Título: ${pagina.titulo || "Sin título"}
Tipo: ${pagina.tipo === "imagen" ? "Imagen" : "Texto"}
Fecha: ${pagina.fecha || "—"}

${pagina.tipo === "imagen" ? "[La imagen está incluida en la ficha / PDF]" : textoPlanoLibro(pagina.contenido || "")}
`;
}

async function correoPaginaLibro() {
  guardarPaginaLibroSinAlerta();

  const paginaIzq = libroPaginas[libroPaginaActual];
  const paginaDer = libroPaginas[libroPaginaActual + 1];

  const paginas = [paginaIzq, paginaDer].filter(Boolean);

  const cuerpo = paginas
    .map((p, i) => textoPaginaLibro(p, libroPaginaActual + i))
    .join("\n----------------\n");

  const adjuntos = paginas
    .filter((p) => p.tipo === "imagen" && p.imagen)
    .map((p, i) => crearAdjuntoDesdeDataUrl(p.titulo || `pagina-${libroPaginaActual + i + 1}`, p.imagen));

  await abrirCorreoComputadora({
    asunto: `Libro - páginas ${libroPaginaActual + 1}${paginaDer ? " y " + (libroPaginaActual + 2) : ""}`,
    cuerpo,
    html: cuerpoHtmlCorreo(
      "Libro",
      `<div class="print-doble">
        ${htmlPaginaLibro(paginaIzq, libroPaginaActual)}
        ${paginaDer ? htmlPaginaLibro(paginaDer, libroPaginaActual + 1) : ""}
      </div>`
    ),
    adjuntos
  });
}

async function correoLibro() {
  guardarPaginaLibroSinAlerta();

  const cuerpo = libroPaginas
    .map((p, i) => textoPaginaLibro(p, i))
    .join("\n----------------\n");

  const adjuntos = libroPaginas
    .map((p, i) => p.tipo === "imagen" && p.imagen ? crearAdjuntoDesdeDataUrl(p.titulo || `pagina-${i + 1}`, p.imagen) : null)
    .filter(Boolean);

  await abrirCorreoComputadora({
    asunto: "Libro completo",
    cuerpo,
    html: cuerpoHtmlCorreo("Libro completo", libroPaginas.map((p, i) => htmlPaginaLibro(p, i)).join("")),
    adjuntos
  });
}

function imprimirPaginaLibro() {
  guardarPaginaLibroSinAlerta();
  const paginaIzq = libroPaginas[libroPaginaActual];
  const paginaDer = libroPaginas[libroPaginaActual + 1];
  imprimirHTML("Imprimir página del libro", `<h1>Libro</h1><div class="print-doble">${htmlPaginaLibro(paginaIzq, libroPaginaActual)}${paginaDer ? htmlPaginaLibro(paginaDer, libroPaginaActual + 1) : ""}</div>`);
}

function descargarPaginaLibro() {
  guardarPaginaLibroSinAlerta();
  const paginaIzq = libroPaginas[libroPaginaActual];
  const paginaDer = libroPaginas[libroPaginaActual + 1];
  descargarHTML(`libro-paginas-${libroPaginaActual + 1}-${libroPaginaActual + 2}`, `<div class="print-doble">${htmlPaginaLibro(paginaIzq, libroPaginaActual)}${paginaDer ? htmlPaginaLibro(paginaDer, libroPaginaActual + 1) : ""}</div>`);
}

function imprimirLibro() {
  guardarPaginaLibroSinAlerta();
  imprimirHTML("Libro completo", `<h1>Libro completo</h1>${libroPaginas.map((p, i) => htmlPaginaLibro(p, i)).join("")}`);
}

function descargarLibro() {
  guardarPaginaLibroSinAlerta();
  descargarHTML("libro-completo", `<h1>Libro completo</h1>${libroPaginas.map((p, i) => htmlPaginaLibro(p, i)).join("")}`);
}

document.addEventListener("DOMContentLoaded", init);
