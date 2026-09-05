import Header from './Components/Header/Header';
import Main from './Components/Main/Main';
import { CartProvider } from './cart/CartProvider';

function App() {
  return (
    <CartProvider>
      <Header />
      <Main />
    </CartProvider>
  );
}

export default App;
