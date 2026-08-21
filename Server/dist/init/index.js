"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../config/db");
const Focus_1 = __importDefault(require("../models/Focus"));
const data_1 = __importDefault(require("./data"));
(0, db_1.connectDb)()
    .then(() => {
    console.log(`Connected To DB`);
})
    .catch((err) => {
    console.log(`Db Connection Errror`);
    console.log(err);
});
const initDb = async () => {
    const allActivities = await Focus_1.default.insertMany(data_1.default);
    console.log(allActivities);
};
initDb();
