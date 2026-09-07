import { Request, Response } from "express";
import ContactMessage from "../models/ContactMessage";
import ExpressError from "../utils/ExpressError";
import { wrapAsync } from "../utils/asyncWrapper";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const clean = (value: unknown) => String(value ?? "").trim();

export const createContactMessage = wrapAsync(
  async (req: Request, res: Response) => {
    const name = clean(req.body?.name);
    const email = clean(req.body?.email).toLowerCase();
    const subject = clean(req.body?.subject);
    const message = clean(req.body?.message);

    if (!name || !email || !subject || !message) {
      throw ExpressError.badRequest("Name, email, subject, and message are required.");
    }

    if (!emailPattern.test(email)) {
      throw ExpressError.badRequest("Please provide a valid email address.");
    }

    const contactMessage = await ContactMessage.create({
      name,
      email,
      subject,
      message,
    });

    res.status(201).json({
      success: true,
      message: "Your message has been received.",
      data: { id: contactMessage.id },
    });
  },
);
