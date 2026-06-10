const CATEGORIAS_DEFAULT = [
  { id: 1, nombre: "Vivienda", icono: "🏠", color: "blue", total: 0 },
  { id: 2, nombre: "Trabajo", icono: "💼", color: "green", total: 0 },
  { id: 3, nombre: "Salud", icono: "🏥", color: "red", total: 0 },
  { id: 4, nombre: "Obra Pública", icono: "🏗️", color: "yellow", total: 0 },
  { id: 5, nombre: "Educación", icono: "📚", color: "purple", total: 0 },
  { id: 6, nombre: "Desarrollo Social", icono: "🤝", color: "orange", total: 0 },
  { id: 7, nombre: "Mujer", icono: "👩", color: "pink", total: 0 },
  { id: 8, nombre: "Legales", icono: "⚖️", color: "gray", total: 0 },
  { id: 100, nombre: "Centro", icono: "🏘️", color: "indigo", total: 0, parent: "Barrios", tipo: "barrio" },
  { id: 101, nombre: "Villa Belgrano", icono: "🏘️", color: "blue", total: 0, parent: "Barrios", tipo: "barrio" },
  { id: 102, nombre: "Barrio Rosario", icono: "🏘️", color: "green", total: 0, parent: "Barrios", tipo: "barrio" },
  { id: 103, nombre: "Barrio San Martín", icono: "🏘️", color: "purple", total: 0, parent: "Barrios", tipo: "barrio" },
  { id: 104, nombre: "Barrio San Cayetano", icono: "🏘️", color: "orange", total: 0, parent: "Barrios", tipo: "barrio" },
  { id: 105, nombre: "Puente Chico", icono: "🏘️", color: "pink", total: 0, parent: "Barrios", tipo: "barrio" },
  { id: 106, nombre: "Barrio Boca / Boca Juniors", icono: "🏘️", color: "gray", total: 0, parent: "Barrios", tipo: "barrio" },
  { id: 107, nombre: "Tres Repúblicas", icono: "🏘️", color: "yellow", total: 0, parent: "Barrios", tipo: "barrio" },
  { id: 108, nombre: "Domingo Moccero", icono: "🏘️", color: "indigo", total: 0, parent: "Barrios", tipo: "barrio" },
  { id: 109, nombre: "Miguel de Güemes", icono: "🏘️", color: "blue", total: 0, parent: "Barrios", tipo: "barrio" },
  { id: 110, nombre: "Barrio Mar del Plata", icono: "🏘️", color: "green", total: 0, parent: "Barrios", tipo: "barrio" },
  { id: 111, nombre: "Lovecchio / Julio César Lovecchio", icono: "🏘️", color: "purple", total: 0, parent: "Barrios", tipo: "barrio" },
  { id: 112, nombre: "Altos Balcarce", icono: "🏘️", color: "orange", total: 0, parent: "Barrios", tipo: "barrio" },
  { id: 113, nombre: "Teodosio Alaniz / Alaniz", icono: "🏘️", color: "pink", total: 0, parent: "Barrios", tipo: "barrio" },
  { id: 114, nombre: "Cristo Redentor", icono: "🏘️", color: "gray", total: 0, parent: "Barrios", tipo: "barrio" },
  { id: 115, nombre: "Barrio Cristo", icono: "🏘️", color: "yellow", total: 0, parent: "Barrios", tipo: "barrio" },
  { id: 116, nombre: "Barrio Puente", icono: "🏘️", color: "indigo", total: 0, parent: "Barrios", tipo: "barrio" },
  { id: 117, nombre: "Barrio Familia", icono: "🏘️", color: "blue", total: 0, parent: "Barrios", tipo: "barrio" },
  { id: 118, nombre: "Brandenberg", icono: "🏘️", color: "green", total: 0, parent: "Barrios", tipo: "barrio" },
  { id: 119, nombre: "Remedios de Escalada", icono: "🏘️", color: "purple", total: 0, parent: "Barrios", tipo: "barrio" },
  { id: 120, nombre: "Islas Malvinas", icono: "🏘️", color: "orange", total: 0, parent: "Barrios", tipo: "barrio" },
  { id: 121, nombre: "Etchegaray", icono: "🏘️", color: "pink", total: 0, parent: "Barrios", tipo: "barrio" },
  { id: 122, nombre: "Fátima", icono: "🏘️", color: "gray", total: 0, parent: "Barrios", tipo: "barrio" },
  { id: 123, nombre: "René Favaloro", icono: "🏘️", color: "yellow", total: 0, parent: "Barrios", tipo: "barrio" },
  { id: 124, nombre: "Bonifacino", icono: "🏘️", color: "indigo", total: 0, parent: "Barrios", tipo: "barrio" },
  { id: 125, nombre: "Pueblo Santa Trinidad / Colonia I", icono: "🏘️", color: "blue", total: 0, parent: "Barrios", tipo: "barrio" },
  { id: 126, nombre: "Pueblo San José / Colonia II", icono: "🏘️", color: "green", total: 0, parent: "Barrios", tipo: "barrio" },
  { id: 127, nombre: "Pueblo Santa María / Colonia III", icono: "🏘️", color: "purple", total: 0, parent: "Barrios", tipo: "barrio" },
  { id: 128, nombre: "PROCREAR Santa Trinidad", icono: "🏘️", color: "orange", total: 0, parent: "Barrios", tipo: "barrio" },
  { id: 129, nombre: "Los Manantiales, en Santa Trinidad", icono: "🏘️", color: "pink", total: 0, parent: "Barrios", tipo: "barrio" },
  { id: 130, nombre: "Sector nuevo / loteo nuevo Santa Trinidad", icono: "🏘️", color: "gray", total: 0, parent: "Barrios", tipo: "barrio" }
];

let categorias = [];
let categoriasEliminadas = [];
let modoEditarBases = false;
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
let encuestaPendienteRevision = null;
let encuestaOCRTrabajando = false;

const $ = (id) => document.getElementById(id);


function limpiarCategoriasBarriosViejas() {
  const nombresViejos = ["planos", "encuesta"];

  categorias = categorias.filter((cat) => {
    const esVieja =
      Number(cat.id) === 10 ||
      Number(cat.id) === 11 ||
      (
        cat.parent === "Barrios" &&
        nombresViejos.includes(String(cat.nombre || "").toLowerCase())
      );

    return !esVieja;
  });

  categoriasEliminadas = categoriasEliminadas.filter((x) => {
    const sx = String(x || "").toLowerCase();
    return sx !== "10" && sx !== "11" && sx !== "planos" && sx !== "encuesta";
  });
}


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
  localStorage.setItem("baseOrden", JSON.stringify(categorias.map((c) => Number(c.id))));
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

  limpiarCategoriasBarriosViejas();

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



function iconoPorTipoBase(tipo) {
  if (tipo === "barrio") return "🏘️";
  return "📁";
}

function colorAleatorioBase() {
  const colores = ["indigo", "blue", "green", "purple", "orange", "pink", "gray", "yellow"];
  return colores[Math.floor(Math.random() * colores.length)];
}


function moverBaseDatos(catId, direccion) {
  const cat = categorias.find((c) => Number(c.id) === Number(catId));
  if (!cat) return;

  const mismaSeccion = (c) => {
    if (cat.parent === "Barrios") return c.parent === "Barrios";
    return !c.parent && c.tipo !== "barrio";
  };

  const visibles = categorias.filter(mismaSeccion);
  const actual = visibles.findIndex((c) => Number(c.id) === Number(catId));
  if (actual === -1) return;

  const nuevo = actual + direccion;

  if (nuevo < 0 || nuevo >= visibles.length) return;

  const a = visibles[actual];
  const b = visibles[nuevo];

  const ia = categorias.findIndex((c) => Number(c.id) === Number(a.id));
  const ib = categorias.findIndex((c) => Number(c.id) === Number(b.id));

  if (ia === -1 || ib === -1) return;

  const temp = categorias[ia];
  categorias[ia] = categorias[ib];
  categorias[ib] = temp;

  localStorage.setItem("baseOrden", JSON.stringify(categorias.map((c) => Number(c.id))));
  guardarStorage();
  renderSidebar();
  renderPanel();

  if (catActiva && Number(catActiva.id) === Number(catId)) {
    catActiva = categorias.find((c) => Number(c.id) === Number(catId));
  }
}

function subirPosicionBase(catId) {
  moverBaseDatos(catId, -1);
}

function bajarPosicionBase(catId) {
  moverBaseDatos(catId, 1);
}


function datosDeBase(catId) {
  const cat = categorias.find((c) => Number(c.id) === Number(catId));
  if (!cat) return null;

  if (cat.tipo === "barrio") {
    return {
      version: 1,
      tipo: "barrio",
      categoria: cat,
      planos: planos.filter((p) => Number(p.barrio_id) === Number(catId)),
      encuestas: encuestas.filter((e) => Number(e.barrio_id) === Number(catId)),
      exportado: new Date().toISOString()
    };
  }

  return {
    version: 1,
    tipo: "normal",
    categoria: cat,
    personas: personas.filter((p) => Number(p.categoria_id) === Number(catId)),
    registros: registros.filter((r) => Number(r.categoria_id) === Number(catId)),
    exportado: new Date().toISOString()
  };
}

