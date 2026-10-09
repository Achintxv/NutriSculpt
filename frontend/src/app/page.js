"use client"
import React from 'react'
import { useRouter } from "next/navigation";

const page = () => {
   const router = useRouter();
  return (
    <div>
      {router.push('/login')}
    </div>
  )
}

export default page
