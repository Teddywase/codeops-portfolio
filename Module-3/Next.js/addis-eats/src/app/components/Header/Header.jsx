import Link from "next/link";
import CartLink from "../CartLink";
import styles from "./header.module.css";

const Header = () => {
    return (
        <header className={styles.navbar}>
            <Link href="/" className={styles.brand}><h1>Addis Eats</h1></Link>

            <nav className={styles.navlinks} aria-label="Main navigation">
                <Link href="/menu">Menu</Link>
                <CartLink />
                <Link href="/orders">My orders</Link>
                <Link href="/checkout">Checkout</Link>
            </nav>
            <div className={styles.authActions}>
                <Link href="/signin" className={styles["auth-button"]}>Sign in</Link>
                <Link href="/signup" className={styles["auth-button"]}>Sign up</Link>
            </div>
        </header>
    )
}

export default Header