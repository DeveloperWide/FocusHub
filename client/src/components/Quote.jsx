import axios from "axios"
import { useState } from "react";
import { useEffect } from "react";

const Quote = () => {
    const [quote, setQuote] = useState(null);
    const [author, setAuthor] = useState(null);

    useEffect(() => {
        axios.get("/api/quote").then((res) => {
            console.log(res.data.data);
            setQuote(res.data.data.quote);
            setAuthor(res.data.data.author);
            console.log(author, quote)
        }).catch((err) => {
            console.log(err)
        })
    }, [])
    return (
        <div className="quote flex  flex-col justify-center items-center">
            <h1>Today's Quote</h1>
            <div className="quote-box">
                <h3>{quote}</h3>
                <p>{author}</p>
            </div>
        </div>
    )
}

export default Quote;