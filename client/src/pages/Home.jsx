import { Link } from "react-router-dom";
import { BarChart3, CheckCircle2, CircleUserRound, ListChecks, TimerReset, Target } from "lucide-react";
import ProductPreview from "../components/public/ProductPreview";
import { usePageMeta } from "../hooks/usePageMeta";

const features = [
  { icon: <ListChecks size={21} />, title: "Daily task management", description: "Create tasks, set priorities and tags, then mark work complete as you move through the day." },
  { icon: <Target size={21} />, title: "Goals and organized work", description: "Set goals and connect related work so your task list has useful context." },
  { icon: <TimerReset size={21} />, title: "Focus sessions", description: "Use the built-in focus timer for personal or goal-linked sessions and keep a record of them." },
  { icon: <BarChart3 size={21} />, title: "Progress views", description: "Review task completion, focus time, recent activity, and goal-based focus patterns from the app." },
  { icon: <CircleUserRound size={21} />, title: "Accounts and plans", description: "Use an account-based workspace and choose from the available plans as your task and goal limits change." },
];

const faqs = [
  ["What is FocusHub?", "FocusHub is a web-based productivity workspace for managing tasks, organizing goals, and recording focused work sessions."],
  ["Is FocusHub free to use?", "FocusHub includes a free plan. The app also offers paid plan options with higher task and goal limits."],
  ["How do I create an account?", "Select Get Started, enter your name, username, email address, and password, then continue to your dashboard."],
  ["Can I manage my tasks in FocusHub?", "Yes. You can create, organize, update, complete, and remove tasks in the authenticated workspace."],
  ["Do I need to install anything?", "No. FocusHub is accessed in a supported web browser; no separate desktop installation is required."],
  ["How can I contact FocusHub?", "Use the contact form on this site to send a message to the FocusHub team."],
];

