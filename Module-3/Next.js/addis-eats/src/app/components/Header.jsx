import Link from "next/link";

const Header = () => {
    return (
        <header>
            <h1>Addis Eats</h1>

            <nav>
                <Link href={"/menu"}>Menu</Link>
                <Link href={"/cart"}>Cart</Link>
                <Link href={"/checkout"}>Checkout</Link>
            </nav>
        </header>
    )
}

export default Header