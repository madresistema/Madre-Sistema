/* =====================================================
   SUPABASE POR DISPOSITIVO + ADMIN
   - Cada computadora ve solo lo que cargó ella.
   - El administrador puede ver/cargar/editar todas con contraseña.
   - Requiere tabla public.app_data_devices.
===================================================== */

const SUPABASE_URL = "https://jkkllfyrndbedrlblzdc.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impra2xsZnlybmRiZWRybGJsemRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2OTg0NDMsImV4cCI6MjA5NzI3NDQ0M30.Gm-6ONaqGXX1b0D6sjDvD2BjNfvZoW9YkDBF0rI2Vh8";

const SUPABASE_DEVICE_TABLE = "app_data_devices";
const DEVICE_ID_KEY = "kees_gestion_device_id";
const DEVICE_NAME_KEY = "kees_gestion_device_name";
const DEVICE_NAME_MANUAL_KEY = "kees_gestion_device_name_manual";
const DEVICE_BASE_KEY = "kees_gestion_device_base";
const ADMIN_PASSWORD = "socioconsultas";

let supabaseSharedClient = null;
let supabaseSharedCargando = false;
let supabaseSharedTimer = null;
let supabaseAdminActivo = false;
let supabaseAdminEditandoDeviceId = null;
let supabaseAdminEditandoDeviceName = "";
let supabaseUltimaCargaRemota = null;

function supabaseCompartidoConfigurado() {
  return (
    typeof window.supabase !== "undefined" &&
    typeof SUPABASE_URL === "string" &&
    typeof SUPABASE_ANON_KEY === "string" &&
    SUPABASE_URL.startsWith("https://") &&
    SUPABASE_ANON_KEY.length > 50 &&
    !SUPABASE_URL.includes("PEGA_ACA") &&
    !SUPABASE_ANON_KEY.includes("PEGA_ACA") &&
    !SUPABASE_ANON_KEY.includes("PEGÁ_ACÁ")
  );
}

function iniciarSupabaseCompartido() {
  if (!supabaseCompartidoConfigurado()) return null;

  if (!supabaseSharedClient) {
    supabaseSharedClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }

  return supabaseSharedClient;
}

function crearIdDispositivo() {
  const rnd = Math.random().toString(36).slice(2, 10);
  return `pc_${Date.now()}_${rnd}`;
}

function obtenerDispositivoId() {
  let id = localStorage.getItem(DEVICE_ID_KEY);

  if (!id) {
    id = crearIdDispositivo();
    localStorage.setItem(DEVICE_ID_KEY, id);
  }

  return id;
}

function obtenerDispositivoNombre() {
  let nombre = localStorage.getItem(DEVICE_NAME_KEY);

  if (!nombre) {
    nombre = "PC local";
    localStorage.setItem(DEVICE_NAME_KEY, nombre);
  }

  return nombre;
}

function cambiarNombreDispositivo() {
  const actual = obtenerDispositivoNombre();
  const nuevo = prompt("Nombre para identificar esta computadora:", actual);

  if (!nuevo || !nuevo.trim()) return;

  localStorage.setItem(DEVICE_NAME_KEY, nuevo.trim());
  localStorage.setItem(DEVICE_NAME_MANUAL_KEY, "1");
  if (nuevo.trim().toLowerCase() !== "compu base") localStorage.removeItem(DEVICE_BASE_KEY);
  guardarDatosCompartidosSupabaseAhora(true);
  actualizarEstadoSupabaseUI();
}

async function asignarNombreAutomaticoDispositivoSiHaceFalta() {
  if (localStorage.getItem(DEVICE_NAME_MANUAL_KEY) === "1") return obtenerDispositivoNombre();

  const client = iniciarSupabaseCompartido();
  if (!client) return obtenerDispositivoNombre();

  const id = obtenerDispositivoId();
  const actual = localStorage.getItem(DEVICE_NAME_KEY) || "";
  if (actual && actual !== "PC local") return actual;

  const { data } = await client
    .from(SUPABASE_DEVICE_TABLE)
    .select("id, device_name, created_at")
    .order("created_at", { ascending: true });

  const rows = Array.isArray(data) ? data : [];
  const existeEsta = rows.some((r) => r.id === id);
  const totalAntes = existeEsta ? rows.findIndex((r) => r.id === id) : rows.length;
  const nuevoNombre = `PC ${totalAntes + 1}`;

  localStorage.setItem(DEVICE_NAME_KEY, nuevoNombre);
  return nuevoNombre;
}

function deviceIdActivoParaGuardar() {
  return supabaseAdminEditandoDeviceId || obtenerDispositivoId();
}

function deviceNameActivoParaGuardar() {
  return supabaseAdminEditandoDeviceName || obtenerDispositivoNombre();
}

function datosCompartidosApp() {
  return {
    version: 2,
    deviceId: deviceIdActivoParaGuardar(),
    deviceName: deviceNameActivoParaGuardar(),
    categorias,
    categoriasEliminadas,
    personas,
    registros,
    planos,
    encuestas,
    seguimientos,
    agendas,
    notasCalcular,
    libroPaginas,
    baseOrden: JSON.parse(localStorage.getItem("baseOrden") || "[]"),
    actualizado: new Date().toISOString()
  };
}

function aplicarDatosCompartidosApp(data) {
  if (!data || typeof data !== "object") return false;

  categorias = Array.isArray(data.categorias) ? data.categorias : categorias;
  categoriasEliminadas = Array.isArray(data.categoriasEliminadas) ? data.categoriasEliminadas : categoriasEliminadas;
  personas = Array.isArray(data.personas) ? data.personas : personas;
  registros = Array.isArray(data.registros) ? data.registros : registros;
  planos = Array.isArray(data.planos) ? data.planos : planos;
  encuestas = Array.isArray(data.encuestas) ? data.encuestas : encuestas;
  seguimientos = Array.isArray(data.seguimientos) ? data.seguimientos : seguimientos;
  agendas = Array.isArray(data.agendas) ? data.agendas : agendas;
  notasCalcular = Array.isArray(data.notasCalcular) ? data.notasCalcular : notasCalcular;
  libroPaginas = Array.isArray(data.libroPaginas) ? data.libroPaginas : libroPaginas;

  if (Array.isArray(data.baseOrden)) {
    localStorage.setItem("baseOrden", JSON.stringify(data.baseOrden));
  }

  return true;
}

function contarArrayData(data, key) {
  return Array.isArray(data?.[key]) ? data[key].length : 0;
}

function totalDatosData(data) {
  return (
    contarArrayData(data, "personas") +
    contarArrayData(data, "registros") +
    contarArrayData(data, "planos") +
    contarArrayData(data, "encuestas") +
    contarArrayData(data, "seguimientos") +
    contarArrayData(data, "agendas") +
    contarArrayData(data, "notasCalcular") +
    contarArrayData(data, "libroPaginas")
  );
}

function totalDatosActuales() {
  return totalDatosData(datosCompartidosApp());
}

function guardarDatosLocalesSinSubir() {
  localStorage.setItem("categorias", JSON.stringify(categorias));
  localStorage.setItem("categoriasEliminadas", JSON.stringify(categoriasEliminadas));
  localStorage.setItem("personas", JSON.stringify(personas));
  localStorage.setItem("registros", JSON.stringify(registros));
  localStorage.setItem("planos", JSON.stringify(planos));
  localStorage.setItem("encuestas", JSON.stringify(encuestas));
  localStorage.setItem("seguimientos", JSON.stringify(seguimientos));
  localStorage.setItem("agendas", JSON.stringify(agendas));
  localStorage.setItem("notasCalcular", JSON.stringify(notasCalcular));
  localStorage.setItem("libroPaginas", JSON.stringify(libroPaginas));
  localStorage.setItem("baseOrden", JSON.stringify(categorias.map((c) => Number(c.id))));
}

function guardarDatosLocalesConFecha() {
  localStorage.setItem("kees_ultima_modificacion_local", new Date().toISOString());
  guardarDatosLocalesSinSubir();
}

async function cargarDatosCompartidosSupabase() {
  if (typeof seguimientoPendienteRevision !== "undefined" && seguimientoPendienteRevision) return;

  const client = iniciarSupabaseCompartido();

  if (!client) {
    console.warn("Supabase no está configurado. La app funcionará solo en esta computadora.");
    actualizarEstadoSupabaseUI("local");
    return;
  }

  await asignarNombreAutomaticoDispositivoSiHaceFalta();

  const deviceId = deviceIdActivoParaGuardar();

  supabaseSharedCargando = true;

  const { data, error } = await client
    .from(SUPABASE_DEVICE_TABLE)
    .select("id, device_name, is_base, data, updated_at")
    .eq("id", deviceId)
    .maybeSingle();

  if (error) {
    console.warn("No se pudieron cargar datos de Supabase:", error.message);
    supabaseSharedCargando = false;
    actualizarEstadoSupabaseUI("error");
    return;
  }

  if (data?.data && Object.keys(data.data).length > 0) {
    aplicarDatosCompartidosApp(data.data);
    guardarDatosLocalesSinSubir();
    cargarStorage();
    renderTodo();
    supabaseUltimaCargaRemota = data.updated_at;
    console.log("✅ Datos cargados desde Supabase:", data.device_name || data.id, data.updated_at);
  } else {
    const localData = datosCompartidosApp();

    // Si esta PC ya tiene datos locales, crea su copia en Supabase.
    // Si no tiene datos, crea la fila vacía solo para identificar el dispositivo.
    await guardarDatosCompartidosSupabaseAhora(true);
    console.log("✅ Dispositivo creado en Supabase:", deviceId, localData.deviceName);
  }

  supabaseSharedCargando = false;
  actualizarEstadoSupabaseUI("ok");
}

function guardarDatosCompartidosSupabaseDebounce() {
  if (supabaseSharedCargando) return;

  clearTimeout(supabaseSharedTimer);
  supabaseSharedTimer = setTimeout(() => guardarDatosCompartidosSupabaseAhora(false), 900);
}

async function guardarBackupHistoricoSupabase(deviceId, deviceName, data) {
  const client = iniciarSupabaseCompartido();
  if (!client || totalDatosData(data) === 0) return;

  try {
    await client
      .from("app_data_devices_history")
      .insert({
        device_id: deviceId,
        device_name: deviceName,
        data: data,
        created_at: new Date().toISOString()
      });
  } catch (e) {
    console.warn("No se pudo crear backup histórico:", e.message);
  }
}

async function guardarDatosCompartidosSupabaseAhora(forzar = false) {
  const client = iniciarSupabaseCompartido();

  if (!client) {
    actualizarEstadoSupabaseUI("local");
    return;
  }

  const deviceId = deviceIdActivoParaGuardar();
  const payloadData = datosCompartidosApp();

  if (!forzar && totalDatosData(payloadData) === 0) {
    console.warn("⚠️ No se suben datos completamente vacíos.");
    return;
  }

  const payload = {
    id: deviceId,
    device_name: deviceNameActivoParaGuardar(),
    is_base: localStorage.getItem(DEVICE_BASE_KEY) === "1" || deviceNameActivoParaGuardar() === "Compu base",
    data: payloadData,
    updated_at: new Date().toISOString()
  };

  await guardarBackupHistoricoSupabase(deviceId, payload.device_name, payloadData);

  const { error } = await client
    .from(SUPABASE_DEVICE_TABLE)
    .upsert(payload, { onConflict: "id" });

  if (error) {
    console.warn("No se pudieron guardar datos en Supabase:", error.message);
    actualizarEstadoSupabaseUI("error");
  } else {
    console.log("✅ Datos guardados en Supabase:", payload.device_name);
    actualizarEstadoSupabaseUI("ok");
  }
}

function iniciarSincronizacionCompartidaSupabase() {
  obtenerDispositivoId();
  obtenerDispositivoNombre();
  asegurarUIAdminDispositivos();
  actualizarEstadoSupabaseUI();

  cargarDatosCompartidosSupabase();

  // Revisa cambios de la misma computadora cada 25 segundos.
  setInterval(cargarDatosCompartidosSupabase, 25000);
}

