export interface getAuthCookieOptions {
  httpOnly: boolean;
  secure: Boolean | null;
  sameSite: "none" | "lax";
  maxAge: number;
  path: string;
}
