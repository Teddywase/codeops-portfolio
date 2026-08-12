// pricing.js - VAT and formatting utilities

export const VAT = 0.15;

export function withVat(amount) {
    return amount * (1 + VAT);
}

export function format(amount) {
    return amount.toFixed(2) + ' ETB';
}

export default function calculateTotal(items) {
    return items.reduce((sum, item) => {
        return sum + (item.price * item.qty);
    }, 0);
}