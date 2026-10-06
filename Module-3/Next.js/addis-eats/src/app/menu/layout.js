import React from 'react'

export default function layout({ children }) {
    return (
        <main className='h-screen flex items-start gap-4'>
            <aside className='px-10 border-r h-full pt-10 bg-gray-950'>
                <h2 className='text-xl font-semibold mb-6'>Categories</h2>
                <div>
                    <p>All Dishes</p>
                    <p>Traditional Stews & Wat</p>
                    <p>Tibs & Grills</p>
                    <p>Raw & Cured Delicacies / Kitfo</p>
                    <p>Fasting & Vegan / Tsom</p>
                    <p>Hot Drinks</p>
                </div>
            </aside>

            <section>{children}</section>
        </main>
    )
}