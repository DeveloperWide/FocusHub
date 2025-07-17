const {connectDb} = require("../config/db");
const Task = require("../models/Task");
const taskData = require("./data");

connectDb().then(() => {
    console.log(`Connected To DB`);
}).catch((err) => {
    console.log(`Db Connection Errror`)
    console.log(err)
})

const initDb = async () => {
    await Task.deleteMany({});
    const allTasks = await Task.insertMany(taskData);
    console.log(allTasks)
}

initDb();