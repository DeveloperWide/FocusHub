import { useEffect, useMemo, useState } from "react";
import { axiosInstance } from "../utils/axiosInstance";
import { useSelector } from "react-redux";
import { selectGoals } from "../features/goals";
import { PencilLine, Trash2, X } from "lucide-react";
import { toast } from "react-toastify";

const ActivityLogs = () => {
  const goals = useSelector(selectGoals);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    linkType: "all",
    from: "",
    to: "",
  });

  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    durationMinutes: 25,
    linkType: "personal",
    goalTag: "",
    status: "completed",
    endedAt: "",
  });

  const toLocalDateTimeInput = (value) => {
    if (!value) return "";
    const d = new Date(value);
    const tzOffsetMs = d.getTimezoneOffset() * 60000;
    return new Date(d.getTime() - tzOffsetMs).toISOString().slice(0, 16);
  };

  const fetchLogs = () => {
    setLoading(true);

    const params = {
      limit: 200,
      mode: "focus",
    };

    if (filters.linkType !== "all") params.linkType = filters.linkType;

    if (filters.from) {
      params.from = new Date(`${filters.from}T00:00:00`).toISOString();
    }

    if (filters.to) {
      params.to = new Date(`${filters.to}T23:59:59.999`).toISOString();
    }

    return axiosInstance
      .get("/focus/timers", { params })
      .then((res) => {
        setData(res.data.data || []);
      })
      .catch(() => {
        toast.error("Failed to load focus logs");
        setData([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.linkType, filters.from, filters.to]);

  useEffect(() => {
    if (!editing) return;

    setEditForm({
      title: editing.title || "Focus Session",
      durationMinutes: Math.max(1, Math.round((editing.durationSeconds || 0) / 60)),
      linkType: editing.linkType || (editing.goal || editing.goalTag ? "goal" : "personal"),
      goalTag: editing.goal?.tag || editing.goalTag || "",
      status: editing.status || "completed",
      endedAt: toLocalDateTimeInput(editing.endedAt || editing.createdAt),
    });
  }, [editing]);

  const formatDuration = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs > 0 ? `${hrs}h ` : ""}${mins}m ${secs}s`;
  };

  const getTimerSeconds = (timer) => {
    if (typeof timer?.durationSeconds === "number") return timer.durationSeconds;
    if (typeof timer?.focusDuration === "number") return timer.focusDuration;
    if (typeof timer?.taskDuration === "number") return timer.taskDuration * 60;
    return 0;
  };

  const getLinkedLabel = (timer) => {
    if (timer?.linkType === "goal") {
      const tag = timer?.goal?.tag || timer?.goalTag;
      return tag ? `Goal: #${tag}` : "Goal";
    }

    return "Personal";
  };

  const rows = useMemo(() => data || [], [data]);

  const onDelete = async (id) => {
    const ok = window.confirm("Delete this focus log?");
    if (!ok) return;

    try {
      await axiosInstance.delete(`/focus/timers/${id}`);
      setData((prev) => prev.filter((t) => t.id !== id));
      toast.success("Deleted");
    } catch (e) {
      console.error(e);
      toast.error("Delete failed");
    }
  };

  const onSaveEdit = async () => {
    if (!editing) return;

    if (!editForm.title.trim()) return toast.info("Title is required");

    if (editForm.linkType === "goal" && !editForm.goalTag) {
      return toast.info("Please select a goal tag");
    }

    const payload = {
      title: editForm.title.trim(),
      durationSeconds: Math.max(1, Math.round(Number(editForm.durationMinutes) * 60)),
      status: editForm.status,
      goalTag: editForm.linkType === "goal" ? editForm.goalTag : "",
      endedAt: editForm.endedAt ? new Date(editForm.endedAt).toISOString() : undefined,
    };

    try {
      const res = await axiosInstance.patch(`/focus/timers/${editing.id}`, payload);
      const updated = res.data.data;
      setData((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      setEditing(null);
      toast.success("Updated");
    } catch (e) {
      console.error(e);
      toast.error("Update failed");
    }
  };

  return (
    <div className="flex flex-col items-center h-full p-6">
      <div className="w-full max-w-5xl">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-4">
          <div>
            <h3 className="font-semibold text-3xl text-gray-800 dark:text-slate-100">
              📒 Focus Logs
            </h3>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
              Filter, edit, or delete saved sessions.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
            <select
              value={filters.linkType}
              onChange={(e) =>
                setFilters((p) => ({ ...p, linkType: e.target.value }))
              }
              className="px-3 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-gray-800 dark:text-slate-100"
            >
              <option value="all">All</option>
              <option value="personal">Personal</option>
              <option value="goal">Goal</option>
            </select>

            <input
              type="date"
              value={filters.from}
              onChange={(e) => setFilters((p) => ({ ...p, from: e.target.value }))}
              className="px-3 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-gray-800 dark:text-slate-100"
            />

            <input
              type="date"
              value={filters.to}
              onChange={(e) => setFilters((p) => ({ ...p, to: e.target.value }))}
              className="px-3 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-gray-800 dark:text-slate-100"
            />

            <button
              type="button"
              onClick={() => setFilters({ linkType: "all", from: "", to: "" })}
              className="px-3 py-2 rounded-xl border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800 transition"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="rounded-2xl shadow-md bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 w-full p-4">
          <div className="overflow-y-auto max-h-[520px] rounded-lg no-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-200 uppercase text-xs sticky top-0 z-10 w-full">
                <tr className="w-full">
                  <th className="px-4 py-3 hidden md:table-cell">Date</th>
                  <th className="px-4 py-3">Focus</th>
                  <th className="px-4 py-3 hidden sm:table-cell">Connected</th>
                  <th className="px-4 py-3">Time</th>
                  <th className="px-4 py-3 hidden md:table-cell">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-4 py-8 text-center text-gray-500 dark:text-slate-400"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : rows.length > 0 ? (
                  rows.map((row) => (
                    <tr
                      key={row.id}
                      className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="px-4 py-3 hidden md:table-cell text-gray-600 dark:text-slate-300">
                        {new Date(row.endedAt || row.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-800 dark:text-slate-100 capitalize">
                        {row.title || "Focus Session"}
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell text-gray-600 dark:text-slate-300">
                        {getLinkedLabel(row)}
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-slate-300">
                        {formatDuration(getTimerSeconds(row))}
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            row.status === "cancelled"
                              ? "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-200"
                              : "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-200"
                          }`}
                        >
                          {row.status || "completed"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setEditing(row)}
                            className="p-2 rounded-lg border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 transition"
                            title="Edit"
                          >
                            <PencilLine size={16} className="text-gray-700 dark:text-slate-200" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDelete(row.id)}
                            className="p-2 rounded-lg border border-gray-200 dark:border-slate-700 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition"
                            title="Delete"
                          >
                            <Trash2 size={16} className="text-rose-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-4 py-8 text-center text-gray-500 dark:text-slate-400 italic"
                    >
                      No focus logs found 📭
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Edit Modal */}
        {editing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setEditing(null)}
            />

            <div className="relative w-full max-w-xl rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-xl p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
                    Edit Focus Log
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
                    Update title, time, connection, or status.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition"
                >
                  <X size={18} className="text-gray-600 dark:text-slate-300" />
                </button>
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-slate-200">
                    Title
                  </label>
                  <input
                    value={editForm.title}
                    onChange={(e) =>
                      setEditForm((p) => ({ ...p, title: e.target.value }))
                    }
                    className="mt-1 w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-gray-900 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-slate-200">
                    Minutes
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={editForm.durationMinutes}
                    onChange={(e) =>
                      setEditForm((p) => ({
                        ...p,
                        durationMinutes: e.target.value,
                      }))
                    }
                    className="mt-1 w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-gray-900 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-slate-200">
                    Status
                  </label>
                  <select
                    value={editForm.status}
                    onChange={(e) =>
                      setEditForm((p) => ({ ...p, status: e.target.value }))
                    }
                    className="mt-1 w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-gray-900 dark:text-slate-100"
                  >
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-slate-200">
                    Connect
                  </label>
                  <select
                    value={editForm.linkType}
                    onChange={(e) =>
                      setEditForm((p) => ({
                        ...p,
                        linkType: e.target.value,
                        goalTag: e.target.value === "personal" ? "" : p.goalTag,
                      }))
                    }
                    className="mt-1 w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-gray-900 dark:text-slate-100"
                  >
                    <option value="personal">Personal</option>
                    <option value="goal">Goal</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-slate-200">
                    Ended At
                  </label>
                  <input
                    type="datetime-local"
                    value={editForm.endedAt}
                    onChange={(e) =>
                      setEditForm((p) => ({ ...p, endedAt: e.target.value }))
                    }
                    className="mt-1 w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-gray-900 dark:text-slate-100"
                  />
                </div>

                {editForm.linkType === "goal" && (
                  <div className="sm:col-span-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-slate-200">
                      Goal Tag
                    </label>
                    <select
                      value={editForm.goalTag}
                      onChange={(e) =>
                        setEditForm((p) => ({ ...p, goalTag: e.target.value }))
                      }
                      className="mt-1 w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-gray-900 dark:text-slate-100"
                    >
                      <option value="">Select a goal tag</option>
                      {goals.map((g) => (
                        <option key={g.id} value={g.tag}>
                          #{g.tag}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="mt-5 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  className="px-4 py-2 rounded-xl border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={onSaveEdit}
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityLogs;
