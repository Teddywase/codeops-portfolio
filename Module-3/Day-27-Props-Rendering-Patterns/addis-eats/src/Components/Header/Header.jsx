import { useCart } from '../../cart/CartProvider';
import './Header.css';

function Header() {
	const { items } = useCart();
	const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

	return (
		<header className='topbar'>
			<h1>Addis Eats</h1>
			<div className='cart-badge' aria-label='cart item count'>
				{itemCount}
			</div>
		</header>
	);
}

export default Header;
