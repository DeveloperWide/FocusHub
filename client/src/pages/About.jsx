import { CheckCircle2, ListChecks, Target, TimerReset } from "lucide-react";
import { Link } from "react-router-dom";
import { usePageMeta } from "../hooks/usePageMeta";

const About = () => {
  usePageMeta("About FocusHub", "Learn how FocusHub helps people organize tasks, goals, and focused work from one web workspace.");

  return (
    <div className="bg-gradient-to-br from-amber-50 via-white to-indigo-50 dark:from-slate-950 dark:via-slate-950 dark:to-indigo-950">
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <p className="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-300">About FocusHub</p>
        <h1 className="mt-4 max-w-4xl text-4xl font-extrabold tracking-tight text-gray-950 dark:text-white sm:text-5xl">A focused workspace for the work that needs your attention.</h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-600 dark:text-slate-300">FocusHub is a web application for organizing tasks, setting goals, and recording focused work. It is designed to make the next piece of work easier to see and manage without claiming to solve every part of your workflow.</p>
      </section>

      <section className="border-y border-gray-200 bg-white/80 py-16 dark:border-slate-800 dark:bg-slate-900/50"><div className="mx-auto grid max-w-5xl gap-10 px-4 sm:px-6 md:grid-cols-2 lg:px-8"><div><h2 className="text-2xl font-extrabold">Why FocusHub exists</h2><p className="mt-4 leading-7 text-gray-600 dark:text-slate-300">It is easy for tasks, priorities, and long-running goals to end up in different places. FocusHub exists to provide a practical workspace where those parts of day-to-day work can be kept together.</p><p className="mt-4 leading-7 text-gray-600 dark:text-slate-300">The aim is simple: give users a clear place to add work, group it in a useful way, track completion, and return to what matters next.</p></div><div className="rounded-3xl border border-indigo-200 bg-indigo-50 p-7 dark:border-indigo-500/30 dark:bg-indigo-500/10"><h2 className="text-2xl font-extrabold">What it helps with</h2><ul className="mt-5 space-y-4">{["Keeping daily tasks visible and prioritized", "Connecting related tasks and goals", "Using focus sessions to support intentional work", "Reviewing completed work and recorded focus time"].map((item) => <li key={item} className="flex gap-3 text-gray-700 dark:text-slate-200"><CheckCircle2 size={20} className="mt-0.5 shrink-0 text-indigo-600 dark:text-indigo-300" />{item}</li>)}</ul></div></div></section>

      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8"><div className="max-w-2xl"><h2 className="text-3xl font-extrabold tracking-tight">How the product works</h2><p className="mt-4 leading-7 text-gray-600 dark:text-slate-300">After creating an account, users enter a personal workspace. The product is organized around a few connected tools rather than a collection of unrelated features.</p></div><div className="mt-10 grid gap-5 md:grid-cols-3">{[[<ListChecks className="text-indigo-600 dark:text-indigo-300" size={24} />, "Tasks", "Create daily tasks with a priority and tag, update them as plans change, and mark them complete."], [<Target className="text-indigo-600 dark:text-indigo-300" size={24} />, "Goals", "Create goals and organize related work so there is context behind a task list."], [<TimerReset className="text-indigo-600 dark:text-indigo-300" size={24} />, "Focus and progress", "Run focus sessions, view activity records, and use dashboard views for task and focus-time progress."]].map(([icon, title, text]) => <article key={title} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">{icon}<h3 className="mt-4 text-lg font-bold">{title}</h3><p className="mt-2 text-sm leading-6 text-gray-600 dark:text-slate-300">{text}</p></article>)}</div></section>

      <section className="border-t border-gray-200 bg-white py-16 text-center dark:border-slate-800 dark:bg-slate-900/50"><div className="mx-auto max-w-2xl px-4 sm:px-6"><h2 className="text-3xl font-extrabold">Start with a clearer workspace.</h2><p className="mt-4 leading-7 text-gray-600 dark:text-slate-300">Create an account when you are ready to organize tasks and focused work in FocusHub.</p><Link to="/signup" className="mt-7 inline-flex rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700">Get Started</Link></div></section>
    </div>
  );
};

export default About;
