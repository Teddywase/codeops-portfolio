import './Dish.css'
import React from "react";

function Dish({ dishes, selectedCategory, orders, onAddToOrder }) {
    const filteredDishes = selectedCategory === 'All'
        ? dishes
        : dishes.filter(dish => dish.category === selectedCategory);

    if (filteredDishes.length === 0) {
        return <p>No dishes in this category yet.</p>;
    }

    return (
        <div className="dish-list">
            {filteredDishes.map((dish) => (
                <div className="dish" key={dish.id}>
                    <img src={dish.image} alt={dish.name} className='dish-img' />
                    <h3>{dish.name}</h3>
                    <p className='price'>{dish.price} ETB</p>
                    <p className='category'>{dish.category}</p>
                    <p className='spicy'>{dish.spicy ? '🌶 Spicy' : 'Not Spicy'}</p>
                    <div className="add-cart">
                        <button className="add" onClick={() => onAddToOrder(dish.id)}>Add to order</button>
                        <p className="qty">{orders[dish.id] || 0}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Dish;