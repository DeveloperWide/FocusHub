import axios from "axios"
import { useState } from "react";
import { useEffect } from "react";

const Quote = () => {
    const [quote, setQuote] = useState(null);
    const [author, setAuthor] = useState(null);
  const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";


    useEffect(() => {
        axios.get(`${BASE_URL}/api/quote`).then((res) => {
            console.log(res.data.data);
            setQuote(res.data.data.quote);
            setAuthor(res.data.data.author);
        }).catch((err) => {
            console.log(err)
        })
    }, [])
    return (
         <>
            {quote && author && (
                <div className="container flex w-full justify-center m-3">
                    <div className="quote-container px-3 py-5 flex flex-col gap-0.5">
                        <h3 className="quote text-xl px-2 py-1 capitalize text-gray-600 font-semibold">
                            <i className="fa-solid fa-quote-left"></i> {quote} <i className="fa-solid fa-quote-right"></i>
                        </h3>
                        <p className="author self-end font-bold">-- {author}</p>
                    </div>
                </div>
            )}
        </>
    )
}

export default Quote;