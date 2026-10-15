import Link from "next/link";
import CartLink from "../CartLink";
import OrderStatusLink from "../OrderStatusLink";
import styles from "./header.module.css";

const Header = () => {
    return (
        <header className={styles.navbar}>
            <Link href="/" className={styles.brand}><h1>Addis Eats</h1></Link>

            <nav className={styles.navlinks} aria-label="Main navigation">
                <Link href="/menu">Menu</Link>
                <CartLink />
                <OrderStatusLink />
                <Link href="/checkout">Checkout</Link>
            </nav>
            <div className={styles.authActions}>
                <Link href="/login" className={styles["auth-button"]}>Login</Link>
                <Link href="/register" className={styles["auth-button"]}>Register</Link>
            </div>
        </header>
    )
}

export default Header