import { useState } from "react";
import { Mail, Send } from "lucide-react";
import { axiosInstance } from "../utils/axiosInstance";
import { usePageMeta } from "../hooks/usePageMeta";

const initialValues: any = { name: "", email: "", subject: "", message: "" };

const Contact = () => {
  usePageMeta(
    "Contact FocusHub",
    "Contact the FocusHub team with a product, account, or website question.",
  );
  const [values, setValues] = useState<any>(initialValues);
  const [errors, setErrors] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<any>(null);

  const validate = () => {
    const nextErrors: any = {};
    if (!values.name.trim()) nextErrors.name = "Please enter your name.";
    if (!values.email.trim())
      nextErrors.email = "Please enter your email address.";
    else if (!/^\S+@\S+\.\S+$/.test(values.email))
      nextErrors.email = "Please enter a valid email address.";
    if (!values.subject.trim()) nextErrors.subject = "Please enter a subject.";
    if (!values.message.trim()) nextErrors.message = "Please enter a message.";
    return nextErrors;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
    setStatus(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    setStatus(null);
    if (Object.keys(nextErrors).length) return;

    setIsSubmitting(true);
    try {
      await axiosInstance.post("/contact", values);
      setValues(initialValues);
      setStatus({
        type: "success",
        message:
          "Your message has been received. We will review it using the contact details you provided.",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error?.response?.data?.message ||
          "Your message could not be sent right now. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const fieldClass = (name) =>
    `mt-2 w-full rounded-xl border bg-white px-3 py-2.5 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-indigo-500/20 ${errors[name] ? "border-red-500" : "border-gray-300 dark:border-slate-700"}`;

  return (
    <div className="bg-gradient-to-br from-amber-50 via-white to-indigo-50 py-14 dark:from-slate-950 dark:via-slate-950 dark:to-indigo-950 sm:py-20">
      <div className="mx-auto grid max-w-5xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
        <section className="lg:pt-8">
          <p className="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-300">
            Contact FocusHub
          </p>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-gray-950 dark:text-white">
            Get in touch.
          </h1>
          <p className="mt-5 max-w-md leading-7 text-gray-600 dark:text-slate-300">
            Send a question about FocusHub, your account, or the website.
            Contact messages are recorded by the FocusHub application for
            review.
          </p>
          <div className="mt-8 rounded-3xl border border-indigo-200 bg-indigo-50 p-5 dark:border-indigo-500/30 dark:bg-indigo-500/10">
            <Mail className="text-indigo-600 dark:text-indigo-300" size={22} />
            <h2 className="mt-3 font-bold">Direct support email</h2>
            <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-slate-300">
              <span className="font-semibold text-amber-700 dark:text-amber-300">
                focushub.co.in@gmail.com
              </span>
            </p>
          </div>
        </section>

        <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xl shadow-indigo-950/5 dark:border-slate-800 dark:bg-slate-900 sm:p-8">
          <h2 className="text-2xl font-extrabold">Send a message</h2>
          <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-slate-300">
            All fields are required.
          </p>
          {status && (
            <div
              role={status.type === "error" ? "alert" : "status"}
              className={`mt-5 rounded-xl border px-4 py-3 text-sm ${status.type === "success" ? "border-green-200 bg-green-50 text-green-800 dark:border-green-500/30 dark:bg-green-500/10 dark:text-green-200" : "border-red-200 bg-red-50 text-red-800 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200"}`}
            >
              {status.message}
            </div>
          )}
          <form className="mt-6 space-y-5" onSubmit={handleSubmit} noValidate>
            <div>
              <label htmlFor="contact-name" className="text-sm font-semibold">
                Name
              </label>
              <input
                id="contact-name"
                name="name"
                type="text"
                autoComplete="name"
                value={values.name}
                onChange={handleChange}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={
                  errors.name ? "contact-name-error" : undefined
                }
                className={fieldClass("name")}
              />
              {errors.name && (
                <p
                  id="contact-name-error"
                  className="mt-1 text-sm text-red-600 dark:text-red-300"
                >
                  {errors.name}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="contact-email" className="text-sm font-semibold">
                Email
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                autoComplete="email"
                value={values.email}
                onChange={handleChange}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={
                  errors.email ? "contact-email-error" : undefined
                }
                className={fieldClass("email")}
              />
              {errors.email && (
                <p
                  id="contact-email-error"
                  className="mt-1 text-sm text-red-600 dark:text-red-300"
                >
                  {errors.email}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="contact-subject"
                className="text-sm font-semibold"
              >
                Subject
              </label>
              <input
                id="contact-subject"
                name="subject"
                type="text"
                value={values.subject}
                onChange={handleChange}
                aria-invalid={Boolean(errors.subject)}
                aria-describedby={
                  errors.subject ? "contact-subject-error" : undefined
                }
                className={fieldClass("subject")}
              />
              {errors.subject && (
                <p
                  id="contact-subject-error"
                  className="mt-1 text-sm text-red-600 dark:text-red-300"
                >
                  {errors.subject}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="contact-message"
                className="text-sm font-semibold"
              >
                Message
              </label>
              <textarea
                id="contact-message"
                name="message"
                rows={6}
                value={values.message}
                onChange={handleChange}
                aria-invalid={Boolean(errors.message)}
                aria-describedby={
                  errors.message ? "contact-message-error" : undefined
                }
                className={fieldClass("message")}
              />
              {errors.message && (
                <p
                  id="contact-message-error"
                  className="mt-1 text-sm text-red-600 dark:text-red-300"
                >
                  {errors.message}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <Send size={17} />
              {isSubmitting ? "Sending message..." : "Send message"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default Contact;
