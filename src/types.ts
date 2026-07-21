export interface GuestbookEntry {
  id: string;
  name: string;
  status: "Hadir" | "Tidak Hadir" | "Ragu";
  message: string;
  timestamp: string;
}

export interface AdminSettings {
  googleSheetsUrl: string;
  hasPasscode: boolean;
}
