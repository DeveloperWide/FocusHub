const Task = require("../models/Task");

module.exports.getTasks = async (req, res) => {
    try {
        const allTasks = await Task.find({user: req.user.id});
        res.json({
            success: true,
            message: "All Your tasks here...",
            data: allTasks
        })
    } catch (err) {
        res.json({
            success: false,
            message: "Server Error Occurred"
        })
    }
}

module.exports.createTask = async (req, res) => {
    let inProgress;

    if (req.body.status === "todo") {
        inProgress = 0
    } else if (req.body.status === "in_Progress") {
        inProgress = 50
    } else {
        inProgress = 100;
    }

    try {
        const newTask = new Task({
            ...req.body,
            inProgress,
            user: req.user.id
        });
        const svdTask = await newTask.save();
        res.status(201).json({
            success: true,
            message: "Task created successfully",
            data: svdTask
        });

    } catch (err) {
        console.log(err);
    }
}

module.exports.showTask = async (req, res) => {
    let task = await Task.findById(req.params.id);
    res.json({
        success: true,
        message: "Your Task",
        data: task
    })
}

module.exports.updateTask = async (req, res) => {
    const { id } = req.params;
    const { inProgress } = req.body;

    let status;
    if (inProgress === 0) {
        status = "todo";
    } else if (inProgress === 100) {
        status = "done";
    } else {
        status = "in_Progress";
    }

    try {
        const updatedTask = await Task.findByIdAndUpdate(id, { ...req.body, status }, { new: true });
        res.json({
            success: true,
            message: "Task updated successfully",
            data: updatedTask
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to update task"
        });
    }
}

module.exports.updateTaskInProgress = async (req, res) => {
    try {
        if (req.body.status === "todo") {
            req.body.inProgress = 0
        } else if (req.body.status === "in_Progress") {
            req.body.inProgress = 50
        } else {
            req.body.inProgress = 100;
        }

        await Task.findByIdAndUpdate(req.params.id, { ...req.body });
        res.status(200).json({
            success: true,
            message: "Task Updated Successfully",
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Task Updation Failed...!"
        })
    }
}

module.exports.deleteTask = async (req, res) => {
    try{
        let {id} = req.params;
        await Task.findByIdAndDelete(id);
        res.status(200).json({
            success: true,
            message: "Task Deleted Successfully"
        })
    }catch(err){
        res.status(500).json({
            success: true,
            message: "Task Deletion Failed...!"
        })
    }
}