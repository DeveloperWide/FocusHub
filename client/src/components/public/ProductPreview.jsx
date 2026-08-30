import { CheckCircle2, Clock3, MoreHorizontal, Plus, Target } from "lucide-react";

const ProductPreview = () => (
  <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl shadow-indigo-950/10 dark:border-slate-700 dark:bg-slate-900">
    <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 dark:border-slate-800 sm:px-6">
      <div className="flex items-center gap-2 font-semibold"><span className="grid h-7 w-7 place-items-center rounded-lg bg-indigo-600 text-xs text-white">F</span> FocusHub</div>
      <div className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-amber-400" /><span className="h-2.5 w-2.5 rounded-full bg-green-500" /></div>
    </div>
    <div className="grid min-h-[360px] grid-cols-1 sm:grid-cols-[150px_1fr]">
      <aside className="hidden border-r border-gray-100 bg-gray-50 p-4 dark:border-slate-800 dark:bg-slate-950/40 sm:block">
        <p className="px-2 text-xs font-semibold uppercase tracking-wider text-gray-400">Workspace</p>
        <div className="mt-3 space-y-1 text-sm">
          <div className="rounded-lg bg-indigo-50 px-2 py-2 font-semibold text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-200">Dashboard</div>
          <div className="px-2 py-2 text-gray-600 dark:text-slate-300">Tasks</div>
          <div className="px-2 py-2 text-gray-600 dark:text-slate-300">Goals</div>
          <div className="px-2 py-2 text-gray-600 dark:text-slate-300">Focus Timer</div>
        </div>
      </aside>
      <div className="p-4 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div><p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Today</p><h3 className="mt-1 text-xl font-bold">Your focused workspace</h3></div>
          <button type="button" className="inline-flex items-center gap-1 rounded-xl bg-indigo-600 px-3 py-2 text-xs font-semibold text-white"><Plus size={14} /> Add task</button>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 p-3 dark:border-slate-700"><p className="text-xs text-gray-500 dark:text-slate-400">Active tasks</p><p className="mt-1 text-2xl font-bold">3</p></div>
          <div className="rounded-2xl border border-gray-200 p-3 dark:border-slate-700"><p className="text-xs text-gray-500 dark:text-slate-400">Completed</p><p className="mt-1 text-2xl font-bold">2</p></div>
          <div className="rounded-2xl border border-gray-200 p-3 dark:border-slate-700"><p className="text-xs text-gray-500 dark:text-slate-400">Focus time</p><p className="mt-1 text-2xl font-bold">25m</p></div>
        </div>
        <div className="mt-5 rounded-2xl border border-gray-200 p-4 dark:border-slate-700">
          <div className="flex items-center justify-between"><div><p className="text-sm font-bold">Today’s tasks</p><p className="text-xs text-gray-500 dark:text-slate-400">An illustrative product preview</p></div><MoreHorizontal size={18} className="text-gray-400" /></div>
          <div className="mt-3 space-y-2">
            {["Prepare project outline", "Review next milestone", "Plan tomorrow’s priorities"].map((task, index) => <div key={task} className="flex items-center gap-3 rounded-xl bg-gray-50 px-3 py-2.5 dark:bg-slate-950/50"><CheckCircle2 size={18} className={index === 1 ? "text-green-500" : "text-gray-300 dark:text-slate-600"} /><span className={`flex-1 text-sm ${index === 1 ? "text-gray-400 line-through dark:text-slate-500" : "font-medium"}`}>{task}</span><span className="text-xs text-gray-400">{index === 0 ? "High" : "Medium"}</span></div>)}
          </div>
        </div>
        <div className="mt-4 flex gap-3 rounded-2xl bg-indigo-50 p-3 text-indigo-800 dark:bg-indigo-500/10 dark:text-indigo-200"><Target size={18} className="mt-0.5 shrink-0" /><p className="text-sm"><span className="font-semibold">Goal-linked work:</span> connect tasks to a goal and keep the next step visible.</p><Clock3 size={18} className="ml-auto shrink-0" /></div>
      </div>
    </div>
  </div>
);

export default ProductPreview;
