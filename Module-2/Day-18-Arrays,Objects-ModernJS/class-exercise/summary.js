// summary.js - Main processing file

import calculateTotal, { withVat, format, VAT } from './pricing.js';
import { orders } from './orders.js';

console.log('=== Addis Market Order Summary ===');
console.log('');
console.log('VAT Rate: ' + (VAT * 100) + '%');
console.log('');

// 1. Calculate total for each order using reduce
function calculateOrderTotal(order) {
    return order.items.reduce((sum, item) => {
        return sum + (item.price * item.qty);
    }, 0);
}

// 2. Add total field to each order using map + spread
const ordersWithTotal = orders.map(order => {
    const total = calculateOrderTotal(order);
    return {
        ...order,
        total: total
    };
});

// 3. Filter orders over 500 ETB
const highValueOrders = ordersWithTotal.filter(order => order.total > 500);

// 4. Format the summary
console.log('--- All Orders with Totals ---');
ordersWithTotal.forEach(order => {
    const totalWithVat = withVat(order.total);
    console.log('Order #' + order.id + ' - ' + order.customer);
    console.log('  Items: ' + order.items.length);
    console.log('  Subtotal: ' + format(order.total));
    console.log('  With VAT: ' + format(totalWithVat));
    console.log('  VIP: ' + (order.vip ? 'Yes' : 'No'));
    console.log('---');
});

// 5. Show high value orders (over 500 ETB)
console.log('');
console.log('--- High Value Orders (Over 500 ETB) ---');
highValueOrders.forEach(order => {
    console.log('Order #' + order.id + ' - ' + order.customer + ': ' + format(order.total));
});

// 6. Calculate grand total
const grandTotal = ordersWithTotal.reduce((sum, order) => {
    return sum + order.total;
}, 0);

const grandTotalWithVat = withVat(grandTotal);

console.log('');
console.log('--- Summary ---');
console.log('Total Orders: ' + orders.length);
console.log('High Value Orders: ' + highValueOrders.length);
console.log('Grand Total: ' + format(grandTotal));
console.log('Grand Total (with VAT): ' + format(grandTotalWithVat));

// 7. VIP customer summary
const vipOrders = ordersWithTotal.filter(order => order.vip);
const vipTotal = vipOrders.reduce((sum, order) => sum + order.total, 0);

console.log('');
console.log('--- VIP Customer Summary ---');
console.log('VIP Customers: ' + vipOrders.length);
console.log('VIP Total Spending: ' + format(vipTotal));
console.log('VIP Average: ' + format(vipTotal / vipOrders.length));

// 8. Most popular items
console.log('');
console.log('--- Most Popular Items ---');
const itemCount = {};

ordersWithTotal.forEach(order => {
    order.items.forEach(item => {
        const key = item.name;
        if (itemCount[key]) {
            itemCount[key] += item.qty;
        } else {
            itemCount[key] = item.qty;
        }
    });
});

const sortedItems = Object.entries(itemCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

sortedItems.forEach(([name, qty], index) => {
    console.log((index + 1) + '. ' + name + ': ' + qty + ' ordered');
});

export { ordersWithTotal, highValueOrders, grandTotal, vipOrders };