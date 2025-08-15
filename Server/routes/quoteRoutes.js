const express = require("express");
const router = express.Router();

router.get("/",  async (req, res) => {
    const response = await fetch("https://api.quotable.io/quotes/random?tags=motivational | Inspirational | wisdom&maxLength=100");
    const data = await response.json()
    const quote = {
        quote: data[0].content,
        author: data[0].author
    };
    res.status(200).json({
        success: true,
        message: "Quotes Successfully fetched...",
        data: quote
    })
})

module.exports = router;