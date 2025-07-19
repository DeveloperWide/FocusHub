import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

const ShowTask = () => {
    const { id } = useParams();
    const [data, setData] = useState({});

    useEffect(() => {
        axios.get(`/api/tasks/${id}`).then((res) => {
            setData(res.data.data)
        }).catch((err) => {
            console.log(err)
        });
    }, []);

    console.log(data)

    return (
        <div>
            <h2>{data.title}</h2>
        </div>
    )
}

export default ShowTask