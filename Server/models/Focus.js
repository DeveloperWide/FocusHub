const mongoose = require("mongoose");
const {model , Schema } = mongoose;

const focusSchema = new Schema({
    task : {
        type: String,
        required: true
    },
    
    taskDuration: {
        type: Number,
        required: true
    }
});

const Focus = model("Focus" , focusSchema);

module.exports = Focus;