const {connectDb} = require("../config/db");
const Goal = require("../models/Goal");
const Task = require("../models/Task");
const tasks = require("./data");

connectDb().then(() => {
    console.log(`Connected To DB`);
}).catch((err) => {
    console.log(`Db Connection Errror`)
    console.log(err)
})

const initDb = async () => {
    await Task.deleteMany({});
    const allTasks = await Task.insertMany(tasks);
    console.log(allTasks)
}

initDb();