function descargarArchivoTexto(nombre, texto) {
  const blob = new Blob([texto], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = nombre;
  document.body.appendChild(a);
  a.click();
  a.remove();

  URL.revokeObjectURL(url);
}

function bajarBaseDatos(catId) {
  const data = datosDeBase(catId);
  if (!data) {
    alert("No se encontró la base de datos.");
    return;
  }

  const nombre = nombreArchivoSeguro(`base-${data.categoria.nombre}`) + ".json";
  descargarArchivoTexto(nombre, JSON.stringify(data, null, 2));
}

function subirBaseDatos(catId) {
  const cat = categorias.find((c) => Number(c.id) === Number(catId));
  if (!cat) {
    alert("No se encontró la base de datos.");
    return;
  }

  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".json,application/json";

  input.onchange = () => {
    const archivo = input.files && input.files[0];
    if (!archivo) return;

    const reader = new FileReader();

    reader.onload = function (e) {
      try {
        const data = JSON.parse(String(e.target.result || "{}"));

        const ok = confirm(
          `¿Seguro que quieres subir datos a la base "${cat.nombre}"?\n\n` +
          `Aceptar = importar datos\n` +
          `Cancelar = no importar`
        );

        if (!ok) return;

        importarDatosEnBase(cat, data);
      } catch (error) {
        alert("El archivo no es una base de datos válida.");
      }
    };

    reader.readAsText(archivo, "utf-8");
  };

  input.click();
}

function importarDatosEnBase(cat, data) {
  if (cat.tipo === "barrio") {
    const nuevosPlanos = Array.isArray(data.planos) ? data.planos : [];
    const nuevasEncuestas = Array.isArray(data.encuestas) ? data.encuestas : [];

    nuevosPlanos.forEach((p) => {
      planos.push({
        ...p,
        id: Date.now() + Math.floor(Math.random() * 999999),
        barrio_id: cat.id,
        barrio_nombre: cat.nombre
      });
    });

    nuevasEncuestas.forEach((e) => {
      encuestas.push({
        ...e,
        id: Date.now() + Math.floor(Math.random() * 999999),
        barrio_id: cat.id,
        barrio_nombre: cat.nombre
      });
    });
  } else {
    const nuevasPersonas = Array.isArray(data.personas) ? data.personas : [];
    const nuevosRegistros = Array.isArray(data.registros) ? data.registros : [];

    const mapaIds = {};

    nuevasPersonas.forEach((p) => {
      const nuevoId = Date.now() + Math.floor(Math.random() * 999999);
      mapaIds[p.id] = nuevoId;

      personas.push({
        ...p,
        id: nuevoId,
        categoria_id: cat.id
      });
    });

    nuevosRegistros.forEach((r) => {
      registros.push({
        ...r,
        id: Date.now() + Math.floor(Math.random() * 999999),
        persona_id: mapaIds[r.persona_id] || r.persona_id,
        categoria_id: cat.id
      });
    });
  }

  guardarStorage();
  renderTodo();
  alert("Base de datos subida correctamente.");
}

function editarNombreBase(catId) {
  const cat = categorias.find((c) => Number(c.id) === Number(catId));
  if (!cat) return;

  const nuevoNombre = prompt("Nuevo nombre de la base de datos:", cat.nombre);
  if (!nuevoNombre || !nuevoNombre.trim()) return;

  const nombreLimpio = nuevoNombre.trim();

  const existe = categorias.some(
    (c) => Number(c.id) !== Number(catId) &&
    String(c.nombre).toLowerCase() === nombreLimpio.toLowerCase()
  );

  if (existe) {
    alert("Ya existe una base de datos con ese nombre.");
    return;
  }

  const nombreAnterior = cat.nombre;
  cat.nombre = nombreLimpio;

  if (cat.tipo === "barrio") {
    planos = planos.map((p) =>
      Number(p.barrio_id) === Number(catId)
        ? { ...p, barrio_nombre: nombreLimpio }
        : p
    );

    encuestas = encuestas.map((e) =>
      Number(e.barrio_id) === Number(catId)
        ? { ...e, barrio_nombre: nombreLimpio }
        : e
    );
  }

  categorias = ordenarCategorias(categorias);

  guardarStorage();
  renderTodo();

  if (catActiva && Number(catActiva.id) === Number(catId)) {
    catActiva = categorias.find((c) => Number(c.id) === Number(catId));
    renderTodo();
  }
}

function confirmarEliminarBase(catId) {
  const cat = categorias.find((c) => Number(c.id) === Number(catId));

  if (!cat) {
    alert("No se encontró la base de datos.");
    return;
  }

  let detalle = "";

  if (cat.tipo === "barrio") {
    const totalPlanos = planos.filter((p) => Number(p.barrio_id) === Number(catId)).length;
    const totalEncuestas = encuestas.filter((e) => Number(e.barrio_id) === Number(catId)).length;

    detalle =
      `También se eliminarán ${totalPlanos} plano${totalPlanos !== 1 ? "s" : ""} ` +
      `y ${totalEncuestas} encuesta${totalEncuestas !== 1 ? "s" : ""}.`;
  } else {
    const totalPersonas = personas.filter((p) => Number(p.categoria_id) === Number(catId)).length;
    const totalRegistros = registros.filter((r) => Number(r.categoria_id) === Number(catId)).length;

    detalle =
      `También se eliminarán ${totalPersonas} persona${totalPersonas !== 1 ? "s" : ""} ` +
      `y ${totalRegistros} registro${totalRegistros !== 1 ? "s" : ""}.`;
  }

  const confirmar = confirm(
    `¿Seguro que quieres eliminar esta base de datos?\n\n` +
    `Base: "${cat.nombre}"\n\n` +
    `${detalle}\n\n` +
    `Aceptar = Sí, eliminar\n` +
    `Cancelar = No, conservar`
  );

  if (!confirmar) return;

  eliminarBaseDatosConfirmada(catId);
}

function eliminarBaseDatosConfirmada(catId) {
  const cat = categorias.find((c) => Number(c.id) === Number(catId));
  if (!cat) return;

  categorias = categorias.filter((c) => Number(c.id) !== Number(catId));

  if (esCategoriaDefault(cat)) {
    categoriasEliminadas.push(cat.id);
    categoriasEliminadas.push(cat.nombre);
    categoriasEliminadas = [...new Set(categoriasEliminadas.map(String))];
  }

  if (cat.tipo === "barrio") {
    planos = planos.filter((p) => Number(p.barrio_id) !== Number(catId));
    encuestas = encuestas.filter((e) => Number(e.barrio_id) !== Number(catId));
  } else {
    personas = personas.filter((p) => Number(p.categoria_id) !== Number(catId));
    registros = registros.filter((r) => Number(r.categoria_id) !== Number(catId));
  }

  localStorage.setItem("baseOrden", JSON.stringify(categorias.map((c) => Number(c.id))));

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



function esCategoriaDefault(cat) {
  return CATEGORIAS_DEFAULT.some(
    (c) => Number(c.id) === Number(cat.id) || String(c.nombre).toLowerCase() === String(cat.nombre).toLowerCase()
  );
}

function puedeBorrarCategoria(cat) {
  return !!cat;
}

function ordenarCategorias(lista) {
  const guardado = JSON.parse(localStorage.getItem("baseOrden") || "[]").map(Number);
  const ordenDefault = CATEGORIAS_DEFAULT.map((cat) => Number(cat.id));

  return [...lista].sort((a, b) => {
    const aid = Number(a.id);
    const bid = Number(b.id);

    const ga = guardado.indexOf(aid);
    const gb = guardado.indexOf(bid);

    if (ga !== -1 && gb !== -1) return ga - gb;
    if (ga !== -1) return -1;
    if (gb !== -1) return 1;

    const da = ordenDefault.indexOf(aid);
    const db = ordenDefault.indexOf(bid);

    if (da !== -1 && db !== -1) return da - db;
    if (da !== -1) return -1;
    if (db !== -1) return 1;

    return aid - bid;
  });
}


function formatPersonas(n) {
  return `${n} persona${n !== 1 ? "s" : ""}`;
}

function totalEnCategoria(catId) {
  const cat = categorias.find((c) => Number(c.id) === Number(catId));

  if (cat?.tipo === "barrio") {
    const totalPlanos = planos.filter((p) => Number(p.barrio_id) === Number(catId)).length;
    const totalEncuestas = encuestas.filter((e) => Number(e.barrio_id) === Number(catId)).length;
    return totalPlanos + totalEncuestas;
  }

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
  const html = documentoHTMLParaPDF(nombre, contenidoHtml);
  const nombrePdf = `${nombreArchivoSeguro(nombre)}.pdf`;

  // Si está en Electron y funciona, guarda PDF directo.
  // Si está en Chrome/GitHub, abre la ventana de impresión para guardar como PDF.
  if (window.api && typeof window.api.guardarPdfHTML === "function") {
    try {
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

      // Si Electron falla, no mostramos error: usamos el modo web.
      abrirVentanaPDFWeb(nombre, html);
      return;
    } catch (e) {
      abrirVentanaPDFWeb(nombre, html);
      return;
    }
  }

  // Modo web / Chrome / GitHub Pages.
  // No muestra error: abre directo para guardar como PDF.
  abrirVentanaPDFWeb(nombre, html);
}


function documentoHTMLParaPDF(nombre, contenidoHtml) {
  return `
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

        .aviso-web-pdf {
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          border-radius: 12px;
          padding: 12px;
          margin-bottom: 18px;
          color: #1e3a8a;
          font-weight: 700;
        }

        .card {
          border: 1px solid #ddd;
          border-radius: 12px;
          padding: 18px;
          margin-bottom: 16px;
          page-break-inside: avoid;
        }

        pre {
          white-space: break-spaces;
          font-size: 14px;
        }

        img {
          max-width: 100%;
          max-height: 760px;
          object-fit: contain;
          border: 1px solid #ddd;
          border-radius: 10px;
          background: #f3f4f6;
          display: block;
          margin: 10px 0;
        }

        iframe {
          width: 100%;
          height: 760px;
          border: 1px solid #ddd;
        }

        .espacio-libro { display:inline; width:auto; min-width:0; height:auto; background:transparent; white-space:break-spaces; }

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
          white-space: break-spaces;
        }

        .pagina-print.lined {
          background-image: linear-gradient(#ffffff 39px, #dbeafe 40px);
          background-size: 100% 40px;
        }

        @media print {
          .no-print,
          .aviso-web-pdf {
            display: none !important;
          }

          body {
            padding: 18px;
          }

          img {
            break-inside: avoid;
            page-break-inside: avoid;
          }
        }
      </style>
    </head>
    <body>${contenidoHtml}</body>
    </html>
  `;
}

function abrirVentanaPDFWeb(nombre, html) {
  const ventana = window.open("", "_blank");

  if (!ventana) {
    // Respaldo si Chrome bloquea ventanas emergentes:
    // descarga un HTML listo para abrir e imprimir como PDF.
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = `${nombreArchivoSeguro(nombre)}-abrir-y-guardar-como-pdf.html`;
    document.body.appendChild(a);
    a.click();
    a.remove();

    setTimeout(() => URL.revokeObjectURL(url), 1200);

    alert("Chrome bloqueó la ventana de PDF. Se descargó un archivo HTML. Abrilo y elegí Imprimir → Guardar como PDF.");
    return;
  }

  ventana.document.open();
  ventana.document.write(html.replace(
    "<body>",
    `<body>
      <div class="aviso-web-pdf no-print">
        PDF listo. En destino elegí “Guardar como PDF” y tocá Guardar.
      </div>`
  ));
  ventana.document.close();

  esperarImagenesYPrint(ventana);
}


function esperarImagenesYPrint(ventana) {
  const lanzarPrint = () => {
    setTimeout(() => {
      try {
        ventana.focus();
        ventana.print();
      } catch (e) {}
    }, 350);
  };

  const imgs = Array.from(ventana.document.images || []);

  if (!imgs.length) {
    lanzarPrint();
    return;
  }

  let pendientes = imgs.length;
  const listo = () => {
    pendientes--;
    if (pendientes <= 0) lanzarPrint();
  };

  imgs.forEach((img) => {
    if (img.complete) {
      listo();
    } else {
      img.onload = listo;
      img.onerror = listo;
    }
  });

  setTimeout(lanzarPrint, 2500);
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
        .card { border: 1px solid #ddd; border-radius: 12px; padding: 18px; margin-bottom: 16px; page-break-inside: avoid; }
        img { max-width: 100%; max-height: 760px; object-fit: contain; display:block; margin:10px 0; }
        iframe { width: 100%; height: 760px; border: 1px solid #ddd; }
        pre { white-space: break-spaces; font-size: 14px; }
        .espacio-libro{display:inline;width:auto;min-width:0;height:auto;background:transparent;white-space:break-spaces;}
        table { width:100%; border-collapse:collapse; }
        th, td { border: 1px solid #999; padding: 8px; vertical-align: top; }
        th { background: #818cf8; }
        .print-doble{display:grid;grid-template-columns:1fr 1fr;gap:18px}
        .pagina-print{border:1px solid #d1d5db;padding:25px;min-height:700px;background:white;page-break-inside:avoid;white-space:pre-wrap}
        .pagina-print.lined{background-image:linear-gradient(#ffffff 39px,#dbeafe 40px);background-size:100% 40px}
        @media print { button { display:none; } img { break-inside: avoid; page-break-inside: avoid; } }
      </style>
    </head>
    <body>
      ${contenidoHtml}
    </body>
    </html>
  `);

  ventana.document.close();
  esperarImagenesYPrint(ventana);
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






function asegurarBotonEditarBases() {
  const box = document.querySelector(".new-db-box");
  if (!box) return;

  let btn = $("btnToggleEditarBases");

  if (!btn) {
    btn = document.createElement("button");
    btn.id = "btnToggleEditarBases";
    btn.type = "button";
    btn.className = "new-db-btn edit-db-toggle";
    box.appendChild(btn);
  }

  btn.onclick = () => {
    modoEditarBases = !modoEditarBases;
    actualizarBotonEditarBases();
    renderSidebar();
    renderPanel();
  };

  actualizarBotonEditarBases();
}


function actualizarBotonEditarBases() {
  const btn = $("btnToggleEditarBases");
  if (!btn) return;

  btn.textContent = modoEditarBases
    ? "✅ Terminar edición"
    : "✏️ Editar bases de datos";

  btn.classList.toggle("activo", modoEditarBases);
}



function bindEvents() {
  asegurarBotonEditarBases();
  actualizarBotonEditarBases();
  $("btnPanel").onclick = mostrarPanel;

  if ($("btnAgenda")) $("btnAgenda").onclick = mostrarAgenda;
  if ($("btnLibro")) $("btnLibro").onclick = mostrarLibro;
  if ($("btnCalcular")) $("btnCalcular").onclick = mostrarCalcular;
  if ($("btnGraficos")) $("btnGraficos").onclick = mostrarGraficos;

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

    $("formNuevaCat").innerHTML = `
      <div class="tipo-base-box">
        <button type="button" id="tipoBaseNormal" class="tipo-base-btn active">📁 Base normal</button>
        <button type="button" id="tipoBaseBarrio" class="tipo-base-btn">🏘️ Base para barrios</button>
      </div>

      <input id="inputNuevaCat" placeholder="Nombre de la base de datos..." />

      <input id="tipoNuevaCat" type="hidden" value="normal" />

      <div class="mini-actions">
        <button id="btnGuardarNuevaCat">Agregar</button>
        <button id="btnCancelarNuevaCat">Cancelar</button>
      </div>
    `;

    $("tipoBaseNormal").onclick = () => seleccionarTipoNuevaBase("normal");
    $("tipoBaseBarrio").onclick = () => seleccionarTipoNuevaBase("barrio");
    $("btnCancelarNuevaCat").onclick = cerrarNuevaCat;
    $("btnGuardarNuevaCat").onclick = crearCategoria;

    $("inputNuevaCat").onkeydown = (e) => {
      if (e.key === "Enter") crearCategoria();
    };

    seleccionarTipoNuevaBase("normal");
    $("inputNuevaCat").focus();
  };

  if ($("btnCancelarNuevaCat")) $("btnCancelarNuevaCat").onclick = cerrarNuevaCat;
  if ($("btnGuardarNuevaCat")) $("btnGuardarNuevaCat").onclick = crearCategoria;

  if ($("inputNuevaCat")) {
    $("inputNuevaCat").onkeydown = (e) => {
      if (e.key === "Enter") crearCategoria();
    };
  }

  $("busqueda").oninput = renderCategoria;
}




function renderTodo() {
  renderSidebar();
  renderSelectCategorias();

  if (vista === "panel") renderPanel();
  else if (vista === "agenda") renderAgenda();
  else if (vista === "libro") renderLibro();
  else if (vista === "calcular") renderCalcular();
  else if (vista === "graficos") renderGraficos();
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
  actualizarBotonEditarBases();

  const total = personas.length + planos.length + encuestas.length;

  $("totalPersonas").textContent =
    `${formatPersonas(total)} cargada${total !== 1 ? "s" : ""}`;

  let html = "";

  const categoriasNormales = categorias.filter((cat) => !cat.parent && cat.tipo !== "barrio");
  const categoriasBarrios = categorias.filter((cat) => cat.parent === "Barrios" || cat.tipo === "barrio");

  categoriasNormales.forEach((cat) => {
    const totalCat = totalEnCategoria(cat.id);

    html += `
      <div class="cat-row ${modoEditarBases ? "editando-base" : ""}">
        <button class="cat-btn ${catActiva?.id === cat.id ? "active bg-" + cat.color : ""}" data-cat="${cat.id}">
          <span class="left"><span>${cat.icono}</span><span>${cat.nombre}</span></span>
          <span class="count">${totalCat}</span>
        </button>

        ${
          modoEditarBases
            ? `
              <div class="base-edit-actions">
                <button title="Editar nombre" onclick="editarNombreBase(${cat.id}); event.stopPropagation();">✏️</button>
                <button title="Bajar posición" onclick="bajarPosicionBase(${cat.id}); event.stopPropagation();">⬇️</button>
                <button title="Subir posición" onclick="subirPosicionBase(${cat.id}); event.stopPropagation();">⬆️</button>
                <button class="danger" title="Eliminar base" onclick="confirmarEliminarBase(${cat.id}); event.stopPropagation();">🗑️</button>
              </div>
            `
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
        <div class="cat-row ${modoEditarBases ? "editando-base" : ""}">
          <button class="cat-btn sub-cat ${catActiva?.id === cat.id ? "active bg-" + cat.color : ""}" data-cat="${cat.id}">
            <span class="left"><span>${cat.icono}</span><span>${cat.nombre}</span></span>
            <span class="count">${totalCat}</span>
          </button>

          ${
            modoEditarBases
              ? `
                <div class="base-edit-actions">
                  <button title="Editar nombre" onclick="editarNombreBase(${cat.id}); event.stopPropagation();">✏️</button>
                  <button title="Bajar posición" onclick="bajarPosicionBase(${cat.id}); event.stopPropagation();">⬇️</button>
                  <button title="Subir posición" onclick="subirPosicionBase(${cat.id}); event.stopPropagation();">⬆️</button>
                  <button class="danger" title="Eliminar base" onclick="confirmarEliminarBase(${cat.id}); event.stopPropagation();">🗑️</button>
                </div>
              `
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
  const normales = categorias.filter((cat) => !cat.parent && cat.tipo !== "barrio");

  $("categoriaSelect").innerHTML =
    `<option value="">— Seleccioná una base de datos —</option>` +
    normales.map((cat) => `<option value="${cat.id}">${cat.icono} ${cat.nombre}</option>`).join("");
}



function renderPanel() {
  activarNavPrincipal("btnPanel");

  const categoriasPanel = categorias.filter((cat) => !cat.parent && cat.tipo !== "barrio");

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
      <span class="badge badge-indigo">${categorias.filter((cat) => cat.parent === "Barrios" || cat.tipo === "barrio").length} barrios</span>
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

      const primerBarrio = categorias.find((cat) => cat.parent === "Barrios" || cat.tipo === "barrio");
      if (primerBarrio) mostrarCategoria(primerBarrio.id);
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

  if (catActiva?.tipo === "planos" || catActiva?.tipo === "encuesta" || catActiva?.tipo === "barrio") {
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

  if (catActiva.tipo === "barrio") {
    renderBarrio();
    return;
  }

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
      <button onclick="descargarBase()">⬇️ Descargar PDF</button>
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


function borrarCategoriaCompleta(catId, yaConfirmado = false) {
  if (!yaConfirmado) {
    confirmarEliminarBase(catId);
    return;
  }

  eliminarBaseDatosConfirmada(catId);
}

function borrarCategoriaNueva(catId) {
  confirmarEliminarBase(catId);
}



function borrarCategoriaNueva(catId) {
  borrarCategoriaCompleta(catId);
}



function seleccionarTipoNuevaBase(tipo) {
  if ($("tipoNuevaCat")) $("tipoNuevaCat").value = tipo;

  if ($("tipoBaseNormal")) {
    $("tipoBaseNormal").classList.toggle("active", tipo === "normal");
  }

  if ($("tipoBaseBarrio")) {
    $("tipoBaseBarrio").classList.toggle("active", tipo === "barrio");
  }

  if ($("inputNuevaCat")) {
    $("inputNuevaCat").placeholder =
      tipo === "barrio"
        ? "Nombre del barrio o base de barrio..."
        : "Nombre de la base de datos...";
  }
}



function crearCategoria() {
  const nombre = $("inputNuevaCat").value.trim();
  if (!nombre) return;

  const tipo = $("tipoNuevaCat")?.value || "normal";

  const existe = categorias.find((c) => c.nombre.toLowerCase() === nombre.toLowerCase());
  if (existe) {
    cerrarNuevaCat();
    mostrarCategoria(existe.id);
    return;
  }

  const nuevoId = categorias.length > 0 ? Math.max(...categorias.map((c) => Number(c.id))) + 1 : 1;

  const nuevaCat =
    tipo === "barrio"
      ? {
          id: nuevoId,
          nombre,
          icono: "🏘️",
          color: colorAleatorioBase(),
          total: 0,
          parent: "Barrios",
          tipo: "barrio"
        }
      : {
          id: nuevoId,
          nombre,
          icono: "📁",
          color: "indigo",
          total: 0,
          tipo: "normal"
        };

  categorias.push(nuevaCat);

  localStorage.setItem("baseOrden", JSON.stringify(categorias.map((c) => Number(c.id))));
  guardarStorage();
  cerrarNuevaCat();

  if (tipo === "barrio") {
    barriosAbierto = true;
  }

  renderTodo();
  mostrarCategoria(nuevaCat.id);
}



function cerrarNuevaCat() {
  if ($("inputNuevaCat")) $("inputNuevaCat").value = "";
  if ($("formNuevaCat")) $("formNuevaCat").classList.add("hidden");
  if ($("btnMostrarNuevaCat")) $("btnMostrarNuevaCat").classList.remove("hidden");
  if ($("tipoNuevaCat")) $("tipoNuevaCat").value = "normal";
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


// ===============================
// BARRIOS: PLANOS + ENCUESTAS POR BARRIO
// ===============================

function archivosPlanosDelBarrio() {
  if (!catActiva) return [];
  return planos.filter((p) => Number(p.barrio_id) === Number(catActiva.id));
}

function archivosEncuestasDelBarrio() {
  if (!catActiva) return [];
  return encuestas.filter((e) => Number(e.barrio_id) === Number(catActiva.id));
}

function archivoEsPdf(archivo) {
  if (!archivo) return false;
  return archivo.type === "application/pdf" || String(archivo.name || "").toLowerCase().endsWith(".pdf");
}


// ===============================
// GRÁFICOS DE ENCUESTAS
// ===============================

function mostrarGraficos() {
  document.body.classList.remove("modo-libro");
  vista = "graficos";
  catActiva = null;

  cerrarFormPersona();

  activarNavPrincipal("btnGraficos");
  $("panelView").classList.add("hidden");
  $("categoriaView").classList.remove("hidden");
  $("busqueda").style.display = "none";

  renderTodo();
}



function reducirImagenParaOCR(dataUrl, maxWidth = 1200) {
  return new Promise((resolve) => {
    const img = new Image();

    img.onload = () => {
      const anchoOriginal = img.naturalWidth || img.width;
      const altoOriginal = img.naturalHeight || img.height;

      if (!anchoOriginal || !altoOriginal || anchoOriginal <= maxWidth) {
        resolve(dataUrl);
        return;
      }

      const escala = maxWidth / anchoOriginal;
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(anchoOriginal * escala);
      canvas.height = Math.round(altoOriginal * escala);

      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      resolve(canvas.toDataURL("image/jpeg", 0.78));
    };

    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

function lineasRapidasPorCanvas(dataUrl) {
  // Respaldo rápido: si OCR tarda o falla, intenta sacar preguntas por patrones comunes
  // usando el nombre/archivo y deja modo manual. No bloquea la app.
  return [];
}


function preguntasEncuestaBase() {
  return [
    "Tiene obra social?",
    "Tiene las calles cortadas?",
    "Tiene luz?",
    "Tiene internet?",
    "Tiene asfalto?"
  ];
}

function limpiarPreguntaOCR(linea) {
  let texto = String(linea || "")
    .replace(/\s+/g, " ")
    .replace(/^[^¿A-Za-zÁÉÍÓÚÑáéíóúñ0-9]+/g, "")
    .trim();

  // Si OCR mezcló la pregunta con opciones "Sí / No",
  // cortamos en el primer signo de pregunta.
  const idxPregunta = texto.indexOf("?");
  if (idxPregunta !== -1) {
    texto = texto.slice(0, idxPregunta + 1);
  }

  texto = texto
    .replace(/\s*[oO0]\s+(si|sí|no)\s*[oO0]?\s*$/i, "")
    .replace(/\s+(si|sí|no)\s*$/i, "")
    .replace(/\s*[oO0]\s*$/i, "")
    .trim();

  if (texto && !texto.endsWith("?")) {
    texto += "?";
  }

  return texto;
}


function extraerPreguntasDesdeTextoOCR(texto) {
  const lineas = String(texto || "")
    .split(/\n+/)
    .map((l) => l.replace(/\s+/g, " ").trim())
    .filter(Boolean);

  const preguntas = [];

  lineas.forEach((linea) => {
    // Solo detectamos preguntas reales con signo.
    if (!linea.includes("?") && !linea.includes("¿")) return;

    let pregunta = limpiarPreguntaOCR(linea);

    const idxPregunta = pregunta.indexOf("?");
    if (idxPregunta !== -1) {
      pregunta = pregunta.slice(0, idxPregunta + 1);
    }

    if (!pregunta.endsWith("?")) pregunta += "?";

    const repetida = preguntas.some(
      (p) => normalizarPregunta(p.pregunta) === normalizarPregunta(pregunta)
    );

    if (!repetida) {
      preguntas.push({
        pregunta,
        respuesta: "si",
        detectado: true,
        metodo: "OCR texto"
      });
    }
  });

  return preguntas;
}


function obtenerLineasOCR(resultado) {
  const data = resultado?.data || {};
  const lineas = data.lines || [];

  return lineas
    .map((linea) => ({
      texto: String(linea.text || "").replace(/\s+/g, " ").trim(),
      bbox: linea.bbox || null
    }))
    .filter((l) => l.texto);
}

function obtenerPalabrasOCR(resultado) {
  const data = resultado?.data || {};
  const palabras = data.words || [];

  return palabras
    .map((w) => ({
      texto: String(w.text || "").trim(),
      bbox: w.bbox || null
    }))
    .filter((w) => w.texto && w.bbox);
}

function normalizarOCR(texto) {
  return String(texto || "")
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "");
}

function buscarOpcionesSiNoEnLinea(palabrasOCR, y) {
  if (!palabrasOCR || !palabrasOCR.length) return null;

  const cerca = palabrasOCR.filter((w) => {
    if (!w.bbox) return false;
    const cy = (w.bbox.y0 + w.bbox.y1) / 2;
    return Math.abs(cy - y) < 38;
  });

  const siWords = cerca.filter((w) => {
    const t = normalizarOCR(w.texto);
    return t === "si" || t === "s";
  });

  const noWords = cerca.filter((w) => {
    const t = normalizarOCR(w.texto);
    return t === "no" || t === "n";
  });

  if (!siWords.length || !noWords.length) return null;

  const si = siWords.sort((a, b) => a.bbox.x0 - b.bbox.x0)[0];
  const no = noWords.sort((a, b) => a.bbox.x0 - b.bbox.x0)[0];

  return { si, no };
}


function detectarPreguntaDesdeLinea(linea) {
  const textoOriginal = String(linea.texto || "").replace(/\s+/g, " ").trim();

  // IMPORTANTE:
  // Solo aceptamos líneas que tengan signo de pregunta.
  // Así no toma títulos como "Barrio Cristo Redentor" como pregunta.
  if (!textoOriginal.includes("?") && !textoOriginal.includes("¿")) {
    return null;
  }

  let pregunta = limpiarPreguntaOCR(textoOriginal);

  const idxPregunta = pregunta.indexOf("?");
  if (idxPregunta !== -1) {
    pregunta = pregunta.slice(0, idxPregunta + 1);
  }

  pregunta = pregunta
    .replace(/\s*[oO0]\s+(si|sí|no).*$/i, "?")
    .replace(/\s+(si|sí|no).*$/i, "?")
    .replace(/\?+$/, "?")
    .trim();

  if (!pregunta.endsWith("?")) pregunta += "?";

  return pregunta;
}



function cargarImagenParaCanvas(dataUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = dataUrl;
  });
}

function promedioMarcaEnZona(ctx, x, y, radio) {
  const canvas = ctx.canvas;
  const sx = Math.max(0, Math.floor(x - radio));
  const sy = Math.max(0, Math.floor(y - radio));
  const sw = Math.min(canvas.width - sx, Math.floor(radio * 2));
  const sh = Math.min(canvas.height - sy, Math.floor(radio * 2));

  if (sw <= 0 || sh <= 0) return 0;

  const data = ctx.getImageData(sx, sy, sw, sh).data;
  let puntos = 0;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    const brillo = (r + g + b) / 3;
    const saturacion = Math.max(r, g, b) - Math.min(r, g, b);

    // Detecta marca verde, azul, roja, negra, cruz o tick.
    // Evita contar el fondo blanco del círculo vacío.
    const marcaColor = saturacion > 45 && brillo < 235;
    const marcaOscura = brillo < 145;

    if (marcaColor || marcaOscura) puntos++;
  }

  return puntos / (data.length / 4);
}

async function detectarRespuestasSiNoPorImagen(dataUrl, preguntasOCR, palabrasOCR = []) {
  try {
    const img = await cargarImagenParaCanvas(dataUrl);
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth || img.width;
    canvas.height = img.naturalHeight || img.height;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    const ancho = canvas.width;
    const alto = canvas.height;

    return preguntasOCR.map((p, index) => {
      let y;

      if (p.bbox && typeof p.bbox.y0 === "number" && typeof p.bbox.y1 === "number") {
        y = (p.bbox.y0 + p.bbox.y1) / 2;
      } else {
        y = alto * (0.18 + index * 0.085);
      }

      const opciones = buscarOpcionesSiNoEnLinea(palabrasOCR, y);

      let yesX;
      let noX;

      if (opciones?.si?.bbox && opciones?.no?.bbox) {
        // En la imagen los círculos están a la izquierda del texto Sí / No.
        const siBox = opciones.si.bbox;
        const noBox = opciones.no.bbox;
        const distanciaSi = Math.max(28, Math.min(70, (noBox.x0 - siBox.x0) * 0.35));

        yesX = siBox.x0 - distanciaSi;
        noX = noBox.x0 - distanciaSi;
      } else {
        // Respaldo para formularios estándar
        yesX = ancho * 0.64;
        noX = ancho * 0.83;
      }

      const radio = Math.max(11, Math.min(28, ancho * 0.018));

      const yesScore = promedioMarcaEnZona(ctx, yesX, y, radio);
      const noScore = promedioMarcaEnZona(ctx, noX, y, radio);

      let respuesta = "si";
      let confianza = "baja";

      // Si un círculo tiene marca de color, cruz, tick o trazo oscuro,
      // su score tiene que ser mayor que el otro.
      if (yesScore > noScore * 1.10 && yesScore > 0.025) {
        respuesta = "si";
        confianza = "media";
      } else if (noScore > yesScore * 1.10 && noScore > 0.025) {
        respuesta = "no";
        confianza = "media";
      } else if (noScore > yesScore) {
        respuesta = "no";
      } else {
        respuesta = "si";
      }

      return {
        ...p,
        respuesta,
        yesScore,
        noScore,
        confianza,
        metodo: `${p.metodo || "OCR"} + detector Sí/No`
      };
    });
  } catch (error) {
    return preguntasOCR;
  }
}


function crearEncuestaManualDesdeArchivo({ nombre, nombreArchivo, tipo, dataUrl, barrio_id, barrio_nombre }) {
  encuestaOCRTrabajando = false;

  const idBarrio = barrio_id || catActiva?.id;
  const nombreBarrio =
    barrio_nombre ||
    categorias.find((c) => Number(c.id) === Number(idBarrio))?.nombre ||
    catActiva?.nombre ||
    "";

  encuestaPendienteRevision = {
    id: Date.now(),
    barrio_id: idBarrio,
    barrio_nombre: nombreBarrio,
    nombre,
    telefono: "",
    direccion: "",
    observaciones: "",
    preguntas: [
      {
        pregunta: "Escribí acá la primera pregunta?",
        respuesta: "si",
        detectado: false,
        metodo: "Manual"
      }
    ],
    archivo: dataUrl || "",
    nombreArchivo: nombreArchivo || "Encuesta manual",
    tipo: tipo || "manual",
    fecha: new Date().toLocaleDateString("es-AR"),
    ocrError: "No se detectaron preguntas automáticamente. Cargá la encuesta manualmente."
  };

  renderBarrio();
}



async function leerEncuestaDesdeImagen({ nombre, nombreArchivo, tipo, dataUrl }) {
  encuestaOCRTrabajando = true;
  renderBarrio();

  const barrioCreacionId = catActiva?.id;

  const fallbackManual = () => {
    if (!catActiva || Number(catActiva.id) !== Number(barrioCreacionId)) return;

    encuestaOCRTrabajando = false;

    crearEncuestaManualDesdeArchivo({
      nombre,
      nombreArchivo,
      tipo,
      dataUrl,
      barrio_id: barrioCreacionId,
      barrio_nombre: categorias.find((c) => Number(c.id) === Number(barrioCreacionId))?.nombre || catActiva?.nombre || ""
    });
  };

  try {
    if (tipo === "pdf") {
      fallbackManual();
      return;
    }

    if (!window.Tesseract || !window.Tesseract.recognize) {
      fallbackManual();
      return;
    }

    const dataUrlOCR = await reducirImagenParaOCR(dataUrl, 1200);

    const tareaOCR = window.Tesseract.recognize(
      dataUrlOCR,
      "spa",
      {
        logger: () => {}
      }
    );

    const timeoutOCR = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("OCR_TIMEOUT")), 6000);
    });

    const resultado = await Promise.race([tareaOCR, timeoutOCR]);

    if (!catActiva || Number(catActiva.id) !== Number(barrioCreacionId)) return;

    const textoOCR = resultado?.data?.text || "";
    const lineasOCR = obtenerLineasOCR(resultado);
    const palabrasOCR = obtenerPalabrasOCR(resultado);

    let preguntas = lineasOCR
      .map((linea) => ({
        pregunta: detectarPreguntaDesdeLinea(linea),
        bbox: linea.bbox,
        respuesta: "si",
        detectado: true,
        metodo: "OCR rápido"
      }))
      .filter((p) => p.pregunta)
      .map((p) => ({
        ...p,
        pregunta: limpiarPreguntaOCR(p.pregunta)
      }));

    if (!preguntas.length) {
      preguntas = extraerPreguntasDesdeTextoOCR(textoOCR);
    }

    if (!preguntas.length) {
      fallbackManual();
      return;
    }

    preguntas = await detectarRespuestasSiNoPorImagen(dataUrl, preguntas, palabrasOCR);

    encuestaOCRTrabajando = false;

    encuestaPendienteRevision = {
      id: Date.now(),
      barrio_id: barrioCreacionId,
      barrio_nombre: categorias.find((c) => Number(c.id) === Number(barrioCreacionId))?.nombre || catActiva?.nombre || "",
      nombre,
      telefono: "",
      direccion: "",
      observaciones: "",
      preguntas,
      archivo: dataUrl,
      nombreArchivo,
      tipo,
      textoOCR,
      fecha: new Date().toLocaleDateString("es-AR")
    };

    // Render inmediato: ya no queda en "Analizando" hasta que cambies de barrio.
    renderBarrio();
  } catch (error) {
    fallbackManual();
  } finally {
    encuestaOCRTrabajando = false;
  }
}





function iniciarRevisionEncuestaBarrio({ nombre, archivo, nombreArchivo, tipo, dataUrl }) {
  leerEncuestaDesdeImagen({ nombre, nombreArchivo, tipo, dataUrl });
}


function renderRevisionEncuestaPendiente() {
  const barrioActualId = catActiva?.id;

  if (
    encuestaPendienteRevision &&
    Number(encuestaPendienteRevision.barrio_id) !== Number(barrioActualId)
  ) {
    return "";
  }

  if (encuestaOCRTrabajando) {
    return `
      <div class="revision-encuesta-box">
        <h2>🤖 Analizando encuesta...</h2>
        <p>La aplicación está intentando leer las preguntas y detectar las marcas de Sí / No.</p>
        <div class="loader-ocr"></div>

        <div class="actions" style="margin-top:14px">
          <button class="secondary" onclick="crearEncuestaManualBarrio()">Crear encuesta manual</button>
          <button class="secondary danger" onclick="cancelarRevisionEncuesta()">Cancelar análisis</button>
        </div>
      </div>
    `;
  }

  if (!encuestaPendienteRevision) return "";

  return `
    <div class="revision-encuesta-box">
      <h2>🤖 Revisión inteligente de encuesta</h2>
      <p>
        La aplicación detectó estas preguntas y respuestas desde la imagen.
        Revisá, modificá o confirmá antes de crear los gráficos.
      </p>

      ${
        encuestaPendienteRevision.ocrError
          ? `<div class="ocr-alerta">${escapeHtml(encuestaPendienteRevision.ocrError)}</div>`
          : ""
      }

      <div class="metodo-deteccion-mini">
        Barrio: ${escapeHtml(encuestaPendienteRevision.barrio_nombre || "—")} ·
        Método: ${escapeHtml(encuestaPendienteRevision.preguntas?.[0]?.metodo || "Detección automática")}
      </div>

      <div class="revision-grid">
        ${
          encuestaPendienteRevision.preguntas.map((p, index) => `
            <div class="revision-row">
              <label>
                Pregunta ${index + 1}
                <input id="revPregunta-${index}" value="${escapeHtml(limpiarPreguntaOCR(p.pregunta))}" />
              </label>

              <label>
                Respuesta detectada
                <select id="revRespuesta-${index}">
                  <option value="si" ${p.respuesta === "si" ? "selected" : ""}>Sí</option>
                  <option value="no" ${p.respuesta === "no" ? "selected" : ""}>No</option>
                </select>
              </label>

              <button type="button" class="icon-btn danger" onclick="quitarPreguntaRevision(${index})">🗑️</button>
            </div>
          `).join("")
        }
      </div>

      <div class="actions">
        <button class="secondary" onclick="agregarPreguntaRevision()">+ Agregar pregunta</button>
        <button class="primary" onclick="confirmarRevisionEncuesta()">Confirmar</button>
        <button class="secondary" onclick="modificarApartadoRevisionEncuesta()">Modificar apartado</button>
        <button class="secondary" onclick="crearEncuestaManualActual()">Crear encuesta manual</button>
        <button class="secondary danger" onclick="cancelarRevisionEncuesta()">Cancelar</button>
      </div>
    </div>
  `;
}





function crearEncuestaManualActual() {
  if (!encuestaPendienteRevision) return;

  encuestaOCRTrabajando = false;

  encuestaPendienteRevision.preguntas = [
    {
      pregunta: "Escribí acá la pregunta?",
      respuesta: "si",
      detectado: false,
      metodo: "Manual"
    }
  ];

  encuestaPendienteRevision.ocrError = "Encuesta manual: agregá, borrá o modificá preguntas antes de confirmar.";
  renderBarrio();
}



function leerPreguntasRevision() {
  if (!encuestaPendienteRevision) return [];

  return encuestaPendienteRevision.preguntas.map((_, index) => ({
    pregunta: limpiarPreguntaOCR($(`revPregunta-${index}`)?.value.trim() || ""),
    respuesta: $(`revRespuesta-${index}`)?.value || "si",
    detectado: true
  })).filter((p) => p.pregunta);
}


function agregarPreguntaRevision() {
  if (!encuestaPendienteRevision) return;

  encuestaPendienteRevision.preguntas = leerPreguntasRevision();
  encuestaPendienteRevision.preguntas.push({
    pregunta: "Nueva pregunta?",
    respuesta: "si",
    detectado: false
  });

  renderBarrio();
}

function quitarPreguntaRevision(index) {
  if (!encuestaPendienteRevision) return;

  encuestaPendienteRevision.preguntas = leerPreguntasRevision();
  encuestaPendienteRevision.preguntas.splice(index, 1);

  renderBarrio();
}

function modificarApartadoRevisionEncuesta() {
  if (!encuestaPendienteRevision) return;

  encuestaPendienteRevision.preguntas = leerPreguntasRevision();
  alert("Ahora podés modificar las preguntas y respuestas en la revisión.");
}

function cancelarRevisionEncuesta() {
  encuestaOCRTrabajando = false;

  if (
    encuestaPendienteRevision &&
    catActiva &&
    Number(encuestaPendienteRevision.barrio_id) !== Number(catActiva.id)
  ) {
    renderBarrio();
    return;
  }

  encuestaPendienteRevision = null;
  renderBarrio();
}



function confirmarRevisionEncuesta() {
  if (!encuestaPendienteRevision) return;

  if (
    catActiva &&
    Number(encuestaPendienteRevision.barrio_id) !== Number(catActiva.id)
  ) {
    alert("Esta encuesta pertenece a otro barrio. Volvé al barrio donde la estabas cargando para confirmarla.");
    return;
  }

  encuestaPendienteRevision.preguntas = leerPreguntasRevision();

  if (!encuestaPendienteRevision.preguntas.length) {
    alert("Agregá al menos una pregunta para confirmar la encuesta.");
    return;
  }

  if (encuestaPendienteRevision.modoEdicion && encuestaPendienteRevision.editandoTipo === "encuesta") {
    const index = encuestas.findIndex((e) => Number(e.id) === Number(encuestaPendienteRevision.editandoId));

    if (index !== -1) {
      encuestas[index] = {
        ...encuestas[index],
        ...encuestaPendienteRevision,
        respuestas_detectadas: encuestaPendienteRevision.preguntas,
        modoEdicion: false,
        editandoId: null,
        editandoTipo: null,
        ocrError: ""
      };
    }
  } else {
    encuestas.push({
      ...encuestaPendienteRevision,
      respuestas_detectadas: encuestaPendienteRevision.preguntas
    });
  }

  encuestaPendienteRevision = null;
  encuestaOCRTrabajando = false;

  guardarStorage();
  renderBarrio();
  alert("Encuesta guardada. Los gráficos se actualizaron automáticamente.");
}



function normalizarPregunta(texto) {
  return String(texto || "")
    .trim()
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[¿?]/g, "")
    .replace(/\s+/g, " ");
}

function obtenerRespuestasEncuestas() {
  const filas = [];

  encuestas.forEach((encuesta) => {
    const respuestas = encuesta.respuestas_detectadas || encuesta.preguntas || [];

    respuestas.forEach((r) => {
      if (!r || !r.pregunta) return;

      filas.push({
        barrio_id: encuesta.barrio_id,
        barrio_nombre: encuesta.barrio_nombre || "Sin barrio",
        encuesta_id: encuesta.id,
        encuesta_nombre: encuesta.nombre || "Encuesta",
        familia: encuesta.nombre || "Sin nombre",
        archivo: encuesta.nombreArchivo || "",
        pregunta: r.pregunta,
        preguntaKey: normalizarPregunta(r.pregunta),
        respuesta: String(r.respuesta || "").toLowerCase() === "no" ? "no" : "si"
      });
    });
  });

  return filas;
}


function agruparGraficosPorPregunta() {
  const filas = obtenerRespuestasEncuestas();
  const grupos = {};

  filas.forEach((fila) => {
    if (!grupos[fila.preguntaKey]) {
      grupos[fila.preguntaKey] = {
        pregunta: fila.pregunta,
        si: 0,
        no: 0,
        barrios: {},
        detalleFamilias: {}
      };
    }

    grupos[fila.preguntaKey][fila.respuesta]++;

    if (!grupos[fila.preguntaKey].barrios[fila.barrio_nombre]) {
      grupos[fila.preguntaKey].barrios[fila.barrio_nombre] = { si: 0, no: 0 };
    }

    if (!grupos[fila.preguntaKey].detalleFamilias[fila.barrio_nombre]) {
      grupos[fila.preguntaKey].detalleFamilias[fila.barrio_nombre] = {
        si: [],
        no: []
      };
    }

    grupos[fila.preguntaKey].barrios[fila.barrio_nombre][fila.respuesta]++;

    grupos[fila.preguntaKey].detalleFamilias[fila.barrio_nombre][fila.respuesta].push({
      nombre: fila.familia || fila.encuesta_nombre || "Sin nombre",
      encuesta: fila.encuesta_nombre || "",
      archivo: fila.archivo || ""
    });
  });

  return Object.values(grupos);
}





function svgGraficoTortaPDF(si, no) {
  const total = Number(si || 0) + Number(no || 0);
  const pctSi = total ? Number(si || 0) / total : 0;
  const pctNo = total ? Number(no || 0) / total : 0;

  const radio = 70;
  const cx = 90;
  const cy = 90;
  const circ = 2 * Math.PI * radio;
  const siLen = circ * pctSi;
  const noLen = circ * pctNo;

  // Se usan stroke-dasharray en SVG, imprime bien en Chrome y en PDF aunque no se activen fondos.
  return `
    <svg class="grafico-svg-pdf" width="190" height="190" viewBox="0 0 180 180" xmlns="http://www.w3.org/2000/svg">
      <circle cx="${cx}" cy="${cy}" r="${radio + 10}" fill="#f8fafc" stroke="#e5e7eb" stroke-width="2"></circle>
      <circle cx="${cx}" cy="${cy}" r="${radio}" fill="#ffffff" stroke="#e5e7eb" stroke-width="12"></circle>

      ${
        total === 0
          ? `<circle cx="${cx}" cy="${cy}" r="${radio}" fill="none" stroke="#e5e7eb" stroke-width="34"></circle>`
          : `
            <circle cx="${cx}" cy="${cy}" r="${radio}" fill="none"
              stroke="#ef4444" stroke-width="34"
              stroke-dasharray="${noLen} ${circ - noLen}"
              stroke-dashoffset="0"
              transform="rotate(-90 ${cx} ${cy})"
              stroke-linecap="butt"></circle>

            <circle cx="${cx}" cy="${cy}" r="${radio}" fill="none"
              stroke="#22c55e" stroke-width="34"
              stroke-dasharray="${siLen} ${circ - siLen}"
              stroke-dashoffset="${-noLen}"
              transform="rotate(-90 ${cx} ${cy})"
              stroke-linecap="butt"></circle>
          `
      }

      <circle cx="${cx}" cy="${cy}" r="43" fill="#ffffff" stroke="#e5e7eb" stroke-width="2"></circle>
      <text x="${cx}" y="${cy - 4}" text-anchor="middle" font-family="Arial" font-size="16" font-weight="800" fill="#111827">${Math.round(pctSi * 100)}%</text>
      <text x="${cx}" y="${cy + 18}" text-anchor="middle" font-family="Arial" font-size="12" fill="#374151">Sí</text>
    </svg>
  `;
}


function htmlGraficoPregunta(grupo) {
  const total = grupo.si + grupo.no;
  const porcentajeSi = total ? Math.round((grupo.si / total) * 100) : 0;
  const porcentajeNo = 100 - porcentajeSi;

  const filasBarrios = Object.entries(grupo.barrios).map(([barrio, datos]) => {
    const totalBarrio = datos.si + datos.no;
    const pctSiBarrio = totalBarrio ? Math.round((datos.si / totalBarrio) * 100) : 0;
    const pctNoBarrio = totalBarrio ? Math.round((datos.no / totalBarrio) * 100) : 0;

    const detalle = grupo.detalleFamilias?.[barrio] || { si: [], no: [] };

    const familiasSi = detalle.si.length
      ? detalle.si.map((f) => `<li>${escapeHtml(f.nombre)}${f.archivo ? ` <small>(${escapeHtml(f.archivo)})</small>` : ""}</li>`).join("")
      : `<li><em>Sin familias.</em></li>`;

    const familiasNo = detalle.no.length
      ? detalle.no.map((f) => `<li>${escapeHtml(f.nombre)}${f.archivo ? ` <small>(${escapeHtml(f.archivo)})</small>` : ""}</li>`).join("")
      : `<li><em>Sin familias.</em></li>`;

    return `
      <tr>
        <td>${escapeHtml(barrio)}</td>
        <td>${datos.si}</td>
        <td>${datos.no}</td>
        <td>${pctSiBarrio}%</td>
        <td>${pctNoBarrio}%</td>
      </tr>

      <tr class="familias-pdf-row">
        <td colspan="5">
          <div class="familias-pdf-grid">
            <div>
              <h4>Familias que votaron Sí</h4>
              <ul>${familiasSi}</ul>
            </div>
            <div>
              <h4>Familias que votaron No</h4>
              <ul>${familiasNo}</ul>
            </div>
          </div>
        </td>
      </tr>
    `;
  }).join("");

  return `
    <div class="grafico-pdf-card">
      <h1>${escapeHtml(grupo.pregunta)}</h1>

      <div class="grafico-pdf-resumen">
        ${svgGraficoTortaPDF(grupo.si, grupo.no)}

        <div class="grafico-pdf-numeros">
          <p><span class="leyenda-cuadro leyenda-si"></span><b>Sí:</b> ${grupo.si} (${porcentajeSi}%)</p>
          <p><span class="leyenda-cuadro leyenda-no"></span><b>No:</b> ${grupo.no} (${porcentajeNo}%)</p>
          <p><b>Total de respuestas:</b> ${total}</p>
        </div>
      </div>

      <h2>Detalle por barrio</h2>

      <table>
        <thead>
          <tr>
            <th>Barrio</th>
            <th>Sí</th>
            <th>No</th>
            <th>% Sí</th>
            <th>% No</th>
          </tr>
        </thead>
        <tbody>
          ${filasBarrios || `<tr><td colspan="5">Sin detalle por barrio.</td></tr>`}
        </tbody>
      </table>
    </div>
  `;
}



function estilosGraficosPDF() {
  return `
    <style>
      * {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }

      .grafico-pdf-card {
        page-break-inside: avoid;
        border: 1px solid #e5e7eb;
        border-radius: 16px;
        padding: 22px;
        margin-bottom: 22px;
        background: #ffffff;
      }

      .grafico-pdf-card h1 {
        font-size: 24px;
        margin: 0 0 18px;
        color: #111827;
      }

      .grafico-pdf-card h2 {
        font-size: 18px;
        margin: 20px 0 10px;
        color: #111827;
      }

      .grafico-pdf-resumen {
        display: flex;
        align-items: center;
        gap: 28px;
        margin: 12px 0 18px;
      }

      .grafico-svg-pdf {
        width: 190px;
        height: 190px;
        flex-shrink: 0;
      }

      .grafico-pdf-numeros p {
        font-size: 17px;
        margin: 8px 0;
      }

      .leyenda-cuadro {
        display: inline-block;
        width: 14px;
        height: 14px;
        border-radius: 3px;
        margin-right: 7px;
        vertical-align: -2px;
        border: 1px solid #11182722;
      }

      .leyenda-si {
        background: #22c55e;
      }

      .leyenda-no {
        background: #ef4444;
      }

      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 8px;
      }

      th,
      td {
        border: 1px solid #d1d5db;
        padding: 10px;
        text-align: left;
        font-size: 13px;
        vertical-align: top;
      }

      th {
        background: #eef2ff;
        color: #111827;
      }

      .familias-pdf-row td {
        background: #f8fafc;
      }

      .familias-pdf-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 18px;
      }

      .familias-pdf-grid h4 {
        margin: 0 0 6px;
        font-size: 13px;
        color: #111827;
      }

      .familias-pdf-grid ul {
        margin: 0;
        padding-left: 18px;
      }

      .familias-pdf-grid li {
        margin: 3px 0;
      }

      .familias-pdf-grid small {
        color: #6b7280;
      }

      @media print {
        .familias-pdf-row,
        .grafico-pdf-card {
          page-break-inside: avoid;
          break-inside: avoid;
        }
      }
    </style>
  `;
}



async function descargarGraficoPregunta(key) {
  const grupos = agruparGraficosPorPregunta();
  const grupo = grupos.find((g) => normalizarPregunta(g.pregunta) === key);

  if (!grupo) {
    alert("No se encontró el gráfico.");
    return;
  }

  await descargarHTML(
    `grafico-${grupo.pregunta}`,
    `
      ${estilosGraficosPDF()}
      ${htmlGraficoPregunta(grupo)}
    `
  );
}

async function descargarTodosGraficos() {
  const grupos = agruparGraficosPorPregunta();

  if (!grupos.length) {
    alert("No hay gráficos para descargar.");
    return;
  }

  await descargarHTML(
    "todos-los-graficos-encuestas",
    `
      ${estilosGraficosPDF()}
      <h1>Gráficos de encuestas</h1>
      <p>Exportado el ${new Date().toLocaleString("es-AR")}</p>
      ${grupos.map((grupo) => htmlGraficoPregunta(grupo)).join("")}
    `
  );
}


function renderGraficoTortaSiNo(grupo) {
  const total = grupo.si + grupo.no;
  const porcentajeSi = total ? Math.round((grupo.si / total) * 100) : 0;
  const porcentajeNo = 100 - porcentajeSi;
  const key = normalizarPregunta(grupo.pregunta);

  return `
    <div class="grafico-card">
      <div class="grafico-card-head">
        <h3>${escapeHtml(grupo.pregunta)}</h3>
        <button class="secondary mini-download" onclick="descargarGraficoPregunta('${key}')">⬇️ PDF</button>
      </div>

      <div class="grafico-body">
        <div class="pie-chart" style="--si:${porcentajeSi};"></div>

        <div class="grafico-info">
          <p><b>Sí:</b> ${grupo.si} (${porcentajeSi}%)</p>
          <p><b>No:</b> ${grupo.no} (${porcentajeNo}%)</p>
          <p><b>Total:</b> ${total}</p>
        </div>
      </div>

      <div class="grafico-barrios">
        <h4>Detalle por barrio</h4>
        ${
          Object.entries(grupo.barrios).map(([barrio, datos]) => `
            <div class="grafico-barrio-row">
              <span>${escapeHtml(barrio)}</span>
              <b> Sí ${datos.si} / No ${datos.no}</b>
            </div>
          `).join("")
        }
      </div>
    </div>
  `;
}


function renderGraficos() {
  $("categoriaHeader").className = "cat-header bg-indigo";
  $("categoriaHeader").innerHTML = `
    <div class="left">
      <div class="emoji">📊</div>
      <div>
        <h2>Gráficos de encuestas</h2>
        <p>Los gráficos se generan solos con las preguntas confirmadas en las encuestas de cada barrio</p>
      </div>
    </div>

    <div class="cat-actions">
      <button onclick="renderGraficos()">🔄 Actualizar</button>
      <button onclick="descargarTodosGraficos()">⬇️ Descargar todos PDF</button>
    </div>
  `;

  const grupos = agruparGraficosPorPregunta();

  $("personasLista").innerHTML = `
    <div class="graficos-layout">
      ${
        grupos.length
          ? grupos.map((grupo) => renderGraficoTortaSiNo(grupo)).join("")
          : `
            <div class="empty">
              <div style="font-size:54px">📊</div>
              <p>No hay gráficos todavía.</p>
              <small>Subí una encuesta en un barrio, confirmá las preguntas y se crearán los gráficos automáticamente.</small>
            </div>
          `
      }
    </div>
  `;
}



function renderBarrio() {
  cerrarFormPersona();
  $("formPersona").classList.add("hidden");
  $("busqueda").style.display = "none";

  const planosBarrio = archivosPlanosDelBarrio();
  const encuestasBarrio = archivosEncuestasDelBarrio();

  $("categoriaHeader").className = `cat-header bg-${catActiva.color}`;
  $("categoriaHeader").innerHTML = `
    <div class="left">
      <div class="emoji">${catActiva.icono}</div>
      <div>
        <h2>${catActiva.nombre}</h2>
        <p>${planosBarrio.length} plano${planosBarrio.length !== 1 ? "s" : ""} y ${encuestasBarrio.length} encuesta${encuestasBarrio.length !== 1 ? "s" : ""}</p>
      </div>
    </div>

    <div class="cat-actions">
      <button onclick="imprimirBarrio()">🖨️ Imprimir barrio</button>
      <button onclick="correoBarrio()">📧 Correo barrio</button>
      <button onclick="descargarBarrio()">⬇️ Descargar PDF</button>
    </div>
  `;

  $("personasLista").innerHTML = `
    <div class="barrio-doble-layout">

      <section class="barrio-columna barrio-planos">
        <div class="barrio-section-head">
          <h2>🗺️ Planos</h2>
          <input id="buscarPlanoBarrio" class="search" placeholder="🔍 Buscar plano..." oninput="renderListaPlanosBarrio()" />
        </div>

        <div class="form-card compact">
          <div class="grid-form una-columna">
            <label>
              Nombre del plano *
              <input id="barrioPlanoNombre" placeholder="Ej: Plano manzana 12" />
            </label>

            <label>
              Imagen o PDF del plano *
              <input id="barrioPlanoArchivo" type="file" accept="image/*,.pdf,application/pdf" />
            </label>
          </div>

          <div class="actions">
            <button class="primary" onclick="guardarPlanoBarrio()">Guardar plano</button>
          </div>
        </div>

        <div id="listaPlanosBarrio"></div>
      </section>

      <div class="barrio-separador"></div>

      <section class="barrio-columna barrio-encuestas">
        <div class="barrio-section-head">
          <h2>📝 Encuestas</h2>
          <input id="buscarEncuestaBarrio" class="search" placeholder="🔍 Buscar encuesta..." oninput="renderListaEncuestasBarrio()" />
        </div>

        <div class="form-card compact">
          <div class="grid-form una-columna">
            <label>
              Nombre de la encuesta *
              <input id="barrioEncuestaNombre" placeholder="Ej: Encuesta familia Pérez" />
            </label>

            <label>
              Foto o PDF de la encuesta *
              <input id="barrioEncuestaArchivo" type="file" accept="image/*,.pdf,application/pdf" />
            </label>
          </div>

          <div class="actions">
            <button class="primary" onclick="guardarEncuestaBarrio()">Guardar encuesta</button>
          <button class="secondary" onclick="crearEncuestaManualBarrio()">Crear encuesta manual</button>
          </div>
        </div>

        ${renderRevisionEncuestaPendiente()}

        <div id="listaEncuestasBarrio"></div>
      </section>

    </div>
  `;

  renderListaPlanosBarrio();
  renderListaEncuestasBarrio();
}

function renderListaPlanosBarrio() {
  const cont = $("listaPlanosBarrio");
  if (!cont || !catActiva) return;

  const texto = String($("buscarPlanoBarrio")?.value || "").toLowerCase();

  const lista = archivosPlanosDelBarrio()
    .filter((plano) =>
      !texto ||
      String(plano.nombre || "").toLowerCase().includes(texto) ||
      String(plano.nombreArchivo || "").toLowerCase().includes(texto)
    )
    .sort((a, b) => Number(b.id) - Number(a.id));

  cont.innerHTML = lista.length
    ? lista.map((plano) => renderArchivoBarrioCard(plano, "plano")).join("")
    : `<div class="empty barrio-empty"><p>No hay planos cargados en este barrio.</p></div>`;
}

function renderListaEncuestasBarrio() {
  const cont = $("listaEncuestasBarrio");
  if (!cont || !catActiva) return;

  const texto = String($("buscarEncuestaBarrio")?.value || "").toLowerCase();

  const lista = archivosEncuestasDelBarrio()
    .filter((encuesta) =>
      !texto ||
      String(encuesta.nombre || "").toLowerCase().includes(texto) ||
      String(encuesta.nombreArchivo || "").toLowerCase().includes(texto)
    )
    .sort((a, b) => Number(b.id) - Number(a.id));

  cont.innerHTML = lista.length
    ? lista.map((encuesta) => renderArchivoBarrioCard(encuesta, "encuesta")).join("")
    : `<div class="empty barrio-empty"><p>No hay encuestas cargadas en este barrio.</p></div>`;
}

function renderArchivoBarrioCard(item, tipo) {
  const archivo = item.archivo || item.imagen || "";
  const esPdf = item.tipo === "pdf";
  const titulo = tipo === "plano" ? "Plano" : "Encuesta";
  const respuestas = item.respuestas_detectadas || item.preguntas || [];

  return `
    <div class="barrio-archivo-card">
      <div class="persona-top">
        <div>
          <h3>${tipo === "plano" ? "🗺️" : "📝"} ${escapeHtml(item.nombre)}</h3>
          <p>📄 ${escapeHtml(item.nombreArchivo || "Archivo cargado")}</p>
          <p>📅 ${escapeHtml(item.fecha || "—")}</p>
        </div>

        <div class="registro-actions">
          <button class="icon-btn" onclick="editarArchivoBarrio(${item.id}, '${tipo}')">✏️</button>
          <button class="icon-btn" onclick="imprimirArchivoBarrio(${item.id}, '${tipo}')">🖨️</button>
          <button class="icon-btn" onclick="correoArchivoBarrio(${item.id}, '${tipo}')">📧</button>
          <button class="icon-btn" onclick="descargarArchivoBarrio(${item.id}, '${tipo}')">⬇️</button>
          <button class="icon-btn danger" onclick="eliminarArchivoBarrio(${item.id}, '${tipo}')">🗑️</button>
        </div>
      </div>

      ${
        tipo === "encuesta" && respuestas.length
          ? `
            <div class="respuestas-detectadas-mini">
              <b>Preguntas confirmadas:</b>
              ${respuestas.map((r) => `
                <div>
                  ${escapeHtml(r.pregunta)}:
                  <strong class="${r.respuesta === "si" ? "resp-si" : "resp-no"}">${r.respuesta === "si" ? "Sí" : "No"}</strong>
                </div>
              `).join("")}
            </div>
          `
          : ""
      }

      <div class="barrio-preview">
        ${
          esPdf
            ? `<iframe src="${archivo}" title="${titulo} PDF"></iframe>`
            : `<img src="${archivo}" alt="${escapeHtml(item.nombre)}" />`
        }
      </div>
    </div>
  `;
}


function guardarPlanoBarrio() {
  if (!catActiva || catActiva.tipo !== "barrio") return;

  const nombre = $("barrioPlanoNombre").value.trim();
  const archivo = $("barrioPlanoArchivo").files[0];

  if (!nombre || !archivo) {
    alert("Completá el nombre y seleccioná una imagen o PDF del plano.");
    return;
  }

  const pesoMaximoMB = 2;
  const pesoMB = archivo.size / 1024 / 1024;

  if (pesoMB > pesoMaximoMB) {
    alert(`El archivo es muy pesado. Usá archivos de hasta ${pesoMaximoMB} MB.`);
    return;
  }

  const esPdf = archivoEsPdf(archivo);
  const reader = new FileReader();

  reader.onload = function (e) {
    planos.push({
      id: Date.now(),
      barrio_id: catActiva.id,
      barrio_nombre: catActiva.nombre,
      nombre,
      observaciones: "",
      archivo: e.target.result,
      nombreArchivo: archivo.name,
      tipo: esPdf ? "pdf" : "imagen",
      estado: "pendiente",
      fecha: new Date().toLocaleDateString("es-AR")
    });

    guardarStorage();
    renderBarrio();
  };

  reader.readAsDataURL(archivo);
}


function crearEncuestaManualBarrio() {
  if (!catActiva || catActiva.tipo !== "barrio") return;

  const nombreInput = $("barrioEncuestaNombre");
  const archivoInput = $("barrioEncuestaArchivo");

  const nombre =
    nombreInput && nombreInput.value.trim()
      ? nombreInput.value.trim()
      : prompt("Nombre de la encuesta manual:", "Encuesta manual");

  if (!nombre || !nombre.trim()) return;

  const archivo = archivoInput && archivoInput.files ? archivoInput.files[0] : null;

  if (!archivo) {
    crearEncuestaManualDesdeArchivo({
      nombre: nombre.trim(),
      nombreArchivo: "Sin imagen",
      tipo: "manual",
      dataUrl: ""
    });
    return;
  }

  const pesoMaximoMB = 2;
  const pesoMB = archivo.size / 1024 / 1024;

  if (pesoMB > pesoMaximoMB) {
    alert(`El archivo es muy pesado. Usá archivos de hasta ${pesoMaximoMB} MB.`);
    return;
  }

  const reader = new FileReader();
  const esPdf = archivoEsPdf(archivo);

  reader.onload = function (e) {
    crearEncuestaManualDesdeArchivo({
      nombre: nombre.trim(),
      nombreArchivo: archivo.name,
      tipo: esPdf ? "pdf" : "imagen",
      dataUrl: e.target.result
    });
  };

  reader.readAsDataURL(archivo);
}


function guardarEncuestaBarrio() {
  if (!catActiva || catActiva.tipo !== "barrio") return;

  const nombre = $("barrioEncuestaNombre").value.trim();
  const archivo = $("barrioEncuestaArchivo").files[0];

  if (!nombre || !archivo) {
    alert("Completá el nombre y seleccioná una foto o PDF de la encuesta.");
    return;
  }

  const pesoMaximoMB = 2;
  const pesoMB = archivo.size / 1024 / 1024;

  if (pesoMB > pesoMaximoMB) {
    alert(`El archivo es muy pesado. Usá archivos de hasta ${pesoMaximoMB} MB.`);
    return;
  }

  const esPdf = archivoEsPdf(archivo);
  const reader = new FileReader();

  reader.onload = function (e) {
    iniciarRevisionEncuestaBarrio({
      nombre,
      archivo,
      nombreArchivo: archivo.name,
      tipo: esPdf ? "pdf" : "imagen",
      dataUrl: e.target.result
    });
  };

  reader.readAsDataURL(archivo);
}


function buscarArchivoBarrio(id, tipo) {
  const lista = tipo === "plano" ? planos : encuestas;
  return lista.find((x) => Number(x.id) === Number(id));
}


function seleccionarArchivoWeb(accept = "image/*,.pdf") {
  return new Promise((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = accept;
    input.style.display = "none";

    input.onchange = () => {
      const archivo = input.files && input.files[0] ? input.files[0] : null;
      input.remove();
      resolve(archivo);
    };

    document.body.appendChild(input);
    input.click();
  });
}

function leerArchivoComoDataUrl(archivo) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = reject;

    reader.readAsDataURL(archivo);
  });
}

async function editarArchivoBarrio(id, tipo) {
  const item = buscarArchivoBarrio(id, tipo);
  if (!item) return;

  const nuevoNombre = prompt(`Editar nombre del ${tipo}:`, item.nombre || "");

  if (nuevoNombre === null) return;

  if (nuevoNombre.trim()) {
    item.nombre = nuevoNombre.trim();
  }

  if (tipo === "encuesta") {
    const editarPreguntas = confirm("¿Querés editar las preguntas y respuestas de esta encuesta?");

    if (editarPreguntas) {
      encuestaPendienteRevision = {
        ...item,
        preguntas: (item.respuestas_detectadas || item.preguntas || []).map((r) => ({
          pregunta: r.pregunta || "Pregunta?",
          respuesta: r.respuesta === "no" ? "no" : "si",
          detectado: false,
          metodo: "Edición manual"
        })),
        modoEdicion: true,
        editandoId: item.id,
        editandoTipo: "encuesta",
        ocrError: "Editando encuesta existente. Modificá las preguntas y confirmá para guardar cambios."
      };

      if (!encuestaPendienteRevision.preguntas.length) {
        encuestaPendienteRevision.preguntas = [
          {
            pregunta: "Escribí acá la pregunta?",
            respuesta: "si",
            detectado: false,
            metodo: "Edición manual"
          }
        ];
      }

      guardarStorage();
      renderBarrio();
      return;
    }
  }

  const reemplazar = confirm(`¿Querés reemplazar la imagen/PDF del ${tipo}?`);

  if (reemplazar) {
    const archivo = await seleccionarArchivoWeb("image/*,.pdf");

    if (archivo) {
      const pesoMaximoMB = 2;
      const pesoMB = archivo.size / 1024 / 1024;

      if (pesoMB > pesoMaximoMB) {
        alert(`El archivo es muy pesado. Usá archivos de hasta ${pesoMaximoMB} MB.`);
        return;
      }

      const dataUrl = await leerArchivoComoDataUrl(archivo);
      item.archivo = dataUrl;
      item.imagen = dataUrl;
      item.nombreArchivo = archivo.name;
      item.tipo = archivoEsPdf(archivo) ? "pdf" : "imagen";
    }
  }

  guardarStorage();
  renderBarrio();
}


function eliminarArchivoBarrio(id, tipo) {
  if (!confirm(`¿Eliminar este ${tipo}?`)) return;

  if (tipo === "plano") {
    planos = planos.filter((x) => Number(x.id) !== Number(id));
  } else {
    encuestas = encuestas.filter((x) => Number(x.id) !== Number(id));
  }

  guardarStorage();
  renderBarrio();
}

function imprimirArchivoBarrio(id, tipo) {
  const item = buscarArchivoBarrio(id, tipo);
  if (!item) return;

  const archivo = item.archivo || item.imagen || "";
  const esPdf = item.tipo === "pdf";

  imprimirHTML(`${tipo} - ${item.nombre}`, `
    <h1>${escapeHtml(item.nombre)}</h1>
    <p><b>Barrio:</b> ${escapeHtml(item.barrio_nombre || catActiva?.nombre || "")}</p>
    <p><b>Archivo:</b> ${escapeHtml(item.nombreArchivo || "Archivo cargado")}</p>
    ${
      esPdf
        ? `<iframe src="${archivo}"></iframe>`
        : `<img src="${archivo}" />`
    }
  `);
}

function correoArchivoBarrio(id, tipo) {
  const item = buscarArchivoBarrio(id, tipo);
  if (!item) return;

  const asunto = `${tipo === "plano" ? "Plano" : "Encuesta"} - ${item.nombre}`;
  const cuerpo = `
${tipo === "plano" ? "Plano" : "Encuesta"}: ${item.nombre}
Barrio: ${item.barrio_nombre || catActiva?.nombre || ""}
Archivo: ${item.nombreArchivo || "Archivo cargado"}
Fecha: ${item.fecha || ""}
`;

  const html = cuerpoHtmlCorreo(asunto, `
    <div class="card">
      <h2>${escapeHtml(item.nombre)}</h2>
      <p><b>Barrio:</b> ${escapeHtml(item.barrio_nombre || catActiva?.nombre || "")}</p>
      <p><b>Archivo:</b> ${escapeHtml(item.nombreArchivo || "Archivo cargado")}</p>
    </div>
  `);

  abrirCorreoComputadora({
    asunto,
    cuerpo,
    html,
    adjuntos: [crearAdjuntoDesdeDataUrl(item.nombreArchivo || item.nombre, item.archivo || item.imagen)]
  });
}


function htmlArchivoBarrioPDF(item, tipo) {
  const archivo = item.archivo || item.imagen || "";
  const titulo = tipo === "plano" ? "Plano" : "Encuesta";
  const respuestas = item.respuestas_detectadas || item.preguntas || [];

  return `
    <h3>${escapeHtml(titulo)}: ${escapeHtml(item.nombre || "")}</h3>
    <p><b>Barrio:</b> ${escapeHtml(item.barrio_nombre || catActiva?.nombre || "")}</p>
    <p><b>Archivo:</b> ${escapeHtml(item.nombreArchivo || "")}</p>

    ${
      tipo === "encuesta" && respuestas.length
        ? `
          <h4>Preguntas confirmadas</h4>
          <table>
            <thead>
              <tr>
                <th>Pregunta</th>
                <th>Respuesta</th>
              </tr>
            </thead>
            <tbody>
              ${respuestas.map((r) => `
                <tr>
                  <td>${escapeHtml(r.pregunta || "")}</td>
                  <td>${r.respuesta === "no" ? "No" : "Sí"}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        `
        : ""
    }

    ${
      archivo
        ? (
          item.tipo === "pdf"
            ? `<iframe src="${archivo}"></iframe>`
            : `<img src="${archivo}" alt="${escapeHtml(item.nombre || titulo)}" />`
        )
        : `<p>Sin imagen cargada.</p>`
    }
  `;
}


function descargarArchivoBarrio(id, tipo) {
  const item = buscarArchivoBarrio(id, tipo);
  if (!item) return;

  descargarHTML(`${tipo}-${item.nombre}`, htmlArchivoBarrioPDF(item, tipo));
}


function imprimirBarrio() {
  if (!catActiva) return;

  const planosBarrio = archivosPlanosDelBarrio();
  const encuestasBarrio = archivosEncuestasDelBarrio();

  imprimirHTML(`Barrio - ${catActiva.nombre}`, `
    <h1>${escapeHtml(catActiva.nombre)}</h1>
    <h2>Planos</h2>
    ${
      planosBarrio.length
        ? planosBarrio.map((p) => `<div class="card">${htmlArchivoBarrioPDF(p, "plano")}</div>`).join("")
        : `<p>Sin planos.</p>`
    }
    <h2>Encuestas</h2>
    ${
      encuestasBarrio.length
        ? encuestasBarrio.map((e) => `<div class="card">${htmlArchivoBarrioPDF(e, "encuesta")}</div>`).join("")
        : `<p>Sin encuestas.</p>`
    }
  `);
}


function correoBarrio() {
  if (!catActiva) return;

  const planosBarrio = archivosPlanosDelBarrio();
  const encuestasBarrio = archivosEncuestasDelBarrio();

  const cuerpo = `
Barrio: ${catActiva.nombre}

Planos:
${planosBarrio.map((p, i) => `${i + 1}) ${p.nombre} - ${p.nombreArchivo || ""}`).join("\n") || "Sin planos."}

Encuestas:
${encuestasBarrio.map((e, i) => `${i + 1}) ${e.nombre} - ${e.nombreArchivo || ""}`).join("\n") || "Sin encuestas."}
`;

  abrirCorreo(`Barrio - ${catActiva.nombre}`, cuerpo);
}

function descargarBarrio() {
  if (!catActiva) return;

  const planosBarrio = archivosPlanosDelBarrio();
  const encuestasBarrio = archivosEncuestasDelBarrio();

  descargarHTML(`barrio-${catActiva.nombre}`, `
    <h1>${escapeHtml(catActiva.nombre)}</h1>
    <h2>Planos</h2>
    ${
      planosBarrio.length
        ? planosBarrio.map((p) => `<div class="card">${htmlArchivoBarrioPDF(p, "plano")}</div>`).join("")
        : `<p>Sin planos.</p>`
    }
    <h2>Encuestas</h2>
    ${
      encuestasBarrio.length
        ? encuestasBarrio.map((e) => `<div class="card">${htmlArchivoBarrioPDF(e, "encuesta")}</div>`).join("")
        : `<p>Sin encuestas.</p>`
    }
  `);
}



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
      <button onclick="descargarBase()">⬇️ Descargar PDF</button>
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
        <button class="icon-btn" onclick="descargarPlano(${plano.id})">⬇️ PDF</button>
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
      <button onclick="descargarBase()">⬇️ Descargar PDF</button>
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
        <input placeholder="Ej: ¿Agrega una encuesta?" value="${escapeHtml(limpiarPreguntaOCR(p.pregunta))}" oninput="actualizarPregunta(${p.id}, this.value)" />
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
      <button onclick="descargarAgendas()">⬇️ Descargar PDF</button>
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
            <button class="icon-btn" onclick="descargarAgenda(${a.id})">⬇️ PDF</button>
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
      <button onclick="descargarNotasCalcular()">⬇️ Descargar PDF</button>
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
            <input id="libroColor" type="color" value="${libroColorLapiz}" oninput="cambiarColorLapiz(this.value)" onchange="cambiarColorLapiz(this.value)" />
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



























































function cambiarColorLapiz(color) {
  libroColorLapiz = colorCssSeguro(color);

  const input = $("libroColor");
  if (input) input.value = libroColorLapiz;

  const editor = obtenerEditorLibroActual() || libroEditorActivo;
  if (editor) {
    libroEditorActivo = editor;
    editor.style.setProperty("--color-lapiz-activo", libroColorLapiz);
    editor.style.caretColor = libroColorLapiz;

    try {
      editor.focus();
      restaurarRangoLibro();
      document.execCommand("styleWithCSS", false, true);
      document.execCommand("foreColor", false, libroColorLapiz);
    } catch (e) {}
  }

  guardarRangoLibro();
}

function colorCssSeguro(color) {
  const valor = String(color || "").trim();
  return /^#[0-9a-fA-F]{6}$/.test(valor) ? valor : "#111827";
}

function aplicarColorLapizAlEditor(editor) {
  if (!editor) return;

  editor.style.setProperty("--color-lapiz-activo", colorCssSeguro(libroColorLapiz));
  editor.style.caretColor = colorCssSeguro(libroColorLapiz);

  try {
    document.execCommand("styleWithCSS", false, true);
    document.execCommand("foreColor", false, colorCssSeguro(libroColorLapiz));
  } catch (e) {}
}












function textoLibroSeguro(texto) {
  return String(texto || "");
}

function crearContenidoTextoLibro(texto) {
  // Usamos texto normal. El CSS "break-spaces" conserva 2+ espacios
  // y permite bajar de renglón sin empujar la página derecha.
  return document.createTextNode(String(texto || ""));
}


function insertarTextoColorLapiz(texto) {
  const color = colorCssSeguro(libroColorLapiz);
  const span = document.createElement("span");

  span.className = "texto-color-lapiz-libro";
  span.setAttribute("data-color-lapiz", color);
  span.style.setProperty("color", color, "important");
  span.appendChild(crearContenidoTextoLibro(texto));

  insertarNodoEnCursorLibro(span);
}




function insertarSaltoLineaColorLapiz() {
  insertarNodoEnCursorLibro(document.createElement("br"));
}


function activarEventosLibro() {
  ["izq", "der"].forEach((lado) => {
    const editor = document.getElementById(`libroContenido-${lado}`);
    if (!editor) return;

    editor.style.setProperty("--color-lapiz-activo", colorCssSeguro(libroColorLapiz));
    editor.style.caretColor = colorCssSeguro(libroColorLapiz);

    editor.addEventListener("focus", () => {
      libroEditorActivo = editor;
      guardarRangoLibro();

      if (!libroResaltadorActivo) {
        aplicarColorLapizAlEditor(editor);
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

      if (!libroResaltadorActivo) {
        aplicarColorLapizAlEditor(editor);
      }
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

      // FIX CLAVE DEL SPAN:
      // Si el botón está apagado pero el cursor quedó dentro de un span resaltado,
      // escribimos afuera normal, sin amarillo y con color lápiz.
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

      // Color lápiz real: texto nuevo siempre en span con color inline !important.
      if (e.inputType === "insertText") {
        e.preventDefault();
        insertarTextoColorLapiz(e.data || "");
        guardarPaginaLibroSinAlerta();
        return;
      }

      if (e.inputType === "insertParagraph") {
        e.preventDefault();
        insertarSaltoLineaColorLapiz();
        insertarSaltoLineaColorLapiz();
        guardarPaginaLibroSinAlerta();
        return;
      }
    });

    editor.addEventListener("input", () => {
      guardarPaginaLibroSinAlerta();
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

  const editor = obtenerEditorLibroActual() || libroEditorActivo;
  if (editor) {
    libroEditorActivo = editor;
    aplicarColorLapizAlEditor(editor);
  }

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
  span.appendChild(crearContenidoTextoLibro(texto));

  insertarNodoEnCursorLibro(span);
}




function insertarSaltoLineaLibro() {
  insertarNodoEnCursorLibro(document.createElement("br"));
  insertarNodoEnCursorLibro(document.createElement("br"));
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
    nodoNuevo = document.createElement("span");
    nodoNuevo.className = "texto-color-lapiz-libro";
    nodoNuevo.setAttribute("data-color-lapiz", colorCssSeguro(libroColorLapiz));
    nodoNuevo.style.setProperty("color", colorCssSeguro(libroColorLapiz), "important");
    nodoNuevo.appendChild(crearContenidoTextoLibro(texto));
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

  if (pesoMB > 5) {
    alert("La imagen es muy pesada. Usá una imagen de hasta 5 MB.");
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
  if (pesoMB > 5) {
    alert("La imagen es muy pesada. Usá una imagen de hasta 5 MB.");
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
