const Home = () => {
  usePageMeta("Organize work and stay focused", "FocusHub is a productivity workspace for organizing tasks, goals, and focused work sessions.");

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-white to-indigo-50 dark:from-slate-950 dark:via-slate-950 dark:to-indigo-950">
        <div className="pointer-events-none absolute inset-0 opacity-60"><div className="absolute -left-28 -top-28 h-80 w-80 rounded-full bg-amber-200 blur-3xl dark:bg-amber-500/10" /><div className="absolute -bottom-32 -right-24 h-96 w-96 rounded-full bg-indigo-200 blur-3xl dark:bg-indigo-500/10" /></div>
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="inline-flex rounded-full border border-indigo-200 bg-white/70 px-3 py-1 text-sm font-semibold text-indigo-700 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-200">FocusHub productivity workspace</p>
            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-gray-950 dark:text-white sm:text-6xl">Organize your work. Stay focused. Get more done.</h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600 dark:text-slate-300">FocusHub helps you manage tasks, organize goals, and make focused work easier to follow from one workspace.</p>
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row"><Link to="/signup" className="rounded-xl bg-indigo-600 px-5 py-3 text-center font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700">Get Started</Link><Link to="/login" className="rounded-xl border border-gray-300 bg-white px-5 py-3 text-center font-semibold text-gray-800 transition hover:bg-gray-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800">Login</Link></div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8"><div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center"><div><p className="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-300">What is FocusHub?</p><h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">A practical place to bring your work into view.</h2></div><div className="space-y-4 text-lg leading-8 text-gray-600 dark:text-slate-300"><p>FocusHub is a productivity and task-management platform designed for people who want a clearer way to organize everyday work. It brings tasks, goals, focus sessions, and useful progress views into one account.</p><p>Rather than making big promises about productivity, FocusHub gives you straightforward tools to decide what matters, keep related work together, and see what you have completed.</p></div></div></section>

      <section className="border-y border-gray-200 bg-white py-20 dark:border-slate-800 dark:bg-slate-900/40 sm:py-24"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><div className="max-w-2xl"><p className="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-300">Product features</p><h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">Built around the way FocusHub works today.</h2><p className="mt-4 leading-7 text-gray-600 dark:text-slate-300">These are features available in the current FocusHub application—not a future roadmap.</p></div><div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{features.map(({ icon, title, description }) => <article key={title} className="rounded-3xl border border-gray-200 bg-gray-50 p-6 dark:border-slate-800 dark:bg-slate-950/50"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-indigo-600 text-white">{icon}</span><h3 className="mt-5 text-lg font-bold">{title}</h3><p className="mt-2 leading-6 text-gray-600 dark:text-slate-300">{description}</p></article>)}</div></div></section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8"><div className="max-w-2xl"><p className="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-300">How it works</p><h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">Start with the next piece of work.</h2></div><ol className="mt-10 grid gap-5 md:grid-cols-4">{[["1", "Create an account", "Set up your FocusHub account to open your personal workspace."], ["2", "Add and organize tasks", "Create daily tasks, choose priorities, and group work with tags or goals."], ["3", "Manage and complete work", "Keep your current work visible, update it as needed, and mark it complete."], ["4", "Review your progress", "Use the dashboard, activity records, and focus views to stay organized."]].map(([number, title, text]) => <li key={number} className="rounded-3xl border border-gray-200 p-6 dark:border-slate-800"><span className="text-sm font-bold text-indigo-600 dark:text-indigo-300">Step {number}</span><h3 className="mt-3 font-bold">{title}</h3><p className="mt-2 text-sm leading-6 text-gray-600 dark:text-slate-300">{text}</p></li>)}</ol></section>

      <section className="border-y border-gray-200 bg-gradient-to-br from-gray-50 to-indigo-50 py-20 dark:border-slate-800 dark:from-slate-950 dark:to-indigo-950/50 sm:py-24"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><div className="mx-auto mb-10 max-w-2xl text-center"><p className="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-300">Product preview</p><h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">A simple view of the FocusHub workspace.</h2><p className="mt-4 leading-7 text-gray-600 dark:text-slate-300">This is an illustrative interface preview based on FocusHub’s actual task, goal, and focus features—not a live account or a screenshot.</p></div><ProductPreview /></div></section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8"><div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]"><div><p className="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-300">Why use FocusHub?</p><h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">Give your workflow a calmer starting point.</h2></div><div className="grid gap-4 sm:grid-cols-2">{[["Keep work organized", "Bring daily tasks and longer-running goals into the same workspace."], ["Manage tasks in one place", "Keep priorities, tags, and completion status close to the work itself."], ["Make progress easier to follow", "Review completed tasks and recorded focus time without maintaining a separate log."], ["Build a repeatable workflow", "Use a consistent process for choosing, working through, and finishing tasks."]].map(([title, text]) => <div key={title} className="rounded-2xl border border-gray-200 p-5 dark:border-slate-800"><CheckCircle2 className="text-green-600 dark:text-green-400" size={20} /><h3 className="mt-3 font-bold">{title}</h3><p className="mt-2 text-sm leading-6 text-gray-600 dark:text-slate-300">{text}</p></div>)}</div></div></section>

      <section className="border-t border-gray-200 bg-white py-20 dark:border-slate-800 dark:bg-slate-900/40 sm:py-24"><div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8"><div className="text-center"><p className="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-300">FAQ</p><h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">Questions about FocusHub</h2></div><div className="mt-10 divide-y divide-gray-200 rounded-3xl border border-gray-200 dark:divide-slate-800 dark:border-slate-800">{faqs.map(([question, answer]) => <details key={question} className="group p-5"><summary className="cursor-pointer list-none pr-8 font-bold marker:content-none">{question}<span className="float-right text-xl text-indigo-600 group-open:hidden">+</span><span className="float-right text-xl text-indigo-600 hidden group-open:inline">−</span></summary><p className="mt-3 max-w-3xl leading-7 text-gray-600 dark:text-slate-300">{answer}</p></details>)}</div></div></section>

      <section className="mx-4 my-12 overflow-hidden rounded-3xl bg-indigo-600 sm:mx-6 lg:mx-8"><div className="mx-auto max-w-7xl px-6 py-14 text-center text-white sm:px-10"><h2 className="text-3xl font-extrabold sm:text-4xl">Ready to organize your work?</h2><p className="mx-auto mt-4 max-w-xl text-indigo-100">Create an account to start managing tasks, goals, and focused work in FocusHub.</p><div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><Link to="/signup" className="rounded-xl bg-white px-5 py-3 font-semibold text-indigo-700 hover:bg-indigo-50">Get Started</Link><Link to="/login" className="rounded-xl border border-indigo-300 px-5 py-3 font-semibold text-white hover:bg-indigo-500">Login</Link></div></div></section>
    </>
  );
};

export default Home;
