import React, { useEffect, useState } from 'react'
import './Main.css'
import Menu from './Menu/Menu'
import SideBar from './SideBar/SideBar'
import { loadDishes } from '../../api'

function Main() {
    const [orders, setOrders] = useState({});
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [dishes, setDishes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const controller = new AbortController();

        async function fetchDishes() {
            try {
                setLoading(true);
                setError(null);
                const data = await loadDishes(selectedCategory, controller.signal);
                setDishes(data);
            } catch (err) {
                if (err.name !== 'AbortError') {
                    setError(err.message);
                }
            } finally {
                setLoading(false);
            }
        }

        fetchDishes();
        return () => controller.abort();
    }, [selectedCategory]);

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

    return (
        <section className='main'>
            <Menu
                dishes={dishes}
                loading={loading}
                error={error}
                onAddToOrder={handleAddToOrder}
                orders={orders}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
            />
            <SideBar orders={orders} menuData={dishes} onRemoveFromOrder={handleRemoveFromOrder} />
        </section>
    )
}

export default Main
