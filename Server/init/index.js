const {connectDb} = require("../config/db");
const Goal = require("../models/Goal");
const Task = require("../models/Task");
const goals = require("./data");

connectDb().then(() => {
    console.log(`Connected To DB`);
}).catch((err) => {
    console.log(`Db Connection Errror`)
    console.log(err)
})

const initDb = async () => {
    await Goal.deleteMany({});
    const allGoals = await Goal.insertMany(goals);
    console.log(allGoals)
}

initDb();