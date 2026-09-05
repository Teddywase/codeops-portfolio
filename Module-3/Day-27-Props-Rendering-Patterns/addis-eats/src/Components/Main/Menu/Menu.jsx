import React from 'react';
import './Menu.css';
import Dish from './Dish/Dish';
import Category from './Category/Category';

function Menu({ dishes, loading, error, onAddToOrder, selectedCategory, onSelectCategory }) {
    if (loading) {
        return (
            <section className='menu-wrapper'>
                <div className='menu-main'>
                    <div className='menu'>
                        <p>Loading Addis Eats menu...</p>
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className='menu-wrapper'>
                <div className='menu-main'>
                    <div className='menu'>
                        <p className='error-message'>{error}</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className='menu-wrapper'>
            <div className='menu-main'>
                <div className='menu'>
                    <Category dishes={dishes} selectedCategory={selectedCategory} onSelectCategory={onSelectCategory} />
                    <Dish dishes={dishes} selectedCategory={selectedCategory} onAddToOrder={onAddToOrder} />
                </div>
            </div>
        </section>
    );
}

export default Menu;
