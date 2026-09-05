import React, { useMemo, useState } from 'react';
import './Main.css';
import Menu from './Menu/Menu';
import SideBar from './SideBar/SideBar';
import { useFetch } from '../../hooks/useFetch';
import { menuData } from '../../data/menuData';
import { useCart } from '../../cart/CartProvider';

const normalizeDish = (dish) => {
    if (!dish || !dish.image) return dish;

    if (dish.image.startsWith('http') || dish.image.startsWith('data:') || dish.image.startsWith('/')) {
        return dish;
    }

    return {
        ...dish,
        image: new URL(`../../assets/${dish.image}`, import.meta.url).href,
    };
};

function Main() {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const { data: fetchedDishes = [], loading, error } = useFetch('/api/dishes');
    const { dispatch } = useCart();

    const dishes = useMemo(() => {
        const sourceDishes = fetchedDishes.length ? fetchedDishes : menuData;
        return sourceDishes.map(normalizeDish);
    }, [fetchedDishes]);

    const visibleDishes = useMemo(() => {
        const filtered = selectedCategory === 'All'
            ? dishes
            : dishes.filter((dish) => dish.category === selectedCategory);

        return [...filtered].sort((a, b) => a.price - b.price);
    }, [dishes, selectedCategory]);

    const handleAddToOrder = (dish) => {
        dispatch({ type: 'add', dish });
    };

    const handleRemoveFromOrder = (dishId) => {
        dispatch({ type: 'remove', dishId });
    };

    return (
        <section className='main'>
            <Menu
                dishes={visibleDishes}
                loading={loading && !dishes.length}
                error={error}
                onAddToOrder={handleAddToOrder}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
            />
            <SideBar onRemoveFromOrder={handleRemoveFromOrder} />
        </section>
    );
}

export default Main;
