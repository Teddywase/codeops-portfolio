import './Dish.css';
import React from 'react';
import { useCart } from '../../../../cart/CartProvider';

function Dish({ dishes, selectedCategory, onAddToOrder }) {
	const { items, dispatch } = useCart();

	const filteredDishes = selectedCategory === 'All'
		? dishes
		: dishes.filter((dish) => dish.category === selectedCategory);

	if (filteredDishes.length === 0) {
		return <p>No dishes in this category yet.</p>;
	}

	return (
		<div className='dish-list'>
			{filteredDishes.map((dish) => {
				const quantity = items.find((item) => item.id === dish.id)?.quantity ?? 0;

				return (
					<div className='dish' key={dish.id}>
						<img src={dish.image} alt={dish.name} className='dish-img' />
						<h3>{dish.name}</h3>
						<p className='price'>{dish.price} ETB</p>
						<p className='category'>{dish.category}</p>
						<p className='spicy'>{dish.spicy ? '🌶 Spicy' : 'Not Spicy'}</p>
						<div className='add-cart'>
							<button
								className='add'
								onClick={() => dispatch({ type: 'remove', dishId: dish.id })}
								disabled={quantity === 0}
								aria-label={`Remove one ${dish.name}`}
							>
								-
							</button>
							<p className='qty'>{quantity}</p>
							<button
								className='add'
								onClick={() => onAddToOrder(dish)}
								aria-label={`Add one ${dish.name}`}
							>
								+
							</button>
						</div>
					</div>
				);
			})}
		</div>
	);
}

export default Dish;
