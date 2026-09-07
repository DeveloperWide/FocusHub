import quotes from "../../data/quotes.json";

const Quote = () => {
  const getTime = new Date().getHours();
  const getDay = new Date().getDate();
  const quote = quotes[getTime > 12 ? getDay + 30 - 1 : getDay] || quotes[0];

  return (
    <div className="rounded-3xl border border-gray-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 backdrop-blur-xl shadow-sm p-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-400">
        Daily quote
      </p>
      <p className="mt-2 text-lg font-semibold text-gray-800 dark:text-slate-100">
        “{quote?.text || "Stay focused. Keep building."}”
      </p>
    </div>
  );
};

export default Quote;
