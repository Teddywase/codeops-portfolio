import React, { useState } from 'react'
import './Menu.css'
import Dish from './Dish/Dish'
import Category from './Category/Category'
import { menuData } from '../../../data/menuData'

function Menu({ onAddToOrder, orders }) {
    const [selectedCategory, setSelectedCategory] = useState('All');

    return (
        <section className='menu-wrapper'>
            <div className='menu-main'>
                <div className='menu'>
                    <Category selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />
                    <Dish 
                        selectedCategory={selectedCategory} 
                        orders={orders}
                        onAddToOrder={onAddToOrder}
                    />
                </div>
            </div>
        </section>
        
    )
}

export default Menu
