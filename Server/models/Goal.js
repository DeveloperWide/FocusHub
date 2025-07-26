let mongoose = require("mongoose");
const {Schema , model} = mongoose;

const goalSchema = new Schema({
    title: {
        type: String,
        required: true
    }
});

const Goal = model("Goal", goalSchema);
module.exports = Goal;