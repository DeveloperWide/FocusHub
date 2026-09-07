import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "maheshsecret";
const AUTH_COOKIE_NAME = process.env.AUTH_COOKIE_NAME || "fh_session";
const SESSION_DAYS = Number(process.env.SESSION_DAYS || 7);
const SESSION_MAX_AGE_MS = SESSION_DAYS * 24 * 60 * 60 * 1000;

interface TokenPayload extends JwtPayload {
  id: string;
}

type SameSite = boolean | "none" | "lax" | "strict" | undefined;

const getCookieSecurityOptions = () => {
  const isProd = process.env.NODE_ENV === "production";

  const secure =
    process.env.COOKIE_SECURE != null
      ? process.env.COOKIE_SECURE === "true"
      : isProd;

  const sameSite: SameSite =
    (process.env.COOKIE_SAME_SITE as SameSite) || (isProd ? "none" : "lax");

  return { secure, sameSite };
};

const getAuthCookieOptions = () => {
  const { secure, sameSite } = getCookieSecurityOptions();

  return {
    httpOnly: true,
    secure,
    sameSite,
    maxAge: SESSION_MAX_AGE_MS,
    path: "/",
  };
};

// Add middlewares like isOwner & isAdmin

export const authenticateUser = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const cookieToken = req.cookies?.[AUTH_COOKIE_NAME];
    const authHeader = req.headers.authorization;

    const headerToken =
      authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : null;

    const token = cookieToken || headerToken;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Authentication failed: No token provided." });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    if (typeof decoded == "string") {
      return res.status(400).json({ message: "Invalid token" });
    }

    const payload = decoded as TokenPayload;

    // ✅ Attach decoded user info to req.user
    req.user = { id: payload.id };

    if (cookieToken) {
      const refreshedToken = jwt.sign({ id: decoded.id }, JWT_SECRET, {
        expiresIn: `${SESSION_DAYS}d`,
      });

      res.cookie(AUTH_COOKIE_NAME, refreshedToken, getAuthCookieOptions());
    }

    next();
  } catch (err) {
    if (req.cookies?.[AUTH_COOKIE_NAME]) {
      const { secure, sameSite } = getCookieSecurityOptions();
      res.clearCookie(AUTH_COOKIE_NAME, {
        httpOnly: true,
        secure,
        sameSite,
        path: "/",
      });
    }

    return res
      .status(401)
      .json({ message: "Authentication failed: Invalid or expired token." });
  }
};
