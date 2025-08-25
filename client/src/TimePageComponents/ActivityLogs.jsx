import axios from "axios";
import React, { useEffect, useState } from "react";

const ActivityLogs = () => {
  const [data, setData] = useState([]);
  const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/focus/focus-tasks`)
      .then((res) => {
        setData(res.data.data || []);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const formatDuration = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs > 0 ? `${hrs}h ` : ""}${mins}m ${secs}s`;
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-6">
      <h3 className="font-semibold text-3xl mb-4 text-gray-800">
        📒 Focus Logs
      </h3>

      <div className="rounded-xl shadow-md bg-white w-full max-w-4xl p-4">
        <div className="overflow-y-auto  max-h-[400px] rounded-lg no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-300 text-gray-700 uppercase text-sm sticky top-0 z-10 w-full">
              <tr className="w-full">
                <th className="px-6 py-3 hidden md:block">S.N.</th>
                <th className="px-6 py-3">Task Name</th>
                <th className="px-6 py-3">Focus Time</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((task, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 hidden md:block text-center py-3 w-1 font-medium text-gray-800 capitalize">
                      {idx}
                    </td>
                    <td className="px-6 py-3 font-medium text-gray-800 capitalize">
                      {task.task}
                    </td>
                    <td className="px-6 py-3 text-gray-600">
                      {formatDuration(task.taskDuration * 60)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="2"
                    className="px-6 py-6 text-center text-gray-500 italic"
                  >
                    No focus logs found 📭
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ActivityLogs;
