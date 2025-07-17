const mongoose = require("mongoose");
const {model, Schema} = mongoose;

const taskSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    priority: {
        type: String,
        enum: [ "High" , "Medium" , "Low" ]
    },
    isCompleted: {
        type: String,
        enum: ["todo", "in_Progress" , "done"]
    }
}, {
    timestamps: true
});

const Task = new model("Task" , taskSchema);
module.exports = Task;