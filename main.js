const fs = require("fs");
const path = require("path");
const { app, BrowserWindow, ipcMain, dialog, shell } = require("electron");

function createWindow() {
  const win = new BrowserWindow({
    width: 1365,
    height: 768,
    minWidth: 1050,
    minHeight: 650,
    backgroundColor: "#f3f4f6",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.loadFile("index.html");
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// =====================================================
// PDF DIRECTO CON "GUARDAR COMO"
// =====================================================

ipcMain.handle("pdf:guardarComo", async (_, data) => {
  try {
    const nombre = data?.nombre || "archivo.pdf";
    const html = data?.html || "";

    const result = await dialog.showSaveDialog({
      title: "Guardar PDF",
      defaultPath: nombre,
      filters: [
        {
          name: "PDF",
          extensions: ["pdf"]
        }
      ]
    });

    if (result.canceled || !result.filePath) {
      return {
        cancelado: true
      };
    }

    const pdfWindow = new BrowserWindow({
      show: false,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true
      }
    });

    await pdfWindow.loadURL(
      "data:text/html;charset=utf-8," + encodeURIComponent(html)
    );

    const pdfBuffer = await pdfWindow.webContents.printToPDF({
      printBackground: true,
      landscape: false,
      pageSize: "A4",
      margins: {
        marginType: "default"
      }
    });

    fs.writeFileSync(result.filePath, pdfBuffer);
    pdfWindow.close();

    return {
      ok: true,
      ruta: result.filePath
    };
  } catch (error) {
    return {
      ok: false,
      error: error.message
    };
  }
});

// =====================================================
// CORREO DE LA COMPUTADORA CON ADJUNTOS
// Crea un .eml temporal con imagen/PDF adjunto y lo abre
// en el cliente de correo predeterminado.
// =====================================================

function limpiarNombreArchivo(nombre) {
  return String(nombre || "archivo")
    .replace(/[\\/:*?"<>|]/g, "-")
    .slice(0, 90);
}

function dataUrlToBuffer(dataUrl) {
  const texto = String(dataUrl || "");
  const match = texto.match(/^data:([^;]+);base64,(.*)$/);

  if (!match) {
    return {
      mime: "application/octet-stream",
      buffer: Buffer.from("")
    };
  }

  return {
    mime: match[1],
    buffer: Buffer.from(match[2], "base64")
  };
}

function codificarHeader(texto) {
  return (
    "=?UTF-8?B?" +
    Buffer.from(String(texto || ""), "utf8").toString("base64") +
    "?="
  );
}

ipcMain.handle("email:abrirConAdjuntos", async (_, data) => {
  try {
    const asunto = data?.asunto || "Correo";
    const cuerpo = data?.cuerpo || "";
    const html = data?.html || `<pre>${cuerpo}</pre>`;
    const adjuntos = Array.isArray(data?.adjuntos) ? data.adjuntos : [];

    const boundary = "----=_KeesBoundary_" + Date.now();
    const boundaryAlt = "----=_KeesAlt_" + Date.now();

    let eml = "";

    eml += `Subject: ${codificarHeader(asunto)}\r\n`;
    eml += "X-Unsent: 1\r\n";
    eml += "MIME-Version: 1.0\r\n";
    eml += `Content-Type: multipart/mixed; boundary="${boundary}"\r\n`;
    eml += "\r\n";

    eml += `--${boundary}\r\n`;
    eml += `Content-Type: multipart/alternative; boundary="${boundaryAlt}"\r\n\r\n`;

    eml += `--${boundaryAlt}\r\n`;
    eml += 'Content-Type: text/plain; charset="UTF-8"\r\n';
    eml += "Content-Transfer-Encoding: base64\r\n\r\n";
    eml +=
      Buffer.from(cuerpo, "utf8")
        .toString("base64")
        .replace(/(.{76})/g, "$1\r\n") + "\r\n\r\n";

    eml += `--${boundaryAlt}\r\n`;
    eml += 'Content-Type: text/html; charset="UTF-8"\r\n';
    eml += "Content-Transfer-Encoding: base64\r\n\r\n";
    eml +=
      Buffer.from(html, "utf8")
        .toString("base64")
        .replace(/(.{76})/g, "$1\r\n") + "\r\n\r\n";

    eml += `--${boundaryAlt}--\r\n`;

    adjuntos.forEach((adj, index) => {
      if (!adj || !adj.dataUrl) return;

      const { mime, buffer } = dataUrlToBuffer(adj.dataUrl);

      if (!buffer.length) return;

      const filename = limpiarNombreArchivo(
        adj.filename || `adjunto-${index + 1}`
      );

      eml += `--${boundary}\r\n`;
      eml += `Content-Type: ${mime}; name="${filename}"\r\n`;
      eml += `Content-Disposition: attachment; filename="${filename}"\r\n`;
      eml += "Content-Transfer-Encoding: base64\r\n\r\n";
      eml +=
        buffer
          .toString("base64")
          .replace(/(.{76})/g, "$1\r\n") + "\r\n\r\n";
    });

    eml += `--${boundary}--\r\n`;

    const tempDir = path.join(
      app.getPath("temp"),
      "gestion-personas-correos"
    );

    fs.mkdirSync(tempDir, {
      recursive: true
    });

    const emlPath = path.join(
      tempDir,
      limpiarNombreArchivo(asunto || "correo") + "-" + Date.now() + ".eml"
    );

    fs.writeFileSync(emlPath, eml, "utf8");

    const respuesta = await shell.openPath(emlPath);

    if (respuesta) {
      return {
        ok: false,
        error: respuesta
      };
    }

    return {
      ok: true,
      ruta: emlPath
    };
  } catch (error) {
    return {
      ok: false,
      error: error.message
    };
  }
});
