import Buttons from "../Buttons";

const TaskList = ({ sortedTasks, deleteTaskHandler, setEditingTask }) => {
  return (
    <div className="max-w-3xl mx-auto mt-6 px-4">
      {sortedTasks.length > 0 ? (
        <div>
          {sortedTasks.map((t) => (
            <div
              key={t.id}
              className={`group flex items-center justify-between border-l-4 bg-white border border-gray-200 hover:border-gray-300 p-4 rounded-xl transition-all my-4 ${
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

                <div>
                  <span className="block text-xs font-semibold uppercase tracking-wider text-gray-400">
                    {t.type}
                  </span>

                  <span className="text-gray-800 font-medium capitalize">
                    {t.title}
                  </span>
                </div>
              </div>
              <Buttons
                obj={t}
                deleteHandler={deleteTaskHandler}
                setEditing={setEditingTask}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg font-medium">No tasks yet</p>
          <p className="text-sm mt-1">Start by adding your first task above</p>
        </div>
      )}
    </div>
  );
};

export default TaskList;