function exportarBackupJSONCompleto() {
  const data = datosCompartidosApp();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");

  a.href = url;
  a.download = `backup-${nombreArchivoSeguro(deviceNameActivoParaGuardar())}-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();

  URL.revokeObjectURL(url);
}

function importarBackupJSONCompleto() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".json,.gestion,application/json";

  input.onchange = () => {
    const archivo = input.files && input.files[0];
    if (!archivo) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = JSON.parse(String(e.target.result || "{}"));
        const confirmar = confirm("¿Importar este respaldo en esta computadora?\n\nEsto reemplaza la vista actual de esta PC y lo sube a Supabase.");
        if (!confirmar) return;

        aplicarDatosCompartidosApp(data);
        guardarDatosLocalesConFecha();
        renderTodo();
        guardarDatosCompartidosSupabaseAhora(true);
        alert("Respaldo importado correctamente.");
      } catch (error) {
        alert("El archivo no es un respaldo JSON válido.");
      }
    };

    reader.readAsText(archivo, "utf-8");
  };

  input.click();
}

function actualizarEstadoSupabaseUI(estado = "") {
  const el = document.getElementById("supabaseDeviceStatus");
  if (!el) return;

  const nombre = deviceNameActivoParaGuardar();
  const total = personas.length + registros.length + planos.length + encuestas.length + seguimientos.length;

  const modo = supabaseAdminEditandoDeviceId
    ? `ADMIN editando: ${nombre}`
    : `Esta PC: ${nombre}`;

  const icono =
    estado === "error" ? "🔴" :
    estado === "local" ? "🟠" :
    "🟢";

  el.innerHTML = `
    <b>${icono} ${escapeHtml(modo)}</b>
    <span>${total} registros</span>
  `;
}

function asegurarUIAdminDispositivos() {
  renderAdminPanelPrincipal();
}

function renderAdminPanelPrincipal() {
  const panel = document.querySelector("#panelView .container");
  if (!panel) return;

  let box = document.getElementById("supabaseAdminBox");
  if (!box) {
    box = document.createElement("div");
    box.id = "supabaseAdminBox";
    box.className = "supabase-admin-panel";

    const topbar = panel.querySelector(".topbar");
    if (topbar) topbar.insertAdjacentElement("afterend", box);
    else panel.prepend(box);
  }

  box.innerHTML = `
    <div class="admin-panel-left">
      <h3>☁️ Guardado por computadora</h3>
      <p>Cada PC guarda sus propios registros. El administrador puede ver y editar todas.</p>
      <div id="supabaseDeviceStatus" class="supabase-device-status"></div>
    </div>
    <div class="admin-panel-actions">
      <button type="button" class="supabase-admin-main" onclick="abrirPanelAdminDispositivos()">🔐 Entrar como admin</button>
    </div>
  `;

  actualizarEstadoSupabaseUI();
}


function ordenarDispositivosAdmin(rows) {
  return [...(rows || [])].sort((a, b) => {
    if (a.is_base && !b.is_base) return -1;
    if (!a.is_base && b.is_base) return 1;
    return String(a.created_at || a.updated_at || "").localeCompare(String(b.created_at || b.updated_at || ""));
  });
}

function etiquetaDispositivoAdmin(row, index) {
  if (row?.is_base || String(row?.device_name || "").toLowerCase() === "compu base") return "Compu base";
  return `PC ${index + 1}`;
}

function nombreDetalleDispositivoAdmin(row, etiqueta) {
  const nombre = String(row?.device_name || "").trim();
  if (!nombre || nombre === etiqueta || nombre === "PC local") return "";
  return ` · ${nombre}`;
}

async function marcarComoCompuBaseAdmin(deviceId) {
  const client = iniciarSupabaseCompartido();
  if (!client) return;

  if (!confirm("¿Marcar esta computadora como Compu base?\n\nLas demás quedarán como PC 1, PC 2, etc.")) return;

  const ahora = new Date().toISOString();

  await client
    .from(SUPABASE_DEVICE_TABLE)
    .update({ is_base: false })
    .neq("id", "__nunca__");

  const { error } = await client
    .from(SUPABASE_DEVICE_TABLE)
    .update({ is_base: true, device_name: "Compu base", updated_at: ahora })
    .eq("id", deviceId);

  if (error) {
    alert("No se pudo marcar como Compu base: " + error.message);
    return;
  }

  if (deviceId === obtenerDispositivoId()) {
    localStorage.setItem(DEVICE_NAME_KEY, "Compu base");
    localStorage.setItem(DEVICE_NAME_MANUAL_KEY, "1");
    localStorage.setItem(DEVICE_BASE_KEY, "1");
  }

  abrirPanelAdminDispositivos();
}

function htmlResumenDispositivo(row) {
  const d = row?.data || {};
  return `
    <small>
      Personas: ${contarArrayData(d, "personas")} ·
      Registros: ${contarArrayData(d, "registros")} ·
      Seguimientos: ${contarArrayData(d, "seguimientos")} ·
      Planos: ${contarArrayData(d, "planos")} ·
      Encuestas: ${contarArrayData(d, "encuestas")}
    </small>
  `;
}

async function abrirPanelAdminDispositivos() {
  const clave = prompt("Contraseña de administrador:");
  if (clave !== ADMIN_PASSWORD) {
    alert("Contraseña incorrecta.");
    return;
  }

  supabaseAdminActivo = true;

  const client = iniciarSupabaseCompartido();
  if (!client) {
    alert("Supabase no está configurado.");
    return;
  }

  const { data, error } = await client
    .from(SUPABASE_DEVICE_TABLE)
    .select("id, device_name, is_base, data, created_at, updated_at")
    .order("updated_at", { ascending: false });

  if (error) {
    alert("No se pudieron cargar los dispositivos: " + error.message);
    return;
  }

  mostrarModalAdminDispositivos(Array.isArray(data) ? data : []);
}

function mostrarModalAdminDispositivos(rows) {
  let modal = document.getElementById("modalAdminDispositivos");

  if (!modal) {
    modal = document.createElement("div");
    modal.id = "modalAdminDispositivos";
    modal.className = "modal-admin-dispositivos";
    document.body.appendChild(modal);
  }

  const rowsOrdenadas = ordenarDispositivosAdmin(rows);
  const totalGeneral = rowsOrdenadas.reduce((acc, row) => acc + totalDatosData(row.data || {}), 0);

  modal.innerHTML = `
    <div class="modal-admin-card">
      <div class="modal-admin-head">
        <div>
          <h2>🔐 Administrador · Todas las computadoras</h2>
          <p>${rows.length} dispositivo${rows.length !== 1 ? "s" : ""} · ${totalGeneral} registros totales</p>
        </div>
        <button onclick="cerrarPanelAdminDispositivos()">✖</button>
      </div>

      <div class="modal-admin-actions">
        <button onclick="volverAMiDispositivo()">🖥️ Volver a mi computadora</button>
      </div>

      <div class="admin-device-list">
        ${
          rowsOrdenadas.length
            ? rowsOrdenadas.map((row, index) => {
              const etiqueta = etiquetaDispositivoAdmin(row, index);
              const detalleNombre = nombreDetalleDispositivoAdmin(row, etiqueta);
              return `
              <div class="admin-device-card ${row.is_base ? "admin-device-base" : ""}">
                <div>
                  <h3>${escapeHtml(etiqueta)}${escapeHtml(detalleNombre)}</h3>
                  <p><b>ID:</b> ${escapeHtml(row.id)}</p>
                  <p><b>Última actualización:</b> ${escapeHtml(row.updated_at || "")}</p>
                  ${htmlResumenDispositivo(row)}
                </div>
                <div class="admin-device-actions">
                  <button onclick="cargarDispositivoAdmin('${escapeHtml(row.id)}')">Ver / editar datos</button>
                  <button onclick="editarNombreDispositivoAdmin('${escapeHtml(row.id)}', '${escapeHtml(row.device_name || etiqueta)}')">Editar nombre PC</button>
                  <button onclick="marcarComoCompuBaseAdmin('${escapeHtml(row.id)}')">⭐ Hacer compu base</button>
                  <button class="danger" onclick="eliminarDispositivoAdmin('${escapeHtml(row.id)}')">Eliminar</button>
                </div>
              </div>`;
            }).join("")
            : `<div class="empty"><p>No hay dispositivos guardados todavía.</p></div>`
        }
      </div>
    </div>
  `;

  modal.classList.add("visible");
}

function cerrarPanelAdminDispositivos() {
  const modal = document.getElementById("modalAdminDispositivos");
  if (modal) modal.classList.remove("visible");
}

async function cargarDispositivoAdmin(deviceId) {
  const client = iniciarSupabaseCompartido();
  if (!client) return;

  const { data, error } = await client
    .from(SUPABASE_DEVICE_TABLE)
    .select("id, device_name, is_base, data, updated_at")
    .eq("id", deviceId)
    .maybeSingle();

  if (error || !data) {
    alert("No se pudo cargar ese dispositivo.");
    return;
  }

  supabaseAdminEditandoDeviceId = data.id;
  supabaseAdminEditandoDeviceName = data.device_name || data.id;

  aplicarDatosCompartidosApp(data.data || {});
  guardarDatosLocalesSinSubir();
  cargarStorage();
  renderTodo();
  cerrarPanelAdminDispositivos();
  actualizarEstadoSupabaseUI("ok");

  alert(`Ahora estás viendo/editando: ${supabaseAdminEditandoDeviceName}\n\nTodo lo que modifiques se guardará en esa computadora.`);
}

function volverAMiDispositivo() {
  supabaseAdminEditandoDeviceId = null;
  supabaseAdminEditandoDeviceName = "";
  cerrarPanelAdminDispositivos();
  cargarDatosCompartidosSupabase();
  actualizarEstadoSupabaseUI("ok");
}

async function eliminarDispositivoAdmin(deviceId) {
  if (!confirm("¿Eliminar este dispositivo de Supabase? Esta acción no borra los datos locales de esa computadora, pero sí la copia compartida.")) return;

  const client = iniciarSupabaseCompartido();
  if (!client) return;

  const { error } = await client
    .from(SUPABASE_DEVICE_TABLE)
    .delete()
    .eq("id", deviceId);

  if (error) {
    alert("No se pudo eliminar: " + error.message);
    return;
  }

  abrirPanelAdminDispositivos();
}

async function editarNombreDispositivoAdmin(deviceId, nombreActual = "") {
  const client = iniciarSupabaseCompartido();
  if (!client) return;

  const nuevo = prompt("Nuevo nombre de la PC:", nombreActual || deviceId);
  if (!nuevo || !nuevo.trim()) return;

  const { error } = await client
    .from(SUPABASE_DEVICE_TABLE)
    .update({ device_name: nuevo.trim(), is_base: nuevo.trim().toLowerCase() === "compu base", updated_at: new Date().toISOString() })
    .eq("id", deviceId);

  if (error) {
    alert("No se pudo editar el nombre: " + error.message);
    return;
  }

  if (supabaseAdminEditandoDeviceId === deviceId) supabaseAdminEditandoDeviceName = nuevo.trim();
  if (deviceId === obtenerDispositivoId()) {
    localStorage.setItem(DEVICE_NAME_KEY, nuevo.trim());
    localStorage.setItem(DEVICE_NAME_MANUAL_KEY, "1");
    if (nuevo.trim().toLowerCase() === "compu base") localStorage.setItem(DEVICE_BASE_KEY, "1");
    else localStorage.removeItem(DEVICE_BASE_KEY);
  }
  abrirPanelAdminDispositivos();
}

async function exportarDispositivoAdmin(deviceId) {
  const client = iniciarSupabaseCompartido();
  if (!client) return;

  const { data, error } = await client
    .from(SUPABASE_DEVICE_TABLE)
    .select("id, device_name, is_base, data, updated_at")
    .eq("id", deviceId)
    .maybeSingle();

  if (error || !data) {
    alert("No se pudo descargar ese dispositivo.");
    return;
  }

  const blob = new Blob([JSON.stringify(data.data || {}, null, 2)], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `backup-${nombreArchivoSeguro(data.device_name || data.id)}-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

async function elegirDispositivoAdminParaImportar() {
  if (!supabaseAdminActivo) return { id: deviceIdActivoParaGuardar(), name: deviceNameActivoParaGuardar() };

  const client = iniciarSupabaseCompartido();
  if (!client) return { id: deviceIdActivoParaGuardar(), name: deviceNameActivoParaGuardar() };

  const { data, error } = await client
    .from(SUPABASE_DEVICE_TABLE)
    .select("id, device_name, is_base, updated_at, created_at")
    .order("device_name", { ascending: true });

  const rows = Array.isArray(data) ? data : [];
  if (error || !rows.length) return { id: deviceIdActivoParaGuardar(), name: deviceNameActivoParaGuardar() };

  const lista = rows.map((r, i) => `${i + 1}) ${r.device_name || r.id}`).join("\n");
  const elegido = prompt(`¿En qué PC querés importar el archivo?\n\n${lista}\n\nEscribí el número:`, "1");
  const idx = Number(elegido) - 1;

  if (!rows[idx]) return null;
  return { id: rows[idx].id, name: rows[idx].device_name || rows[idx].id };
}


const CATEGORIAS_DEFAULT = [
  { id: 1, nombre: "Vivienda", icono: "🏠", color: "blue", total: 0 },
  { id: 2, nombre: "Trabajo", icono: "💼", color: "green", total: 0 },
  { id: 3, nombre: "Salud", icono: "🏥", color: "red", total: 0 },
  { id: 4, nombre: "Obra Pública", icono: "🏗️", color: "yellow", total: 0 },
  { id: 5, nombre: "Educación", icono: "📚", color: "purple", total: 0 },
  { id: 6, nombre: "Desarrollo Social", icono: "🤝", color: "orange", total: 0 },
  { id: 7, nombre: "Mujer", icono: "👩", color: "pink", total: 0 },
  { id: 8, nombre: "Legales", icono: "⚖️", color: "gray", total: 0 },
  { id: 9, nombre: "Seguimientos", icono: "📋", color: "teal", total: 0, tipo: "seguimiento" },
  { id: 100, nombre: "Centro", icono: "🏘️", color: "indigo", total: 0, parent: "Barrios y Localidades", tipo: "barrio" },
  { id: 101, nombre: "Villa Belgrano", icono: "🏘️", color: "blue", total: 0, parent: "Barrios y Localidades", tipo: "barrio" },
  { id: 102, nombre: "Barrio Rosario", icono: "🏘️", color: "green", total: 0, parent: "Barrios y Localidades", tipo: "barrio" },
  { id: 103, nombre: "Barrio San Martín", icono: "🏘️", color: "purple", total: 0, parent: "Barrios y Localidades", tipo: "barrio" },
  { id: 104, nombre: "Barrio San Cayetano", icono: "🏘️", color: "orange", total: 0, parent: "Barrios y Localidades", tipo: "barrio" },
  { id: 105, nombre: "Puente Chico", icono: "🏘️", color: "pink", total: 0, parent: "Barrios y Localidades", tipo: "barrio" },
  { id: 106, nombre: "Barrio Boca / Boca Juniors", icono: "🏘️", color: "gray", total: 0, parent: "Barrios y Localidades", tipo: "barrio" },
  { id: 107, nombre: "Tres Repúblicas", icono: "🏘️", color: "yellow", total: 0, parent: "Barrios y Localidades", tipo: "barrio" },
  { id: 108, nombre: "Domingo Moccero", icono: "🏘️", color: "indigo", total: 0, parent: "Barrios y Localidades", tipo: "barrio" },
  { id: 109, nombre: "Miguel de Güemes", icono: "🏘️", color: "blue", total: 0, parent: "Barrios y Localidades", tipo: "barrio" },
  { id: 110, nombre: "Barrio Mar del Plata", icono: "🏘️", color: "green", total: 0, parent: "Barrios y Localidades", tipo: "barrio" },
  { id: 111, nombre: "Lovecchio / Julio César Lovecchio", icono: "🏘️", color: "purple", total: 0, parent: "Barrios y Localidades", tipo: "barrio" },
  { id: 112, nombre: "Altos Balcarce", icono: "🏘️", color: "orange", total: 0, parent: "Barrios y Localidades", tipo: "barrio" },
  { id: 113, nombre: "Teodosio Alaniz / Alaniz", icono: "🏘️", color: "pink", total: 0, parent: "Barrios y Localidades", tipo: "barrio" },
  { id: 114, nombre: "Cristo Redentor", icono: "🏘️", color: "gray", total: 0, parent: "Barrios y Localidades", tipo: "barrio" },
  { id: 115, nombre: "Barrio Cristo", icono: "🏘️", color: "yellow", total: 0, parent: "Barrios y Localidades", tipo: "barrio" },
  { id: 116, nombre: "Barrio Puente", icono: "🏘️", color: "indigo", total: 0, parent: "Barrios y Localidades", tipo: "barrio" },
  { id: 117, nombre: "Barrio Familia", icono: "🏘️", color: "blue", total: 0, parent: "Barrios y Localidades", tipo: "barrio" },
  { id: 118, nombre: "Brandenberg", icono: "🏘️", color: "green", total: 0, parent: "Barrios y Localidades", tipo: "barrio" },
  { id: 119, nombre: "Remedios de Escalada", icono: "🏘️", color: "purple", total: 0, parent: "Barrios y Localidades", tipo: "barrio" },
  { id: 120, nombre: "Islas Malvinas", icono: "🏘️", color: "orange", total: 0, parent: "Barrios y Localidades", tipo: "barrio" },
  { id: 121, nombre: "Etchegaray", icono: "🏘️", color: "pink", total: 0, parent: "Barrios y Localidades", tipo: "barrio" },
  { id: 122, nombre: "Fátima", icono: "🏘️", color: "gray", total: 0, parent: "Barrios y Localidades", tipo: "barrio" },
  { id: 123, nombre: "René Favaloro", icono: "🏘️", color: "yellow", total: 0, parent: "Barrios y Localidades", tipo: "barrio" },
  { id: 124, nombre: "Bonifacino", icono: "🏘️", color: "indigo", total: 0, parent: "Barrios y Localidades", tipo: "barrio" },
  { id: 125, nombre: "Pueblo Santa Trinidad / Colonia I", icono: "🏘️", color: "blue", total: 0, parent: "Barrios y Localidades", tipo: "barrio" },
  { id: 126, nombre: "Pueblo San José / Colonia II", icono: "🏘️", color: "green", total: 0, parent: "Barrios y Localidades", tipo: "barrio" },
  { id: 127, nombre: "Pueblo Santa María / Colonia III", icono: "🏘️", color: "purple", total: 0, parent: "Barrios y Localidades", tipo: "barrio" },
  { id: 128, nombre: "PROCREAR Santa Trinidad", icono: "🏘️", color: "orange", total: 0, parent: "Barrios y Localidades", tipo: "barrio" },
  { id: 129, nombre: "Los Manantiales, en Santa Trinidad", icono: "🏘️", color: "pink", total: 0, parent: "Barrios y Localidades", tipo: "barrio" },
  { id: 130, nombre: "Sector nuevo / loteo nuevo Santa Trinidad", icono: "🏘️", color: "gray", total: 0, parent: "Barrios y Localidades", tipo: "barrio" }
];

let categorias = [];
let categoriasEliminadas = [];
let modoEditarBases = false;
let personas = [];
let registros = [];
let planos = [];
let encuestas = [];
let seguimientos = [];
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
let archivoSeleccionados = [];
let archivoRegistroOpciones = {};
let seguimientoPendienteRevision = null;

const $ = (id) => document.getElementById(id);


function limpiarCategoriasBarriosViejas() {
  const nombresViejos = ["planos", "encuesta"];

  categorias = categorias.filter((cat) => {
    const esVieja =
      Number(cat.id) === 10 ||
      Number(cat.id) === 11 ||
      (
        (cat.parent === "Barrios" || cat.parent === "Barrios y Localidades") &&
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
  localStorage.setItem("seguimientos", JSON.stringify(seguimientos));
  localStorage.setItem("agendas", JSON.stringify(agendas));
  localStorage.setItem("notasCalcular", JSON.stringify(notasCalcular));
  localStorage.setItem("libroPaginas", JSON.stringify(libroPaginas));
  localStorage.setItem("baseOrden", JSON.stringify(categorias.map((c) => Number(c.id))));

  if (typeof guardarDatosCompartidosSupabaseDebounce === "function") {
    guardarDatosCompartidosSupabaseDebounce();
  }
}

function cargarStorage() {
  categorias = JSON.parse(localStorage.getItem("categorias")) || [];
  categoriasEliminadas = JSON.parse(localStorage.getItem("categoriasEliminadas")) || [];
  personas = JSON.parse(localStorage.getItem("personas")) || [];
  registros = JSON.parse(localStorage.getItem("registros")) || [];
  planos = JSON.parse(localStorage.getItem("planos")) || [];
  encuestas = JSON.parse(localStorage.getItem("encuestas")) || [];
  seguimientos = JSON.parse(localStorage.getItem("seguimientos")) || [];
  agendas = JSON.parse(localStorage.getItem("agendas")) || [];
  notasCalcular = JSON.parse(localStorage.getItem("notasCalcular")) || [];
  libroPaginas = JSON.parse(localStorage.getItem("libroPaginas")) || [];

  limpiarCategoriasBarriosViejas();

  categorias = categorias.map((cat) => {
    if (cat.parent === "Barrios") return { ...cat, parent: "Barrios y Localidades" };
    return cat;
  });

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
    if ((cat.parent === "Barrios" || cat.parent === "Barrios y Localidades")) return c.parent === "Barrios";
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
  input.accept = ".json,.gestion,application/json";

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

  if (cat?.tipo === "seguimiento") {
    return seguimientos.length;
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

  if (typeof iniciarSincronizacionCompartidaSupabase === "function") {
    iniciarSincronizacionCompartidaSupabase();
  }
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




function cerrarSidebarMobile() {
  if (window.innerWidth <= 820) {
    document.body.classList.remove("sidebar-abierto");
  }
}

function toggleSidebarMobile() {
  document.body.classList.toggle("sidebar-abierto");
}



function asegurarBotonMobile() {
  if ($("btnMenuMobile")) return;

  const btn = document.createElement("button");
  btn.id = "btnMenuMobile";
  btn.className = "btn-menu-mobile";
  btn.innerHTML = "☰";
  btn.title = "Abrir menú";
  btn.onclick = toggleSidebarMobile;

  document.body.appendChild(btn);

  document.addEventListener("click", (e) => {
    if (window.innerWidth > 820) return;
    if (!document.body.classList.contains("sidebar-abierto")) return;

    const sidebar = document.querySelector(".sidebar");
    const menuBtn = $("btnMenuMobile");

    if (sidebar && !sidebar.contains(e.target) && menuBtn && !menuBtn.contains(e.target)) {
      document.body.classList.remove("sidebar-abierto");
    }
  });
}


function bindEvents() {
  asegurarBotonMobile();
  asegurarBotonEditarBases();
  actualizarBotonEditarBases();
  $("btnPanel").onclick = mostrarPanel;
  if ($("btnCrearArchivo")) $("btnCrearArchivo").onclick = mostrarCrearArchivo;

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





function mostrarCrearArchivo() {
  document.body.classList.remove("modo-libro");
  vista = "crearArchivo";
  catActiva = null;

  activarNavPrincipal("");
  $("panelView").classList.add("hidden");
  $("categoriaView").classList.remove("hidden");
  $("busqueda").style.display = "none";

  renderCrearArchivo();
}

function textoItemCrearArchivo(item) {
  return [
    item.tipo,
    item.titulo,
    item.subtitulo,
    item.barrio,
    item.detalle
  ].join(" ").toLowerCase();
}


function fechaOrdenCrearArchivo(valor) {
  const v = String(valor || "").trim();

  if (!v) return 0;

  if (/^\d{4}-\d{2}-\d{2}$/.test(v)) {
    return new Date(v + "T00:00:00").getTime() || 0;
  }

  const m = v.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (m) {
    return new Date(`${m[3]}-${m[2].padStart(2, "0")}-${m[1].padStart(2, "0")}T00:00:00`).getTime() || 0;
  }

  return 0;
}

function ordenarItemsCrearArchivo(items) {
  const orden = String($("ordenCrearArchivo")?.value || "base-nombre");

  const copia = [...items];

  copia.sort((a, b) => {
    const baseA = String(a.subtitulo || "").localeCompare(String(b.subtitulo || ""), "es");
    const baseB = String(b.subtitulo || "").localeCompare(String(a.subtitulo || ""), "es");
    const nombreA = String(a.titulo || "").localeCompare(String(b.titulo || ""), "es");
    const nombreB = String(b.titulo || "").localeCompare(String(a.titulo || ""), "es");
    const fechaA = fechaOrdenCrearArchivo(a.fecha);
    const fechaB = fechaOrdenCrearArchivo(b.fecha);

    if (orden === "nombre") return nombreA;
    if (orden === "nombre-desc") return nombreB;
    if (orden === "fecha") return (fechaA - fechaB) || nombreA;
    if (orden === "fecha-desc") return (fechaB - fechaA) || nombreA;
    if (orden === "base-fecha") return baseA || (fechaB - fechaA) || nombreA;

    return baseA || nombreA || (fechaB - fechaA);
  });

  return copia;
}

function agruparItemsPorSubtitulo(items) {
  const grupos = {};

  items.forEach((item) => {
    const key = item.subtitulo || "Sin base";

    if (!grupos[key]) grupos[key] = [];

    grupos[key].push(item);
  });

  return grupos;
}

function renderGrupoCrearArchivo(titulo, items) {
  return `
    <section class="crear-archivo-grupo">
      <div class="crear-archivo-grupo-head">
        <h3>${escapeHtml(titulo)}</h3>
        <span>${items.length} elemento${items.length !== 1 ? "s" : ""}</span>
      </div>

      <div class="crear-archivo-lista">
        ${items.map((item) => `
          <label class="crear-archivo-item ${archivoSeleccionados.includes(item.id) ? "seleccionado" : ""}">
            <input type="checkbox" ${archivoSeleccionados.includes(item.id) ? "checked" : ""} onchange="toggleSeleccionCrearArchivo('${item.id}')" />
            <div>
              <b>${escapeHtml(item.tipo)} · ${escapeHtml(item.titulo)}</b>
              <p>${escapeHtml(item.subtitulo || "")}</p>
              <small>
                ${item.fecha ? `📅 ${escapeHtml(item.fecha)} · ` : ""}
                ${escapeHtml(item.detalle || "")}
              </small>
            </div>
          </label>
        `).join("")}
      </div>
    </section>
  `;
}


function buscarItemsCrearArchivo() {
  const items = [];

  personas.forEach((p) => {
    const cat = categorias.find((c) => Number(c.id) === Number(p.categoria_id));
    items.push({
      id: `persona-${p.id}`,
      tipo: "Persona",
      titulo: p.nombre || "Persona",
      subtitulo: cat ? cat.nombre : "Base normal",
      barrio: p.barrio || "",
      fecha: p.fecha_carga || "",
      detalle: `${p.direccion || ""} ${p.celular || ""} ${p.motivo_consulta || ""}`,
      html: () => htmlPersonaCrearArchivo(p, !!archivoRegistroOpciones[`persona-${p.id}`])
    });
  });

  planos.forEach((p) => {
    items.push({
      id: `plano-${p.id}`,
      tipo: "Plano",
      titulo: p.nombre || "Plano",
      subtitulo: p.barrio_nombre || "Barrios y Localidades",
      barrio: p.barrio_nombre || "",
      fecha: p.fecha || "",
      detalle: p.nombreArchivo || "",
      html: () => htmlArchivoBarrioPDF(p, "plano")
    });
  });

  encuestas.forEach((e) => {
    items.push({
      id: `encuesta-${e.id}`,
      tipo: "Encuesta",
      titulo: e.nombre || "Encuesta",
      subtitulo: e.barrio_nombre || "Barrios y Localidades",
      barrio: e.barrio_nombre || "",
      fecha: e.fecha || "",
      detalle: `${e.nombreArchivo || ""} ${(e.preguntas || []).map((p) => p.pregunta).join(" ")}`,
      html: () => htmlArchivoBarrioPDF(e, "encuesta")
    });
  });

  seguimientos.forEach((s) => {
    items.push({
      id: `seguimiento-${s.id}`,
      tipo: "Seguimiento",
      titulo: s.titulo || "Seguimiento",
      subtitulo: s.barrio || "Seguimientos",
      barrio: s.barrio || "",
      fecha: s.fecha || s.fecha_carga || "",
      detalle: `${s.nombre_apellido || ""} ${s.dni || ""} ${s.celular || ""} ${s.direccion_numero || ""} ${s.informe || ""} ${s.nombreArchivo || ""}`,
      html: () => htmlSeguimientoPDF(s)
    });
  });

  agruparGraficosPorPregunta().forEach((g, index) => {
    items.push({
      id: `grafico-${normalizarPregunta(g.pregunta)}-${index}`,
      tipo: "Gráfico",
      titulo: g.pregunta || "Gráfico",
      subtitulo: "Gráficos de encuestas",
      barrio: Object.keys(g.barrios || {}).join(", "),
      fecha: "",
      detalle: (g.opciones || []).join(", "),
      html: () => htmlGraficoPregunta(g)
    });
  });

  return items;
}


function htmlPersonaCrearArchivo(p, incluirRegistros = true) {
  const cat = categorias.find((c) => Number(c.id) === Number(p.categoria_id));
  const regs = incluirRegistros ? registros.filter((r) => Number(r.persona_id) === Number(p.id)) : [];

  return `
    <div class="card">
      <h2>👤 ${escapeHtml(p.nombre || "Persona")}</h2>
      <table>
        <tbody>
          <tr><th>Base</th><td>${escapeHtml(cat?.nombre || "")}</td></tr>
          <tr><th>Dirección</th><td>${escapeHtml(p.direccion || "")}</td></tr>
          <tr><th>Celular</th><td>${escapeHtml(p.celular || "")}</td></tr>
          <tr><th>Barrio</th><td>${escapeHtml(p.barrio || "")}</td></tr>
          <tr><th>Fecha</th><td>${escapeHtml(p.fecha_carga || "")}</td></tr>
          <tr><th>Motivo</th><td>${escapeHtml(p.motivo_consulta || "")}</td></tr>
        </tbody>
      </table>

      ${
        incluirRegistros && regs.length
          ? `
            <h3>Registros</h3>
            ${regs.map((r) => `
              <div class="card">
                <h4>${escapeHtml(r.titulo || "Registro")}</h4>
                <p><b>Fecha:</b> ${escapeHtml(r.fecha || "")}</p>
                <p>${escapeHtml(r.descripcion || "").replace(/\n/g, "<br>")}</p>
              </div>
            `).join("")}
          `
          : ""
      }
    </div>
  `;
}

function toggleSeleccionCrearArchivo(id) {
  if (archivoSeleccionados.includes(id)) {
    archivoSeleccionados = archivoSeleccionados.filter((x) => x !== id);
  } else {
    archivoSeleccionados.push(id);
  }

  renderCrearArchivo();
}

function seleccionarTodosCrearArchivo() {
  const texto = String($("buscarCrearArchivo")?.value || "").toLowerCase();
  const items = buscarItemsCrearArchivo().filter((item) => !texto || textoItemCrearArchivo(item).includes(texto));

  const ids = items.map((x) => x.id);
  const todosSeleccionados = ids.every((id) => archivoSeleccionados.includes(id));

  if (todosSeleccionados) {
    archivoSeleccionados = archivoSeleccionados.filter((id) => !ids.includes(id));
  } else {
    ids.forEach((id) => {
      if (!archivoSeleccionados.includes(id)) archivoSeleccionados.push(id);
    });
  }

  renderCrearArchivo();
}

function renderCrearArchivo() {
  $("categoriaHeader").className = "cat-header bg-indigo";
  $("categoriaHeader").innerHTML = `
    <div class="left">
      <div class="emoji">🧾</div>
      <div>
        <h2>Crear archivo</h2>
        <p>Buscá registros de todas las bases, separados por base de datos, nombre o fecha.</p>
      </div>
    </div>

    <div class="cat-actions">
      <button onclick="imprimirArchivoPersonalizado()">🖨️ Imprimir</button>
      <button onclick="descargarArchivoPersonalizado()">⬇️ Descargar PDF</button>
      <button onclick="subirArchivoPersonalizadoNube()">☁️ Subir a la nube</button>
      <button onclick="importarArchivoPersonalizadoNube()">⬆️ Importar archivo</button>
    </div>
  `;

  const texto = String($("buscarCrearArchivo")?.value || "").toLowerCase();
  const itemsFiltrados = buscarItemsCrearArchivo().filter((item) => !texto || textoItemCrearArchivo(item).includes(texto));
  const items = ordenarItemsCrearArchivo(itemsFiltrados);
  const grupos = agruparItemsPorSubtitulo(items);

  $("personasLista").innerHTML = `
    <div class="crear-archivo-box">
      <div class="crear-archivo-toolbar">
        <input id="buscarCrearArchivo" class="search" placeholder="🔍 Buscar en todas las bases: planos, encuestas, gráficos, personas, seguimientos..." value="${escapeHtml(texto)}" oninput="renderCrearArchivo()" />

        <select id="ordenCrearArchivo" class="select-orden-crear" onchange="renderCrearArchivo()">
          <option value="base-nombre" ${($("ordenCrearArchivo")?.value || "base-nombre") === "base-nombre" ? "selected" : ""}>Separar por base y nombre</option>
          <option value="base-fecha" ${$("ordenCrearArchivo")?.value === "base-fecha" ? "selected" : ""}>Separar por base y fecha</option>
          <option value="nombre" ${$("ordenCrearArchivo")?.value === "nombre" ? "selected" : ""}>Ordenar por nombre A-Z</option>
          <option value="nombre-desc" ${$("ordenCrearArchivo")?.value === "nombre-desc" ? "selected" : ""}>Ordenar por nombre Z-A</option>
          <option value="fecha-desc" ${$("ordenCrearArchivo")?.value === "fecha-desc" ? "selected" : ""}>Ordenar por fecha reciente</option>
          <option value="fecha" ${$("ordenCrearArchivo")?.value === "fecha" ? "selected" : ""}>Ordenar por fecha antigua</option>
        </select>

        <button class="secondary" onclick="seleccionarTodosCrearArchivo()">Seleccionar / deseleccionar visibles</button>
        <span class="badge badge-indigo">${archivoSeleccionados.length} seleccionado${archivoSeleccionados.length !== 1 ? "s" : ""}</span>
      </div>

      <div class="crear-archivo-grupos">
        ${
          items.length
            ? Object.entries(grupos).map(([grupo, lista]) => renderGrupoCrearArchivo(grupo, lista)).join("")
            : `<div class="empty"><p>No se encontraron registros con esa búsqueda.</p></div>`
        }
      </div>
    </div>
  `;
}



function configurarRegistrosArchivoPersonalizado(accion = "descargar") {
  const items = buscarItemsCrearArchivo().filter((item) => archivoSeleccionados.includes(item.id));
  const personasItems = items.filter((item) => item.id.startsWith("persona-"));

  if (!personasItems.length) {
    archivoRegistroOpciones = {};
    return;
  }

  const personasLista = personasItems
    .map((item) => personas.find((p) => `persona-${p.id}` === item.id))
    .filter(Boolean);

  const mapa = preguntarRegistroMultiple(personasLista, accion);

  archivoRegistroOpciones = {};
  personasLista.forEach((p) => {
    archivoRegistroOpciones[`persona-${p.id}`] = !!mapa[p.id];
  });
}

function htmlArchivoPersonalizado() {
  const items = ordenarItemsCrearArchivo(
    buscarItemsCrearArchivo().filter((item) => archivoSeleccionados.includes(item.id))
  );

  if (!items.length) {
    return `<p>No seleccionaste elementos.</p>`;
  }

  const grupos = agruparItemsPorSubtitulo(items);

  return `
    <h1>Archivo personalizado</h1>
    <p><b>Total de elementos:</b> ${items.length}</p>

    ${Object.entries(grupos).map(([grupo, lista]) => `
      <section class="archivo-personalizado-grupo">
        <h2>${escapeHtml(grupo)}</h2>

        ${lista.map((item) => `
          <section class="archivo-personalizado-section">
            <h3>${escapeHtml(item.tipo)} · ${escapeHtml(item.titulo)}</h3>
            ${item.fecha ? `<p><b>Fecha:</b> ${escapeHtml(item.fecha)}</p>` : ""}
            ${item.html()}
          </section>
        `).join("")}
      </section>
    `).join("")}
  `;
}


function imprimirArchivoPersonalizado() {
  if (!archivoSeleccionados.length) {
    alert("Seleccioná al menos un registro, plano, encuesta, gráfico o seguimiento.");
    return;
  }

  configurarRegistrosArchivoPersonalizado("imprimir este archivo personalizado");
  imprimirHTML("Archivo personalizado", htmlArchivoPersonalizado());
}

function descargarArchivoPersonalizado() {
  if (!archivoSeleccionados.length) {
    alert("Seleccioná al menos un registro, plano, encuesta, gráfico o seguimiento.");
    return;
  }

  configurarRegistrosArchivoPersonalizado("descargar este archivo personalizado");
  descargarHTML("archivo-personalizado", htmlArchivoPersonalizado());
}

function subirArchivoPersonalizadoNube() {
  if (!archivoSeleccionados.length) {
    alert("Seleccioná al menos un registro, plano, encuesta, gráfico o seguimiento.");
    return;
  }

  configurarRegistrosArchivoPersonalizado("subir/guardar en la nube este archivo personalizado");

  alert(
    "Se abrirá Guardar como PDF.\n\n" +
    "Para Google Drive: elegí una carpeta de Google Drive sincronizada en esta PC o guardalo y subilo a Drive.\n\n" +
    "Además, los datos quedan guardados automáticamente en Supabase."
  );

  descargarHTML("archivo-personalizado-nube", htmlArchivoPersonalizado());
}

function normalizarClaveDuplicadoPersona(p) {
  return [p.categoria_id, p.nombre, p.barrio]
    .map((x) => String(x || "").trim().toLowerCase())
    .join("|");
}

function pedirDuplicadosAImportar(duplicados) {
  if (!duplicados.length) return new Set();

  const lista = duplicados
    .map((d, i) => `${i + 1}) ${d.nuevo.nombre || "Sin nombre"} · ${d.nuevo.barrio || "Sin barrio"} · ${d.baseNombre || "Base"}`)
    .join("\n");

  const noImportar = prompt(
    `Se detectaron posibles repetidos.\n\nTodos están seleccionados para importar.\n\n${lista}\n\nEscribí los números que NO querés importar separados por coma, o dejá vacío para importar todos.`,
    ""
  );

  const ignorar = new Set();
  String(noImportar || "").split(",").map((x) => Number(x.trim()) - 1).forEach((idx) => {
    if (idx >= 0 && idx < duplicados.length) ignorar.add(duplicados[idx].nuevo.__import_tmp_id);
  });

  const editar = confirm("¿Querés editar algún repetido antes de importarlo?");
  if (editar) {
    duplicados.forEach((d, i) => {
      if (ignorar.has(d.nuevo.__import_tmp_id)) return;
      const ok = confirm(`¿Editar repetido ${i + 1}?\n${d.nuevo.nombre || "Sin nombre"} - ${d.nuevo.barrio || "Sin barrio"}`);
      if (!ok) return;
      const nombre = prompt("Nombre:", d.nuevo.nombre || "");
      const barrio = prompt("Barrio:", d.nuevo.barrio || "");
      const direccion = prompt("Dirección:", d.nuevo.direccion || "");
      const celular = prompt("Celular:", d.nuevo.celular || "");
      const motivo = prompt("Motivo de consulta:", d.nuevo.motivo_consulta || "");
      if (nombre !== null) d.nuevo.nombre = nombre;
      if (barrio !== null) d.nuevo.barrio = barrio;
      if (direccion !== null) d.nuevo.direccion = direccion;
      if (celular !== null) d.nuevo.celular = celular;
      if (motivo !== null) d.nuevo.motivo_consulta = motivo;
    });
  }

  return ignorar;
}

async function importarDataEnDispositivo(target, importData) {
  const client = iniciarSupabaseCompartido();
  let originalContext = null;

  if (target && target.id && target.id !== deviceIdActivoParaGuardar()) {
    const { data } = await client
      .from(SUPABASE_DEVICE_TABLE)
      .select("id, device_name, data")
      .eq("id", target.id)
      .maybeSingle();

    if (data?.data) {
      originalContext = { id: supabaseAdminEditandoDeviceId, name: supabaseAdminEditandoDeviceName };
      supabaseAdminEditandoDeviceId = data.id;
      supabaseAdminEditandoDeviceName = data.device_name || data.id;
      aplicarDatosCompartidosApp(data.data);
      guardarDatosLocalesSinSubir();
      cargarStorage();
    }
  }

  const origen = importData.data && typeof importData.data === "object" ? importData.data : importData;
  const nuevasPersonas = Array.isArray(origen.personas) ? origen.personas : [];
  const nuevosRegistros = Array.isArray(origen.registros) ? origen.registros : [];
  const nuevosPlanos = Array.isArray(origen.planos) ? origen.planos : [];
  const nuevasEncuestas = Array.isArray(origen.encuestas) ? origen.encuestas : [];
  const nuevosSeguimientos = Array.isArray(origen.seguimientos) ? origen.seguimientos : [];

  const basePorId = Object.fromEntries(categorias.map((c) => [Number(c.id), c.nombre]));
  const existentes = new Set(personas.map(normalizarClaveDuplicadoPersona));
  const duplicados = [];

  nuevasPersonas.forEach((p, idx) => {
    p.__import_tmp_id = `tmp_${idx}_${Date.now()}`;
    if (existentes.has(normalizarClaveDuplicadoPersona(p))) {
      duplicados.push({ nuevo: p, baseNombre: basePorId[Number(p.categoria_id)] || "Base" });
    }
  });

  const ignorar = pedirDuplicadosAImportar(duplicados);
  const idMap = {};

  nuevasPersonas.forEach((p) => {
    if (ignorar.has(p.__import_tmp_id)) return;
    const oldId = p.id;
    const newId = Date.now() + Math.floor(Math.random() * 999999);
    idMap[oldId] = newId;
    const limpio = { ...p, id: newId };
    delete limpio.__import_tmp_id;
    personas.push(limpio);
  });

  nuevosRegistros.forEach((r) => {
    const newPersonaId = idMap[r.persona_id] || r.persona_id;
    registros.push({ ...r, id: Date.now() + Math.floor(Math.random() * 999999), persona_id: newPersonaId });
  });

  nuevosPlanos.forEach((p) => planos.push({ ...p, id: Date.now() + Math.floor(Math.random() * 999999) }));
  nuevasEncuestas.forEach((e) => encuestas.push({ ...e, id: Date.now() + Math.floor(Math.random() * 999999) }));
  nuevosSeguimientos.forEach((s) => seguimientos.push({ ...s, id: Date.now() + Math.floor(Math.random() * 999999) }));

  guardarStorage();
  await guardarDatosCompartidosSupabaseAhora(true);
  renderTodo();

  if (originalContext) {
    supabaseAdminEditandoDeviceId = originalContext.id;
    supabaseAdminEditandoDeviceName = originalContext.name;
  }

  alert("Archivo importado y guardado en Supabase.");
}

function importarArchivoPersonalizadoNube() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".json,.gestion,application/json";

  input.onchange = async () => {
    const archivo = input.files && input.files[0];
    if (!archivo) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = JSON.parse(String(e.target.result || "{}"));
        const target = await elegirDispositivoAdminParaImportar();
        if (!target) return;
        await importarDataEnDispositivo(target, data);
      } catch (error) {
        alert("El archivo no es válido para importar. Usá un respaldo/exportación de la app; el PDF sirve para ver/imprimir, pero no contiene datos editables para importar.");
      }
    };
    reader.readAsText(archivo, "utf-8");
  };

  input.click();
}


function renderTodo() {
  renderSidebar();
  renderSelectCategorias();

  if (vista === "panel") renderPanel();
  else if (vista === "agenda") renderAgenda();
  else if (vista === "libro") renderLibro();
  else if (vista === "calcular") renderCalcular();
  else if (vista === "graficos") renderGraficos();
  else if (vista === "crearArchivo") renderCrearArchivo();
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

  const total = personas.length + planos.length + encuestas.length + seguimientos.length;

  $("totalPersonas").textContent =
    `${formatPersonas(total)} cargada${total !== 1 ? "s" : ""}`;

  let html = "";

  const categoriasNormales = categorias.filter((cat) => !cat.parent && cat.tipo !== "barrio");
  const categoriasBarrios = categorias.filter((cat) => cat.parent === "Barrios" || cat.parent === "Barrios y Localidades" || cat.tipo === "barrio");

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
      cerrarSidebarMobile();
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
  setTimeout(renderAdminPanelPrincipal, 0);

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
      <h3>Barrios y Localidades</h3>
      <span class="badge badge-indigo">${categorias.filter((cat) => cat.parent === "Barrios" || cat.parent === "Barrios y Localidades" || cat.tipo === "barrio").length} barrios/localidades</span>
    </div>
  `;

  document.querySelectorAll(".card[data-cat]").forEach((card) => {
    card.onclick = () => mostrarCategoria(Number(card.dataset.cat));
      cerrarSidebarMobile();
  });

  const cardBarrios = $("cardBarrios");
  if (cardBarrios) {
    cardBarrios.onclick = () => {
      barriosAbierto = true;
      renderSidebar();

      const primerBarrio = categorias.find((cat) => cat.parent === "Barrios" || cat.parent === "Barrios y Localidades" || cat.tipo === "barrio");
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

  if (catActiva?.tipo === "planos" || catActiva?.tipo === "encuesta" || catActiva?.tipo === "barrio" || catActiva?.tipo === "seguimiento") {
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

  if (catActiva.tipo === "seguimiento") {
    renderSeguimientos();
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

function categoriasDePersonaRelacionada(persona) {
  if (!persona) return [];

  if (persona.persona_grupo_id) {
    const ids = personas
      .filter((p) => p.persona_grupo_id === persona.persona_grupo_id)
      .map((p) => Number(p.categoria_id));
    return [...new Set(ids)];
  }

  const clave = [persona.nombre, persona.celular, persona.direccion, persona.barrio]
    .map((x) => String(x || "").trim().toLowerCase())
    .join("|");

  const ids = personas
    .filter((p) => [p.nombre, p.celular, p.direccion, p.barrio].map((x) => String(x || "").trim().toLowerCase()).join("|") === clave)
    .map((p) => Number(p.categoria_id));

  return [...new Set(ids.length ? ids : [Number(persona.categoria_id)])];
}

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

  const principal = persona?.categoria_id || categoriaId || "";
  $("categoriaSelect").value = principal;

  const seleccionadas = persona
    ? categoriasDePersonaRelacionada(persona)
    : principal
      ? [Number(principal)]
      : [];

  asegurarMultiBasePersona(seleccionadas);

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
  const categoriasDestino = categoriasSeleccionadasFormulario();

  const baseData = {
    nombre: $("nombre").value.trim(),
    celular: $("celular").value.trim(),
    direccion: $("direccion").value.trim(),
    barrio: $("barrio").value.trim(),
    motivo_consulta: $("motivo").value.trim(),
    fecha_carga: $("fechaCarga").value || new Date().toLocaleDateString("es-AR")
  };

  if (!baseData.nombre || !categoriasDestino.length) {
    alert("Completá Nombre y elegí al menos una Base de Datos de Destino.");
    return;
  }

  if (editandoId) {
    const original = personas.find((p) => Number(p.id) === Number(editandoId));
    const grupoId = original?.persona_grupo_id || `grupo_${editandoId}`;
    const relacionados = personas.filter((p) =>
      p.persona_grupo_id === grupoId || Number(p.id) === Number(editandoId)
    );

    personas = personas.filter((p) => !(p.persona_grupo_id === grupoId || Number(p.id) === Number(editandoId)));

    categoriasDestino.forEach((catId, index) => {
      const existente = relacionados.find((p) => Number(p.categoria_id) === Number(catId));
      personas.push({
        ...baseData,
        id: existente?.id || (Date.now() + index),
        categoria_id: Number(catId),
        persona_grupo_id: grupoId
      });
    });

    const categoriaId = Number(categoriasDestino[0]);
    guardarStorage();
    cerrarFormPersona();
    renderTodo();

    if (vista === "categoria") mostrarCategoria(categoriaId);
    return;
  }

  const primerId = Date.now();
  const grupoId = `grupo_${primerId}`;

  categoriasDestino.forEach((catId, index) => {
    personas.push({
      ...baseData,
      id: primerId + index,
      categoria_id: Number(catId),
      persona_grupo_id: grupoId
    });
  });

  const categoriaGuardadaId = Number(categoriasDestino[0]);

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
          parent: "Barrios y Localidades",
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









function textoParecePreguntaOCR(texto) {
  const t = String(texto || "").trim();
  const n = normalizarOCR(t);

  if (!t) return false;

  // Evita títulos.
  if (/^barrio\s+/i.test(t) || n.includes("coronelsuarez")) return false;

  // Evita líneas de opciones solas.
  if (/^(o|0)?\s*(si|sí|no)\s*$/i.test(t)) return false;

  // Preguntas con signos.
  if (t.includes("¿") || t.includes("?")) return true;

  // Si el OCR no leyó el signo, igual aceptamos frases típicas de encuesta.
  return /^(hay|tiene|se siente|el barrio|la vivienda|existe|cuenta|posee|dispone|recibe|faltan|necesita|hay\s+)/i.test(t);
}

function agregarPreguntaOCRLista(lista, preguntaObj) {
  if (!preguntaObj || !preguntaObj.pregunta) return;

  const pregunta = limpiarPreguntaOCR(preguntaObj.pregunta);
  if (!pregunta || pregunta.length < 6) return;

  const key = normalizarPregunta(pregunta);

  const existe = lista.some((p) => normalizarPregunta(p.pregunta) === key);
  if (existe) return;

  lista.push({
    ...preguntaObj,
    pregunta
  });
}

function ordenarPreguntasOCR(preguntas) {
  return (preguntas || []).sort((a, b) => {
    const ay = a?.bbox?.y0 ?? 999999;
    const by = b?.bbox?.y0 ?? 999999;
    return ay - by;
  });
}



function valorCampo(id) {
  return String($(id)?.value || "").trim();
}

function datosEncuestaDesdeFormulario() {
  return {
    nombre_persona: valorCampo("encDatoNombre"),
    telefono: valorCampo("encDatoTelefono"),
    dni: valorCampo("encDatoDni"),
    fecha: valorCampo("encDatoFecha"),
    barrio: valorCampo("encDatoBarrio") || catActiva?.nombre || "",
    direccion_numero: valorCampo("encDatoDireccion")
  };
}

function htmlDatosEncuesta(datos) {
  const d = datos || {};
  const filas = [
    ["Nombre", d.nombre_persona],
    ["Teléfono", d.telefono],
    ["DNI", d.dni],
    ["Fecha", d.fecha],
    ["Barrio", d.barrio],
    ["Dirección y número", d.direccion_numero]
  ].filter(([, v]) => String(v || "").trim());

  if (!filas.length) return "";

  return `
    <div class="datos-encuesta-box">
      <h4>👤 Datos de la encuesta</h4>
      <div class="datos-encuesta-grid">
        ${filas.map(([k, v]) => `
          <div><b>${escapeHtml(k)}:</b> ${escapeHtml(v)}</div>
        `).join("")}
      </div>
    </div>
  `;
}

function etiquetaRespuesta(valor) {
  const raw = String(valor || "").trim();
  const n = normalizarOCR(raw);

  if (n === "si" || n === "s") return "Sí";
  if (n === "no" || n === "n") return "No";
  if (n === "bueno" || n === "buena") return "Bueno";
  if (n === "regular") return "Regular";
  if (n === "malo" || n === "mala") return "Malo";
  if (n === "propia") return "Propia";
  if (n === "alquilada") return "Alquilada";
  if (n === "prestada") return "Prestada";
  if (n === "caps") return "CAPS";
  return raw || "Sin respuesta";
}

function claveRespuesta(valor) {
  return normalizarOCR(etiquetaRespuesta(valor)) || "sinrespuesta";
}

function opcionesRespuestaPregunta(p) {
  const opciones = Array.isArray(p?.opciones) && p.opciones.length
    ? p.opciones
    : ["Sí", "No"];

  const limpias = [];
  opciones.forEach((op) => {
    const label = etiquetaRespuesta(op);
    if (!limpias.some((x) => claveRespuesta(x) === claveRespuesta(label))) {
      limpias.push(label);
    }
  });

  return limpias.length ? limpias : ["Sí", "No"];
}

function esOpcionRespuestaOCR(w) {
  const t = normalizarOCR(w?.texto || w || "");
  return [
    "si", "s", "no", "n",
    "bueno", "buena", "regular", "malo", "mala",
    "propia", "alquilada", "prestada", "otra",
    "caps", "hospital", "privado"
  ].includes(t);
}

function detectarOpcionesFilaOCR(palabras) {
  const opts = [];

  (palabras || []).forEach((w) => {
    const n = normalizarOCR(w.texto);

    let label = "";
    if (n === "si" || n === "s") label = "Sí";
    else if (n === "no" || n === "n") label = "No";
    else if (n === "bueno" || n === "buena") label = "Bueno";
    else if (n === "regular") label = "Regular";
    else if (n === "malo" || n === "mala") label = "Malo";

    if (label && !opts.some((o) => claveRespuesta(o.label) === claveRespuesta(label))) {
      opts.push({ label, bbox: w.bbox });
    }
  });

  return opts;
}

function obtenerTextoAntesDeOpciones(palabras) {
  const idx = (palabras || []).findIndex((w) => esOpcionRespuestaOCR(w));
  const base = idx >= 0 ? palabras.slice(0, idx) : palabras;

  return base.map((w) => w.texto).join(" ").replace(/\s+/g, " ").trim();
}

function textoFilaOCR(fila) {
  return (fila?.palabras || []).map((w) => w.texto).join(" ").replace(/\s+/g, " ").trim();
}

function esTituloSeccionOCR(texto) {
  const t = String(texto || "").trim();
  const n = normalizarOCR(t);

  if (!t || t.length < 3) return false;
  if (textoParecePreguntaOCR(t)) return false;
  if (["aspecto", "tema", "nivel educativo alcanzado"].includes(n)) return false;

  const letras = t.replace(/[^A-Za-zÁÉÍÓÚÑáéíóúñ]/g, "");
  if (!letras) return false;

  const mayus = letras.replace(/[^A-ZÁÉÍÓÚÑ]/g, "").length;
  return mayus / letras.length > 0.65 || [
    "vivienda", "salud", "lugar de atencion", "infraestructura",
    "educacion y formacion", "ambiente", "comunidad", "desarrollo social"
  ].includes(n);
}

function detectarHeadersMultiplesOCR(fila) {
  const palabras = fila?.palabras || [];
  const opciones = detectarOpcionesFilaOCR(palabras);

  if (opciones.length >= 2) {
    return opciones;
  }

  return null;
}

function xCheckboxParaOpcion(opcion, tipo = "inline", proxima = null) {
  const b = opcion?.bbox;
  if (!b) return null;

  if (tipo === "tabla") {
    return b.x0 + Math.min(24, Math.max(8, (b.x1 - b.x0) * 0.25));
  }

  const dist = proxima?.bbox
    ? Math.max(24, Math.min(75, (proxima.bbox.x0 - b.x0) * 0.35))
    : Math.max(24, Math.min(70, (b.x1 - b.x0) * 1.3));

  return b.x0 - dist;
}

function crearPreguntaOCRConOpciones({ pregunta, bbox, opciones, tipoOpciones = "inline", metodo = "OCR multiple choice" }) {
  const ops = (opciones || []).map((op, idx, arr) => {
    const label = etiquetaRespuesta(op.label || op);
    const boxX = op.boxX ?? xCheckboxParaOpcion(op, tipoOpciones, arr[idx + 1]);

    return {
      label,
      bbox: op.bbox || null,
      boxX,
      tipo: tipoOpciones
    };
  }).filter((op) => op.label);

  return {
    pregunta: limpiarPreguntaOCR(pregunta),
    bbox,
    opciones: ops.map((o) => o.label),
    opcionesBoxes: ops,
    respuesta: ops[0]?.label || "Sí",
    detectado: true,
    metodo
  };
}

function construirPreguntasMultipleChoiceDesdePalabrasOCR(palabrasOCR) {
  const filas = agruparPalabrasPorRenglonOCR(palabrasOCR);
  const preguntas = [];
  let seccionActual = "";
  let headersTabla = null;

  // Primer método: tabla por columnas / encabezados.
  reconstruirFilasTablaPorColumnasOCR(filas).forEach((p) => agregarPreguntaOCRLista(preguntas, p));

  filas.forEach((fila) => {
    const palabras = fila.palabras || [];
    const texto = textoFilaOCR(fila);
    const n = normalizarOCR(texto);

    if (!texto) return;

    if (esTituloSeccionOCR(texto)) {
      seccionActual = texto.replace(/[:]+$/g, "").trim();
      headersTabla = null;
      return;
    }

    const headers = detectarHeadersMultiplesOCR(fila);

    if (
      headers &&
      headers.length >= 2 &&
      (
        n.includes("bueno") ||
        n.includes("regular") ||
        n.includes("malo") ||
        n.includes("sino") ||
        n.includes("aspecto") ||
        n.includes("tema")
      )
    ) {
      headersTabla = headers.map((h) => ({ ...h, tipo: "tabla" }));
      return;
    }

    const opcionesInline = detectarOpcionesFilaOCR(palabras);
    if (textoParecePreguntaOCR(texto) && opcionesInline.length >= 2) {
      const preguntaTxt = obtenerTextoAntesDeOpciones(palabras) || texto;
      const baseBbox = {
        x0: Math.min(...palabras.map((w) => w.bbox.x0)),
        y0: Math.min(...palabras.map((w) => w.bbox.y0)),
        x1: Math.max(...palabras.map((w) => w.bbox.x1)),
        y1: Math.max(...palabras.map((w) => w.bbox.y1))
      };

      agregarPreguntaOCRLista(preguntas, crearPreguntaOCRConOpciones({
        pregunta: preguntaTxt,
        bbox: baseBbox,
        opciones: opcionesInline,
        tipoOpciones: "inline",
        metodo: "OCR pregunta con opciones"
      }));
      return;
    }

    if (headersTabla && palabras.length) {
      const minHeaderX = Math.min(...headersTabla.map((h) => h.bbox.x0 || 999999));
      const palabrasPregunta = palabras.filter((w) => minHeaderX === 999999 || w.bbox.x0 < minHeaderX - 10);
      const preguntaTxt = palabrasPregunta.length
        ? palabrasPregunta.map((w) => w.texto).join(" ").replace(/\s+/g, " ").trim()
        : texto.replace(/\b(bueno|regular|malo|mala|si|sí|no)\b/gi, "").trim();

      if (preguntaTxt && preguntaTxt.length >= 3 && !esOpcionRespuestaOCR(preguntaTxt)) {
        const baseBbox = {
          x0: Math.min(...palabras.map((w) => w.bbox.x0)),
          y0: Math.min(...palabras.map((w) => w.bbox.y0)),
          x1: Math.max(...palabras.map((w) => w.bbox.x1)),
          y1: Math.max(...palabras.map((w) => w.bbox.y1))
        };

        const preguntaFinal = seccionActual ? `${seccionActual} - ${preguntaTxt}` : preguntaTxt;

        agregarPreguntaOCRLista(preguntas, crearPreguntaOCRConOpciones({
          pregunta: preguntaFinal,
          bbox: baseBbox,
          opciones: headersTabla,
          tipoOpciones: "tabla",
          metodo: "OCR tabla multiple choice"
        }));
      }
    }
  });

  return ordenarPreguntasOCR(preguntas);
}






function textoCeldaDocx(celda) {
  return Array.from(celda.getElementsByTagName("w:t"))
    .map((n) => n.textContent || "")
    .join("")
    .replace(/\s+/g, " ")
    .trim();
}

function limpiarHeaderTablaDocx(texto) {
  return String(texto || "")
    .replace(/\s+/g, " ")
    .replace(/N\s*°/gi, "N°")
    .trim();
}

function opcionesParaColumnaTablaDocx(header, valores = []) {
  const h = normalizarOCR(header);
  const unicos = [...new Set((valores || []).map((v) => etiquetaRespuesta(v)).filter(Boolean))]
    .filter((v) => normalizarOCR(v) && !/^_+$/.test(v));

  if (h.includes("estado")) return ["Pendiente", "En tratamiento", "Resuelto"];
  if (h.includes("derivacion") || h.includes("accionrealizada")) return ["Sí", "No"];
  if (h.includes("arearesponsable")) {
    return ["Obras Públicas", "Salud", "Desarrollo Social", "Educación", "Ambiente", "Seguridad", "Otro"];
  }
  if (h.includes("problematica")) {
    return unicos.length >= 2 ? unicos.slice(0, 8) : ["Cloacas", "Alumbrado", "Calles", "Limpieza", "Seguridad", "Salud", "Otro"];
  }
  if (h.includes("observaciones")) return ["Con observación", "Sin observación"];

  if (unicos.length >= 2 && unicos.length <= 8) return unicos;

  return ["Completar", "Pendiente", "No corresponde"];
}

function preguntasDesdeTablaDocx(rows, tablaIndex = 1) {
  if (!Array.isArray(rows) || rows.length < 1) return [];

  const limpias = rows
    .map((r) => r.map((c) => limpiarHeaderTablaDocx(c)).filter((c) => c))
    .filter((r) => r.length);

  if (!limpias.length) return [];

  const header = limpias[0];
  const preguntas = [];

  // Caso encuesta clásica: primera columna tema/aspecto, columnas siguientes son opciones.
  const headerNorm = header.map((h) => normalizarOCR(h));
  const tieneOpcionesEnHeader =
    header.length >= 3 &&
    (
      headerNorm.includes("bueno") ||
      headerNorm.includes("regular") ||
      headerNorm.includes("malo") ||
      headerNorm.includes("si") ||
      headerNorm.includes("no")
    );

  if (tieneOpcionesEnHeader) {
    const opciones = header.slice(1).map((h) => etiquetaRespuesta(h)).filter(Boolean);

    limpias.slice(1).forEach((row) => {
      const tema = row[0];
      if (!tema || normalizarOCR(tema).includes("tema") || normalizarOCR(tema).includes("aspecto")) return;

      preguntas.push({
        pregunta: `Tabla ${tablaIndex} - ${tema}`,
        opciones: opciones.length ? opciones : ["Sí", "No"],
        respuesta: opciones[0] || "Sí",
        detectado: true,
        metodo: "DOCX tabla encuesta"
      });
    });

    return preguntas;
  }

  // Caso planilla de seguimiento: columnas tipo Estado, Área responsable, etc.
  const tituloTabla = header.some((h) => normalizarOCR(h).includes("problematica"))
    ? "Seguimiento de problemáticas barriales"
    : `Tabla ${tablaIndex}`;

  header.forEach((col, colIndex) => {
    const n = normalizarOCR(col);
    if (!col || n === "n" || n === "numero" || n.includes("domicilio") || n.includes("fecha")) return;

    const valores = limpias.slice(1).map((row) => row[colIndex] || "").filter(Boolean);
    const opciones = opcionesParaColumnaTablaDocx(col, valores);

    preguntas.push({
      pregunta: `${tituloTabla} - ${col}`,
      opciones,
      respuesta: opciones[0] || "Completar",
      detectado: true,
      metodo: "DOCX tabla seguimiento"
    });
  });

  return preguntas;
}

async function extraerEncuestaDesdeDocx(archivo) {
  if (!window.JSZip) {
    throw new Error("JSZip no está cargado.");
  }

  const zip = await window.JSZip.loadAsync(archivo);
  const xmlText = await zip.file("word/document.xml")?.async("text");

  if (!xmlText) {
    throw new Error("No se pudo leer el Word.");
  }

  const xml = new DOMParser().parseFromString(xmlText, "application/xml");
  const bodyText = Array.from(xml.getElementsByTagName("w:t"))
    .map((n) => n.textContent || "")
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

  const tables = Array.from(xml.getElementsByTagName("w:tbl"));
  let preguntas = [];

  tables.forEach((tbl, idx) => {
    const rows = Array.from(tbl.getElementsByTagName("w:tr")).map((tr) =>
      Array.from(tr.getElementsByTagName("w:tc")).map((tc) => textoCeldaDocx(tc))
    );

    preguntas.push(...preguntasDesdeTablaDocx(rows, idx + 1));
  });

  // Campos generales del documento como informe.
  const informeDocx = bodyText.slice(0, 1800);

  if (!preguntas.length) {
    const lineas = bodyText
      .split(/(?=¿|Pregunta|Tema|Estado|Observaciones|Problemática)/i)
      .map((x) => x.trim())
      .filter(Boolean);

    lineas.forEach((linea, i) => {
      if (linea.length < 4) return;

      preguntas.push({
        pregunta: `Word - ${linea.slice(0, 80)}${linea.length > 80 ? "..." : ""}`,
        opciones: ["Completar", "Pendiente", "Resuelto"],
        respuesta: "Completar",
        detectado: true,
        metodo: "DOCX texto"
      });
    });
  }

  return {
    preguntas: preguntas.slice(0, 60),
    informe: informeDocx
  };
}

async function leerEncuestaDesdeWord({ nombre, nombreArchivo, tipo, dataUrl, informe = "", datos = {}, archivo }) {
  encuestaOCRTrabajando = true;
  renderBarrio();

  const barrioCreacionId = catActiva?.id;

  try {
    if (!archivo) throw new Error("Archivo Word no disponible.");

    const resultado = await extraerEncuestaDesdeDocx(archivo);

    encuestaOCRTrabajando = false;

    const preguntas = resultado.preguntas.length
      ? resultado.preguntas
      : [
          {
            pregunta: "Word - Estado del seguimiento",
            opciones: ["Pendiente", "En tratamiento", "Resuelto"],
            respuesta: "Pendiente",
            detectado: false,
            metodo: "DOCX manual"
          }
        ];

    encuestaPendienteRevision = {
      id: Date.now(),
      barrio_id: barrioCreacionId,
      barrio_nombre: categorias.find((c) => Number(c.id) === Number(barrioCreacionId))?.nombre || catActiva?.nombre || "",
      nombre,
      informe: String(informe || resultado.informe || "").trim(),
      datos: datos || {},
      telefono: "",
      direccion: "",
      observaciones: "",
      preguntas,
      archivo: dataUrl,
      nombreArchivo,
      tipo: "word",
      textoOCR: resultado.informe || "",
      fecha: new Date().toLocaleDateString("es-AR")
    };

    renderBarrio();
  } catch (error) {
    encuestaOCRTrabajando = false;

    crearEncuestaManualDesdeArchivo({
      nombre,
      informe,
      datos,
      nombreArchivo,
      tipo: "word",
      dataUrl,
      barrio_id: barrioCreacionId,
      barrio_nombre: categorias.find((c) => Number(c.id) === Number(barrioCreacionId))?.nombre || catActiva?.nombre || ""
    });

    if (encuestaPendienteRevision) {
      encuestaPendienteRevision.preguntas = [
        {
          pregunta: "Word - Estado del seguimiento",
          opciones: ["Pendiente", "En tratamiento", "Resuelto"],
          respuesta: "Pendiente",
          detectado: false,
          metodo: "DOCX manual"
        }
      ];
      encuestaPendienteRevision.ocrError = "El Word se cargó, pero no se pudieron leer automáticamente las tablas. Configurá las preguntas y respuestas.";
    }

    renderBarrio();
  }
}


function archivoEsWord(archivo) {
  const nombre = String(archivo?.name || "").toLowerCase();
  const tipo = String(archivo?.type || "").toLowerCase();

  return (
    nombre.endsWith(".doc") ||
    nombre.endsWith(".docx") ||
    tipo.includes("word") ||
    tipo.includes("officedocument.wordprocessingml")
  );
}

function dataUrlEsWord(dataUrl, nombre = "") {
  const n = String(nombre || "").toLowerCase();
  const d = String(dataUrl || "").toLowerCase();

  return (
    n.endsWith(".doc") ||
    n.endsWith(".docx") ||
    d.includes("application/msword") ||
    d.includes("officedocument.wordprocessingml")
  );
}

function linkDescargaArchivo(nombre, dataUrl) {
  if (!dataUrl) return "";
  return `<a class="archivo-link-descarga" href="${dataUrl}" download="${escapeHtml(nombre || "archivo")}">📄 Descargar / abrir archivo Word</a>`;
}

function esPreguntaPlantillaInfra(p) {
  const n = normalizarPregunta(p?.pregunta || "");
  return (
    n.includes("lugar de atencion") ||
    n.includes("infraestructura") ||
    n.includes("educacion y formacion")
  );
}

function detectarComponentesCasillas(ctx) {
  const canvas = ctx.canvas;
  const w = canvas.width;
  const h = canvas.height;
  const img = ctx.getImageData(0, 0, w, h);
  const data = img.data;
  const visited = new Uint8Array(w * h);

  const esPixel = (x, y) => {
    if (x < 0 || y < 0 || x >= w || y >= h) return false;
    const i = (y * w + x) * 4;
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const brillo = (r + g + b) / 3;
    const sat = Math.max(r, g, b) - Math.min(r, g, b);

    // Negro/gris de bordes + azul/verde de marcas.
    return brillo < 120 || (sat > 35 && brillo < 210);
  };

  const comps = [];
  const paso = Math.max(1, Math.floor(w / 900));

  for (let y = Math.floor(h * 0.05); y < Math.floor(h * 0.92); y += paso) {
    for (let x = Math.floor(w * 0.22); x < Math.floor(w * 0.94); x += paso) {
      const idx = y * w + x;
      if (visited[idx] || !esPixel(x, y)) continue;

      const stack = [[x, y]];
      visited[idx] = 1;

      let minX = x, maxX = x, minY = y, maxY = y, count = 0;

      while (stack.length) {
        const [cx, cy] = stack.pop();
        count++;
        if (cx < minX) minX = cx;
        if (cx > maxX) maxX = cx;
        if (cy < minY) minY = cy;
        if (cy > maxY) maxY = cy;

        const vecinos = [
          [cx + paso, cy],
          [cx - paso, cy],
          [cx, cy + paso],
          [cx, cy - paso]
        ];

        for (const [nx, ny] of vecinos) {
          if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
          const ni = ny * w + nx;
          if (visited[ni] || !esPixel(nx, ny)) continue;
          visited[ni] = 1;
          stack.push([nx, ny]);
        }
      }

      const bw = maxX - minX + 1;
      const bh = maxY - minY + 1;
      const ratio = bw / Math.max(1, bh);

      if (bw >= 5 && bh >= 5 && bw <= w * 0.045 && bh <= h * 0.035 && ratio > 0.45 && ratio < 2.2) {
        const cx = (minX + maxX) / 2;
        const cy = (minY + maxY) / 2;

        // Evita letras al inicio del texto: nos quedamos con zonas de casilleros.
        if (cx > w * 0.28) {
          comps.push({ x0: minX, y0: minY, x1: maxX, y1: maxY, cx, cy, w: bw, h: bh, count });
        }
      }
    }
  }

  return comps;
}

function scoreMarcaCasilla(ctx, comp) {
  const canvas = ctx.canvas;
  const cx = comp.cx;
  const cy = comp.cy;
  const r = Math.max(5, Math.min(18, Math.max(comp.w, comp.h) * 0.65));

  const sx = Math.max(0, Math.floor(cx - r));
  const sy = Math.max(0, Math.floor(cy - r));
  const sw = Math.min(canvas.width - sx, Math.floor(r * 2));
  const sh = Math.min(canvas.height - sy, Math.floor(r * 2));

  if (sw <= 0 || sh <= 0) return 0;

  const data = ctx.getImageData(sx, sy, sw, sh).data;
  let marca = 0;
  let total = 0;

  for (let i = 0; i < data.length; i += 4) {
    const px = (i / 4) % sw;
    const py = Math.floor((i / 4) / sw);

    // Miramos centro, no borde.
    if (px < sw * 0.22 || px > sw * 0.78 || py < sh * 0.22 || py > sh * 0.78) continue;

    const rr = data[i], gg = data[i + 1], bb = data[i + 2];
    const brillo = (rr + gg + bb) / 3;
    const sat = Math.max(rr, gg, bb) - Math.min(rr, gg, bb);
    const azul = bb > rr + 15 && bb > gg - 10;
    const oscuro = brillo < 135;

    if ((sat > 28 && brillo < 215) || azul || oscuro) marca++;
    total++;
  }

  return total ? marca / total : 0;
}

function agruparCasillasPorFila(casillas) {
  const ordenadas = [...casillas].sort((a, b) => a.cy - b.cy || a.cx - b.cx);
  const filas = [];

  ordenadas.forEach((c) => {
    let fila = filas.find((f) => Math.abs(f.cy - c.cy) < Math.max(12, c.h * 1.8));

    if (!fila) {
      fila = { cy: c.cy, casillas: [] };
      filas.push(fila);
    }

    fila.casillas.push(c);
    fila.cy = (fila.cy * (fila.casillas.length - 1) + c.cy) / fila.casillas.length;
  });

  filas.forEach((f) => f.casillas.sort((a, b) => a.cx - b.cx));

  return filas.sort((a, b) => a.cy - b.cy);
}

async function detectarPlantillaInfraestructuraPorImagen(dataUrl, preguntas) {
  try {
    if (!dataUrl || !Array.isArray(preguntas) || !preguntas.some(esPreguntaPlantillaInfra)) return preguntas;

    const img = await cargarImagenParaCanvas(dataUrl);
    const canvas = document.createElement("canvas");
    const maxW = 1200;
    const escala = Math.min(1, maxW / (img.naturalWidth || img.width));
    canvas.width = Math.round((img.naturalWidth || img.width) * escala);
    canvas.height = Math.round((img.naturalHeight || img.height) * escala);

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    const comps = detectarComponentesCasillas(ctx)
      .map((c) => ({ ...c, score: scoreMarcaCasilla(ctx, c) }))
      .filter((c) => c.score > 0.012 || c.count > 8);

    const filas = agruparCasillasPorFila(comps)
      .filter((f) => f.casillas.length >= 1)
      .sort((a, b) => a.cy - b.cy);

    if (!filas.length) return preguntas;

    const copia = preguntas.map((p) => ({ ...p }));

    const setRespuesta = (patron, respuesta) => {
      const item = copia.find((p) => normalizarPregunta(p.pregunta).includes(patron));
      if (item) item.respuesta = respuesta;
    };

    // Tomamos filas con casillas ubicadas desde la zona superior del formulario.
    // Mapea: 5 filas de Lugar de atención, 6 filas de Infraestructura, 1 fila de educación.
    let idx = 0;

    const lugar = [
      ["caps", "Sí"],
      ["hospital municipal", "Sí"],
      ["hospital y caps", "Sí"],
      ["privado", "Sí"],
      ["otro", "Sí"]
    ];

    lugar.forEach(([pat]) => {
      const fila = filas[idx++];
      if (!fila) return;
      const marcada = fila.casillas.some((c) => c.score > 0.055);
      setRespuesta(`lugar de atencion ${pat}`, marcada ? "Sí" : "No");
    });

    const infra = [
      "agua corriente",
      "alumbrado publico",
      "cloacas",
      "estado de calles",
      "limpieza y recoleccion de residuos",
      "estado de espacios publicos"
    ];

    infra.forEach((pat) => {
      const fila = filas[idx++];
      if (!fila) return;

      const casillas = fila.casillas.slice(-3).sort((a, b) => a.cx - b.cx);
      let respuesta = "Bueno";

      if (casillas.length >= 3) {
        const scores = casillas.map((c, i) => ({ i, score: c.score })).sort((a, b) => b.score - a.score);
        if (scores[0].i === 0) respuesta = "Bueno";
        if (scores[0].i === 1) respuesta = "Regular";
        if (scores[0].i === 2) respuesta = "Malo";
      } else {
        const marcada = fila.casillas.sort((a, b) => b.score - a.score)[0];
        if (marcada) {
          const rel = marcada.cx / canvas.width;
          respuesta = rel < 0.55 ? "Bueno" : rel < 0.72 ? "Regular" : "Malo";
        }
      }

      setRespuesta(`infraestructura ${pat}`, respuesta);
    });

    // Educación: fila con Sí/No.
    const filaEdu = filas[idx];
    if (filaEdu) {
      const casillas = filaEdu.casillas.slice(-2).sort((a, b) => a.cx - b.cx);
      if (casillas.length >= 2) {
        setRespuesta("educacion y formacion", casillas[0].score >= casillas[1].score ? "Sí" : "No");
      }
    }

    return copia;
  } catch (e) {
    return preguntas;
  }
}

function svgPieMulticolor(opciones, conteos, total) {
  const cx = 90;
  const cy = 90;
  const r = 70;
  const circ = 2 * Math.PI * r;
  let offset = 0;
  const colores = ["#2563eb", "#ef4444", "#22c55e", "#f97316", "#8b5cf6", "#14b8a6"];

  const partes = opciones.map((op, i) => {
    const key = claveRespuesta(op);
    const val = conteos[key] || 0;
    const len = total ? (val / total) * circ : 0;
    const stroke = colores[i % colores.length];
    const el = `
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${stroke}" stroke-width="34"
        stroke-dasharray="${len} ${circ - len}"
        stroke-dashoffset="${-offset}"
        transform="rotate(-90 ${cx} ${cy})"
        stroke-linecap="butt"></circle>
    `;
    offset += len;
    return el;
  }).join("");

  return `
    <svg class="pie-svg-app" width="150" height="150" viewBox="0 0 180 180" xmlns="http://www.w3.org/2000/svg">
      <circle cx="${cx}" cy="${cy}" r="${r + 10}" fill="#f8fafc" stroke="#e5e7eb" stroke-width="2"></circle>
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#e5e7eb" stroke-width="34"></circle>
      ${partes}
      <circle cx="${cx}" cy="${cy}" r="42" fill="#ffffff" stroke="#e5e7eb" stroke-width="2"></circle>
    </svg>
  `;
}


function preguntasPlantillaInfraestructura() {
  return [
    "Lugar de atención - CAPS",
    "Lugar de atención - Hospital Municipal",
    "Lugar de atención - Hospital y CAPS",
    "Lugar de atención - Privado",
    "Lugar de atención - Otro",
    "Infraestructura - Agua corriente",
    "Infraestructura - Alumbrado público",
    "Infraestructura - Cloacas",
    "Infraestructura - Estado de calles",
    "Infraestructura - Limpieza y recolección de residuos",
    "Infraestructura - Estado de espacios públicos"
  ];
}

function crearPreguntaRevisionRapida(tipo = "sino") {
  if (!encuestaPendienteRevision) return;

  const opciones = tipo === "brm"
    ? ["Bueno", "Regular", "Malo"]
    : tipo === "atencion"
      ? ["CAPS", "Hospital Municipal", "Hospital y CAPS", "Privado", "Otro"]
      : ["Sí", "No"];

  encuestaPendienteRevision.preguntas.push({
    pregunta: tipo === "brm" ? "Infraestructura - Nueva pregunta?" : "Nueva pregunta?",
    opciones,
    respuesta: opciones[0],
    detectado: false,
    metodo: "Manual multiple choice"
  });

  renderBarrio();
}

function cargarPlantillaInfraestructuraRevision() {
  if (!encuestaPendienteRevision) return;

  const existentes = new Set((encuestaPendienteRevision.preguntas || []).map((p) => normalizarPregunta(p.pregunta)));

  const nuevas = [
    ...["CAPS", "Hospital Municipal", "Hospital y CAPS", "Privado", "Otro"].map((x) => ({
      pregunta: `Lugar de atención - ${x}`,
      opciones: ["Sí", "No"],
      respuesta: "No",
      detectado: false,
      metodo: "Plantilla lugar de atención"
    })),
    ...["Agua corriente", "Alumbrado público", "Cloacas", "Estado de calles", "Limpieza y recolección de residuos", "Estado de espacios públicos"].map((x) => ({
      pregunta: `Infraestructura - ${x}`,
      opciones: ["Bueno", "Regular", "Malo"],
      respuesta: "Bueno",
      detectado: false,
      metodo: "Plantilla infraestructura"
    })),
    {
      pregunta: "Educación y formación - ¿Conoce el Centro Regional Educativo Universitario Suarense?",
      opciones: ["Sí", "No"],
      respuesta: "Sí",
      detectado: false,
      metodo: "Plantilla educación"
    }
  ].filter((p) => !existentes.has(normalizarPregunta(p.pregunta)));

  encuestaPendienteRevision.preguntas.push(...nuevas);

  const archivo = encuestaPendienteRevision.archivo || encuestaPendienteRevision.imagen || "";

  if (archivo && !dataUrlEsWord(archivo, encuestaPendienteRevision.nombreArchivo)) {
    detectarPlantillaInfraestructuraPorImagen(archivo, encuestaPendienteRevision.preguntas).then((preguntas) => {
      if (!encuestaPendienteRevision) return;
      encuestaPendienteRevision.preguntas = preguntas;
      renderBarrio();
    });
  }

  renderBarrio();
}


function reconstruirFilasTablaPorColumnasOCR(filas) {
  const preguntas = [];
  let seccionActual = "";
  let headersTabla = null;

  filas.forEach((fila) => {
    const texto = textoFilaOCR(fila);
    const n = normalizarOCR(texto);
    const palabras = fila.palabras || [];

    if (!texto) return;

    if (esTituloSeccionOCR(texto)) {
      seccionActual = texto.replace(/[:]+$/g, "").trim();
      headersTabla = null;
      return;
    }

    const tieneBuenoRegularMalo =
      n.includes("bueno") && n.includes("regular") && (n.includes("malo") || n.includes("mala"));

    const tieneSiNo =
      (n.includes("si") && n.includes("no")) &&
      (n.includes("tema") || n.includes("aspecto") || n === "sino");

    if (tieneBuenoRegularMalo || tieneSiNo) {
      const opts = detectarOpcionesFilaOCR(palabras);

      if (opts.length >= 2) {
        headersTabla = opts.map((h) => ({ ...h, tipo: "tabla" }));
      } else if (tieneBuenoRegularMalo) {
        headersTabla = [
          { label: "Bueno", bbox: { x0: 0, x1: 0 }, tipo: "tabla" },
          { label: "Regular", bbox: { x0: 0, x1: 0 }, tipo: "tabla" },
          { label: "Malo", bbox: { x0: 0, x1: 0 }, tipo: "tabla" }
        ];
      } else {
        headersTabla = [
          { label: "Sí", bbox: { x0: 0, x1: 0 }, tipo: "tabla" },
          { label: "No", bbox: { x0: 0, x1: 0 }, tipo: "tabla" }
        ];
      }

      return;
    }

    if (!headersTabla || !palabras.length) return;

    const textoFila = texto
      .replace(/\b(bueno|regular|malo|mala|si|sí|no)\b/gi, "")
      .replace(/\s+/g, " ")
      .trim();

    if (!textoFila || textoFila.length < 3) return;
    if (esTituloSeccionOCR(textoFila)) return;

    const preguntaFinal = seccionActual ? `${seccionActual} - ${textoFila}` : textoFila;

    const bbox = {
      x0: Math.min(...palabras.map((w) => w.bbox.x0)),
      y0: Math.min(...palabras.map((w) => w.bbox.y0)),
      x1: Math.max(...palabras.map((w) => w.bbox.x1)),
      y1: Math.max(...palabras.map((w) => w.bbox.y1))
    };

    agregarPreguntaOCRLista(preguntas, crearPreguntaOCRConOpciones({
      pregunta: preguntaFinal,
      bbox,
      opciones: headersTabla,
      tipoOpciones: "tabla",
      metodo: "OCR tabla por columnas"
    }));
  });

  return ordenarPreguntasOCR(preguntas);
}

async function mejorarImagenParaOCR(dataUrl, maxWidth = 1600) {
  const img = await cargarImagenParaCanvas(dataUrl);

  const escala = Math.min(1, maxWidth / (img.naturalWidth || img.width));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round((img.naturalWidth || img.width) * escala);
  canvas.height = Math.round((img.naturalHeight || img.height) * escala);

  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imgData.data;

  for (let i = 0; i < data.length; i += 4) {
    const gris = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
    const contraste = gris < 175 ? Math.max(0, gris - 45) : Math.min(255, gris + 25);
    data[i] = data[i + 1] = data[i + 2] = contraste;
  }

  ctx.putImageData(imgData, 0, 0);
  return canvas.toDataURL("image/jpeg", 0.92);
}


function normalizarTextoPreguntaOCR(texto) {
  let t = String(texto || "")
    .replace(/\s+/g, " ")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[|]/g, "I")
    .trim();

  // Quita basura inicial común de OCR, pero conserva signo de apertura.
  t = t.replace(/^[\s:;,.·•°_\-–—]+/g, "");

  // Corrige signos de apertura mal leídos.
  t = t
    .replace(/^([iI!¡;:])\s*(hay|tiene|se|el|la|los|las|existe|cuenta|posee|dispone|recibe|hay)/i, "¿$2")
    .replace(/^\?\s*/, "¿")
    .replace(/^([Hh]ay|[Tt]iene|[Ss]e|[Ee]l|[Ll]a|[Ee]xiste|[Cc]uenta|[Pp]osee|[Dd]ispone|[Rr]ecibe)\b/, "¿$1");

  // Corrige cierre de pregunta mal leído al final.
  t = t
    .replace(/[¿?]+/g, "?")
    .replace(/\s+\?/g, "?")
    .replace(/[;:!¡]\s*$/g, "?")
    .replace(/[2]\s*$/g, "?")
    .trim();

  // Si quedó "?Hay", lo volvemos "¿Hay".
  t = t.replace(/^\?([A-Za-zÁÉÍÓÚÑáéíóúñ])/, "¿$1");

  return t;
}

function limpiarPreguntaOCR(linea) {
  let texto = normalizarTextoPreguntaOCR(linea);

  // Si OCR mezcló la pregunta con opciones Sí / No,
  // cortamos donde aparece la opción, pero nunca antes del cierre ?.
  texto = texto
    .replace(/\s+(o|0|O)?\s*(si|sí)\s+(o|0|O)?\s*no\b.*$/i, "")
    .replace(/\s+(si|sí)\s+no\b.*$/i, "")
    .replace(/\s+(si|sí|no)\s*$/i, "")
    .trim();

  const idxPregunta = texto.indexOf("?");
  if (idxPregunta !== -1) {
    texto = texto.slice(0, idxPregunta + 1);
  }

  texto = texto
    .replace(/\s*[oO0]\s+(si|sí|no).*$/i, "?")
    .replace(/\s+(si|sí|no).*$/i, "?")
    .replace(/\?+$/, "?")
    .trim();

  if (texto && !texto.startsWith("¿")) {
    texto = "¿" + texto.replace(/^¿+/, "");
  }

  if (texto && !texto.endsWith("?")) {
    texto += "?";
  }

  return texto;
}

function esPalabraSiNoOCR(w) {
  const t = normalizarOCR(w?.texto || w || "");
  return t === "si" || t === "s" || t === "no" || t === "n";
}

function agruparPalabrasPorRenglonOCR(palabrasOCR) {
  const palabras = (palabrasOCR || [])
    .filter((w) => w?.bbox)
    .map((w) => ({
      ...w,
      cx: (w.bbox.x0 + w.bbox.x1) / 2,
      cy: (w.bbox.y0 + w.bbox.y1) / 2,
      h: Math.max(8, w.bbox.y1 - w.bbox.y0)
    }))
    .sort((a, b) => a.cy - b.cy || a.cx - b.cx);

  const filas = [];

  palabras.forEach((w) => {
    let fila = filas.find((f) => Math.abs(f.cy - w.cy) <= Math.max(18, w.h * 0.9));

    if (!fila) {
      fila = { cy: w.cy, palabras: [] };
      filas.push(fila);
    }

    fila.palabras.push(w);
    fila.cy = (fila.cy * (fila.palabras.length - 1) + w.cy) / fila.palabras.length;
  });

  filas.forEach((f) => f.palabras.sort((a, b) => a.bbox.x0 - b.bbox.x0));

  return filas;
}

function construirPreguntasDesdePalabrasOCR(palabrasOCR) {
  const filas = agruparPalabrasPorRenglonOCR(palabrasOCR);
  const preguntas = [];

  // Primero intentamos tablas y multiple choice general.
  construirPreguntasMultipleChoiceDesdePalabrasOCR(palabrasOCR).forEach((p) => agregarPreguntaOCRLista(preguntas, p));

  filas.forEach((fila) => {
    const palabras = fila.palabras || [];
    if (!palabras.length) return;

    const idxOpcion = palabras.findIndex((w) => esPalabraSiNoOCR(w));
    const palabrasPregunta = idxOpcion >= 0 ? palabras.slice(0, idxOpcion) : palabras;

    const textoCompleto = palabras.map((w) => w.texto).join(" ");
    const textoPreguntaCrudo = palabrasPregunta.map((w) => w.texto).join(" ");

    if (!textoParecePreguntaOCR(textoCompleto) && !textoParecePreguntaOCR(textoPreguntaCrudo)) {
      return;
    }

    let pregunta = limpiarPreguntaOCR(textoPreguntaCrudo);

    if (pregunta.length < 8) {
      pregunta = limpiarPreguntaOCR(textoCompleto);
    }

    if (!pregunta || pregunta.length < 6) return;

    const baseBbox = palabrasPregunta.length ? palabrasPregunta : palabras;

    const bbox = {
      x0: Math.min(...baseBbox.map((w) => w.bbox.x0)),
      y0: Math.min(...palabras.map((w) => w.bbox.y0)),
      x1: Math.max(...baseBbox.map((w) => w.bbox.x1)),
      y1: Math.max(...palabras.map((w) => w.bbox.y1))
    };

    agregarPreguntaOCRLista(preguntas, {
      pregunta,
      bbox,
      opciones: ["Sí", "No"],
      respuesta: "Sí",
      detectado: true,
      metodo: "OCR palabras rápido"
    });
  });

  return ordenarPreguntasOCR(preguntas);
}



function extraerPreguntasDesdeTextoOCR(texto) {
  const lineas = String(texto || "")
    .split(/\n+/)
    .map((l) => l.replace(/\s+/g, " ").trim())
    .filter(Boolean);

  const preguntas = [];

  lineas.forEach((linea) => {
    if (!textoParecePreguntaOCR(linea)) return;

    let pregunta = limpiarPreguntaOCR(linea);

    if (!pregunta || pregunta.length < 6) return;

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
    return Math.abs(cy - y) < 42;
  });

  const siWords = cerca.filter((w) => {
    const t = normalizarOCR(w.texto);
    return t === "si" || t === "s" || t === "sl" || t === "sí";
  });

  const noWords = cerca.filter((w) => {
    const t = normalizarOCR(w.texto);
    return t === "no" || t === "n" || t === "n0";
  });

  if (!siWords.length || !noWords.length) return null;

  const si = siWords.sort((a, b) => a.bbox.x0 - b.bbox.x0)[0];
  const no = noWords.sort((a, b) => a.bbox.x0 - b.bbox.x0)[0];

  return { si, no };
}



function detectarPreguntaDesdeLinea(linea) {
  const textoOriginal = String(linea.texto || "").replace(/\s+/g, " ").trim();

  if (!textoParecePreguntaOCR(textoOriginal)) {
    return null;
  }

  const pregunta = limpiarPreguntaOCR(textoOriginal);

  if (!pregunta || pregunta.length < 6) return null;

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

      const radio = Math.max(10, Math.min(26, ancho * 0.017));

      // Multiple choice general: Bueno/Regular/Malo, Sí/No, etc.
      if (Array.isArray(p.opcionesBoxes) && p.opcionesBoxes.length >= 2) {
        const puntajes = p.opcionesBoxes.map((op) => {
          let x = op.boxX;

          if (typeof x !== "number" && op.bbox) {
            x = xCheckboxParaOpcion(op, op.tipo || "inline");
          }

          const score = typeof x === "number"
            ? promedioMarcaEnZona(ctx, x, y, radio)
            : 0;

          return {
            label: etiquetaRespuesta(op.label),
            x,
            score
          };
        });

        puntajes.sort((a, b) => b.score - a.score);

        const mejor = puntajes[0];
        const respuesta = mejor?.label || etiquetaRespuesta(p.respuesta || p.opciones?.[0] || "Sí");

        return {
          ...p,
          opciones: opcionesRespuestaPregunta(p),
          respuesta,
          puntajes,
          confianza: mejor && mejor.score > 0.018 ? "media" : "baja",
          metodo: `${p.metodo || "OCR"} + detector multiple choice`
        };
      }

      const opciones = buscarOpcionesSiNoEnLinea(palabrasOCR, y);

      let yesX;
      let noX;

      if (opciones?.si?.bbox && opciones?.no?.bbox) {
        const siBox = opciones.si.bbox;
        const noBox = opciones.no.bbox;
        const distanciaSi = Math.max(28, Math.min(70, (noBox.x0 - siBox.x0) * 0.35));

        yesX = siBox.x0 - distanciaSi;
        noX = noBox.x0 - distanciaSi;
      } else {
        yesX = ancho * 0.64;
        noX = ancho * 0.83;
      }

      const yesScore = promedioMarcaEnZona(ctx, yesX, y, radio);
      const noScore = promedioMarcaEnZona(ctx, noX, y, radio);

      let respuesta = "Sí";
      let confianza = "baja";

      if (yesScore > noScore * 1.10 && yesScore > 0.025) {
        respuesta = "Sí";
        confianza = "media";
      } else if (noScore > yesScore * 1.10 && noScore > 0.025) {
        respuesta = "No";
        confianza = "media";
      } else if (noScore > yesScore) {
        respuesta = "No";
      } else {
        respuesta = "Sí";
      }

      return {
        ...p,
        opciones: opcionesRespuestaPregunta(p),
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



function crearEncuestaManualDesdeArchivo({ nombre, informe = "", datos = {}, nombreArchivo, tipo, dataUrl, barrio_id, barrio_nombre }) {
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
    informe: String(informe || "").trim(),
    datos: datos || {},
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




async function leerEncuestaDesdeImagen({ nombre, nombreArchivo, tipo, dataUrl, informe = "", datos = {} }) {
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
      informe,
      datos,
      barrio_id: barrioCreacionId,
      barrio_nombre: categorias.find((c) => Number(c.id) === Number(barrioCreacionId))?.nombre || catActiva?.nombre || ""
    });

    // En vez de dejar una sola pregunta, cargamos una base útil para estas planillas.
    if (encuestaPendienteRevision && encuestaPendienteRevision.preguntas.length === 1) {
      encuestaPendienteRevision.preguntas = [];
      cargarPlantillaInfraestructuraRevision();
    }
  };

  try {
    if (tipo === "pdf" || tipo === "word") {
      fallbackManual();
      return;
    }

    if (!window.Tesseract || !window.Tesseract.recognize) {
      fallbackManual();
      return;
    }

    let dataUrlOCR = await mejorarImagenParaOCR(dataUrl, 1600);

    const tareaOCR = window.Tesseract.recognize(
      dataUrlOCR,
      "spa",
      {
        logger: () => {},
        tessedit_pageseg_mode: "6",
        preserve_interword_spaces: "1"
      }
    );

    const timeoutOCR = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("OCR_TIMEOUT")), 12000);
    });

    const resultado = await Promise.race([tareaOCR, timeoutOCR]);

    if (!catActiva || Number(catActiva.id) !== Number(barrioCreacionId)) return;

    const textoOCR = resultado?.data?.text || "";
    const lineasOCR = obtenerLineasOCR(resultado);
    const palabrasOCR = obtenerPalabrasOCR(resultado);

    let preguntas = [];

    construirPreguntasDesdePalabrasOCR(palabrasOCR).forEach((p) => agregarPreguntaOCRLista(preguntas, p));

    lineasOCR.forEach((linea) => {
      const pregunta = detectarPreguntaDesdeLinea(linea);
      if (!pregunta) return;

      agregarPreguntaOCRLista(preguntas, {
        pregunta,
        bbox: linea.bbox,
        opciones: ["Sí", "No"],
        respuesta: "Sí",
        detectado: true,
        metodo: "OCR línea rápido"
      });
    });

    extraerPreguntasDesdeTextoOCR(textoOCR).forEach((p) => agregarPreguntaOCRLista(preguntas, p));

    preguntas = ordenarPreguntasOCR(preguntas);

    if (!preguntas.length) {
      fallbackManual();
      return;
    }

    preguntas = await detectarRespuestasSiNoPorImagen(dataUrl, preguntas, palabrasOCR);
    preguntas = await detectarPlantillaInfraestructuraPorImagen(dataUrl, preguntas);

    encuestaOCRTrabajando = false;

    encuestaPendienteRevision = {
      id: Date.now(),
      barrio_id: barrioCreacionId,
      barrio_nombre: categorias.find((c) => Number(c.id) === Number(barrioCreacionId))?.nombre || catActiva?.nombre || "",
      nombre,
      informe: String(informe || "").trim(),
      datos: datos || {},
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

    renderBarrio();
  } catch (error) {
    fallbackManual();
  } finally {
    encuestaOCRTrabajando = false;
  }
}








function iniciarRevisionEncuestaBarrio({ nombre, archivo, nombreArchivo, tipo, dataUrl, informe = "", datos = {} }) {
  if (tipo === "word") {
    leerEncuestaDesdeWord({ nombre, nombreArchivo, tipo, dataUrl, informe, datos, archivo });
    return;
  }

  leerEncuestaDesdeImagen({ nombre, nombreArchivo, tipo, dataUrl, informe, datos });
}





function modoConfigPreguntasActivo() {
  return !!(encuestaPendienteRevision && encuestaPendienteRevision.configPreguntasActiva);
}


function agregarTablaSeguimientoRevision() {
  if (!encuestaPendienteRevision) return;

  encuestaPendienteRevision.configPreguntasActiva = true;

  [
    {
      pregunta: "Seguimiento de problemáticas barriales - Problemática detectada",
      opciones: ["Cloacas", "Alumbrado", "Calles", "Limpieza", "Seguridad", "Salud", "Otro"],
      respuesta: "Cloacas"
    },
    {
      pregunta: "Seguimiento de problemáticas barriales - Estado",
      opciones: ["Pendiente", "En tratamiento", "Resuelto"],
      respuesta: "Pendiente"
    },
    {
      pregunta: "Seguimiento de problemáticas barriales - Derivación realizada",
      opciones: ["Sí", "No"],
      respuesta: "No"
    }
  ].forEach((p) => encuestaPendienteRevision.preguntas.push({
    ...p,
    detectado: false,
    metodo: "Tabla manual seguimiento"
  }));

  renderBarrio();
}


function configurarPreguntasRespuestas() {
  if (!encuestaPendienteRevision) return;

  encuestaPendienteRevision.configPreguntasActiva = !encuestaPendienteRevision.configPreguntasActiva;
  renderBarrio();
}

function actualizarOpcionesRevision(index) {
  if (!encuestaPendienteRevision) return;

  const inputOpciones = $(`revOpciones-${index}`);
  const select = $(`revRespuesta-${index}`);
  if (!inputOpciones || !select) return;

  const opciones = String(inputOpciones.value || "Sí, No")
    .split(",")
    .map((x) => etiquetaRespuesta(x))
    .filter(Boolean);

  const opcionesFinales = opciones.length ? opciones : ["Sí", "No"];
  const valorActual = etiquetaRespuesta(select.value || opcionesFinales[0]);

  select.innerHTML = opcionesFinales.map((op) => `
    <option value="${escapeHtml(op)}" ${claveRespuesta(valorActual) === claveRespuesta(op) ? "selected" : ""}>${escapeHtml(op)}</option>
  `).join("");

  if (!opcionesFinales.some((op) => claveRespuesta(op) === claveRespuesta(select.value))) {
    select.value = opcionesFinales[0];
  }
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
        <p>La aplicación está intentando leer las preguntas y detectar las marcas de la encuesta.</p>
        <div class="loader-ocr"></div>

        <div class="actions" style="margin-top:14px">
          <button class="secondary danger" onclick="cancelarRevisionEncuesta()">Cancelar</button>
        </div>
      </div>
    `;
  }

  if (!encuestaPendienteRevision) return "";

  const configActiva = modoConfigPreguntasActivo();

  return `
    <div class="revision-encuesta-box">
      <h2>🤖 Revisión inteligente de encuesta</h2>
      <p>
        La aplicación detectó estas preguntas y respuestas desde la imagen.
        Revisá y confirmá para crear los gráficos.
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

      <div class="datos-encuesta-form revision-datos-form">
        <label>Nombre <input id="revDatoNombre" value="${escapeHtml(encuestaPendienteRevision.datos?.nombre_persona || "")}" /></label>
        <label>Teléfono <input id="revDatoTelefono" value="${escapeHtml(encuestaPendienteRevision.datos?.telefono || "")}" /></label>
        <label>DNI <input id="revDatoDni" value="${escapeHtml(encuestaPendienteRevision.datos?.dni || "")}" /></label>
        <label>Fecha <input id="revDatoFecha" type="date" value="${escapeHtml(encuestaPendienteRevision.datos?.fecha || "")}" /></label>
        <label>Barrio <input id="revDatoBarrio" value="${escapeHtml(encuestaPendienteRevision.datos?.barrio || encuestaPendienteRevision.barrio_nombre || "")}" /></label>
        <label>Dirección y número <input id="revDatoDireccion" value="${escapeHtml(encuestaPendienteRevision.datos?.direccion_numero || "")}" /></label>
      </div>
${
        configActiva
          ? `<div class="config-tablas-tools">
              <button type="button" class="secondary" onclick="agregarTablaSeguimientoRevision()">+ Tipo tabla seguimiento</button>
              <small>También podés escribir opciones separadas por coma en cada pregunta.</small>
            </div>`
          : ""
      }

      <div class="revision-grid ${configActiva ? "config-activa" : "config-cerrada"}">
        ${
          encuestaPendienteRevision.preguntas.map((p, index) => `
            <div class="revision-row">
              <label>
                Pregunta ${index + 1} ${p.metodo && p.metodo.toLowerCase().includes("tabla") ? "· Tabla" : ""}
                <input
                  id="revPregunta-${index}"
                  value="${escapeHtml(limpiarPreguntaOCR(p.pregunta))}"
                  ${configActiva ? "" : "readonly"}
                />
              </label>

              <label>
                Respuesta detectada
                <select id="revRespuesta-${index}">
                  ${opcionesRespuestaPregunta(p).map((op) => `
                    <option value="${escapeHtml(op)}" ${claveRespuesta(p.respuesta) === claveRespuesta(op) ? "selected" : ""}>${escapeHtml(op)}</option>
                  `).join("")}
                </select>

                ${
                  configActiva
                    ? `<input id="revOpciones-${index}" class="opciones-extra-input" value="${escapeHtml(opcionesRespuestaPregunta(p).join(", "))}" placeholder="Opciones separadas por coma. Ej: Sí, No" oninput="actualizarOpcionesRevision(${index})" />`
                    : `<small class="opciones-resumen">Opciones: ${escapeHtml(opcionesRespuestaPregunta(p).join(", "))}</small>`
                }
              </label>

              ${
                configActiva
                  ? `<button type="button" class="icon-btn danger" onclick="quitarPreguntaRevision(${index})">🗑️</button>`
                  : `<span></span>`
              }
            </div>
          `).join("")
        }
      </div>

      <div class="actions revision-actions-final">
        <button class="secondary danger" onclick="cancelarRevisionEncuesta()">Cancelar</button>
        <button class="secondary" onclick="configurarPreguntasRespuestas()">⚙️ Configurar preguntas/respuestas</button>
        <button class="secondary" onclick="agregarPreguntaRevision()">+ Agregar pregunta</button>
        <button class="primary" onclick="confirmarRevisionEncuesta()">Confirmar</button>
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

  return encuestaPendienteRevision.preguntas.map((original, index) => {
    const inputOpciones = $(`revOpciones-${index}`);

    const opciones = inputOpciones
      ? String(inputOpciones.value || "Sí, No")
          .split(",")
          .map((x) => etiquetaRespuesta(x))
          .filter(Boolean)
      : opcionesRespuestaPregunta(original);

    const opcionesFinales = opciones.length ? opciones : ["Sí", "No"];
    const respuestaRaw = $(`revRespuesta-${index}`)?.value || original.respuesta || opcionesFinales[0] || "Sí";
    const respuesta = etiquetaRespuesta(respuestaRaw);

    return {
      pregunta: limpiarPreguntaOCR($(`revPregunta-${index}`)?.value.trim() || original.pregunta || ""),
      opciones: opcionesFinales,
      respuesta,
      detectado: true
    };
  }).filter((p) => p.pregunta);
}





function agregarPreguntaRevision() {
  if (!encuestaPendienteRevision) return;

  encuestaPendienteRevision.configPreguntasActiva = true;

  encuestaPendienteRevision.preguntas.push({
    pregunta: "Nueva pregunta?",
    opciones: ["Sí", "No"],
    respuesta: "Sí",
    detectado: false,
    metodo: "Manual"
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

      const respuesta = etiquetaRespuesta(r.respuesta || "Sí");

      filas.push({
        barrio_id: encuesta.barrio_id,
        barrio_nombre: encuesta.barrio_nombre || "Sin barrio",
        encuesta_id: encuesta.id,
        encuesta_nombre: encuesta.nombre || "Encuesta",
        familia: encuesta.datos?.nombre_persona || encuesta.nombre || "Sin nombre",
        archivo: encuesta.nombreArchivo || "",
        pregunta: r.pregunta,
        preguntaKey: normalizarPregunta(r.pregunta),
        opciones: opcionesRespuestaPregunta(r),
        respuesta,
        respuestaKey: claveRespuesta(respuesta)
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
        opciones: [],
        total: 0,
        conteos: {},
        barrios: {},
        detalleFamilias: {}
      };
    }

    const grupo = grupos[fila.preguntaKey];

    fila.opciones.forEach((op) => {
      const label = etiquetaRespuesta(op);
      if (!grupo.opciones.some((x) => claveRespuesta(x) === claveRespuesta(label))) {
        grupo.opciones.push(label);
      }
    });

    if (!grupo.opciones.some((x) => claveRespuesta(x) === fila.respuestaKey)) {
      grupo.opciones.push(fila.respuesta);
    }

    grupo.total++;
    grupo.conteos[fila.respuestaKey] = (grupo.conteos[fila.respuestaKey] || 0) + 1;

    if (!grupo.barrios[fila.barrio_nombre]) {
      grupo.barrios[fila.barrio_nombre] = { total: 0, conteos: {} };
    }

    if (!grupo.detalleFamilias[fila.barrio_nombre]) {
      grupo.detalleFamilias[fila.barrio_nombre] = {};
    }

    grupo.barrios[fila.barrio_nombre].total++;
    grupo.barrios[fila.barrio_nombre].conteos[fila.respuestaKey] =
      (grupo.barrios[fila.barrio_nombre].conteos[fila.respuestaKey] || 0) + 1;

    if (!grupo.detalleFamilias[fila.barrio_nombre][fila.respuestaKey]) {
      grupo.detalleFamilias[fila.barrio_nombre][fila.respuestaKey] = [];
    }

    grupo.detalleFamilias[fila.barrio_nombre][fila.respuestaKey].push({
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
  const opciones = grupo.opciones.length ? grupo.opciones : ["Sí", "No"];
  const total = grupo.total || 0;

  const resumenOpciones = opciones.map((op) => {
    const key = claveRespuesta(op);
    const cantidad = grupo.conteos[key] || 0;
    const pct = total ? Math.round((cantidad / total) * 100) : 0;

    return `
      <p><b>${escapeHtml(op)}:</b> ${cantidad} (${pct}%)</p>
      <div class="barra-pdf"><span style="width:${pct}%"></span></div>
    `;
  }).join("");

  const filasBarrios = Object.entries(grupo.barrios).map(([barrio, datos]) => {
    const celdas = opciones.map((op) => {
      const key = claveRespuesta(op);
      return `<td>${datos.conteos[key] || 0}</td>`;
    }).join("");

    const familias = opciones.map((op) => {
      const key = claveRespuesta(op);
      const lista = grupo.detalleFamilias?.[barrio]?.[key] || [];
      return `
        <div>
          <h4>Familias que respondieron ${escapeHtml(op)}</h4>
          <ul>
            ${
              lista.length
                ? lista.map((f) => `<li>${escapeHtml(f.nombre)}${f.archivo ? ` <small>(${escapeHtml(f.archivo)})</small>` : ""}</li>`).join("")
                : `<li><em>Sin familias.</em></li>`
            }
          </ul>
        </div>
      `;
    }).join("");

    return `
      <tr>
        <td>${escapeHtml(barrio)}</td>
        ${celdas}
        <td>${datos.total || 0}</td>
      </tr>
      <tr class="familias-pdf-row">
        <td colspan="${opciones.length + 2}">
          <div class="familias-pdf-grid familias-pdf-grid-multi">
            ${familias}
          </div>
        </td>
      </tr>
    `;
  }).join("");

  return `
    <div class="grafico-pdf-card">
      <h1>${escapeHtml(grupo.pregunta)}</h1>

      <div class="grafico-pdf-resumen grafico-pdf-resumen-multi">
        <div class="grafico-pdf-numeros">
          ${resumenOpciones}
          <p><b>Total de respuestas:</b> ${total}</p>
        </div>
      </div>

      <h2>Detalle por barrio</h2>

      <table>
        <thead>
          <tr>
            <th>Barrio</th>
            ${opciones.map((op) => `<th>${escapeHtml(op)}</th>`).join("")}
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${filasBarrios || `<tr><td colspan="${opciones.length + 2}">Sin detalle por barrio.</td></tr>`}
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
  const opciones = grupo.opciones.length ? grupo.opciones : ["Sí", "No"];
  const total = grupo.total || 0;
  const key = normalizarPregunta(grupo.pregunta);

  const filas = opciones.map((op) => {
    const opKey = claveRespuesta(op);
    const cantidad = grupo.conteos[opKey] || 0;
    const pct = total ? Math.round((cantidad / total) * 100) : 0;

    return `
      <p><b>${escapeHtml(op)}:</b> ${cantidad} (${pct}%)</p>
    `;
  }).join("");

  return `
    <div class="grafico-card">
      <div class="grafico-card-head">
        <h3>${escapeHtml(grupo.pregunta)}</h3>
        <button class="secondary mini-download" onclick="descargarGraficoPregunta('${key}')">⬇️ PDF</button>
      </div>

      <div class="grafico-body">
        ${svgPieMulticolor(opciones, grupo.conteos, total)}

        <div class="grafico-info">
          ${filas}
          <p><b>Total:</b> ${total}</p>
        </div>
      </div>

      <div class="grafico-barrios">
        <h4>Detalle por barrio</h4>
        ${
          Object.entries(grupo.barrios).map(([barrio, datos]) => `
            <div class="grafico-barrio-row grafico-barrio-row-multi">
              <span>${escapeHtml(barrio)}</span>
              <b>${opciones.map((op) => `${escapeHtml(op)} ${datos.conteos[claveRespuesta(op)] || 0}`).join(" / ")}</b>
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




function valorInformeEncuesta() {
  return String($("barrioEncuestaInforme")?.value || "").trim();
}

function htmlInformeEncuesta(informe) {
  const texto = String(informe || "").trim();

  if (!texto) return "";

  return `
    <div class="informe-encuesta-box">
      <h4>📋 Informe</h4>
      <div>${escapeHtml(texto).replace(/\n/g, "<br>")}</div>
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
              <input id="barrioPlanoArchivo" type="file" accept="image/*,.pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" />
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
              Imagen, PDF o Word de la encuesta *
              <input id="barrioEncuestaArchivo" type="file" accept="image/*,.pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" />
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
                  <strong class="${claveRespuesta(r.respuesta) === "si" ? "resp-si" : "resp-no"}">${escapeHtml(etiquetaRespuesta(r.respuesta))}</strong>
                </div>
              `).join("")}
            </div>
          `
          : ""
      }

      <div class="barrio-preview">
        ${
          item.tipo === "word"
            ? linkDescargaArchivo(item.nombreArchivo || item.nombre, archivo)
            : esPdf
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
  const informe = "";
  const datos = datosEncuestaDesdeFormulario();
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
      informe,
      datos,
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
      informe,
      datos,
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
  const informe = "";
  const datos = datosEncuestaDesdeFormulario();
  const archivo = $("barrioEncuestaArchivo").files[0];

  if (!nombre || !archivo) {
    alert("Completá el nombre y seleccioná una imagen, PDF o Word de la encuesta.");
    return;
  }

  const pesoMaximoMB = 2;
  const pesoMB = archivo.size / 1024 / 1024;

  if (pesoMB > pesoMaximoMB) {
    alert(`El archivo es muy pesado. Usá archivos de hasta ${pesoMaximoMB} MB.`);
    return;
  }

  const esPdf = archivoEsPdf(archivo);
  const esWord = archivoEsWord(archivo);
  const reader = new FileReader();

  reader.onload = function (e) {
    iniciarRevisionEncuestaBarrio({
      nombre,
      informe,
      datos,
      archivo,
      nombreArchivo: archivo.name,
      tipo: esWord ? "word" : esPdf ? "pdf" : "imagen",
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
    const nuevoInforme = prompt("Editar informe de la encuesta:", item.informe || "");
    if (nuevoInforme !== null) {
      item.informe = nuevoInforme.trim();
    }

    const editarPreguntas = confirm("¿Querés editar las preguntas, respuestas e informe de esta encuesta?");

    if (editarPreguntas) {
      encuestaPendienteRevision = {
        ...item,
        preguntas: (item.respuestas_detectadas || item.preguntas || []).map((r) => ({
          pregunta: r.pregunta || "Pregunta?",
          opciones: opcionesRespuestaPregunta(r),
          respuesta: etiquetaRespuesta(r.respuesta || "Sí"),
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
    const archivo = await seleccionarArchivoWeb("image/*,.pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document");

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
      item.tipo = archivoEsWord(archivo) ? "word" : archivoEsPdf(archivo) ? "pdf" : "imagen";
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

  imprimirHTML(`${tipo} - ${item.nombre}`, htmlArchivoBarrioPDF(item, tipo));
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
${tipo === "encuesta" && item.informe ? `Informe: ${item.informe}` : ""}
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
                  <td>${escapeHtml(etiquetaRespuesta(r.respuesta))}</td>
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
          item.tipo === "word"
            ? linkDescargaArchivo(item.nombreArchivo || item.nombre, archivo)
            : item.tipo === "pdf"
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
${encuestasBarrio.map((e, i) => `${i + 1}) ${e.nombre} - ${e.nombreArchivo || ""}${e.informe ? " - Informe: " + e.informe : ""}`).join("\n") || "Sin encuestas."}
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





function tablaHtmlDesdeMatriz(rows, titulo = "Cuadro") {
  const filas = Array.isArray(rows) ? rows : [];
  if (!filas.length) return "";

  const header = filas[0] || [];
  const body = filas.slice(1);

  return `
    <div class="tabla-seguimiento-box">
      <h4>📊 ${escapeHtml(titulo)}</h4>
      <div class="tabla-scroll">
        <table>
          <thead>
            <tr>${header.map((h) => `<th>${escapeHtml(h || "")}</th>`).join("")}</tr>
          </thead>
          <tbody>
            ${
              body.length
                ? body.map((row) => `
                    <tr>${header.map((_, i) => `<td>${escapeHtml(row[i] || "")}</td>`).join("")}</tr>
                  `).join("")
                : `<tr><td colspan="${Math.max(1, header.length)}">Sin filas cargadas.</td></tr>`
            }
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function tablasSeguimientoHtml(tablas) {
  const lista = Array.isArray(tablas) ? tablas : [];
  if (!lista.length) return "";

  return lista.map((tabla, index) => tablaHtmlDesdeMatriz(tabla.rows || tabla, tabla.titulo || `Cuadro ${index + 1}`)).join("");
}


function limpiarTextoDocxTabla(texto) {
  return String(texto || "")
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/\n\s+/g, "\n")
    .trim();
}

function textoCeldaDocxMejorado(celda) {
  const parrafos = Array.from(celda.getElementsByTagName("w:p")).map((p) =>
    Array.from(p.getElementsByTagName("w:t"))
      .map((n) => n.textContent || "")
      .join("")
      .trim()
  ).filter(Boolean);

  const texto = parrafos.length
    ? parrafos.join("\n")
    : Array.from(celda.getElementsByTagName("w:t")).map((n) => n.textContent || "").join("");

  return limpiarTextoDocxTabla(texto);
}

function normalizarFilasDocxMejorado(rows) {
  return (rows || [])
    .map((r) => (r || []).map((c) => limpiarTextoDocxTabla(c)))
    .filter((r) => r.some((c) => String(c || "").trim()));
}

function esTablaDocxReal(rows) {
  const filas = normalizarFilasDocxMejorado(rows);
  if (!filas.length) return false;

  const maxCols = Math.max(...filas.map((r) => r.length));
  const filasConDosColumnas = filas.filter((r) => r.filter((c) => String(c || "").trim()).length >= 2).length;

  if (maxCols < 2) return false;
  if (filas.length < 2) return false;
  if (filasConDosColumnas < 1) return false;

  return true;
}

function tituloTablaSeguimientoDocx(rows, idx) {
  const filas = normalizarFilasDocxMejorado(rows);
  const texto = filas.flat().join(" ").toLowerCase();

  if (texto.includes("programa") || texto.includes("operativo") || texto.includes("barrio") || texto.includes("equipo interviniente")) {
    return "Datos del operativo";
  }

  if (texto.includes("caso detectado") || texto.includes("problemática") || texto.includes("problematica") || texto.includes("estado") || texto.includes("observaciones")) {
    return "Cuadro de seguimiento";
  }

  return `Cuadro ${idx + 1}`;
}


function textoCeldaDocxGenerico(celda) {
  return Array.from(celda.getElementsByTagName("w:t"))
    .map((n) => n.textContent || "")
    .join("")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizarFilasDocx(rows) {
  return (rows || [])
    .map((r) => (r || []).map((c) => String(c || "").replace(/\s+/g, " ").trim()))
    .filter((r) => r.some((c) => c));
}

async function extraerTablasSeguimientoDesdeDocx(archivo) {
  if (!window.JSZip) return [];

  const zip = await window.JSZip.loadAsync(archivo);
  const xmlText = await zip.file("word/document.xml")?.async("text");

  if (!xmlText) return [];

  const xml = new DOMParser().parseFromString(xmlText, "application/xml");
  const tablas = Array.from(xml.getElementsByTagName("w:tbl"));

  return tablas
    .map((tbl, idx) => {
      const rowsOriginal = Array.from(tbl.getElementsByTagName("w:tr")).map((tr) =>
        Array.from(tr.getElementsByTagName("w:tc")).map((tc) => textoCeldaDocxMejorado(tc))
      );

      const rows = normalizarFilasDocxMejorado(rowsOriginal);

      return {
        titulo: tituloTablaSeguimientoDocx(rows, idx),
        rows
      };
    })
    .filter((tabla) => esTablaDocxReal(tabla.rows))
    .slice(0, 2);
}


function seguimientoArchivoPreview(item) {
  const archivo = item.archivo || "";
  if (!archivo) return `<p>Sin archivo cargado.</p>`;

  if (item.tipo === "word") {
    return linkDescargaArchivo(item.nombreArchivo || item.titulo || "archivo.docx", archivo);
  }

  if (item.tipo === "pdf") {
    return `<iframe src="${archivo}" title="PDF seguimiento"></iframe>`;
  }

  return `<img src="${archivo}" alt="${escapeHtml(item.titulo || "Seguimiento")}" />`;
}

function htmlSeguimientoPDF(item) {
  return `
    <div class="seguimiento-pdf">
      <h2>${escapeHtml(item.titulo || "Seguimiento")}</h2>

      <table>
        <tbody>
          <tr><th>Nombre y apellido</th><td>${escapeHtml(item.nombre_apellido || "")}</td></tr>
          <tr><th>Fecha</th><td>${escapeHtml(item.fecha || "")}</td></tr>
          <tr><th>N° celular</th><td>${escapeHtml(item.celular || "")}</td></tr>
          <tr><th>DNI</th><td>${escapeHtml(item.dni || "")}</td></tr>
          <tr><th>Barrio</th><td>${escapeHtml(item.barrio || "")}</td></tr>
          <tr><th>Dirección y número</th><td>${escapeHtml(item.direccion_numero || "")}</td></tr>
          <tr><th>Archivo</th><td>${escapeHtml(item.nombreArchivo || "")}</td></tr>
        </tbody>
      </table>

      <h3>Informe</h3>
      <div class="informe-encuesta-box">
        ${escapeHtml(item.informe || "").replace(/\n/g, "<br>") || "Sin informe."}
      </div>

      ${tablasSeguimientoHtml(item.tablas)}
      ${preguntasSeguimientoHtml(item.preguntas)}
      ${seguimientoArchivoPreview(item)}
    </div>
  `;
}


function columnasTablaSeguimiento(tabla) {
  const rows = tabla?.rows || [];
  const header = rows[0] || [];

  return header.length ? header : ["Tema", "Descripción", "Estado", "Observaciones"];
}

function filasTablaSeguimiento(tabla) {
  const rows = tabla?.rows || [];
  return rows.length > 1 ? rows.slice(1) : [["", "", "", ""]];
}

function crearTablaSeguimientoVacia() {
  return {
    titulo: "Nuevo cuadro",
    rows: [
      ["Tema", "Descripción", "Estado", "Observaciones"],
      ["", "", "", ""],
      ["", "", "", ""],
      ["", "", "", ""]
    ]
  };
}

function crearPreguntaSeguimientoVacia() {
  return {
    pregunta: "Nueva pregunta?",
    opciones: ["Sí", "No"],
    respuesta: "Sí"
  };
}

function renderPreguntasSeguimientoEditor(preguntas) {
  const lista = Array.isArray(preguntas) ? preguntas : [];

  return `
    <div class="seg-editor-preguntas">
      <h3>Preguntas con opciones</h3>

      ${
        lista.length
          ? lista.map((p, index) => `
            <div class="seg-pregunta-row">
              <label>
                Pregunta ${index + 1}
                <input id="segPreg-${index}" value="${escapeHtml(p.pregunta || "")}" />
              </label>

              <label>
                Respuesta
                <select id="segResp-${index}">
                  ${opcionesRespuestaPregunta(p).map((op) => `
                    <option value="${escapeHtml(op)}" ${claveRespuesta(p.respuesta) === claveRespuesta(op) ? "selected" : ""}>${escapeHtml(op)}</option>
                  `).join("")}
                </select>
              </label>

              <label>
                Opciones
                <input id="segOpciones-${index}" value="${escapeHtml(opcionesRespuestaPregunta(p).join(", "))}" oninput="actualizarOpcionesSeguimiento(${index})" />
              </label>
            </div>
          `).join("")
          : `<p class="muted">Sin preguntas agregadas.</p>`
      }
    </div>
  `;
}

function renderTablasSeguimientoEditor(tablas) {
  const lista = Array.isArray(tablas) ? tablas : [];

  if (!lista.length) {
    return `<div class="empty"><p>No hay tablas cargadas. Tocá <b>Agregar apartado</b> para crear una tabla nueva.</p></div>`;
  }

  return lista.map((tabla, tIndex) => {
    const columnas = columnasTablaSeguimiento(tabla);
    const filas = filasTablaSeguimiento(tabla);

    return `
      <div class="seg-tabla-editor">
        <div class="seg-tabla-editor-head">
          <label>
            Título del apartado / cuadro
            <input id="segTablaTitulo-${tIndex}" value="${escapeHtml(tabla.titulo || `Cuadro ${tIndex + 1}`)}" />
          </label>

          <div class="seg-tabla-actions">
            <button type="button" class="secondary" onclick="agregarColumnaSeguimiento(${tIndex})">+ Columna a la derecha</button>
            <button type="button" class="secondary" onclick="agregarFilaSeguimiento(${tIndex})">+ Fila</button>
            <button type="button" class="secondary danger btn-borrar-tabla" onclick="eliminarApartadoSeguimiento(${tIndex})">🗑️ Borrar tabla completa</button>
          </div>
        </div>

        <div class="tabla-scroll tabla-scroll-grande">
          <table class="tabla-editor-grande">
            <thead>
              <tr>
                ${columnas.map((col, cIndex) => `
                  <th>
                    <div class="columna-controls">
                      <button type="button" title="Mover izquierda" onclick="moverColumnaSeguimiento(${tIndex}, ${cIndex}, -1)">⬅️</button>
                      <button type="button" title="Mover derecha" onclick="moverColumnaSeguimiento(${tIndex}, ${cIndex}, 1)">➡️</button>
                      <button type="button" class="danger" title="Eliminar columna completa" onclick="eliminarColumnaSeguimiento(${tIndex}, ${cIndex})">🗑️</button>
                    </div>
                    <textarea id="segTablaHead-${tIndex}-${cIndex}" rows="2">${escapeHtml(col)}</textarea>
                  </th>
                `).join("")}
                <th class="fila-control-head">Fila</th>
              </tr>
            </thead>
            <tbody>
              ${filas.map((row, rIndex) => `
                <tr>
                  ${columnas.map((_, cIndex) => `
                    <td>
                      <textarea id="segTablaCell-${tIndex}-${rIndex}-${cIndex}" rows="4">${escapeHtml(row[cIndex] || "")}</textarea>
                    </td>
                  `).join("")}
                  <td class="fila-control-cell">
                    <button type="button" class="icon-btn danger" title="Eliminar fila completa" onclick="eliminarFilaSeguimiento(${tIndex}, ${rIndex})">🗑️</button>
                  </td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }).join("");
}

function actualizarOpcionesSeguimiento(index) {
  const input = $(`segOpciones-${index}`);
  const select = $(`segResp-${index}`);
  if (!input || !select) return;

  const opciones = String(input.value || "Sí, No")
    .split(",")
    .map((x) => etiquetaRespuesta(x))
    .filter(Boolean);

  const valorActual = etiquetaRespuesta(select.value || opciones[0] || "Sí");

  select.innerHTML = (opciones.length ? opciones : ["Sí", "No"]).map((op) => `
    <option value="${escapeHtml(op)}" ${claveRespuesta(valorActual) === claveRespuesta(op) ? "selected" : ""}>${escapeHtml(op)}</option>
  `).join("");
}

function leerTablasSeguimientoEditor() {
  const tablas = seguimientoPendienteRevision?.tablas || [];

  return tablas.map((tabla, tIndex) => {
    const columnas = columnasTablaSeguimiento(tabla);
    const filas = filasTablaSeguimiento(tabla);

    const header = columnas.map((_, cIndex) =>
      String($(`segTablaHead-${tIndex}-${cIndex}`)?.value || `Columna ${cIndex + 1}`).trim()
    );

    const body = filas.map((_, rIndex) =>
      header.map((_, cIndex) =>
        String($(`segTablaCell-${tIndex}-${rIndex}-${cIndex}`)?.value || "").trim()
      )
    );

    return {
      titulo: String($(`segTablaTitulo-${tIndex}`)?.value || tabla.titulo || `Cuadro ${tIndex + 1}`).trim(),
      rows: [header, ...body]
    };
  });
}

function leerPreguntasSeguimientoEditor() {
  const preguntas = seguimientoPendienteRevision?.preguntas || [];

  return preguntas.map((p, index) => {
    const opciones = String($(`segOpciones-${index}`)?.value || "Sí, No")
      .split(",")
      .map((x) => etiquetaRespuesta(x))
      .filter(Boolean);

    return {
      pregunta: String($(`segPreg-${index}`)?.value || p.pregunta || "").trim(),
      opciones: opciones.length ? opciones : ["Sí", "No"],
      respuesta: etiquetaRespuesta($(`segResp-${index}`)?.value || p.respuesta || "Sí")
    };
  }).filter((p) => p.pregunta);
}


function preguntasSeguimientoHtml(preguntas) {
  const lista = Array.isArray(preguntas) ? preguntas : [];
  if (!lista.length) return "";

  return `
    <div class="preguntas-seguimiento-box">
      <h4>❓ Preguntas y respuestas</h4>
      <table>
        <thead>
          <tr>
            <th>Pregunta</th>
            <th>Respuesta</th>
            <th>Opciones</th>
          </tr>
        </thead>
        <tbody>
          ${lista.map((p) => `
            <tr>
              <td>${escapeHtml(p.pregunta || "")}</td>
              <td>${escapeHtml(etiquetaRespuesta(p.respuesta || ""))}</td>
              <td>${escapeHtml(opcionesRespuestaPregunta(p).join(", "))}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}



function preservarEdicionSeguimientoTemporal() {
  if (!seguimientoPendienteRevision) return;

  try {
    seguimientoPendienteRevision.tablas = leerTablasSeguimientoEditor();
    seguimientoPendienteRevision.preguntas = leerPreguntasSeguimientoEditor();
    seguimientoPendienteRevision.titulo = String($("revSegTitulo")?.value || seguimientoPendienteRevision.titulo || "").trim();
    seguimientoPendienteRevision.nombre_apellido = String($("revSegNombreApellido")?.value || seguimientoPendienteRevision.nombre_apellido || "").trim();
    seguimientoPendienteRevision.fecha = String($("revSegFecha")?.value || seguimientoPendienteRevision.fecha || "").trim();
    seguimientoPendienteRevision.celular = String($("revSegCelular")?.value || seguimientoPendienteRevision.celular || "").trim();
    seguimientoPendienteRevision.dni = String($("revSegDni")?.value || seguimientoPendienteRevision.dni || "").trim();
    seguimientoPendienteRevision.barrio = String($("revSegBarrio")?.value || seguimientoPendienteRevision.barrio || "").trim();
    seguimientoPendienteRevision.direccion_numero = String($("revSegDireccion")?.value || seguimientoPendienteRevision.direccion_numero || "").trim();
    seguimientoPendienteRevision.informe = String($("revSegInforme")?.value || seguimientoPendienteRevision.informe || "").trim();
  } catch (e) {}
}


function eliminarApartadoSeguimiento(tIndex) {
  if (!seguimientoPendienteRevision) return;
  if (!confirm("¿Eliminar esta tabla completa?")) return;

  preservarEdicionSeguimientoTemporal();

  if (!Array.isArray(seguimientoPendienteRevision.tablas)) {
    seguimientoPendienteRevision.tablas = [];
  }

  seguimientoPendienteRevision.tablas = seguimientoPendienteRevision.tablas.filter((_, idx) => Number(idx) !== Number(tIndex));

  renderSeguimientos();

  setTimeout(() => {
    document.querySelector(".revision-seguimiento-box")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 80);
}

function agregarColumnaSeguimiento(tIndex) {
  if (!seguimientoPendienteRevision) return;

  preservarEdicionSeguimientoTemporal();

  const tabla = seguimientoPendienteRevision.tablas[tIndex];
  if (!tabla) return;

  if (!Array.isArray(tabla.rows) || !tabla.rows.length) {
    tabla.rows = [["Nueva columna"], [""]];
  }

  tabla.rows.forEach((row, idx) => {
    row.push(idx === 0 ? "Nueva columna" : "");
  });

  renderSeguimientos();
}

function moverColumnaSeguimiento(tIndex, cIndex, direccion) {
  if (!seguimientoPendienteRevision) return;

  preservarEdicionSeguimientoTemporal();

  const tabla = seguimientoPendienteRevision.tablas[tIndex];
  if (!tabla || !Array.isArray(tabla.rows) || !tabla.rows.length) return;

  const cols = tabla.rows[0].length;
  const nuevo = cIndex + direccion;

  if (nuevo < 0 || nuevo >= cols) return;

  tabla.rows.forEach((row) => {
    const temp = row[cIndex] || "";
    row[cIndex] = row[nuevo] || "";
    row[nuevo] = temp;
  });

  renderSeguimientos();
}

function eliminarColumnaSeguimiento(tIndex, cIndex) {
  if (!seguimientoPendienteRevision) return;
  if (!confirm("¿Eliminar esta columna del cuadro?")) return;

  preservarEdicionSeguimientoTemporal();

  const tabla = seguimientoPendienteRevision.tablas[tIndex];
  if (!tabla || !Array.isArray(tabla.rows) || !tabla.rows.length) return;

  if (tabla.rows[0].length <= 1) {
    alert("El cuadro debe tener al menos una columna.");
    return;
  }

  tabla.rows.forEach((row) => row.splice(cIndex, 1));
  renderSeguimientos();
}

function agregarFilaSeguimiento(tIndex) {
  if (!seguimientoPendienteRevision) return;

  preservarEdicionSeguimientoTemporal();

  const tabla = seguimientoPendienteRevision.tablas[tIndex];
  if (!tabla) return;

  const cols = Math.max(1, columnasTablaSeguimiento(tabla).length);
  tabla.rows.push(Array(cols).fill(""));

  renderSeguimientos();
}

function eliminarFilaSeguimiento(tIndex, rIndex) {
  if (!seguimientoPendienteRevision) return;

  preservarEdicionSeguimientoTemporal();

  const tabla = seguimientoPendienteRevision.tablas[tIndex];
  if (!tabla || !Array.isArray(tabla.rows)) return;

  if (tabla.rows.length <= 2) {
    alert("El cuadro debe tener al menos una fila editable.");
    return;
  }

  tabla.rows.splice(rIndex + 1, 1);
  renderSeguimientos();
}


function renderRevisionSeguimientoPendiente() {
  if (!seguimientoPendienteRevision) return "";

  return `
    <div class="revision-seguimiento-box">
      <h2>${seguimientoPendienteRevision.editando ? "✏️ Editar seguimiento" : "📋 Configurar seguimiento antes de confirmar"}</h2>
      <p>Revisá el cuadro, editá las celdas y guardá. Al confirmar, el editor se oculta y quedan las opciones de editar, imprimir, correo, descargar y eliminar.</p>

      <div class="grid-form">
        <label>
          Título
          <input id="revSegTitulo" value="${escapeHtml(seguimientoPendienteRevision.titulo || "")}" />
        </label>

        <label>
          Nombre y apellido
          <input id="revSegNombreApellido" value="${escapeHtml(seguimientoPendienteRevision.nombre_apellido || "")}" />
        </label>

        <label>
          Fecha
          <input id="revSegFecha" type="date" value="${escapeHtml(seguimientoPendienteRevision.fecha || "")}" />
        </label>

        <label>
          N° celular
          <input id="revSegCelular" inputmode="tel" value="${escapeHtml(seguimientoPendienteRevision.celular || "")}" />
        </label>

        <label>
          DNI
          <input id="revSegDni" value="${escapeHtml(seguimientoPendienteRevision.dni || "")}" />
        </label>

        <label>
          Barrio
          <input id="revSegBarrio" value="${escapeHtml(seguimientoPendienteRevision.barrio || "")}" />
        </label>

        <label>
          Dirección y número
          <input id="revSegDireccion" value="${escapeHtml(seguimientoPendienteRevision.direccion_numero || "")}" />
        </label>

        <label class="full">
          Informe
          <textarea id="revSegInforme" rows="5">${escapeHtml(seguimientoPendienteRevision.informe || "")}</textarea>
        </label>
      </div>

      <div class="seg-editor-section">
        <h3>Cuadros / apartados</h3>
        ${renderTablasSeguimientoEditor(seguimientoPendienteRevision.tablas)}
      </div>

      ${renderPreguntasSeguimientoEditor(seguimientoPendienteRevision.preguntas)}

      <div class="actions revision-actions-final">
        <button class="secondary danger" onclick="cancelarSeguimientoRevision()">Cancelar</button>
        <button class="secondary" onclick="agregarApartadoSeguimiento()">+ Agregar apartado</button>
        <button class="secondary" onclick="agregarPreguntaSeguimiento()">+ Agregar pregunta</button>
        <button class="primary" onclick="confirmarSeguimientoRevision()">Confirmar</button>
      </div>
    </div>
  `;
}

function cancelarSeguimientoRevision() {
  seguimientoPendienteRevision = null;
  renderSeguimientos();
}

function agregarApartadoSeguimiento() {
  if (!seguimientoPendienteRevision) return;

  if (!Array.isArray(seguimientoPendienteRevision.tablas)) seguimientoPendienteRevision.tablas = [];

  seguimientoPendienteRevision.tablas = leerTablasSeguimientoEditor();
  seguimientoPendienteRevision.preguntas = leerPreguntasSeguimientoEditor();
  seguimientoPendienteRevision.tablas.push(crearTablaSeguimientoVacia());

  renderSeguimientos();
}

function agregarPreguntaSeguimiento() {
  if (!seguimientoPendienteRevision) return;

  seguimientoPendienteRevision.tablas = leerTablasSeguimientoEditor();
  seguimientoPendienteRevision.preguntas = leerPreguntasSeguimientoEditor();
  seguimientoPendienteRevision.preguntas.push(crearPreguntaSeguimientoVacia());

  renderSeguimientos();
}

function confirmarSeguimientoRevision() {
  if (!seguimientoPendienteRevision) return;

  const item = {
    ...seguimientoPendienteRevision,
    titulo: String($("revSegTitulo")?.value || seguimientoPendienteRevision.titulo || "").trim(),
    nombre_apellido: String($("revSegNombreApellido")?.value || "").trim(),
    fecha: String($("revSegFecha")?.value || "").trim(),
    celular: String($("revSegCelular")?.value || "").trim(),
    dni: String($("revSegDni")?.value || "").trim(),
    barrio: String($("revSegBarrio")?.value || "").trim(),
    direccion_numero: String($("revSegDireccion")?.value || "").trim(),
    informe: String($("revSegInforme")?.value || "").trim(),
    tablas: leerTablasSeguimientoEditor(),
    preguntas: leerPreguntasSeguimientoEditor()
  };

  if (!item.titulo) {
    alert("Completá el título del seguimiento.");
    return;
  }

  const editando = !!item.editando;
  const editandoId = item.editandoId || item.id;

  delete item.editando;
  delete item.editandoId;

  if (editando) {
    seguimientos = seguimientos.map((s) =>
      Number(s.id) === Number(editandoId)
        ? { ...item, id: editandoId }
        : s
    );
  } else {
    seguimientos.push(item);
  }

  seguimientoPendienteRevision = null;

  guardarStorage();
  if (typeof guardarDatosCompartidosSupabaseAhora === 'function') guardarDatosCompartidosSupabaseAhora();
  renderSeguimientos();
}



function renderSeguimientos() {
  cerrarFormPersona();

  if ($("formPersona")) $("formPersona").classList.add("hidden");
  if ($("busqueda")) $("busqueda").style.display = "block";

  $("categoriaHeader").className = "cat-header bg-teal";
  $("categoriaHeader").innerHTML = `
    <div class="left">
      <div class="emoji">📋</div>
      <div>
        <h2>Seguimientos</h2>
        <p>Informes, datos personales y archivos de seguimiento barrial.</p>
      </div>
    </div>

    <div class="cat-actions">
      <button onclick="imprimirSeguimientos()">🖨️ Imprimir</button>
      <button onclick="correoSeguimientos()">📧 Correo base</button>
      <button onclick="descargarSeguimientos()">⬇️ Descargar PDF</button>
    </div>
  `;

  const texto = String($("busqueda")?.value || "").toLowerCase();

  const lista = seguimientos
    .filter((s) =>
      !texto ||
      String(s.titulo || "").toLowerCase().includes(texto) ||
      String(s.nombre_apellido || "").toLowerCase().includes(texto) ||
      String(s.barrio || "").toLowerCase().includes(texto) ||
      String(s.dni || "").toLowerCase().includes(texto) ||
      String(s.celular || "").toLowerCase().includes(texto) ||
      String(s.direccion_numero || "").toLowerCase().includes(texto) ||
      String(s.informe || "").toLowerCase().includes(texto) ||
      String(s.nombreArchivo || "").toLowerCase().includes(texto)
    )
    .sort((a, b) => Number(b.id) - Number(a.id));

  const htmlInicial = `
    <div id="seguimientoFormInicial" class="form-card seguimiento-form seguimiento-form-inicial-visible">
      <h2>📋 Nuevo seguimiento</h2>

      <div class="grid-form seguimiento-grid-inicial">
        <label>
          Título *
          <input id="segTitulo" placeholder="Ej: Seguimiento problemática cloacas" />
        </label>

        <label>
          Seleccionar archivo
          <input id="segArchivo" type="file" accept="image/*,.pdf,.doc,.docx" />
        </label>
      </div>

      <div class="actions seguimiento-acciones-iniciales">
        <button class="primary" onclick="guardarSeguimiento()">Guardar seguimiento</button>
        <button class="secondary" onclick="crearTablaManualSeguimiento()">Crear tabla manual</button>
      </div>

      <p class="seguimiento-ayuda-simple">
        Escribí el título y después cargá un archivo o creá una tabla manual. Al hacerlo, abajo aparece el apartado para completar fecha, celular, DNI, barrio, dirección, informe y tablas.
      </p>
    </div>
  `;

  const destino = $("personasLista") || $("contenido");

  if (!destino) {
    console.error("No se encontró contenedor para seguimientos.");
    return;
  }

  destino.innerHTML = `
    ${htmlInicial}
    ${renderRevisionSeguimientoPendiente()}
    <div class="seguimientos-lista">
      ${lista.map(renderSeguimientoCard).join("") || `<p class="empty">No hay seguimientos cargados.</p>`}
    </div>
  `;
}


function editarSeguimiento(id) {
  const item = buscarSeguimiento(id);
  if (!item) return;

  seguimientoPendienteRevision = JSON.parse(JSON.stringify(item));
  seguimientoPendienteRevision.editando = true;
  seguimientoPendienteRevision.editandoId = item.id;

  // Aseguramos que siempre haya al menos un cuadro editable.
  if (!Array.isArray(seguimientoPendienteRevision.tablas) || !seguimientoPendienteRevision.tablas.length) {
    seguimientoPendienteRevision.tablas = [crearTablaSeguimientoVacia()];
  }

  if (!Array.isArray(seguimientoPendienteRevision.preguntas)) {
    seguimientoPendienteRevision.preguntas = [];
  }

  renderSeguimientos();

  setTimeout(() => {
    const box = document.querySelector(".revision-seguimiento-box");
    if (box) box.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 100);
}

function cancelarEdicionSeguimiento() {
  seguimientoPendienteRevision = null;
  renderSeguimientos();
}


function renderSeguimientoCard(item) {
  const cantidadCuadros = Array.isArray(item.tablas) ? item.tablas.length : 0;
  const cantidadPreguntas = Array.isArray(item.preguntas) ? item.preguntas.length : 0;

  return `
    <div class="barrio-archivo-card seguimiento-card seguimiento-card-compacta">
      <div class="seguimiento-card-head">
        <div class="seguimiento-resumen">
          <h3>📋 ${escapeHtml(item.titulo || "Seguimiento")}</h3>

          <div class="seguimiento-meta-grid">
            <p>👤 <b>Nombre:</b> ${escapeHtml(item.nombre_apellido || "Sin nombre")}</p>
            <p>🪪 <b>DNI:</b> ${escapeHtml(item.dni || "—")}</p>
            <p>🏘️ <b>Barrio:</b> ${escapeHtml(item.barrio || "—")}</p>
            <p>📍 <b>Dirección:</b> ${escapeHtml(item.direccion_numero || "—")}</p>
            <p>📅 <b>Fecha:</b> ${escapeHtml(item.fecha || "—")}</p>
            <p>📱 <b>N° celular:</b> ${escapeHtml(item.celular || "—")}</p>
            <p>📄 <b>Archivo:</b> ${escapeHtml(item.nombreArchivo || "Sin archivo")}</p>
          </div>

          <div class="seguimiento-chips">
            <span>${cantidadCuadros} cuadro${cantidadCuadros !== 1 ? "s" : ""}</span>
            <span>${cantidadPreguntas} pregunta${cantidadPreguntas !== 1 ? "s" : ""}</span>
          </div>
        </div>

        <div class="registro-actions seguimiento-actions-visibles">
          <button class="icon-btn" title="Editar" onclick="editarSeguimiento(${item.id})">✏️</button>
          <button class="icon-btn" title="Imprimir" onclick="imprimirSeguimiento(${item.id})">🖨️</button>
          <button class="icon-btn" title="Correo" onclick="correoSeguimiento(${item.id})">📧</button>
          <button class="icon-btn" title="Descargar PDF" onclick="descargarSeguimiento(${item.id})">⬇️</button>
          <button class="icon-btn danger" title="Eliminar" onclick="eliminarSeguimiento(${item.id})">🗑️</button>
        </div>
      </div>

      ${
        item.informe
          ? `<div class="informe-encuesta-box informe-compacto">
              <h4>📋 Informe</h4>
              <div>${escapeHtml(item.informe).replace(/\n/g, "<br>")}</div>
            </div>`
          : ""
      }

      <div class="seguimiento-aviso-compacto">
        La tabla está guardada. Tocá <b>✏️ Editar</b> para ver o modificar cuadros, columnas, filas y preguntas.
      </div>
    </div>
  `;
}


function crearTablaManualSeguimiento() {
  const titulo = String($("segTitulo")?.value || "").trim();

  if (!titulo) {
    alert("Completá el título del seguimiento.");
    return;
  }

  seguimientoPendienteRevision = {
    id: Date.now(),
    titulo,
    nombre_apellido: "",
    fecha: "",
    celular: "",
    dni: "",
    barrio: "",
    direccion_numero: "",
    informe: "",
    archivo: "",
    nombreArchivo: "",
    tipo: "",
    tablas: [crearTablaSeguimientoVacia()],
    preguntas: [],
    fecha_carga: new Date().toLocaleDateString("es-AR")
  };

  renderSeguimientos();

  setTimeout(() => {
    document.querySelector(".revision-seguimiento-box")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 80);
}


function guardarSeguimiento() {
  const titulo = String($("segTitulo")?.value || "").trim();
  const archivo = $("segArchivo")?.files?.[0] || null;

  if (!titulo) {
    alert("Completá el título del seguimiento.");
    return;
  }

  if (!archivo) {
    alert("Seleccioná un archivo o tocá Crear tabla manual.");
    return;
  }

  const crearPendiente = (dataUrl = "", nombreArchivo = "", tipo = "", tablas = []) => {
    seguimientoPendienteRevision = {
      id: Date.now(),
      titulo,
      nombre_apellido: "",
      fecha: "",
      celular: "",
      dni: "",
      barrio: "",
      direccion_numero: "",
      informe: "",
      archivo: dataUrl,
      nombreArchivo,
      tipo,
      tablas: Array.isArray(tablas) && tablas.length ? tablas : [],
      preguntas: [],
      fecha_carga: new Date().toLocaleDateString("es-AR")
    };

    if (!seguimientoPendienteRevision.tablas.length) {
      seguimientoPendienteRevision.tablas.push(crearTablaSeguimientoVacia());
    }

    renderSeguimientos();

    setTimeout(() => {
      document.querySelector(".revision-seguimiento-box")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  };

  const tipo = archivo.type || "";
  const nombreArchivo = archivo.name || "archivo";

  if (nombreArchivo.toLowerCase().endsWith(".docx")) {
    extraerTablasSeguimientoDesdeDocx(archivo)
      .then((tablas) => {
        leerArchivoComoDataUrl(archivo).then((dataUrl) => {
          crearPendiente(dataUrl, nombreArchivo, tipo || "application/vnd.openxmlformats-officedocument.wordprocessingml.document", tablas);
        });
      })
      .catch(() => {
        leerArchivoComoDataUrl(archivo).then((dataUrl) => {
          crearPendiente(dataUrl, nombreArchivo, tipo, [crearTablaSeguimientoVacia()]);
        });
      });
    return;
  }

  leerArchivoComoDataUrl(archivo).then((dataUrl) => {
    crearPendiente(dataUrl, nombreArchivo, tipo, [crearTablaSeguimientoVacia()]);
  });
}



function buscarSeguimiento(id) {
  return seguimientos.find((s) => Number(s.id) === Number(id));
}

function eliminarSeguimiento(id) {
  if (!confirm("¿Eliminar este seguimiento?")) return;
  seguimientos = seguimientos.filter((s) => Number(s.id) !== Number(id));
  guardarStorage();
  if (typeof guardarDatosCompartidosSupabaseAhora === 'function') guardarDatosCompartidosSupabaseAhora();
  renderSeguimientos();
}

function imprimirSeguimiento(id) {
  const item = buscarSeguimiento(id);
  if (!item) return;
  imprimirHTML(`Seguimiento - ${item.titulo}`, htmlSeguimientoPDF(item));
}

async function correoSeguimiento(id) {
  const item = buscarSeguimiento(id);
  if (!item) return;

  const archivo = item.archivo || "";
  const adjunto = crearAdjuntoDesdeDataUrl(item.nombreArchivo || item.titulo || "seguimiento", archivo);

  const cuerpo = `
Seguimiento: ${item.titulo || ""}
Nombre y apellido: ${item.nombre_apellido || ""}
Fecha: ${item.fecha || ""}
N° celular: ${item.celular || ""}
DNI: ${item.dni || ""}
Barrio: ${item.barrio || ""}
Dirección y número: ${item.direccion_numero || ""}
Archivo: ${item.nombreArchivo || ""}
Informe:
${item.informe || "Sin informe."}
`;

  await abrirCorreoComputadora({
    asunto: `Seguimiento - ${item.titulo || "Sin título"}`,
    cuerpo,
    html: cuerpoHtmlCorreo(`Seguimiento - ${item.titulo || "Sin título"}`, htmlSeguimientoPDF(item)),
    adjuntos: adjunto ? [adjunto] : []
  });
}

function descargarSeguimiento(id) {
  const item = buscarSeguimiento(id);
  if (!item) return;
  descargarHTML(`seguimiento-${item.titulo}`, htmlSeguimientoPDF(item));
}

function imprimirSeguimientos() {
  imprimirHTML("Seguimientos", `
    <h1>Seguimientos</h1>
    ${seguimientos.map((s) => `<div class="card">${htmlSeguimientoPDF(s)}</div>`).join("") || "<p>Sin seguimientos.</p>"}
  `);
}

async function correoSeguimientos() {
  const cuerpo = seguimientos.length
    ? seguimientos.map((s, i) => `
${i + 1}) ${s.titulo || "Seguimiento"}
Nombre y apellido: ${s.nombre_apellido || ""}
Fecha: ${s.fecha || ""}
N° celular: ${s.celular || ""}
DNI: ${s.dni || ""}
Barrio: ${s.barrio || ""}
Dirección y número: ${s.direccion_numero || ""}
Archivo: ${s.nombreArchivo || ""}
Informe: ${s.informe || "Sin informe."}
`).join("\n----------------\n")
    : "No hay seguimientos cargados.";

  const adjuntos = seguimientos
    .map((s) => crearAdjuntoDesdeDataUrl(s.nombreArchivo || s.titulo || "seguimiento", s.archivo || ""))
    .filter(Boolean);

  await abrirCorreoComputadora({
    asunto: "Base de datos - Seguimientos",
    cuerpo: `Base de datos: Seguimientos\n\n${cuerpo}`,
    html: cuerpoHtmlCorreo(
      "Base de datos - Seguimientos",
      seguimientos.length
        ? seguimientos.map((s) => `<div class="card">${htmlSeguimientoPDF(s)}</div>`).join("")
        : "<p>No hay seguimientos cargados.</p>"
    ),
    adjuntos
  });
}

function descargarSeguimientos() {
  descargarHTML("seguimientos", `
    <h1>Seguimientos</h1>
    ${seguimientos.map((s) => `<div class="card">${htmlSeguimientoPDF(s)}</div>`).join("") || "<p>Sin seguimientos.</p>"}
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
          <input id="planoArchivo" type="file" accept="image/*,.pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" />
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
                  <input id="editPlanoArchivo-${plano.id}" type="file" accept="image/*,.pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" />
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


function registrosDePersona(personaId) {
  return registros.filter((r) => Number(r.persona_id) === Number(personaId));
}

function htmlRegistrosDePersona(personaId) {
  const regs = registrosDePersona(personaId);

  if (!regs.length) {
    return `<p><i>Sin registros internos.</i></p>`;
  }

  return `
    <h2>Registros internos</h2>
    ${regs.map((r) => `
      <div class="card registro-print-card">
        <h3>${escapeHtml(r.titulo || "Registro")}</h3>
        <p><b>Fecha:</b> ${escapeHtml(r.fecha || "—")}</p>
        <p>${escapeHtml(r.descripcion || "—").replace(/\n/g, "<br>")}</p>
      </div>
    `).join("")}
  `;
}

function htmlPersonaConOpciones(p, incluirRegistros = false) {
  return `
    <h1>Registro: ${escapeHtml(p.nombre || "Persona")}</h1>
    <div class="card">
      <pre>${escapeHtml(textoPersona(p))}</pre>
      ${incluirRegistros ? htmlRegistrosDePersona(p.id) : ""}
    </div>
  `;
}

function preguntarRegistroSimple(nombre = "este apartado") {
  return confirm(`¿Querés imprimir/descargar ${nombre} con registros internos?\n\nAceptar = Sí\nCancelar = No`);
}

function preguntarRegistroMultiple(personasLista, accion = "imprimir") {
  if (!personasLista.length) return {};

  const respuesta = prompt(
    `¿Deseás ${accion} con registros internos?\n\n` +
    `Escribí una opción:\n` +
    `SI = todos con registros\n` +
    `NO = todos sin registros\n` +
    `EDITAR = elegir persona por persona`,
    "NO"
  );

  const r = String(respuesta || "NO").trim().toLowerCase();
  const mapa = {};

  if (r === "si" || r === "sí" || r === "s") {
    personasLista.forEach((p) => mapa[p.id] = true);
    return mapa;
  }

  if (r === "editar" || r === "e") {
    const listado = personasLista.map((p, i) => `${i + 1}) ${p.nombre || "Sin nombre"}`).join("\n");
    const elegidos = prompt(
      `Elegí cuáles van CON registros internos.\n\n${listado}\n\n` +
      `Escribí los números separados por coma. Ej: 1,3,5\n` +
      `Los que no pongas salen sin registros.`,
      ""
    );

    const nums = String(elegidos || "")
      .split(",")
      .map((x) => Number(x.trim()))
      .filter(Boolean);

    personasLista.forEach((p, i) => {
      mapa[p.id] = nums.includes(i + 1);
    });

    return mapa;
  }

  personasLista.forEach((p) => mapa[p.id] = false);
  return mapa;
}

function htmlPersonasConMapaRegistro(personasLista, mapa) {
  return personasLista.map((p) => htmlPersonaConOpciones(p, !!mapa[p.id])).join("");
}

function categoriasSeleccionadasFormulario() {
  const checks = Array.from(document.querySelectorAll(".categoria-extra-check:checked"))
    .map((c) => Number(c.value))
    .filter(Boolean);

  const principal = Number($("categoriaSelect")?.value || 0);
  if (principal && !checks.includes(principal)) checks.unshift(principal);

  return [...new Set(checks)];
}

function renderCategoriasExtraPersona(seleccionadas = []) {
  const normales = categorias.filter((cat) => !cat.parent && cat.tipo !== "barrio");

  return `
    <div class="multi-base-box">
      <div class="multi-base-head">
        <b>Mandar también a otras bases de datos</b>
        <small>Podés elegir una o varias bases.</small>
      </div>

      <div class="multi-base-list">
        ${normales.map((cat) => `
          <label class="multi-base-item">
            <input
              type="checkbox"
              class="categoria-extra-check"
              value="${cat.id}"
              ${seleccionadas.map(Number).includes(Number(cat.id)) ? "checked" : ""}
            />
            <span>${cat.icono} ${escapeHtml(cat.nombre)}</span>
          </label>
        `).join("")}
      </div>
    </div>
  `;
}

function asegurarMultiBasePersona(seleccionadas = []) {
  const select = $("categoriaSelect");
  if (!select || !select.parentElement) return;

  let box = $("multiBasePersonaBox");
  if (!box) {
    box = document.createElement("div");
    box.id = "multiBasePersonaBox";
    select.parentElement.insertAdjacentElement("afterend", box);
  }

  box.innerHTML = renderCategoriasExtraPersona(seleccionadas);
}


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
  return htmlPersonaConOpciones(p, false);
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

  if (catActiva.tipo === "seguimiento") {
    imprimirSeguimientos();
    return;
  }

  const personasCat = personas.filter((p) => Number(p.categoria_id) === Number(catActiva.id));
  const mapa = preguntarRegistroMultiple(personasCat, "imprimir esta base");
  imprimirHTML(`Imprimir ${catActiva.nombre}`, `<h1>Base de datos: ${escapeHtml(catActiva.nombre)}</h1>${personasCat.length ? htmlPersonasConMapaRegistro(personasCat, mapa) : "<p>No hay registros cargados.</p>"}`);
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

  if (catActiva.tipo === "seguimiento") {
    descargarSeguimientos();
    return;
  }

  const personasCat = personas.filter((p) => Number(p.categoria_id) === Number(catActiva.id));
  const mapa = preguntarRegistroMultiple(personasCat, "descargar esta base");
  descargarHTML(`base-${catActiva.nombre}`, `<h1>Base de datos: ${escapeHtml(catActiva.nombre)}</h1>${personasCat.length ? htmlPersonasConMapaRegistro(personasCat, mapa) : "<p>No hay registros cargados.</p>"}`);
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

  
  if (catActiva.tipo === "seguimiento") {
    correoSeguimientos();
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
  if (!p) return;

  const incluir = preguntarRegistroSimple(p.nombre || "esta persona");
  imprimirHTML(`Imprimir ${p.nombre}`, htmlPersonaConOpciones(p, incluir));
}

function correoPersona(id) {
  const p = personas.find((x) => Number(x.id) === Number(id));
  if (p) abrirCorreo(`Registro - ${p.nombre}`, textoPersona(p));
}

function descargarPersona(id) {
  const p = personas.find((x) => Number(x.id) === Number(id));
  if (!p) return;

  const incluir = preguntarRegistroSimple(p.nombre || "esta persona");
  descargarHTML(`persona-${p.nombre}`, htmlPersonaConOpciones(p, incluir));
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





















