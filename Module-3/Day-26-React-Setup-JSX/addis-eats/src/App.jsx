import Header from './Components/Header/Header';
import Dish from './Components/Dish/Dish';

const menu = [
  { id: 1, name: "Doro Wat", price: 240 },
  { id: 2, name: "Shiro", price: 120 },
  { id: 3, name: "Tibs", price: 280 },
];

function App() {
  return (
    <div>
      <Header />
      {menu.map(dish => (
        <Dish key={dish.id} name={dish.name} price={dish.price} />
      ))}
    </div>
  );
}

export default App;