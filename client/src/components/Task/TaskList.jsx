import TaskSkeleton from "../../skeletons/TaskSkeleton";
import Buttons from "../Buttons";
import { useMemo, useState } from "react";

const TaskList = ({
  loading,
  sortedTasks,
  deleteTaskHandler,
  setEditingTask,
  toggleCompleteHandler,
}) => {
  const [showCompleted, setShowCompleted] = useState(true);

  const { activeTasks, completedTasks } = useMemo(() => {
    const active = (sortedTasks || []).filter((t) => !t.isComplete);
    const completed = (sortedTasks || []).filter((t) => t.isComplete);
    completed.sort((a, b) => {
      const da = a.completedAt ? new Date(a.completedAt).getTime() : 0;
      const db = b.completedAt ? new Date(b.completedAt).getTime() : 0;
      return db - da;
    });
    return { activeTasks: active, completedTasks: completed };
  }, [sortedTasks]);

  return (
    <div className="max-w-3xl mx-auto mt-6 px-4">
      {loading ? (
        Array(4)
          .fill(0)
          .map((_, i) => <TaskSkeleton key={i} />)
      ) : activeTasks.length > 0 || completedTasks.length > 0 ? (
        <div className="space-y-8">
          {/* Active */}
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-slate-200">
                Active ({activeTasks.length})
              </h3>
            </div>

            {activeTasks.length === 0 ? (
              <div className="mt-4 text-center py-10 text-gray-500 dark:text-slate-400 border border-dashed border-gray-200 dark:border-slate-800 rounded-xl">
                No active tasks. Add one above.
              </div>
            ) : (
              activeTasks.map((t) => (
                <div
                  key={t.id}
                  className={`group flex items-center justify-between border-l-4 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600 p-4 rounded-xl transition-all my-4 ${
                    t.priority === "high"
                      ? "border-l-red-300 hover:border-l-red-400"
                      : t.priority === "medium"
                        ? "border-l-yellow-300 hover:border-l-yellow-400"
                        : "border-l-green-300 hover:border-l-green-400"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`h-2 w-2 rounded-full ${
                        t.priority === "high"
                          ? "bg-red-500"
                          : t.priority === "medium"
                            ? "bg-yellow-500"
                            : "bg-green-500"
                      }`}
                    />
                    <div className="flex flex-col">
                      <span className="block text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-slate-400">
                        {t.type}
                      </span>

                      <div className="flex items-center gap-2">
                        <span className="text-gray-800 dark:text-slate-100 font-medium capitalize">
                          {t.title}
                        </span>

                        {t.tag && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-200 font-medium">
                            #{t.tag}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <Buttons
                    obj={t}
                    onCheck={() => toggleCompleteHandler(t.id, true)}
                    deleteHandler={deleteTaskHandler}
                    setEditing={setEditingTask}
                  />
                </div>
              ))
            )}
          </div>

          {/* Completed */}
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-slate-200">
                Completed ({completedTasks.length})
              </h3>
              {completedTasks.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowCompleted((p) => !p)}
                  className="text-sm text-gray-600 dark:text-slate-300 hover:underline"
                >
                  {showCompleted ? "Hide" : "Show"}
                </button>
              )}
            </div>

            {showCompleted && completedTasks.length > 0 && (
              <div className="mt-4">
                {completedTasks.map((t) => (
                  <div
                    key={t.id}
                    className="group flex items-center justify-between bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 p-4 rounded-xl transition-all my-4 opacity-90 hover:opacity-100"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="h-2 w-2 rounded-full bg-emerald-500" />
                      <div className="flex flex-col min-w-0">
                        <span className="block text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-slate-400">
                          {t.type}
                        </span>

                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-gray-500 dark:text-slate-400 font-medium capitalize line-through truncate">
                            {t.title}
                          </span>

                          {t.tag && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-200 font-medium">
                              #{t.tag}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <Buttons
                      obj={t}
                      onCheck={() => toggleCompleteHandler(t.id, false)}
                      deleteHandler={deleteTaskHandler}
                      setEditing={setEditingTask}
                    />
                  </div>
                ))}
              </div>
            )}

            {completedTasks.length === 0 && (
              <div className="mt-4 text-center py-10 text-gray-500 dark:text-slate-400 border border-dashed border-gray-200 dark:border-slate-800 rounded-xl">
                No completed tasks yet.
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-16 text-gray-400 dark:text-slate-400">
          <p className="text-lg font-medium">No tasks yet</p>
          <p className="text-sm mt-1">Start by adding your first task above</p>
        </div>
      )}
    </div>
  );
};

export default TaskList;
