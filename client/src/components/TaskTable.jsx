import React from 'react'
import OutlinedFlagIcon from '@mui/icons-material/OutlinedFlag';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

const TaskTable = ({ tasks }) => {
    const updatedTasks = tasks.map((task) => {
         let isoDate = task.dueDate;
            let date = new Date(isoDate);

            const formattedDate = date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric"
            });

            task.dueDate = formattedDate

            return task;
    });
    console.log(updatedTasks)
    return (
        <table className='w-full'>
            <thead>
                <tr>
                    <th className='table-header font-mono'>Task</th>
                    <th className='table-header px-2'>Due Date</th>
                    <th className='table-header px-2'>Task Tags</th>
                    <th className='table-header'>Priority</th>
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
                                <a href={`/tasks/${task._id}`}>{task.title}</a>
                            </td>
                            <td className="task-title font-semibold text-[13px] px-5 py-2">
                                <CalendarMonthIcon sx={{paddingRight: "5px", color: "#3971cc"}}/>{task.dueDate}
                            </td>
                            <td className="task-title font-semibold text-[13px] px-5 py-2">
                                {task.tags}
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