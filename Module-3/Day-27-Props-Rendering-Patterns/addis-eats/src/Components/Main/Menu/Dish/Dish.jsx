import { menuData } from '../../../../data/menuData';
import './Dish.css'

function Dish() {
    return (
        <div className="dish-list">
            {menuData.map((dish) => (
                <div className="dish" key={dish.id}>
                    <img src={dish.image} alt={dish.name} className='dish-img' a/>
                    <h3>{dish.name}</h3>
                    <p className='price'>{dish.price} ETB</p>
                    <p className='category'>{dish.category}</p>
                    <p className='spicy'>{dish.spicy ? '🌶 Spicy' : 'Not Spicy'}</p>
                </div>
            ))}
        </div>
    );
}

export default Dish;