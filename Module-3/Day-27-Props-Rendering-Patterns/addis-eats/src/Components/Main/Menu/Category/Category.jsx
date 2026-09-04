import './Category.css'
import React from "react";

function Category({ dishes, selectedCategory, onSelectCategory }) {
    const uniqueCategories = ['All', ...new Set(dishes.map(dish => dish.category))];

    return (
        <div className="category-list">
            {uniqueCategories.map((category) => (
                <button
                    key={category}
                    className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                    onClick={() => onSelectCategory(category)}
                >
                    {category}
                </button>
            ))}
        </div>
    );
}

export default Category;
