const imageUrl = (name) => new URL(`../assets/${name}`, import.meta.url).href;

export const menuData = [
  { id: 1, name: 'Doro Wat', category: 'Main', price: 240, spicy: true, image: imageUrl('doro-wet.jpg') },
  { id: 2, name: 'Shiro', category: 'Vegetarian', price: 120, spicy: false, image: imageUrl('shiro.jpg') },
  { id: 3, name: 'Kitfo', category: 'Main', price: 320, spicy: true, image: imageUrl('kitfo.jpg') },
  { id: 4, name: 'Tibs', category: 'Main', price: 280, spicy: true, image: imageUrl('tibs.jpg') },
  { id: 5, name: 'Injera Firfir', category: 'Breakfast', price: 100, spicy: true, image: imageUrl('firfir.jpg') },
  { id: 6, name: 'Beyaynetu', category: 'Vegetarian', price: 150, spicy: false, image: imageUrl('beyaynetu.jpg') },
  { id: 7, name: 'Misir Wat', category: 'Vegetarian', price: 110, spicy: true, image: imageUrl('misir-wet.jpg') },
  { id: 8, name: 'Gomen', category: 'Vegetarian', price: 90, spicy: false, image: imageUrl('gomen.jpg') },
  { id: 9, name: 'Atkilt Wot', category: 'Vegetarian', price: 100, spicy: false, image: imageUrl('atkilt.jpg') },
  { id: 10, name: 'Derek Tibs', category: 'Main', price: 310, spicy: true, image: imageUrl('derek-tibs.jpg') },
  { id: 11, name: 'Key Wat', category: 'Main', price: 220, spicy: true, image: imageUrl('key-wet.jpg') },
  { id: 12, name: 'Alicha Wat', category: 'Main', price: 210, spicy: false, image: imageUrl('alicha.jpg') },
  { id: 13, name: 'Bozena Shiro', category: 'Main', price: 180, spicy: true, image: imageUrl('bozena.jpg') },
  { id: 14, name: 'Ayibe', category: 'Side', price: 70, spicy: false, image: imageUrl('ayibe.jpg') },
  { id: 15, name: 'Kocho', category: 'Side', price: 60, spicy: false, image: imageUrl('kocho.jpg') },
  { id: 16, name: 'Enkulal Firfir', category: 'Breakfast', price: 110, spicy: true, image: imageUrl('enkulal.jpg') },
  { id: 17, name: 'Fuul', category: 'Breakfast', price: 90, spicy: true, image: imageUrl('fuul.jpg') },
  { id: 18, name: 'Genfo', category: 'Breakfast', price: 130, spicy: true, image: imageUrl('genfo.jpg') },
  { id: 19, name: 'Chechebsa', category: 'Breakfast', price: 120, spicy: true, image: imageUrl('chechebsa.jpg') },
  { id: 20, name: 'Kik Alicha', category: 'Vegetarian', price: 100, spicy: false, image: imageUrl('kik-alcha.jpg') },
];

export const categories = [
  { id: 'all', label: 'All' },
  { id: 'main', label: 'Main Dishes' },
  { id: 'breakfast', label: 'Breakfast' },
  { id: 'drink', label: 'Drinks' },
];