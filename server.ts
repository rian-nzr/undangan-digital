import express from "express";
import path from "path";
import fs from "fs/promises";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  const GUESTBOOK_FILE = path.join(process.cwd(), "guestbook.json");
  const SETTINGS_FILE = path.join(process.cwd(), "settings.json");

  // Helper to read data
  async function readGuestbook() {
    try {
      const data = await fs.readFile(GUESTBOOK_FILE, "utf-8");
      return JSON.parse(data);
    } catch (e) {
      return [];
    }
  }

  // Helper to write data
  async function writeGuestbook(data: any) {
    await fs.writeFile(GUESTBOOK_FILE, JSON.stringify(data, null, 2), "utf-8");
  }

  // Helper to read settings
  async function readSettings() {
    try {
      const data = await fs.readFile(SETTINGS_FILE, "utf-8");
      return JSON.parse(data);
    } catch (e) {
      return {
        googleSheetsUrl: "",
        weddingPasscode: "gayo2026",
      };
    }
  }

  // Helper to write settings
  async function writeSettings(data: any) {
    await fs.writeFile(SETTINGS_FILE, JSON.stringify(data, null, 2), "utf-8");
  }

  // Ensure files exist
  try {
    await fs.access(GUESTBOOK_FILE);
  } catch {
    await writeGuestbook([]);
  }

  try {
    await fs.access(SETTINGS_FILE);
  } catch {
    await writeSettings({
      googleSheetsUrl: "",
      weddingPasscode: "gayo2026",
    });
  }

  // --- API ROUTES ---

  // Get all guestbook entries
  app.get("/api/guestbook", async (req, res) => {
    try {
      const entries = await readGuestbook();
      res.json(entries);
    } catch (error) {
      res.status(500).json({ error: "Gagal membaca buku tamu" });
    }
  });

  // Add a guestbook entry
  app.post("/api/guestbook", async (req, res) => {
    try {
      const { name, status, message } = req.body;
      if (!name || !status || !message) {
        return res.status(400).json({ error: "Nama, status kehadiran, dan ucapan harus diisi" });
      }

      const newEntry = {
        id: Date.now().toString(),
        name,
        status,
        message,
        timestamp: new Date().toISOString(),
      };

      const entries = await readGuestbook();
      entries.unshift(newEntry); // Add to beginning (newest first)
      await writeGuestbook(entries);

      // Try forwarding to Google Sheets Webhook in background if configured
      const settings = await readSettings();
      if (settings.googleSheetsUrl) {
        // Forwarding using fetch
        try {
          // Fire and forget, or log it
          fetch(settings.googleSheetsUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newEntry),
          }).catch(err => console.error("Error sending to Google Sheet Webhook:", err.message));
        } catch (e) {
          console.error("Fetch exception during Webhook post:", e);
        }
      }

      res.status(201).json(newEntry);
    } catch (error) {
      res.status(500).json({ error: "Gagal menyimpan buku tamu" });
    }
  });

  // Get settings
  app.get("/api/admin/settings", async (req, res) => {
    try {
      const settings = await readSettings();
      // Don't send the real passcode back directly in plain view, or send it masked
      res.json({
        googleSheetsUrl: settings.googleSheetsUrl,
        hasPasscode: !!settings.weddingPasscode,
      });
    } catch (error) {
      res.status(500).json({ error: "Gagal membaca pengaturan" });
    }
  });

  // Update settings
  app.post("/api/admin/settings", async (req, res) => {
    try {
      const { googleSheetsUrl, passcode } = req.body;
      const settings = await readSettings();

      if (settings.weddingPasscode && passcode !== settings.weddingPasscode) {
        return res.status(401).json({ error: "Passcode admin salah!" });
      }

      settings.googleSheetsUrl = googleSheetsUrl || "";
      await writeSettings(settings);

      res.json({ success: true, message: "Pengaturan berhasil diperbarui" });
    } catch (error) {
      res.status(500).json({ error: "Gagal menyimpan pengaturan" });
    }
  });

  // Export as CSV
  app.get("/api/admin/export", async (req, res) => {
    try {
      const entries = await readGuestbook();
      let csvContent = "\uFEFF"; // UTF-8 BOM for Excel
      csvContent += "ID,Tanggal,Nama,Kehadiran,Ucapan/Doa\n";

      entries.forEach((entry: any) => {
        const dateStr = new Date(entry.timestamp).toLocaleString("id-ID");
        // Escape commas and quotes for CSV
        const safeName = `"${(entry.name || "").replace(/"/g, '""')}"`;
        const safeStatus = `"${(entry.status || "").replace(/"/g, '""')}"`;
        const safeMessage = `"${(entry.message || "").replace(/"/g, '""').replace(/\n/g, " ")}"`;
        csvContent += `${entry.id},${dateStr},${safeName},${safeStatus},${safeMessage}\n`;
      });

      res.setHeader("Content-Type", "text/csv; charset=utf-8");
      res.setHeader("Content-Disposition", "attachment; filename=daftar-buku-tamu.csv");
      res.send(csvContent);
    } catch (error) {
      res.status(500).send("Gagal mengunduh CSV");
    }
  });

  // Clear guestbook
  app.post("/api/admin/clear", async (req, res) => {
    try {
      const { passcode } = req.body;
      const settings = await readSettings();

      if (settings.weddingPasscode && passcode !== settings.weddingPasscode) {
        return res.status(401).json({ error: "Passcode admin salah!" });
      }

      await writeGuestbook([]);
      res.json({ success: true, message: "Buku tamu berhasil dibersihkan" });
    } catch (error) {
      res.status(500).json({ error: "Gagal membersihkan buku tamu" });
    }
  });

  // --- VITE MIDDLEWARE SETUP ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
