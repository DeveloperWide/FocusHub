import { connectDb } from "../config/db";
import Focus from "../models/Focus";
import activities from "./data";

connectDb()
  .then(() => {
    console.log(`Connected To DB`);
  })
  .catch((err) => {
    console.log(`Db Connection Errror`);
    console.log(err);
  });

const initDb = async () => {
  const allActivities = await Focus.insertMany(activities);
  console.log(allActivities);
};

initDb();
