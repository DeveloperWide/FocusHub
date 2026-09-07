import { Schema, model } from "mongoose";

interface IContactMessage {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const contactMessageSchema = new Schema<IContactMessage>(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 254 },
    subject: { type: String, required: true, trim: true, maxlength: 200 },
    message: { type: String, required: true, trim: true, maxlength: 5000 },
  },
  { timestamps: true },
);

contactMessageSchema.index({ createdAt: -1 });

const ContactMessage = model<IContactMessage>(
  "ContactMessage",
  contactMessageSchema,
);

export default ContactMessage;
