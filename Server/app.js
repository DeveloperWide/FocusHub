const express = require("express");
const app = express();
const cors = require("cors");
const PORT = 8080;

app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173/"
}))

app.get("/api", (req, res) => {
    res.json({
        success: true,
        message: "Hey Everyone"
    })
});

app.listen(PORT, () => {
    console.log(`Server is listing on PORT 8080`)
})