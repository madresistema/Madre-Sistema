const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  guardarPdfHTML: (data) => ipcRenderer.invoke("pdf:guardarComo", data),
  abrirCorreoConAdjuntos: (data) => ipcRenderer.invoke("email:abrirConAdjuntos", data)
});
