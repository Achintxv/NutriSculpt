"use client";

import { useEffect, useState } from 'react'
import { apiFetch } from '@/lib/api'

export default function TestAPI() {
    const [message, setMessage] = useState("Connecting...");

    useEffect(()=>{
        apiFetch("/health").then((data)=>{
            setMessage(JSON.stringify(data));
        })
        .catch((error)=>{
            setMessage(error.message);
        })
    }, []);
  
    return (
    <div className='p-10'>
        <h1 className='text-2xl font-bold'>
            FastAPI Connection
        </h1>
        <p>
            {message}
        </p>
    </div>
  )
}