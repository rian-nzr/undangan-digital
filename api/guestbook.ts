type GuestbookEntry = {
  id: string;
  name: string;
  status: "Hadir" | "Tidak Hadir" | "Ragu";
  message: string;
  timestamp: string;
};

type Request = {
  method?: string;
  body?: unknown;
};

type Response = {
  status: (statusCode: number) => Response;
  json: (body: unknown) => void;
  setHeader: (name: string, value: string) => void;
};

const getWebhookUrl = () => {
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  if (!webhookUrl) {
    return null;
  }

  const url = new URL(webhookUrl);
  const token = process.env.GOOGLE_SHEETS_TOKEN;
  if (token) {
    url.searchParams.set("token", token);
  }

  return url;
};

const isValidEntry = (value: unknown): value is Omit<GuestbookEntry, "id" | "timestamp"> => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const entry = value as Record<string, unknown>;
  return (
    typeof entry.name === "string" &&
    entry.name.trim().length > 0 &&
    typeof entry.message === "string" &&
    entry.message.trim().length > 0 &&
    (entry.status === "Hadir" || entry.status === "Tidak Hadir" || entry.status === "Ragu")
  );
};

export default async function handler(req: Request, res: Response) {
  const webhookUrl = getWebhookUrl();

  if (!webhookUrl) {
    return res.status(503).json({
      error: "Google Sheets belum dikonfigurasi. Tambahkan GOOGLE_SHEETS_WEBHOOK_URL di Vercel.",
    });
  }

  if (req.method === "GET") {
    try {
      webhookUrl.searchParams.set("action", "entries");
      const response = await fetch(webhookUrl, { redirect: "follow" });
      if (!response.ok) {
        throw new Error(`Google Sheets merespons ${response.status}`);
      }

      const data: unknown = await response.json();
      return res.status(200).json(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Gagal memuat ucapan dari Google Sheets:", error);
      return res.status(502).json({ error: "Gagal memuat ucapan dari Google Sheets." });
    }
  }

  if (req.method === "POST") {
    if (!isValidEntry(req.body)) {
      return res.status(400).json({ error: "Nama, kehadiran, dan ucapan wajib diisi." });
    }

    const entry: GuestbookEntry = {
      id: crypto.randomUUID(),
      name: req.body.name.trim(),
      status: req.body.status,
      message: req.body.message.trim(),
      timestamp: new Date().toISOString(),
    };

    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entry),
        redirect: "follow",
      });

      if (!response.ok) {
        throw new Error(`Google Sheets merespons ${response.status}`);
      }

      return res.status(201).json(entry);
    } catch (error) {
      console.error("Gagal menyimpan ucapan ke Google Sheets:", error);
      return res.status(502).json({ error: "Gagal menyimpan ucapan ke Google Sheets." });
    }
  }

  res.setHeader("Allow", "GET, POST");
  return res.status(405).json({ error: "Method tidak diizinkan." });
}
