import React from 'react'
import OutlinedFlagIcon from '@mui/icons-material/OutlinedFlag';

const TaskTable = ({ tasks }) => {
    return (
        <table className='w-full'>
            <thead>
                <tr>
                    <th className='table-header font-mono'>Task</th>
                    <th className='table-header px-2'>Priority</th>
                </tr>
            </thead>
            <tbody>
                {tasks.map((task, idx) => {
                    // Define style classes based on priority
                    let priorityStyles = {
                        text: "",
                        bg: ""
                    };

                    if (task.priority === "High") {
                        priorityStyles.text = "text-red-700";
                        priorityStyles.bg = "bg-red-100";
                    } else if (task.priority === "Medium") {
                        priorityStyles.text = "text-yellow-700";
                        priorityStyles.bg = "bg-yellow-100";
                    } else {
                        priorityStyles.text = "text-green-700";
                        priorityStyles.bg = "bg-green-100";
                    }

                    return (
                        <tr key={idx}>
                            <td className="task-title font-semibold text-[14px] px-5 py-2">
                                {task.title}
                            </td>
                            <td className={`task-priority text-[13px] px-2 py-1 inline-flex items-center gap-1 rounded ${priorityStyles.text} ${priorityStyles.bg} mb-1.5`}>
                                <OutlinedFlagIcon sx={{ fontSize: "13px" }} />
                                {task.priority}
                            </td>
                        </tr>
                    );
                })}
            </tbody>

        </table>
    )
}

export default TaskTable