import Link from "next/link";
import CartLink from "../CartLink";
import styles from "./header.module.css";

const Header = () => {
    return (
        <header className={styles.navbar}>
            <Link href="/" className={styles.brand}><h1>Addis Eats</h1></Link>

            <nav className= {styles.navlinks}>
                <Link href={"/menu"}>Menu</Link>
                <CartLink />
                <Link href={"/checkout"}>Checkout</Link>
            </nav>
            <div className= "auth-actions">
                <Link href="/login" className= {styles["auth-button"]}>Login</Link>
                <Link href="/register" className={styles["auth-button"]}>Register</Link>
            </div>
        </header>
    )
}

export default Header