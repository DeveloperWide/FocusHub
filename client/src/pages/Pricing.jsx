import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Check, Crown, Sparkles, Zap } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { selectUser } from "../features/auth/authSelector";
import { fetchMe } from "../features/auth/authThunk";
import {
  createCheckoutAPI,
  fetchBillingPlansAPI,
  verifyPaymentAPI,
} from "../services/billingService";
import {
  BILLING_PLANS,
  PAID_PLAN_IDS,
  formatInr,
  getEffectivePlanId,
} from "../utils/billingPlans";

const loadRazorpay = () => {
  if (typeof window === "undefined") return Promise.resolve(false);
  if (window.Razorpay) return Promise.resolve(true);

  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const normalizeServerPlans = (plans) => {
  const list = Array.isArray(plans) ? plans : [];
  const map = {};
  for (const p of list) {
    if (!p?.id) continue;
    map[String(p.id).toLowerCase()] = p;
  }
  return map;
};

const Pricing = ({ embedded = false }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [interval, setInterval] = useState("monthly");
  const [busyPlanId, setBusyPlanId] = useState(null);
  const [serverPlanMap, setServerPlanMap] = useState({});
  const [earlyBird, setEarlyBird] = useState(null);

  const currentPlanId = useMemo(() => getEffectivePlanId(user), [user]);

  useEffect(() => {
    let mounted = true;

    fetchBillingPlansAPI()
      .then((res) => {
        if (!mounted) return;
        const plans = res.data?.data?.plans;
        const promos = res.data?.data?.promos;
        setServerPlanMap(normalizeServerPlans(plans));
        setEarlyBird(promos?.earlyBird || null);
      })
      .catch(() => {
        if (!mounted) return;
        setServerPlanMap({});
        setEarlyBird(null);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const paidPlans = useMemo(() => {
    return PAID_PLAN_IDS.map((id) => {
      const local = BILLING_PLANS[id];
      const server = serverPlanMap[id] || null;

      return {
        id,
        name: server?.name || local.name,
        tagline: server?.tagline || local.tagline,
        badge: local.badge,
        prices: server?.prices || local.prices,
        limits: server?.limits || local.limits,
        features: local.features || [],
      };
    });
  }, [serverPlanMap]);

  const intervalLabel = interval === "yearly" ? "Year" : "Month";

  const promoActive = Boolean(
    earlyBird?.active && Number(earlyBird?.remaining || 0) > 0,
  );

  const backHref = embedded ? "/app/dashboard" : user ? "/app/dashboard" : "/";

  const handleSubscribe = async (planId) => {
    if (!user) {
      navigate("/login");
      return;
    }

    setBusyPlanId(planId);

    try {
      const loaded = await loadRazorpay();
      if (!loaded) {
        throw new Error("Failed to load Razorpay checkout");
      }

      const checkoutRes = await createCheckoutAPI({ planId, interval });
      const payload = checkoutRes.data?.data;

      if (!payload?.orderId || !payload?.keyId) {
        throw new Error("Checkout not available right now");
      }

      const plan = paidPlans.find((p) => p.id === planId);
      const displayName = plan?.name || "FocusHub Plan";

      const options = {
        key: payload.keyId,
        amount: payload.amount,
        currency: payload.currency || "INR",
        name: "FocusHub",
        description: `${displayName} • ${intervalLabel}`,
        order_id: payload.orderId,
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
        },
        theme: {
          color: isDark ? "#818cf8" : "#4f46e5",
        },
        modal: {
          ondismiss: () => setBusyPlanId(null),
        },
        handler: async (response) => {
          try {
            setBusyPlanId("verifying");
            await verifyPaymentAPI(response);
            await dispatch(fetchMe()).unwrap();
            toast.success("You're upgraded!");
            navigate("/app/dashboard");
          } catch (err) {
            toast.error(
              err?.response?.data?.message || "Payment verification failed",
            );
          } finally {
            setBusyPlanId(null);
          }
        },
      };

      const rz = new window.Razorpay(options);
      rz.on("payment.failed", (resp) => {
        const msg =
          resp?.error?.description ||
          resp?.error?.reason ||
          "Payment failed. Please try again.";
        toast.error(msg);
        setBusyPlanId(null);
      });
      rz.open();
    } catch (err) {
      toast.error(
        err?.response?.data?.message || err?.message || "Checkout failed",
      );
      setBusyPlanId(null);
    }
  };

  return (
    <div
      className={`relative bg-gradient-to-br from-amber-50 via-white to-indigo-50 dark:from-slate-950 dark:via-slate-950 dark:to-indigo-950`}
    >
      <div className="absolute inset-0 pointer-events-none opacity-60">
        <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-amber-200 blur-3xl dark:bg-amber-500/10" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-indigo-200 blur-3xl dark:bg-indigo-500/10" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between gap-3">
          <Link
            to={backHref}
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-slate-200 hover:underline"
          >
            <span className="w-8 h-8 rounded-xl bg-indigo-600 text-white grid place-items-center font-bold">
              F
            </span>
            FocusHub
          </Link>

          <div className="flex items-center gap-2">
            <Link
              to={user ? "/app/dashboard" : "/signup"}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition"
            >
              {user ? "Go to app" : "Start free"}
            </Link>
          </div>
        </div>

        <div className="mt-10 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-slate-100">
            Simple pricing that keeps you curious
          </h1>
          <p className="mt-3 text-gray-600 dark:text-slate-300 max-w-2xl mx-auto">
            Keep using FocusHub for free, then unlock higher limits and early
            access when you’re ready.
          </p>

          {promoActive && (
            <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 text-amber-900 dark:bg-amber-500/15 dark:text-amber-200 border border-amber-200/70 dark:border-amber-500/30">
              <Sparkles size={16} />
              <span className="text-sm font-semibold">
                Early-bird: {earlyBird.discountPercent}% off for first{" "}
                {earlyBird.limit} users • {earlyBird.remaining} left
              </span>
            </div>
          )}
        </div>

        <div className="mt-10 flex justify-center">
          <div className="inline-flex p-1 rounded-2xl bg-white/70 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 shadow-sm">
            <button
              type="button"
              onClick={() => setInterval("monthly")}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
                interval === "monthly"
                  ? "bg-indigo-600 text-white"
                  : "text-gray-700 dark:text-slate-200 hover:bg-white/70 dark:hover:bg-slate-800/60"
              }`}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setInterval("yearly")}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
                interval === "yearly"
                  ? "bg-indigo-600 text-white"
                  : "text-gray-700 dark:text-slate-200 hover:bg-white/70 dark:hover:bg-slate-800/60"
              }`}
            >
              Yearly <span className="ml-1 text-xs opacity-80">(save)</span>
            </button>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {paidPlans.map((plan) => {
            const isBest = plan.badge === "Best value";
            const isCurrent = currentPlanId === plan.id;
            const price = Number(plan.prices?.[interval] ?? 0);
            const isBusy = busyPlanId === plan.id || busyPlanId === "verifying";

            return (
              <div
                key={plan.id}
                className={`relative rounded-3xl border bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl shadow-xl p-7 overflow-hidden ${
                  isBest
                    ? "border-indigo-300 dark:border-indigo-500/40 ring-2 ring-indigo-200/70 dark:ring-indigo-500/15"
                    : "border-gray-200 dark:border-slate-800"
                }`}
              >
                {plan.badge && (
                  <div className="absolute top-5 right-5">
                    <span
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${
                        isBest
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-slate-200"
                      }`}
                    >
                      {plan.badge === "Best value" ? (
                        <Zap size={14} />
                      ) : (
                        <Crown size={14} />
                      )}
                      {plan.badge}
                    </span>
                  </div>
                )}

                <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100">
                  {plan.name}
                </h3>
                <p className="mt-1 text-sm text-gray-600 dark:text-slate-300">
                  {plan.tagline}
                </p>

                <div className="mt-6 flex items-end gap-2">
                  <div className="text-4xl font-extrabold text-gray-900 dark:text-slate-100">
                    {formatInr(price)}
                  </div>
                  <div className="pb-1 text-sm text-gray-500 dark:text-slate-400">
                    / {intervalLabel.toLowerCase()}
                  </div>
                </div>

                {promoActive && (
                  <p className="mt-2 text-xs text-gray-500 dark:text-slate-400">
                    Early-bird discount applies at checkout (while available).
                  </p>
                )}

                <button
                  type="button"
                  disabled={isBusy || isCurrent}
                  onClick={() => handleSubscribe(plan.id)}
                  className={`mt-6 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-semibold transition ${
                    isCurrent
                      ? "bg-gray-100 text-gray-500 dark:bg-slate-800 dark:text-slate-400 cursor-not-allowed"
                      : isBest
                        ? "bg-indigo-600 text-white hover:bg-indigo-700"
                        : "bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
                  }`}
                >
                  {isCurrent
                    ? "Current plan"
                    : busyPlanId === "verifying"
                      ? "Verifying..."
                      : isBusy
                        ? "Opening checkout..."
                        : "Upgrade"}
                </button>

                <ul className="mt-6 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <span className="mt-0.5 text-indigo-600 dark:text-indigo-300">
                        <Check size={16} />
                      </span>
                      <span className="text-sm text-gray-700 dark:text-slate-200">
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 rounded-2xl bg-gray-50 dark:bg-slate-950/40 border border-gray-200 dark:border-slate-800 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-400">
                    Limits
                  </p>
                  <p className="mt-2 text-sm text-gray-700 dark:text-slate-200">
                    Goals:{" "}
                    <span className="font-semibold">
                      {plan.limits?.goals == null
                        ? "Unlimited"
                        : plan.limits.goals}
                    </span>
                  </p>
                  <p className="mt-1 text-sm text-gray-700 dark:text-slate-200">
                    Tasks/day:{" "}
                    <span className="font-semibold">
                      {plan.limits?.tasks?.high == null
                        ? "Unlimited"
                        : `H${plan.limits.tasks.high} • M${plan.limits.tasks.medium} • L${plan.limits.tasks.low}`}
                    </span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <p className="text-sm text-gray-600 dark:text-slate-300">
            Not ready to pay?{" "}
            <span className="font-semibold text-gray-900 dark:text-slate-100">
              Keep using Free
            </span>{" "}
            and upgrade anytime.
          </p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <Link
              to={user ? "/app/dashboard" : "/signup"}
              className="px-4 py-2 rounded-xl bg-white/70 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 text-sm font-semibold text-gray-900 dark:text-slate-100 hover:bg-white dark:hover:bg-slate-900 transition"
            >
              {user ? "Back to dashboard" : "Create account"}
            </Link>
            <Link
              to={embedded ? "/app/dashboard" : "/"}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-700 dark:text-slate-200 hover:underline"
            >
              {embedded ? "Back" : "Learn more"}
            </Link>
          </div>
        </div>

        <div className="mt-14 rounded-3xl border border-gray-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 backdrop-blur-xl p-8">
          <h2 className="text-xl font-extrabold text-gray-900 dark:text-slate-100">
            Coming soon (Elite gets first access)
          </h2>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              "Calendar + reminders",
              "Team spaces",
              "AI weekly review",
              "Notion / Google integrations",
              "Templates library",
              "Advanced analytics",
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50/70 dark:bg-slate-950/30 p-4"
              >
                <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">
                  {item}
                </p>
                <p className="mt-1 text-xs text-gray-600 dark:text-slate-300">
                  We’re building this next. Pricing stays friendly for early
                  users.
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 text-center text-xs text-gray-500 dark:text-slate-400">
          Payments are processed securely by Razorpay. You can cancel anytime.
        </div>
      </div>
    </div>
  );
};

export default Pricing;
