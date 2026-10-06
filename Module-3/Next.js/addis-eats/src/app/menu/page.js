import React, { Suspense } from 'react'

// marks as static
export const revalidate = 0;

export default function Menu() {
  return (
    <div>
      <h2>Menu Page</h2>
      
      <Suspense>
        Dish List
      </Suspense>
    </div>
  )
}