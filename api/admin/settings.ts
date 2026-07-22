type Request = { method?: string };
type Response = {
  status: (statusCode: number) => Response;
  json: (body: unknown) => void;
  setHeader: (name: string, value: string) => void;
};

export default function handler(req: Request, res: Response) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Pengaturan dikelola dari Vercel Environment Variables." });
  }

  return res.status(200).json({
    configured: Boolean(process.env.GOOGLE_SHEETS_WEBHOOK_URL),
    googleSheetsUrl: "",
    hasPasscode: false,
  });
}
