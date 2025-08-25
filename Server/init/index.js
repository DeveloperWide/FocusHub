const {connectDb} = require("../config/db");
const Focus = require("../models/Focus");
const activities = require("./data");

connectDb().then(() => {
    console.log(`Connected To DB`);
}).catch((err) => {
    console.log(`Db Connection Errror`)
    console.log(err)
})

const initDb = async () => {
    const allActivities = await Focus.insertMany(activities);
    console.log(allActivities)
}

initDb();