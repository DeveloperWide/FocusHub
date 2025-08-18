import axios from "axios"
import { useState } from "react";
import { useEffect } from "react";
import quotes from "../data/quotes.json";

const Quote = () => {
    const getTime = new Date().getHours();
    const getDay = new Date().getDate();
    const quote = quotes[getTime > 12 ? getDay + 30 - 1 : getDay];

    return (
        <>
                <div className="container flex w-full justify-center m-3">
                    <div className="quote-container px-3 py-5 flex flex-col gap-0.5">
                        <h3 className="quote text-xl px-2 py-1 capitalize text-gray-600 font-semibold">
                            <i className="fa-solid fa-quote-left"></i> {quote.text} <i className="fa-solid fa-quote-right"></i>
                        </h3>
                    </div>
                </div>
        </>
    )
}

export default Quote;