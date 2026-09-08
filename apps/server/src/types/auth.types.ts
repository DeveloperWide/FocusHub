/**
 * JWT returned after a successful authentication request.
 *
 * Browser clients continue to receive the same token in an httpOnly cookie;
 * native clients use this value with an Authorization Bearer header.
 */
export interface AuthTokenResponse {
  token: string;
}

export interface getAuthCookieOptions {
  httpOnly: boolean;
  secure: Boolean | null;
  sameSite: "none" | "lax";
  maxAge: number;
  path: string;
}
