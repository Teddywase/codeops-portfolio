import React, { useState } from 'react'
import './Main.css'
import Menu from './Menu/Menu'
import SideBar from './SideBar/SideBar'
import { menuData } from '../../data/menuData'

function Main() {
    const [orders, setOrders] = useState({});

    const handleAddToOrder = (dishId) => {
        setOrders(prev => ({
            ...prev,
            [dishId]: (prev[dishId] || 0) + 1
        }));
    };

    const handleRemoveFromOrder = (dishId) => {
        setOrders(prev => {
            const newOrders = { ...prev };
            delete newOrders[dishId];
            return newOrders;
        });
    };

const [selectedCategory, setSelectedCategory] = useState('All');
    return (
        <section className='main'>
            <Menu onAddToOrder={handleAddToOrder} orders={orders} />
            <SideBar orders={orders} menuData={menuData} onRemoveFromOrder={handleRemoveFromOrder} />
        </section>
    )
}

export default Main
